import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  Lock,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Store,
  Tag,
  Truck,
  User,
  Zap,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { HELP_TOPICS } from '../data/helpAndCategories';
import { Locale, OrderRecord } from '../types/store';
import { formatOrderDate } from '../utils/format';

interface WarrantyScreenProps {
  locale: Locale;
  orders: OrderRecord[];
  onBackToCatalog: () => void;
  onGoToTracking: () => void;
  onBrowseOffers: () => void;
}

const SERVICE_HUBS = [
  {
    city: 'Douala — Hub Akwa',
    address: 'Boulevard de la Liberté, Immeuble Lorena',
    hours: 'Lun–Sam · 08:00 – 18:00',
    phone: '+237 693 71 25 25',
  },
  {
    city: 'Yaoundé — Comptoir Bastos',
    address: 'Rue 1775, Bastos',
    hours: 'Lun–Sam · 08:30 – 18:00',
    phone: '+237 699 00 84 15',
  },
  {
    city: 'Bafoussam — Relais Tamdja',
    address: 'Avenue du Gouverneur, Bloc B',
    hours: 'Lun–Ven · 09:00 – 17:30',
    phone: '+237 655 00 32 90',
  },
];

function getTopicIcon(topicId: string) {
  switch (topicId) {
    case 'paiements':
      return CreditCard;
    case 'livraison':
      return Truck;
    case 'retours':
      return RefreshCw;
    case 'bons':
      return Tag;
    case 'produits':
      return Package;
    case 'compte':
      return User;
    case 'commandes':
      return FileText;
    default:
      return Lock;
  }
}

