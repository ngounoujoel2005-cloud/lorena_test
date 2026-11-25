import {
  AlertCircle,
  Bot,
  Loader2,
  MessageSquareText,
  RotateCcw,
  Send,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { PRODUCTS } from '../data/catalog';
import { ChatMessage, Locale, Product } from '../types/store';
import { formatXAF } from '../utils/format';
import { ActionIconTooltip } from './ActionIconTooltip';

interface GeminiChatbotProps {
  locale: Locale;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  messages: ChatMessage[];
  onMessagesChange: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
  activeProduct: Product | null;
  comparedProducts: Product[];
  queuedPrompt: string | null;
  onClearQueuedPrompt: () => void;
  elevated?: boolean;
}

export function GeminiChatbot({
  locale,
  isOpen,
  onOpenChange,
  messages,
  onMessagesChange,
  activeProduct,
  comparedProducts,
  queuedPrompt,
  onClearQueuedPrompt,
  elevated = false,
}: GeminiChatbotProps) {
  const [input, setInput] = useState('');
  const [modelMode, setModelMode] = useState<'standard' | 'fast'>('standard');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const catalogContext = useMemo(
    () =>
      PRODUCTS.map(
        (p) =>
          `[${p.sku}] ${p.nameFr} (${p.brand}) — ${formatXAF(p.price)}${
            p.oldPrice ? ` (avant ${formatXAF(p.oldPrice)})` : ''
          } · Stock: ${p.stockQty > 0 ? `${p.stockQty} dispo` : 'Rupture'} · Garantie: ${
            p.warrantyMonths
          } mois · Specs: ${p.specs.map((s) => `${s.labelFr}: ${s.value}`).join(', ')}`
      ).join('\n'),
    []
  );

  const focusContext = useMemo(() => {
    const lines: string[] = [];
    if (activeProduct) {
      lines.push(
        `Fiche produit consultée: ${activeProduct.nameFr} [${activeProduct.sku}] à ${formatXAF(
          activeProduct.price
        )}.`
      );
    }
    if (comparedProducts.length > 0) {
      lines.push(
        `Produits dans le comparateur (${comparedProducts.length}): ${comparedProducts
          .map((p) => `${p.nameFr} (${formatXAF(p.price)})`)
          .join(' | ')}.`
      );
    }
    return lines.join('\n');
  }, [activeProduct, comparedProducts]);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isSending]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isSending) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    const historyPayload = messages
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role, text: m.text }));

    onMessagesChange((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
          locale,
          modelMode,
          catalogContext,
          focusContext,
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        model?: string;
        error?: string;
      };

      if (!response.ok || data.error || !data.reply) {
        const message =
          data.error ||
          (locale === 'fr'
            ? 'Impossible de contacter Lorena Assistant pour le moment.'
            : 'Unable to reach Lorena Assistant right now.');
        setErrorMsg(message);
        return;
      }

      const botMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.reply,
        model: data.model,
        createdAt: new Date().toISOString(),
      };
      onMessagesChange((prev) => [...prev, botMsg]);
    } catch {
      setErrorMsg(
        locale === 'fr'
          ? 'Erreur réseau lors de la connexion au serveur Gemini.'
          : 'Network error while reaching the Gemini server.'
      );
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (isOpen && queuedPrompt && !isSending) {
      const prompt = queuedPrompt;
      onClearQueuedPrompt();
      void sendMessage(prompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, queuedPrompt]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const quickPrompts =
    locale === 'fr'
      ? [
          'Quel réfrigérateur choisir pour un studio ?',
          'Quels sont les frais de livraison à Douala et Yaoundé ?',
          'Quels codes promo sont valides ?',
        ]
      : [
          'Which refrigerator fits a studio apartment?',
          'Delivery fees in Douala and Yaoundé?',
          'Which promo codes are active?',
        ];

  return (
    <>
      {/* Floating Launcher Button (Persistent popup on every page) */}
      {!isOpen && (
        <div
          className={`no-print fixed right-4 z-40 transition-all duration-200 ${
            elevated ? 'bottom-20' : 'bottom-4'
          }`}
        >
          <ActionIconTooltip
            text={
              locale === 'fr'
                ? 'Ouvrir Lorena Assistant IA pour poser vos questions produits et prix'
                : 'Open Lorena AI Assistant to ask about products and pricing'
            }
            placement="top"
          >
            <button
              type="button"
              onClick={() => onOpenChange(true)}
              aria-label={
                locale === 'fr'
                  ? 'Ouvrir Lorena Assistant IA'
                  : 'Open Lorena AI Assistant'
              }
              className="glass-pill-black min-h-[44px] px-3.5 py-2 rounded-full text-white flex items-center gap-2 ring-2 ring-[#F4BE38]/80 shadow-[0_10px_28px_-4px_rgba(90,90,161,0.58)] hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="relative inline-flex items-center justify-center shrink-0">
                <MessageSquareText className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4BE38]" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#F4BE38] animate-pulse"
                />
              </span>
              <span className="font-display text-[11px] sm:text-xs font-extrabold tracking-wide whitespace-nowrap">
                {locale === 'fr' ? 'Lorena IA' : 'Lorena AI'}
              </span>
            </button>
          </ActionIconTooltip>
        </div>
      )}

      {/* Multi-turn Chat Drawer/Panel */}
      {isOpen && (
        <aside
          aria-label="Lorena Assistant"
          className="no-print ice-surface fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[400px] h-[540px] max-h-[82vh] z-50 rounded-3xl flex flex-col"
        >
          {/* Header (Obsidian Ice) */}
          <div className="ice-obsidian rounded-t-3xl text-white px-4 py-3.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Assistant intelligent Lorena pour comparer et choisir'
                    : 'Lorena AI assistant to compare and choose products'
                }
                placement="bottom"
                focusable
              >
                <span className="glass-pill-cta w-9 h-9 rounded-full flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#F4BE38]" aria-hidden="true" />
                </span>
              </ActionIconTooltip>
              <div className="min-w-0">
                <h2 className="font-display text-sm font-bold truncate">
                  Lorena Assistant
                </h2>
                <p className="text-[11px] text-white/75 truncate">
                  {locale === 'fr'
                    ? 'Conseiller shopping & fiches techniques'
                    : 'Shopping & technical advisor'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Réinitialiser et démarrer une nouvelle conversation'
                    : 'Reset and start a new conversation'
                }
                placement="bottom"
              >
                <button
                  type="button"
                  aria-label={
                    locale === 'fr'
                      ? 'Nouvelle conversation'
                      : 'New conversation'
                  }
                  onClick={() => {
                    onMessagesChange(() => []);
                    setErrorMsg(null);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-white/15 text-white/85 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
              </ActionIconTooltip>
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Fermer la fenêtre de discussion'
                    : 'Close assistant panel'
                }
                placement="left"
              >
                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={() => onOpenChange(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/15 text-white/85 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </ActionIconTooltip>
            </div>
          </div>

          {/* Model Mode Bar */}
          <div className="px-3.5 py-2 ice-surface-subtle border-b border-white/75 flex items-center justify-between gap-2 text-[11px]">
            <span className="text-[#3F3F56] font-bold">
              {locale === 'fr' ? 'Mode réponse :' : 'Response mode:'}
            </span>
            <div className="ice-surface-subtle inline-flex rounded-full p-0.5">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Activer des réponses détaillées et complètes'
                    : 'Enable detailed, thorough AI answers'
                }
                placement="bottom"
              >
                <button
                  type="button"
                  onClick={() => setModelMode('standard')}
                  className={`px-3 py-1 rounded-full font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                    modelMode === 'standard'
                      ? 'glass-pill-cta text-white'
                      : 'text-[#3F3F56] hover:text-[#000000]'
                  }`}
                >
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Complet' : 'Standard'}</span>
                </button>
              </ActionIconTooltip>
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Activer des réponses courtes et ultra-rapides'
                    : 'Enable short, ultra-fast AI answers'
                }
                placement="bottom"
              >
                <button
                  type="button"
                  onClick={() => setModelMode('fast')}
                  className={`px-3 py-1 rounded-full font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                    modelMode === 'fast'
                      ? 'glass-pill-gold text-[#000000]'
                      : 'text-[#3F3F56] hover:text-[#000000]'
                  }`}
                >
                  <Zap className="w-3 h-3" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Rapide' : 'Fast'}</span>
                </button>
              </ActionIconTooltip>
            </div>
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <div className="ice-surface-subtle rounded-2xl p-4 text-xs sm:text-sm text-[#000000] space-y-1.5">
                  <p className="font-display font-bold text-[#5A5AA1]">
                    {locale === 'fr'
                      ? 'Bonjour ! Comment puis-je vous aider ?'
                      : 'Hello! How can I help you shop today?'}
                  </p>
                  <p className="text-xs text-[#3F3F56] leading-relaxed">
                    {locale === 'fr'
                      ? 'Posez vos questions sur les appareils en XAF, comparez des modèles ou vérifiez nos délais de livraison MTN/Orange Money.'
                      : 'Ask about XAF pricing, compare appliances or smartphones, or check Cameroon delivery & Mobile Money options.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#3F3F56]">
                    {locale === 'fr' ? 'Suggestions' : 'Quick questions'}
                  </p>
                  {quickPrompts.map((qp) => (
                    <button
                      key={qp}
                      type="button"
                      onClick={() => void sendMessage(qp)}
                      className="glass-pill-frost w-full text-left px-3.5 py-2 rounded-2xl text-xs font-semibold text-[#000000] cursor-pointer"
                    >
                      {qp}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'glass-pill-cta text-white rounded-br-xs'
                        : 'ice-surface-subtle text-[#000000] rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}

            {isSending && (
              <div className="flex justify-start">
                <div className="ice-surface-subtle rounded-2xl px-3.5 py-2.5 text-xs text-[#5A5AA1] font-semibold inline-flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>
                    {locale === 'fr'
                      ? 'Lorena Assistant rédige...'
                      : 'Lorena Assistant is typing...'}
                  </span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-[#ffdad6]/90 border border-[#ba1a1a]/30 text-[#93000a] text-xs font-medium flex items-start gap-2 backdrop-blur-md">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 ice-surface-subtle rounded-b-3xl border-t border-white/75 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                locale === 'fr'
                  ? 'Posez une question sur un produit...'
                  : 'Ask about a product or price...'
              }
              disabled={isSending}
              className="glass-input-recessed min-h-[40px] flex-1 px-4 rounded-full text-xs sm:text-sm text-[#000000] placeholder:text-[#3F3F56]/70 focus:outline-none min-w-0"
            />
            <ActionIconTooltip
              text={
                locale === 'fr'
                  ? 'Envoyer votre message à Lorena Assistant'
                  : 'Send your message to Lorena Assistant'
              }
              placement="left"
            >
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                aria-label={locale === 'fr' ? 'Envoyer' : 'Send'}
                className="glass-pill-cta w-10 h-10 rounded-full text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </ActionIconTooltip>
          </form>
        </aside>
      )}
    </>
  );
}
