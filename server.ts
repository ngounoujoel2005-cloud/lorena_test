import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

interface ClientHistoryItem {
  role: 'user' | 'model';
  text: string;
}

interface ChatRequestBody {
  message?: string;
  history?: ClientHistoryItem[];
  locale?: 'fr' | 'en';
  modelMode?: 'standard' | 'fast';
  catalogContext?: string;
  appContext?: string;
  focusContext?: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/chat', async (req, res) => {
    try {
      const body = (req.body ?? {}) as ChatRequestBody;
      const userMessage = typeof body.message === 'string' ? body.message.trim() : '';

      if (!userMessage) {
        res.status(400).json({ error: 'Message text is required.' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        res.status(500).json({
          error:
            body.locale === 'en'
              ? 'Gemini API key is missing. Please configure GEMINI_API_KEY in Settings > Secrets.'
              : 'Clé API Gemini manquante. Veuillez configurer GEMINI_API_KEY dans Settings > Secrets.',
        });
        return;
      }

      const model =
        body.modelMode === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-4-hydrogen';

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const langDirective =
        body.locale === 'en'
          ? 'Respond primarily in clear, helpful English unless the user writes in French.'
          : 'Réponds principalement en français clair et chaleureux (sauf si le client écrit en anglais).';

      const systemInstruction = [
        'Tu es Lorena Assistant, le conseiller shopping, SAV et navigation officiel de Lorena Market (Cameroun).',
        'Rôle : renseigner les clients à partir des données réelles de l’application (catalogue produits avec IDs/SKU/prix en XAF/specs/stock, rayons, frais et délais de livraison par ville et quartier au Cameroun, panier en cours, commandes et suivi, favoris, liste d’attente, paiements MTN Mobile Money *126#, Orange Money #150# et paiement à la livraison, codes promo LORENA10 = -10% et BIENVENUE = -5 000 XAF, garanties 3 à 24 mois).',
        langDirective,
        'Navigation par liens cliquables : chaque fois que tu recommandes une page, une catégorie, une commande ou un produit, génère un lien Markdown cliquable exact avec le schéma app:// afin que le client puisse y accéder en un clic :',
        '- Pages : [Accueil](app://screen/home), [Catalogue](app://screen/category), [Comparateur](app://screen/compare), [Mon Panier](app://screen/cart), [Paiement / Commander](app://screen/checkout), [Suivi de commande](app://screen/tracking), [Mes Factures PDF](app://screen/invoice), [Mes Favoris](app://screen/wishlist), [Mon Compte](app://screen/account), [Aide & Garanties](app://screen/help).',
        '- Catégories : [Nom du rayon](app://category/SLUG) en utilisant exactement un slug présent dans la liste des catégories.',
        '- Produits : [Nom du produit](app://product/PRODUCT_ID) en utilisant exactement l’ID fourni dans le catalogue (ex: app://product/iphone-13-pro-sm).',
        '- Commandes : [Suivre commande #ID](app://order/ORDER_ID) en utilisant exactement l’ID de commande du client.',
        'Règles : sois concis, structuré et précis. N’invente jamais de produit, de prix, de commande ou de lien inexistant. Si une information manque dans les données fournies, dis-le honnêtement et propose le service client au +237 693 71 25 25 ou la page [Aide & Garanties](app://screen/help).',
        body.catalogContext ? `\nCatalogue complet Lorena Market:\n${body.catalogContext}` : '',
        body.appContext ? `\nDonnées actuelles de l'application & du client:\n${body.appContext}` : '',
        body.focusContext ? `\nContexte immédiat à l'écran:\n${body.focusContext}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const rawHistory = Array.isArray(body.history) ? body.history : [];
      const sanitizedHistory = rawHistory
        .filter(
          (item) =>
            (item.role === 'user' || item.role === 'model') &&
            typeof item.text === 'string' &&
            item.text.trim().length > 0
        )
        .slice(-20)
        .map((item) => ({
          role: item.role,
          parts: [{ text: item.text.trim() }],
        }));

      const chat = ai.chats.create({
        model,
        history: sanitizedHistory,
        config: {
          systemInstruction,
        },
      });

      const response = await chat.sendMessage({ message: userMessage });
      const reply = (response.text ?? '').trim();

      if (!reply) {
        res.status(502).json({
          error:
            body.locale === 'en'
              ? 'Empty response received from Gemini.'
              : 'Réponse vide reçue depuis Gemini.',
        });
        return;
      }

      res.json({ reply, model });
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      const status = typeof errorObj?.status === 'number' ? errorObj.status : 500;
      const message =
        errorObj?.message || 'Unable to reach Gemini service right now.';
      console.error('[Gemini /api/chat error]', status, message);
      res.status(status >= 400 && status < 600 ? status : 500).json({
        error: message,
      });
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found. Run npm run build.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lorena Market server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
