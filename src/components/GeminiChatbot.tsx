import {
  AlertCircle,
  ArrowUpRight,
  Bot,
  Compass,
  Loader2,
  MessageSquareText,
  RotateCcw,
  Send,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { FormEvent, Fragment, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  CATEGORIES_META,
  FREE_DELIVERY_THRESHOLD,
  LOGISTICS_REGIONS,
  PRODUCTS,
} from '../data/catalog';
import {
  AppScreen,
  CartItem,
  CategorySlug,
  ChatMessage,
  Locale,
  OrderRecord,
  Product,
  UserSession,
} from '../types/store';
import { formatXAF } from '../utils/format';
import { ActionIconTooltip } from './ActionIconTooltip';

interface GeminiChatbotProps {
  locale: Locale;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  messages: ChatMessage[];
  onMessagesChange: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
  activeScreen: AppScreen;
  activeCategory: CategorySlug;
  activeProduct: Product | null;
  comparedProducts: Product[];
  cart: CartItem[];
  appliedPromoCode: string | null;
  wishlistIds: string[];
  waitlistIds: string[];
  orders: OrderRecord[];
  userSession: UserSession | null;
  queuedPrompt: string | null;
  onClearQueuedPrompt: () => void;
  onNavigate: (screen: AppScreen) => void;
  onSelectCategory: (slug: CategorySlug) => void;
  onSelectProduct: (product: Product) => void;
  onInspectOrder: (orderId: string) => void;
  elevated?: boolean;
}

const VALID_SCREENS = new Set<AppScreen>([
  'home',
  'category',
  'product',
  'compare',
  'cart',
  'checkout',
  'invoice',
  'tracking',
  'wishlist',
  'account',
  'help',
]);

function renderInlineBold(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={`${keyPrefix}-b-${idx}`} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={`${keyPrefix}-t-${idx}`}>{part}</Fragment>;
  });
}