export function WarrantyScreen({
  locale,
  orders,
  onBackToCatalog,
  onGoToTracking,
  onBrowseOffers,
}: WarrantyScreenProps) {
  const [activeTopicId, setActiveTopicId] = useState<string>(HELP_TOPICS[0].id);
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    HELP_TOPICS[0].questions[0]?.id ?? null
  );

  const [serialQuery, setSerialQuery] = useState('LR-WRN-26-8492A');
  const [matchedOrder, setMatchedOrder] = useState<OrderRecord | null>(
    orders[0] ?? null
  );
  const [notFound, setNotFound] = useState(false);

  const isWarrantyTab = activeTopicId === 'garantie_lookup';
  const currentTopic =
    HELP_TOPICS.find((topic) => topic.id === activeTopicId) ?? HELP_TOPICS[0];

  const displayedQuestions = useMemo(() => {
    const q = faqSearch.trim().toLowerCase();
    if (!q) return currentTopic.questions;
    const allQuestions = HELP_TOPICS.flatMap((t) => t.questions);
    return allQuestions.filter(
      (item) =>
        item.qFr.toLowerCase().includes(q) ||
        item.qEn.toLowerCase().includes(q) ||
        item.aFr.toLowerCase().includes(q) ||
        item.aEn.toLowerCase().includes(q)
    );
  }, [currentTopic, faqSearch]);

  const handleVerify = (e: FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    const cleaned = serialQuery.trim().toUpperCase();
    const found = orders.find(
      (o) =>
        o.warrantySerial.toUpperCase() === cleaned ||
        o.id.toUpperCase() === cleaned
    );
    if (!found) {
      setMatchedOrder(null);
      setNotFound(true);
      return;
    }
    setMatchedOrder(found);
  };

  return (
    <div className="pb-16">
      {/* Top Help Hero Banner (Violet & Blue Frosted Crystal Prism) */}
      <div className="max-w-[1360px] mx-auto px-4 pt-6">
        <section className="ice-violet rounded-[32px] text-white pt-10 pb-20 px-6 sm:px-10">
          <div className="space-y-2.5">
            <span className="glass-pill-black inline-block px-3.5 py-1 rounded-full text-xs font-bold text-[#F4BE38]">
              {locale === 'fr' ? 'Support Lorena Market' : 'Lorena Market Support'}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold">
              {locale === 'fr' ? "Centre d'aide" : 'Help Center'}
            </h1>
            <p className="text-sm sm:text-base text-white/90">
              {locale === 'fr'
                ? 'Salut, comment pouvons-nous vous aider ?'
                : 'Hi there, how can we help you today?'}
            </p>
          </div>
        </section>
      </div>

      {/* 5 Overlapping Quick Shortcut Cards */}
      <div className="max-w-[1360px] mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => {
              setActiveTopicId('confidentialite');
              setFaqSearch('');
            }}
            className="ice-surface rounded-2xl p-4 flex items-center gap-3 text-left transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-[#5A5AA1] shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-bold text-[#000000]">
              {locale === 'fr' ? 'Politique Confidentialité' : 'Privacy Policy'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTopicId('retours');
              setFaqSearch('');
            }}
            className="ice-surface rounded-2xl p-4 flex items-center gap-3 text-left transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5 text-[#5A5AA1] shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-bold text-[#000000]">
              {locale === 'fr' ? 'Politique Retour' : 'Return Policy'}
            </span>
          </button>

          <button
            type="button"
            onClick={onBrowseOffers}
            className="ice-surface rounded-2xl p-4 flex items-center gap-3 text-left transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Zap className="w-5 h-5 text-[#F4BE38] shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-bold text-[#000000]">
              {locale === 'fr' ? 'Meilleures offres' : 'Best Deals'}
            </span>
          </button>

          <button
            type="button"
            onClick={onBackToCatalog}
            className="ice-surface rounded-2xl p-4 flex items-center gap-3 text-left transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Store className="w-5 h-5 text-[#2563EB] shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-bold text-[#000000]">
              {locale === 'fr' ? 'Boutique' : 'Storefront'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTopicId('commandes');
              setFaqSearch('');
            }}
            className="col-span-2 sm:col-span-1 ice-surface rounded-2xl p-4 flex items-center gap-3 text-left transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-[#5A5AA1] shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-bold text-[#000000]">
              {locale === 'fr'
                ? 'Comment Acheter sur Lorena'
                : 'How to Buy on Lorena'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Split Help Layout */}
      <div className="max-w-[1360px] mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Topic Menu */}
        <aside className="lg:col-span-3 space-y-2.5">
          {HELP_TOPICS.map((topic) => {
            const Icon = getTopicIcon(topic.id);
            const active = activeTopicId === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => {
                  setActiveTopicId(topic.id);
                  setFaqSearch('');
                  setOpenFaqId(topic.questions[0]?.id ?? null);
                }}
                className={`w-full px-4 py-3.5 rounded-2xl flex items-center justify-between gap-3 text-left text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? 'ice-obsidian text-[#F4BE38]'
                    : 'ice-surface text-[#000000] hover:border-[#5A5AA1]'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active ? 'text-[#F4BE38]' : 'text-[#5A5AA1]'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate">
                    {locale === 'fr' ? topic.labelFr : topic.labelEn}
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setActiveTopicId('garantie_lookup')}
            className={`w-full px-4 py-3.5 rounded-2xl flex items-center justify-between gap-3 text-left text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isWarrantyTab
                ? 'ice-obsidian text-[#F4BE38]'
                : 'ice-surface text-[#000000] hover:border-[#5A5AA1]'
            }`}
          >
            <span className="flex items-center gap-2.5 truncate">
              <ShieldCheck
                className={`w-4 h-4 shrink-0 ${
                  isWarrantyTab ? 'text-[#F4BE38]' : 'text-[#5A5AA1]'
                }`}
                aria-hidden="true"
              />
              <span className="truncate">
                {locale === 'fr'
                  ? 'Vérifier une garantie'
                  : 'Verify a Warranty'}
              </span>
            </span>
            <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onGoToTracking}
            className="glass-pill-cta w-full px-4 py-3.5 rounded-full text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
            <span>
              {locale === 'fr' ? 'Suivre une commande' : 'Track an Order'}
            </span>
          </button>
        </aside>

        {/* Right FAQ & Warranty Panel */}
        <div className="lg:col-span-9 space-y-6">
          {!isWarrantyTab && (
            <section className="ice-surface rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/75 space-y-4">
                <div>
                  <h2 className="font-display text-xl font-extrabold text-[#000000]">
                    {faqSearch.trim()
                      ? locale === 'fr'
                        ? `Résultats pour « ${faqSearch.trim()} »`
                        : `Results for "${faqSearch.trim()}"`
                      : locale === 'fr'
                      ? currentTopic.labelFr
                      : currentTopic.labelEn}
                  </h2>
                  <p className="text-xs text-[#3F3F56] font-medium mt-0.5">
                    {displayedQuestions.length}{' '}
                    {displayedQuestions.length > 1 ? 'questions' : 'question'}
                  </p>
                </div>

                <div className="glass-input-recessed rounded-full max-w-md flex items-center px-3.5">
                  <Search className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                  <input
                    type="search"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder={
                      locale === 'fr'
                        ? 'Tapez des mots-clés comme « retour »'
                        : 'Type keywords like "return"'
                    }
                    className="min-h-[42px] w-full pl-2.5 bg-transparent text-sm text-[#000000] placeholder:text-[#3F3F56]/70 focus:outline-none"
                  />
                </div>
              </div>

              <div className="divide-y divide-white/70">
                {displayedQuestions.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#3F3F56]">
                    {locale === 'fr'
                      ? 'Aucune question trouvée pour cette recherche.'
                      : 'No questions matched your search.'}
                  </div>
                ) : (
                  displayedQuestions.map((item) => {
                    const isOpen = openFaqId === item.id;
                    return (
                      <div key={item.id}>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenFaqId((prev) =>
                              prev === item.id ? null : item.id
                            )
                          }
                          className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/35 transition-colors cursor-pointer"
                        >
                          <span className="text-sm font-bold text-[#000000]">
                            {locale === 'fr' ? item.qFr : item.qEn}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-[#5A5AA1] shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5 text-sm text-[#3F3F56] leading-relaxed bg-white/30">
                            {locale === 'fr' ? item.aFr : item.aEn}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          )}

          {/* Serial Warranty Verification (Always Accessible) */}
          <section className="ice-surface rounded-3xl p-6 space-y-5">
            <div className="max-w-xl">
              <span className="glass-pill-gold inline-block px-2.5 py-0.5 rounded-full text-[#000000] text-[10px] font-extrabold uppercase mb-2">
                {locale === 'fr' ? 'SAV & Certificat' : 'Service & Certificate'}
              </span>
              <h2 className="font-display text-lg font-extrabold text-[#000000]">
                {locale === 'fr'
                  ? 'Vérifier un certificat de garantie'
                  : 'Verify a Warranty Certificate'}
              </h2>
              <p className="mt-1 text-xs text-[#3F3F56] font-medium">
                {locale === 'fr'
                  ? 'Exemple : LR-WRN-26-8492A ou numéro de commande LR-8492'
                  : 'Example: LR-WRN-26-8492A or order ID LR-8492'}
              </p>

              <form
                onSubmit={handleVerify}
                className="mt-4 flex flex-col sm:flex-row gap-2.5"
              >
                <div className="glass-input-recessed rounded-full flex-1 flex items-center px-3.5">
                  <Search className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                  <input
                    type="text"
                    value={serialQuery}
                    onChange={(e) => setSerialQuery(e.target.value)}
                    aria-label="Numéro de garantie"
                    className="min-h-[44px] w-full pl-2.5 bg-transparent font-mono text-sm text-[#000000] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="glass-pill-cta min-h-[44px] px-6 text-white text-sm font-bold rounded-full cursor-pointer"
                >
                  {locale === 'fr' ? 'Vérifier' : 'Verify'}
                </button>
              </form>
            </div>

            {matchedOrder && (
              <div className="ice-yellow p-5 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#000000]">
                    <CheckCircle2 className="w-5 h-5 text-[#5A5AA1]" aria-hidden="true" />
                    <span>
                      {locale === 'fr'
                        ? 'Garantie active vérifiée'
                        : 'Active Warranty Verified'}
                    </span>
                  </div>
                  <span className="glass-pill-black font-mono text-xs font-bold px-3 py-1 rounded-full text-[#F4BE38]">
                    {matchedOrder.warrantySerial}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="block text-xs text-[#3F3F56] font-medium">
                      {locale === 'fr' ? 'Titulaire' : 'Owner'}
                    </span>
                    <span className="font-bold text-[#000000]">
                      {matchedOrder.customer.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-[#3F3F56] font-medium">Date</span>
                    <span className="font-semibold text-[#000000]">
                      {formatOrderDate(matchedOrder.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-[#3F3F56] font-medium">
                      {locale === 'fr' ? 'Produits couverts' : 'Covered Items'}
                    </span>
                    <span className="font-semibold text-[#000000]">
                      {matchedOrder.items.map((i) => i.name).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {notFound && (
              <div className="p-4 rounded-2xl bg-[#ffdad6]/90 border border-[#ba1a1a]/30 text-[#93000a] text-sm font-medium backdrop-blur-md">
                {locale === 'fr'
                  ? `Aucun certificat trouvé pour « ${serialQuery} ».`
                  : `No warranty certificate matched "${serialQuery}".`}
              </div>
            )}
          </section>

          {/* Hubs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SERVICE_HUBS.map((hub) => (
              <div
                key={hub.city}
                className="ice-surface rounded-3xl p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A5AA1]">
                    <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Point Relais</span>
                  </div>
                  <h3 className="font-display text-base font-extrabold text-[#000000]">
                    {hub.city}
                  </h3>
                  <p className="text-xs text-[#3F3F56]">{hub.address}</p>
                </div>
                <div className="pt-3 border-t border-white/75 space-y-1 text-xs">
                  <p className="text-[#3F3F56] font-semibold">{hub.hours}</p>
                  <p className="inline-flex items-center gap-1 font-mono font-bold text-[#000000]">
                    <Phone
                      className="w-3.5 h-3.5 text-[#5A5AA1]"
                      aria-hidden="true"
                    />
                    <span>{hub.phone}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
