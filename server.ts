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
        'Tu es Lorena Assistant, le conseiller shopping et technique officiel de Lorena Market (Cameroun).',
        'Rôle : aider les clients à choisir, comparer les fiches techniques et prix en XAF (FCFA), comprendre les options de paiement (MTN Mobile Money *126#, Orange Money #150#, Paiement à la livraison), les délais de livraison au Cameroun (Douala, Yaoundé, Bafoussam, Buea, Limbe, Kribi ; livraison offerte dès 150 000 XAF à Douala & Yaoundé), les codes promo (LORENA10 = -10%, BIENVENUE = -5 000 XAF) et les garanties certifiées (3 à 24 mois selon produit).',
        langDirective,
        'Sois concis, structuré et utile (listes courtes si pertinent). Ne cite que des produits et prix présents dans le contexte catalogue fourni ; si une donnée manque, dis-le honnêtement et propose le service client au 693 71 25 25.',
        body.catalogContext ? `\nCatalogue actif Lorena Market:\n${body.catalogContext}` : '',
        body.focusContext ? `\nContexte actuel de l'utilisateur:\n${body.focusContext}` : '',
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