export function GeminiChatbot({
  locale,
  isOpen,
  onOpenChange,
  messages,
  onMessagesChange,
  activeScreen,
  activeCategory,
  activeProduct,
  comparedProducts,
  cart,
  appliedPromoCode,
  wishlistIds,
  waitlistIds,
  orders,
  userSession,
  queuedPrompt,
  onClearQueuedPrompt,
  onNavigate,
  onSelectCategory,
  onSelectProduct,
  onInspectOrder,
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
          `id="${p.id}" | sku="${p.sku}" | cat="${p.category}" | ${p.nameFr} (${p.nameEn}) [${p.brand}] — ${formatXAF(
            p.price
          )}${p.oldPrice ? ` (avant ${formatXAF(p.oldPrice)})` : ''} · Stock: ${
            p.stockQty > 0 ? `${p.stockQty} dispo` : 'Rupture'
          } · Garantie: ${p.warrantyMonths} mois · Specs: ${p.specs
            .map((s) => `${s.labelFr}: ${s.value}`)
            .join(', ')}`
      ).join('\n'),
    []
  );

  const appContext = useMemo(() => {
    const categoriesLine = CATEGORIES_META.map(
      (c) => `${c.slug} (${c.labelFr} / ${c.labelEn})`
    ).join(', ');

    const logisticsLines = LOGISTICS_REGIONS.map((region) =>
      `${region.name}: ${region.cities
        .map(
          (city) =>
            `${city.name} [${city.quarters
              .map((q) => `${q.name}: ${formatXAF(q.fee)}, ${q.etaFr}`)
              .join('; ')}]`
        )
        .join(' | ')}`
    ).join('\n');

    const cartSubtotal = cart.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const cartSummary =
      cart.length > 0
        ? `Panier (${cart.reduce((s, i) => s + i.quantity, 0)} art., sous-total ${formatXAF(
            cartSubtotal
          )}${appliedPromoCode ? `, promo ${appliedPromoCode}` : ''}): ${cart
            .map(
              (i) =>
                `${i.quantity}x ${i.name} (id="${i.productId}", ${i.variantLabel}, ${formatXAF(
                  i.unitPrice
                )})`
            )
            .join('; ')}`
        : 'Panier vide (0 article).';

    const stageLabels = ['Confirmée', 'Préparation entrepôt', 'En transit', 'Livrée'];
    const ordersSummary =
      orders.length > 0
        ? orders
            .slice(0, 5)
            .map(
              (o) =>
                `#${o.id} — ${stageLabels[o.stageIndex] ?? 'En cours'} · ${formatXAF(
                  o.total
                )} · ${o.customer.city}/${o.customer.quarter} · Paiement: ${
                  o.paymentMethod
                } (${o.paymentVerified ? 'vérifié' : 'à la livraison'}) · Garantie: ${
                  o.warrantySerial
                }`
            )
            .join('\n')
        : 'Aucune commande enregistrée.';

    const wishlistNames = wishlistIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p))
      .map((p) => `${p.nameFr} (id="${p.id}")`)
      .join(', ');

    const waitlistNames = waitlistIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p))
      .map((p) => `${p.nameFr} (id="${p.id}")`)
      .join(', ');

    return [
      `Client connecté: ${
        userSession ? `${userSession.fullName} (${userSession.email})` : 'Invité'
      }`,
      `Rayons disponibles (slugs exacts): ${categoriesLine}`,
      `Livraison gratuite dès ${formatXAF(FREE_DELIVERY_THRESHOLD)} (Douala & Yaoundé). Zones & tarifs:\n${logisticsLines}`,
      cartSummary,
      `Favoris (${wishlistIds.length}): ${wishlistNames || 'Aucun'}`,
      `Liste d'attente réapprovisionnement (${waitlistIds.length}): ${
        waitlistNames || 'Aucun'
      }`,
      `Commandes récentes:\n${ordersSummary}`,
    ].join('\n\n');
  }, [appliedPromoCode, cart, orders, userSession, waitlistIds, wishlistIds]);

  const focusContext = useMemo(() => {
    const lines: string[] = [
      `Page active: ${activeScreen}${
        activeScreen === 'category' ? ` (rayon=${activeCategory})` : ''
      }`,
    ];
    if (activeProduct) {
      lines.push(
        `Fiche produit consultée: id="${activeProduct.id}", ${activeProduct.nameFr} [${
          activeProduct.sku
        }] à ${formatXAF(activeProduct.price)} (Stock: ${
          activeProduct.stockQty > 0 ? activeProduct.stockQty : 'Rupture'
        }).`
      );
    }
    if (comparedProducts.length > 0) {
      lines.push(
        `Produits dans le comparateur (${comparedProducts.length}): ${comparedProducts
          .map((p) => `${p.nameFr} (id="${p.id}", ${formatXAF(p.price)})`)
          .join(' | ')}.`
      );
    }
    return lines.join('\n');
  }, [activeCategory, activeProduct, activeScreen, comparedProducts]);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isSending]);

  const handleAppLink = (href: string) => {
    if (!href.startsWith('app://')) return;
    const rawPath = href.slice('app://'.length).replace(/^\/+/, '');
    const [kind, ...rest] = rawPath.split('/');
    const target = rest.join('/');

    if (kind === 'screen') {
      if (target === 'category' || target.startsWith('category/')) {
        const slug = target.split('/')[1] as CategorySlug | undefined;
        onSelectCategory(slug || 'all');
        return;
      }
      if (VALID_SCREENS.has(target as AppScreen)) {
        onNavigate(target as AppScreen);
      }
      return;
    }

    if (kind === 'category') {
      const validSlug = CATEGORIES_META.find((c) => c.slug === target)?.slug;
      onSelectCategory(validSlug ?? 'all');
      return;
    }

    if (kind === 'product') {
      const found =
        PRODUCTS.find((p) => p.id === target) ??
        PRODUCTS.find((p) => p.sku.toLowerCase() === target.toLowerCase());
      if (found) {
        onSelectProduct(found);
      } else {
        onSelectCategory('all');
      }
      return;
    }

    if (kind === 'order') {
      const cleanId = target.replace(/^#/, '');
      if (cleanId) {
        onInspectOrder(cleanId);
      } else {
        onNavigate('tracking');
      }
    }
  };

  const renderMessageContent = (text: string, isUser: boolean) => {
    const linkPattern = /\[([^\]]+)\]\((app:\/\/[^)\s]+)\)/g;
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let tokenIndex = 0;

    while ((match = linkPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(
          ...renderInlineBold(
            text.slice(lastIndex, match.index),
            `seg-${tokenIndex++}`
          )
        );
      }
      const label = match[1];
      const href = match[2];
      nodes.push(
        <button
          key={`link-${tokenIndex++}`}
          type="button"
          onClick={() => handleAppLink(href)}
          className={`inline-flex items-center gap-1 mx-0.5 my-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold align-baseline cursor-pointer transition-transform hover:scale-[1.03] ${
            isUser
              ? 'glass-pill-gold text-[#000000]'
              : 'glass-pill-gold text-[#000000]'
          }`}
        >
          <span>{label}</span>
          <ArrowUpRight className="w-3 h-3 shrink-0" aria-hidden="true" />
        </button>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      nodes.push(...renderInlineBold(text.slice(lastIndex), `tail-${tokenIndex}`));
    }

    return nodes.length > 0 ? nodes : text;
  };

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
          appContext,
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
          'Quel réfrigérateur choisir pour un studio et donne-moi le lien ?',
          'Résume mon panier, mes commandes et envoie les liens utiles.',
          'Quels sont les frais de livraison à Douala et Yaoundé ?',
          'Montre-moi vos meilleurs smartphones avec liens directs.',
        ]
      : [
          'Which refrigerator fits a studio apartment? Send the link.',
          'Summarize my cart & orders with direct page links.',
          'Delivery fees in Douala and Yaoundé?',
          'Show top smartphones with direct links.',
        ];

  const quickPages: { label: string; screen: AppScreen }[] =
    locale === 'fr'
      ? [
          { label: 'Catalogue', screen: 'category' },
          { label: 'Panier', screen: 'cart' },
          { label: 'Suivi', screen: 'tracking' },
          { label: 'Comparer', screen: 'compare' },
          { label: 'Aide', screen: 'help' },
        ]
      : [
          { label: 'Catalog', screen: 'category' },
          { label: 'Bag', screen: 'cart' },
          { label: 'Tracking', screen: 'tracking' },
          { label: 'Compare', screen: 'compare' },
          { label: 'Help', screen: 'help' },
        ];

  return (
    <>
      {/* Persistent Floating Launcher Button */}
      <div
        className={`no-print fixed right-4 z-[100] transition-all duration-200 ${
          elevated ? 'bottom-20' : 'bottom-4'
        }`}
      >
        <ActionIconTooltip
          text={
            isOpen
              ? locale === 'fr'
                ? 'Réduire la boîte de dialogue Lorena IA'
                : 'Minimize Lorena AI dialog'
              : locale === 'fr'
              ? 'Ouvrir Lorena Assistant IA pour poser vos questions produits et prix'
              : 'Open Lorena AI Assistant to ask about products and pricing'
          }
          placement="top"
        >
          <button
            type="button"
            onClick={() => onOpenChange(!isOpen)}
            aria-expanded={isOpen}
            aria-label={
              isOpen
                ? locale === 'fr'
                  ? 'Fermer Lorena Assistant IA'
                  : 'Close Lorena AI Assistant'
                : locale === 'fr'
                ? 'Ouvrir Lorena Assistant IA'
                : 'Open Lorena AI Assistant'
            }
            className={`min-h-[44px] px-3.5 py-2 rounded-full flex items-center gap-2 ring-2 shadow-[0_10px_28px_-4px_rgba(90,90,161,0.58)] hover:scale-105 transition-transform cursor-pointer ${
              isOpen
                ? 'glass-pill-cta text-white ring-white/85'
                : 'glass-pill-black text-white ring-[#F4BE38]/80'
            }`}
          >
            <span className="relative inline-flex items-center justify-center shrink-0">
              {isOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4BE38]" aria-hidden="true" />
              ) : (
                <MessageSquareText
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#F4BE38]"
                  aria-hidden="true"
                />
              )}
              {!isOpen && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#F4BE38] animate-pulse"
                />
              )}
            </span>
            <span className="font-display text-[11px] sm:text-xs font-extrabold tracking-wide whitespace-nowrap">
              {locale === 'fr' ? 'Lorena IA' : 'Lorena AI'}
            </span>
          </button>
        </ActionIconTooltip>
      </div>

      {/* Multi-turn Chat Dialog anchored directly ABOVE the Lorena IA button with z-index 100 */}
      {isOpen && (
        <aside
          aria-label="Lorena Assistant"
          className={`no-print ice-surface fixed right-4 left-4 sm:left-auto sm:w-[400px] h-[495px] z-[100] rounded-3xl flex flex-col shadow-2xl ${
            elevated
              ? 'bottom-[132px] max-h-[calc(100vh-152px)] sm:max-h-[72vh]'
              : 'bottom-[68px] max-h-[calc(100vh-92px)] sm:max-h-[75vh]'
          }`}
        >
          {/* Header (Obsidian Ice) */}
          <div className="ice-obsidian rounded-t-3xl text-white px-4 py-3.5 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Assistant intelligent Lorena connecté aux données de la boutique'
                    : 'Lorena AI assistant connected to live store data'
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
                    ? 'Données boutique en direct & liens pages'
                    : 'Live store advisor & direct page links'}
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
          <div className="px-3.5 py-2 ice-surface-subtle border-b border-white/75 flex items-center justify-between gap-2 text-[11px] shrink-0">
            <span className="text-[#3F3F56] font-bold">
              {locale === 'fr' ? 'Mode réponse :' : 'Response mode:'}
            </span>
            <div className="ice-surface-subtle inline-flex rounded-full p-0.5">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Gemini 4 Hydrogen — réponses complètes et conseillées'
                    : 'Gemini 4 Hydrogen — detailed, thorough AI answers'
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
                    ? 'Gemini 3.1 Flash Lite — réponses rapides'
                    : 'Gemini 3.1 Flash Lite — fast AI answers'
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

          {/* Quick Page Navigation Strip */}
          <div className="px-3 py-1.5 border-b border-white/70 bg-white/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <Compass className="w-3.5 h-3.5 text-[#5A5AA1] shrink-0" aria-hidden="true" />
            {quickPages.map((pg) => (
              <button
                key={pg.screen}
                type="button"
                onClick={() => {
                  if (pg.screen === 'category') {
                    onSelectCategory('all');
                  } else {
                    onNavigate(pg.screen);
                  }
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 cursor-pointer transition-all ${
                  activeScreen === pg.screen
                    ? 'glass-pill-gold text-[#000000]'
                    : 'glass-pill-frost text-[#3F3F56] hover:text-[#000000]'
                }`}
              >
                {pg.label}
              </button>
            ))}
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
                      ? 'Je connais tout le catalogue en XAF, votre panier, vos commandes, les tarifs par quartier et je peux vous envoyer des liens cliquables vers chaque page ou produit.'
                      : 'I know our live XAF catalog, your bag, orders, neighborhood shipping fees, and can send direct clickable links to any page or product.'}
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
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'glass-pill-cta text-white rounded-br-xs'
                        : 'ice-surface-subtle text-[#000000] rounded-bl-xs'
                    }`}
                  >
                    {renderMessageContent(msg.text, msg.role === 'user')}
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
            className="p-3 ice-surface-subtle rounded-b-3xl border-t border-white/75 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                locale === 'fr'
                  ? 'Posez une question ou demandez un lien...'
                  : 'Ask a question or request a page link...'
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
