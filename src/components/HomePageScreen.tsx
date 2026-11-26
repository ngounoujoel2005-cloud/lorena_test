import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Flame,
  History,
  Ticket,
  Trash2,
} from 'lucide-react';
import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import {
  CATEGORIES_META,
  IMAGES,
  PRODUCTS,
  SUGGESTED_BENTO_CARDS,
} from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { CategorySlug, Locale, Product } from '../types/store';
import { ActionIconTooltip } from './ActionIconTooltip';
import { DailySpecialsSection } from './DailySpecialsSection';
import { HeroShowcaseCarousel } from './HeroShowcaseCarousel';
import { ProductCard } from './ProductCard';
import { ProductCarouselRow } from './ProductCarouselRow';
import { ProductImage } from './ProductImage';

interface HomePageScreenProps {
  locale: Locale;
  wishlistIds: string[];
  compareIds?: string[];
  waitlistIds?: string[];
  historyIds?: string[];
  recentlyAddedId: string | null;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onNotifyMe?: (product: Product) => void;
  onSelectCategory: (slug: CategorySlug) => void;
  onClearHistory?: () => void;
}

export function HomePageScreen({
  locale,
  wishlistIds,
  compareIds = [],
  waitlistIds = [],
  historyIds = [],
  recentlyAddedId,
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  onToggleCompare,
  onNotifyMe,
  onSelectCategory,
  onClearHistory,
}: HomePageScreenProps) {
  const t = TRANSLATIONS[locale];
  const [bestOfferTab, setBestOfferTab] = useState<'new' | 'clearance'>('new');
  const [secondsLeft, setSecondsLeft] = useState(2 * 86400 + 3600 + 8);
  const bestOffersRef = useRef<HTMLDivElement>(null);
  const historyRowRef = useRef<HTMLDivElement>(null);
  const vipPromoRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 2 * 86400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = String(Math.floor(secondsLeft / 86400)).padStart(2, '0');
  const hours = String(Math.floor((secondsLeft % 86400) / 3600)).padStart(2, '0');
  const mins = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  const uniqueById = (list: Product[]): Product[] => {
    const seen = new Set<string>();
    return list.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  const bestOffersList = PRODUCTS.filter((p) =>
    bestOfferTab === 'new'
      ? p.sections.includes('best_offers_new')
      : p.sections.includes('best_offers_clearance')
  );

  const vipLuxuryList = useMemo(() => {
    const preferredIds = [
      'watch-chronos-steel',
      'headphones-studio-anc',
      'earbuds-pro-anc',
      'titan-x5-pro',
      'iphone-13-pro-sm',
      'speaker-sonus-360',
      'tv-lg-55-4k',
      'ac-icona-125',
    ];
    const preferred = preferredIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
    const highValue = PRODUCTS.filter(
      (p) => p.price >= 45000 && !preferredIds.includes(p.id)
    ).slice(0, 4);
    return uniqueById([...preferred, ...highValue]);
  }, []);

  const dailySelectionList = uniqueById(
    PRODUCTS.filter((p) => p.sections.includes('daily_selection')).concat(
      PRODUCTS.filter((p) => p.sections.includes('freezers')).slice(0, 2)
    )
  );

  const kitchenList = PRODUCTS.filter(
    (p) => p.sections.includes('kitchen') || p.sections.includes('blenders')
  ).slice(0, 6);

  const coolingList = uniqueById(
    PRODUCTS.filter((p) => p.sections.includes('cooling')).concat(
      PRODUCTS.filter((p) => p.sections.includes('best_offers_new')).slice(1, 5)
    )
  );

  const secondHandList = uniqueById(
    PRODUCTS.filter((p) => p.sections.includes('second_hand')).concat(
      PRODUCTS.filter((p) => p.sections.includes('hightech')).slice(0, 4)
    )
  );

  const hightechList = PRODUCTS.filter((p) =>
    p.sections.includes('hightech')
  ).slice(0, 6);

  const beautyList = uniqueById(
    PRODUCTS.filter((p) => p.sections.includes('beauty')).concat(
      PRODUCTS.filter(
        (p) => p.id === 'watch-chronos-steel' || p.id === 'kettle-winning-18'
      )
    )
  ).slice(0, 6);

  const smartTvList = uniqueById(
    PRODUCTS.filter((p) => p.sections.includes('smart_tv')).concat(
      PRODUCTS.filter(
        (p) => p.id === 'speaker-sonus-360' || p.id === 'headphones-studio-anc'
      )
    )
  );

  const freezersList = uniqueById(
    PRODUCTS.filter((p) => p.sections.includes('freezers')).concat(
      PRODUCTS.filter((p) => p.sections.includes('daily_selection')).slice(0, 2)
    )
  );

  const blendersList = PRODUCTS.filter(
    (p) => p.sections.includes('blenders') || p.sections.includes('kitchen')
  ).slice(0, 6);

  const topDiscountsList = PRODUCTS.filter((p) =>
    p.sections.includes('top_discounts')
  );

  const findProduct = (id: string) =>
    PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];

  const historyProducts = useMemo(
    () =>
      historyIds
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
    [historyIds]
  );

  const historySimilarProducts = useMemo(() => {
    if (historyProducts.length === 0) return [];
    const historySet = new Set(historyProducts.map((p) => p.id));

    return PRODUCTS.filter((candidate) => !historySet.has(candidate.id))
      .map((candidate) => {
        let score = 0;
        historyProducts.forEach((seed, idx) => {
          const recencyWeight = Math.max(1, 4 - idx);
          if (candidate.category === seed.category) {
            score += 4 * recencyWeight;
          }
          if (candidate.brand.toLowerCase() === seed.brand.toLowerCase()) {
            score += 3;
          }
          const sharedSections = candidate.sections.filter((sec) =>
            seed.sections.includes(sec)
          ).length;
          score += sharedSections * 2;

          const minP = seed.price * 0.6;
          const maxP = seed.price * 1.4;
          if (candidate.price >= minP && candidate.price <= maxP) {
            score += 2;
          }
        });
        return { candidate, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((entry) => entry.candidate);
  }, [historyProducts]);

  const scrollBestOffers = (delta: number) => {
    if (bestOffersRef.current) {
      bestOffersRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  const scrollHistoryRow = (delta: number) => {
    if (historyRowRef.current) {
      historyRowRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  const scrollVipPromoRow = (delta: number) => {
    if (vipPromoRowRef.current) {
      vipPromoRowRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  const renderAutoScrollingProducts = (
    items: Product[],
    prefix: string,
    refObj?: RefObject<HTMLDivElement | null>
  ) => {
    const filled: Product[] = [];
    if (items.length > 0) {
      while (filled.length < 6) {
        filled.push(...items);
      }
    }
    return (
      <div
        ref={refObj}
        className="lorena-rtl-track w-full overflow-x-auto no-scrollbar py-1"
      >
        <div className="animate-lorena-rtl-products">
          {[0, 1].map((dupIdx) => (
            <div
              key={`${prefix}-deck-${dupIdx}`}
              aria-hidden={dupIdx === 1}
              className="flex items-stretch gap-3.5 pr-3.5 shrink-0"
            >
              {filled.map((product, idx) => (
                <ProductCard
                  key={`${prefix}-${dupIdx}-${idx}-${product.id}`}
                  product={product}
                  locale={locale}
                  compact
                  isWishlisted={wishlistIds.includes(product.id)}
                  isCompared={compareIds.includes(product.id)}
                  isWaitlisted={waitlistIds.includes(product.id)}
                  justAdded={recentlyAddedId === product.id}
                  onSelectProduct={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                  onToggleWishlist={onToggleWishlist}
                  onToggleCompare={onToggleCompare}
                  onNotifyMe={onNotifyMe}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="lorena-ice-canvas space-y-10 pb-8">
      {/* 1. HERO RIGHT-TO-LEFT CAROUSEL WITH MODELED KINETIC MONTAGE & ROTATING PRODUCT SHOWCASE */}
      <HeroShowcaseCarousel
        locale={locale}
        onSelectProduct={onSelectProduct}
        onSelectCategory={onSelectCategory}
      />

      {/* 1.5 DAILY SPECIALS — 4 ROTATING FEATURED DEALS UPDATED BY DAY OF WEEK */}
      <DailySpecialsSection
        locale={locale}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
        recentlyAddedId={recentlyAddedId}
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onToggleCompare={onToggleCompare}
      />

      {/* 1.75 MES OFFRES & ACCESSOIRES VIP / PRESTIGE + PRODUITS EN DÉFILEMENT */}
      <section className="max-w-[1360px] mx-auto px-3 sm:px-4 space-y-4">
        <div className="ice-surface rounded-3xl p-4 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="glass-pill-gold px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[#000000] inline-flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{locale === 'fr' ? 'Espace Pub & Prestige' : 'VIP Promo Spotlight'}</span>
              </span>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#000000]">
                {locale === 'fr'
                  ? 'Mes Offres, Accessoires VIP & Good Deals'
                  : 'My Offers, VIP Luxury Gear & Good Deals'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={locale === 'fr' ? 'Précédent' : 'Previous'}
                onClick={() => scrollVipPromoRow(-400)}
                className="glass-pill-frost w-8 h-8 rounded-full text-[#000000] hidden sm:flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={locale === 'fr' ? 'Suivant' : 'Next'}
                onClick={() => scrollVipPromoRow(400)}
                className="glass-pill-cta w-8 h-8 rounded-full text-white hidden sm:flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onSelectCategory('fashion')}
                className="glass-pill-black px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#F4BE38] cursor-pointer whitespace-nowrap"
              >
                {t.viewAll}
              </button>
            </div>
          </div>

          {/* 3 Eye-Catching Promotional Highlights (VIP / Offers / Good Deal & Loto) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Card 1: Accessoires VIP / Prestige */}
            <div
              onClick={() => onSelectProduct(findProduct('watch-chronos-steel'))}
              className="ice-obsidian relative rounded-3xl overflow-hidden text-white p-5 flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div
                aria-hidden="true"
                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-[#F4BE38]/15 to-transparent animate-kinetic-sweep pointer-events-none"
              />
              <div className="relative z-10 space-y-2 min-w-0">
                <span className="glass-pill-gold inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[#000000] text-[10px] font-extrabold uppercase tracking-wider">
                  <Crown className="w-3 h-3" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Accessoires VIP' : 'VIP Prestige'}</span>
                </span>
                <h3 className="font-display text-base sm:text-lg font-extrabold leading-snug">
                  {locale === 'fr'
                    ? 'Collection Luxe & Prestige'
                    : 'Luxury & Executive Gear'}
                </h3>
                <p className="text-[11px] text-white/80 line-clamp-2">
                  {locale === 'fr'
                    ? 'Montres acier, Audio Studio ANC & Éditions Pro exclusives.'
                    : 'Steel timepieces, ANC Studio Audio & flagship Pro tech.'}
                </p>
                <span className="glass-pill-frost inline-block px-3 py-1 rounded-full text-[#000000] text-[11px] font-extrabold">
                  {locale === 'fr' ? 'Explorer VIP ▸' : 'Explore VIP ▸'}
                </span>
              </div>
              <div className="ice-product-trap w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-2 shrink-0 flex items-center justify-center relative z-10">
                <ProductImage
                  src={IMAGES.smartwatch}
                  alt="Accessoires VIP"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            {/* Card 2: Mes Offres & Ventes Flash */}
            <div
              onClick={() => onSelectCategory('electronique')}
              className="ice-violet relative rounded-3xl overflow-hidden text-white p-5 flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="relative z-10 space-y-2 min-w-0">
                <span className="glass-pill-black inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[#F4BE38] text-[10px] font-extrabold uppercase tracking-wider">
                  <Flame className="w-3 h-3" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Mes Offres Flash' : 'Flash Deals'}</span>
                </span>
                <h3 className="font-display text-base sm:text-lg font-extrabold leading-snug">
                  {locale === 'fr'
                    ? 'Jusqu’à -40% Immédiat'
                    : 'Up to -40% Instant Markdown'}
                </h3>
                <p className="text-[11px] text-white/85 line-clamp-2">
                  {locale === 'fr'
                    ? 'Promotions choc sur Smart TV, Audio & Smartphones 5G.'
                    : 'Hot markdowns on Smart TVs, Audio & 5G Smartphones.'}
                </p>
                <span className="glass-pill-gold inline-block px-3 py-1 rounded-full text-[#000000] text-[11px] font-extrabold">
                  {locale === 'fr' ? 'Voir Mes Offres ▸' : 'See My Offers ▸'}
                </span>
              </div>
              <div className="ice-product-trap w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-2 shrink-0 flex items-center justify-center relative z-10">
                <ProductImage
                  src={IMAGES.headphones}
                  alt="Mes Offres"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            {/* Card 3: Good Deal & Lorena Loto */}
            <div
              onClick={() => onSelectCategory('all')}
              className="ice-yellow relative rounded-3xl overflow-hidden text-[#000000] p-5 flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="relative z-10 space-y-2 min-w-0">
                <span className="glass-pill-cta inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-white text-[10px] font-extrabold uppercase tracking-wider">
                  <Ticket className="w-3 h-3" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Good Deal & Loto' : 'Good Deal & Loto'}</span>
                </span>
                <h3 className="font-display text-base sm:text-lg font-extrabold leading-snug">
                  {locale === 'fr'
                    ? 'Code LORENA10 & Bonus'
                    : 'Code LORENA10 & Bonus'}
                </h3>
                <p className="text-[11px] text-[#3F3F56] font-medium line-clamp-2">
                  {locale === 'fr'
                    ? 'Chaque commande participe au tirage Lorena Loto & bons d’achat.'
                    : 'Every order unlocks Lorena Loto jackpot tickets & perks.'}
                </p>
                <span className="glass-pill-black inline-block px-3 py-1 rounded-full text-[#F4BE38] text-[11px] font-extrabold">
                  {locale === 'fr' ? 'Profiter du Deal ▸' : 'Grab the Deal ▸'}
                </span>
              </div>
              <div className="ice-product-trap w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-2 shrink-0 flex items-center justify-center relative z-10">
                <ProductImage
                  src={IMAGES.smartphone}
                  alt="Good Deal Lorena Loto"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>

          {/* Continuously Scrolling VIP & Promo Products Carousel Underneath */}
          {renderAutoScrollingProducts(vipLuxuryList, 'vip-promo', vipPromoRowRef)}
        </div>
      </section>

      {/* 2. PARCOURIR PAR CATÉGORIE — CIRCULAR CRYSTAL ICE MEDALLIONS */}
      <section className="max-w-[1360px] mx-auto px-3 sm:px-4">
        <div className="ice-surface rounded-3xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#000000]">
              {t.browseByCategory}
            </h2>
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className="glass-pill-frost px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold text-[#5A5AA1] cursor-pointer"
            >
              {t.viewAll}
            </button>
          </div>

          <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES_META.map((cat) => (
              <ActionIconTooltip
                key={cat.slug}
                text={
                  locale === 'fr'
                    ? `Rayon ${cat.labelFr} — cliquez pour explorer les articles`
                    : `${cat.labelEn} department — click to browse products`
                }
              >
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className="group flex flex-col items-center text-center w-[92px] shrink-0 cursor-pointer"
                >
                  <div className="ice-obsidian relative w-20 h-20 rounded-full border-2 border-white/80 group-hover:border-[#F4BE38] overflow-hidden flex items-center justify-center p-2 transition-all group-hover:scale-105">
                    <img
                      src={cat.image}
                      alt=""
                      aria-hidden="true"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    <span className="relative z-10 font-display text-[10px] font-extrabold text-white leading-tight uppercase tracking-tight">
                      {locale === 'fr' ? cat.badgeTextFr : cat.badgeTextEn}
                    </span>
                  </div>
                  <span className="mt-2 text-xs font-semibold text-[#000000] group-hover:text-[#5A5AA1] leading-tight line-clamp-2">
                    {locale === 'fr' ? cat.labelFr : cat.labelEn}
                  </span>
                </button>
              </ActionIconTooltip>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MEILLEURES OFFRES — OBSIDIAN CRYSTAL ICE CONTAINER WITH TIMER, TABS & AUTO-SCROLL */}
      <section className="max-w-[1360px] mx-auto px-3 sm:px-4">
        <div className="ice-obsidian rounded-3xl p-4 sm:p-6 text-white space-y-5">
          {/* Top Row: Title + Countdown + Carousel Arrows */}
          <div className="flex flex-wrap items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                {t.bestOffers}
              </h2>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBestOfferTab('new')}
                  className={`min-h-[34px] px-4 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    bestOfferTab === 'new'
                      ? 'glass-pill-cta text-white'
                      : 'bg-white/10 border border-white/30 text-white/85 hover:border-[#F4BE38]'
                  }`}
                >
                  {t.newTab}
                </button>
                <button
                  type="button"
                  onClick={() => setBestOfferTab('clearance')}
                  className={`min-h-[34px] px-4 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    bestOfferTab === 'clearance'
                      ? 'glass-pill-cta text-white'
                      : 'bg-white/10 border border-white/30 text-white/85 hover:border-[#F4BE38]'
                  }`}
                >
                  {t.clearanceTab}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-white/80">{t.limitedTime}</span>
                <div className="flex items-center gap-1 font-mono font-bold tabular-nums">
                  {[days, hours, mins, secs].map((unit, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="glass-pill-gold px-2 sm:px-2.5 py-1 rounded-full text-[#000000] text-xs font-extrabold">
                        {unit}
                      </span>
                      {i < 3 && <span className="text-white/60">:</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ActionIconTooltip
                  placement="top"
                  text={
                    locale === 'fr'
                      ? 'Défiler les meilleures offres vers la gauche'
                      : 'Scroll best offers left'
                  }
                >
                  <button
                    type="button"
                    aria-label="Précédent"
                    onClick={() => scrollBestOffers(-450)}
                    className="glass-pill-frost w-8 h-8 rounded-full text-[#000000] flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                </ActionIconTooltip>
                <ActionIconTooltip
                  placement="top"
                  text={
                    locale === 'fr'
                      ? 'Défiler les meilleures offres vers la droite'
                      : 'Scroll best offers right'
                  }
                >
                  <button
                    type="button"
                    aria-label="Suivant"
                    onClick={() => scrollBestOffers(450)}
                    className="glass-pill-cta w-8 h-8 rounded-full text-white flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </ActionIconTooltip>
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className="glass-pill-gold ml-1 min-h-[34px] px-4 py-1 rounded-full text-[#000000] text-xs font-extrabold cursor-pointer"
                >
                  {t.viewMore}
                </button>
              </div>
            </div>
          </div>

          {/* Auto-Scrolling Right-to-Left Product Carousel */}
          {renderAutoScrollingProducts(bestOffersList, `best-${bestOfferTab}`, bestOffersRef)}
        </div>
      </section>

      {/* 4. SÉLECTION DU JOUR + 3-COLUMN REASSURANCE BAR */}
      <ProductCarouselRow
        title={t.dailySelection}
        products={dailySelectionList}
        locale={locale}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
        waitlistIds={waitlistIds}
        recentlyAddedId={recentlyAddedId}
        darkHeaderBar
        viewAllCategory="gros-electromenager"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onToggleCompare={onToggleCompare}
        onNotifyMe={onNotifyMe}
        onViewAll={onSelectCategory}
      />

      {/* 3-Column Trust & Logistics Bar Encased in Frosted Crystal Ice */}
      <section className="max-w-[1360px] mx-auto px-3 sm:px-4">
        <div className="ice-surface rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/70">
            <div className="p-5 sm:p-6">
              <span className="glass-pill-gold inline-block px-2.5 py-0.5 rounded-full font-mono text-xs font-extrabold text-[#000000]">
                01
              </span>
              <h3 className="mt-2 font-display text-sm font-bold text-[#000000]">
                {t.reassurance01Title}
              </h3>
              <p className="mt-1 text-xs text-[#3F3F56] leading-relaxed">
                {t.reassurance01Desc}
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <span className="glass-pill-cta inline-block px-2.5 py-0.5 rounded-full font-mono text-xs font-extrabold text-white">
                02
              </span>
              <h3 className="mt-2 font-display text-sm font-bold text-[#000000]">
                {t.reassurance02Title}
              </h3>
              <p className="mt-1 text-xs text-[#3F3F56] leading-relaxed">
                {t.reassurance02Desc}
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <span className="glass-pill-blue inline-block px-2.5 py-0.5 rounded-full font-mono text-xs font-extrabold text-white">
                03
              </span>
              <h3 className="mt-2 font-display text-sm font-bold text-[#000000]">
                {t.reassurance03Title}
              </h3>
              <p className="mt-1 text-xs text-[#3F3F56] leading-relaxed">
                {t.reassurance03Desc}
              </p>
            </div>
          </div>

          <div className="ice-surface-subtle px-4 sm:px-6 py-3 border-t border-white/80 flex flex-wrap items-center justify-between gap-2 text-xs text-[#3F3F56]">
            <span className="font-medium">{t.customerServiceHours}</span>
            <span className="glass-pill-frost px-3 py-0.5 rounded-full font-mono font-bold text-[#000000]">
              693 71 25 25
            </span>
          </div>
        </div>
      </section>

      {/* 4.5 D'APRÈS VOTRE HISTORIQUE / BASED ON YOUR HISTORY */}
      {historyProducts.length > 0 && historySimilarProducts.length > 0 && (
        <section
          aria-labelledby="based-on-history-heading"
          className="max-w-[1360px] mx-auto px-3 sm:px-4 space-y-4"
        >
          <div className="ice-obsidian text-white rounded-3xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ActionIconTooltip
                focusable
                placement="right"
                text={
                  locale === 'fr'
                    ? 'Historique local de vos produits récemment consultés'
                    : 'Local history of your recently viewed products'
                }
              >
                <span className="glass-pill-gold w-9 h-9 rounded-full text-[#000000] flex items-center justify-center shrink-0">
                  <History className="w-4 h-4" aria-hidden="true" />
                </span>
              </ActionIconTooltip>
              <div>
                <h2
                  id="based-on-history-heading"
                  className="font-display text-base sm:text-lg font-bold text-white"
                >
                  {locale === 'fr'
                    ? "D'après votre historique"
                    : 'Based on your history'}
                </h2>
                <p className="text-[11px] text-white/75">
                  {locale === 'fr'
                    ? 'Articles similaires à vos dernières consultations et ajouts'
                    : 'Similar items inspired by products you recently viewed or added'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onClearHistory && (
                <ActionIconTooltip
                  placement="top"
                  text={
                    locale === 'fr'
                      ? 'Effacer votre historique de navigation récent'
                      : 'Clear your recent browsing history'
                  }
                >
                  <button
                    type="button"
                    onClick={onClearHistory}
                    className="min-h-[32px] px-3 py-1 rounded-full bg-white/10 border border-white/25 hover:border-[#F4BE38] text-white/85 hover:text-[#F4BE38] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" aria-hidden="true" />
                    <span>{locale === 'fr' ? 'Effacer' : 'Clear'}</span>
                  </button>
                </ActionIconTooltip>
              )}
              <ActionIconTooltip
                placement="top"
                text={
                  locale === 'fr'
                    ? 'Voir les recommandations précédentes'
                    : 'Scroll recommendations left'
                }
              >
                <button
                  type="button"
                  aria-label={locale === 'fr' ? 'Précédent' : 'Previous'}
                  onClick={() => scrollHistoryRow(-420)}
                  className="glass-pill-frost w-8 h-8 rounded-full text-[#000000] flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
              </ActionIconTooltip>
              <ActionIconTooltip
                placement="top"
                text={
                  locale === 'fr'
                    ? 'Voir plus de recommandations similaires'
                    : 'Scroll recommendations right'
                }
              >
                <button
                  type="button"
                  aria-label={locale === 'fr' ? 'Suivant' : 'Next'}
                  onClick={() => scrollHistoryRow(420)}
                  className="glass-pill-cta w-8 h-8 rounded-full text-white flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </ActionIconTooltip>
              <button
                type="button"
                onClick={() => onSelectCategory(historyProducts[0].category)}
                className="glass-pill-gold px-3.5 py-1.5 rounded-full text-[#000000] text-xs font-extrabold cursor-pointer"
              >
                {t.viewAll}
              </button>
            </div>
          </div>

          {/* Recently Viewed Seed Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F3F56] shrink-0">
              {locale === 'fr' ? 'Basé sur :' : 'Inspired by:'}
            </span>
            {historyProducts.slice(0, 4).map((seed) => (
              <button
                key={seed.id}
                type="button"
                onClick={() => onSelectProduct(seed)}
                className="glass-pill-frost px-3.5 py-1 rounded-full text-xs font-semibold text-[#000000] whitespace-nowrap shrink-0 cursor-pointer"
              >
                {locale === 'fr' ? seed.nameFr : seed.nameEn}
              </button>
            ))}
          </div>

          {renderAutoScrollingProducts(historySimilarProducts, 'history', historyRowRef)}
        </section>
      )}

      {/* 5. CATÉGORIES PROPOSÉES — FROSTED CRYSTAL BENTO GRID */}
      <section className="max-w-[1360px] mx-auto px-3 sm:px-4 space-y-4">
        <div className="ice-surface rounded-3xl px-4 sm:px-5 py-3 flex items-center justify-between gap-2">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#000000]">
            {t.suggestedCategories}
          </h2>
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="glass-pill-frost px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold text-[#5A5AA1] cursor-pointer"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left Vertical Feature Poster */}
          <div
            onClick={() => onSelectCategory('electronique')}
            className="ice-obsidian lg:col-span-3 rounded-3xl overflow-hidden text-white p-5 flex flex-col justify-between min-h-[280px] cursor-pointer group"
          >
            <div>
              <h3 className="font-display text-2xl font-extrabold italic">
                {locale === 'fr' ? 'Du bon son' : 'Studio Sound'}
              </h3>
              <p className="mt-1.5 text-xs text-white/85">
                {locale === 'fr' ? 'À partir de ' : 'Starting from '}
                <span className="glass-pill-gold px-2.5 py-0.5 rounded-full text-[#000000] font-extrabold">
                  14 990 FCFA
                </span>
              </p>
            </div>
            <ActionIconTooltip
              className="block w-full my-4"
              focusable
              text={
                locale === 'fr'
                  ? 'Illustration Audio Hi-Fi — cliquez pour explorer le rayon Électronique'
                  : 'Hi-Fi Audio illustration — click to browse Electronics'
              }
            >
              <div className="ice-product-trap h-36 rounded-2xl p-3 flex items-center justify-center">
                <ProductImage
                  src={IMAGES.speaker}
                  alt="Audio Hi-Fi"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </ActionIconTooltip>
            <div className="flex justify-end">
              <span className="glass-pill-frost px-3.5 py-1.5 rounded-full text-[#000000] text-xs font-extrabold">
                {t.visitBtn} ▸
              </span>
            </div>
          </div>

          {/* Right 2x4 Grid of Compact Split Crystal Cards */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
            {SUGGESTED_BENTO_CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelectCategory(card.category)}
                className="ice-surface hover:-translate-y-0.5 rounded-3xl overflow-hidden grid grid-cols-2 text-left transition-all cursor-pointer min-h-[126px]"
              >
                <div className="ice-obsidian text-white p-3 flex flex-col justify-between">
                  <span className="font-display text-[11px] font-bold leading-tight">
                    {locale === 'fr' ? card.titleFr : card.titleEn}
                  </span>
                  <span className="glass-pill-cta mt-2 inline-block w-fit px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold">
                    {locale === 'fr' ? '◂ Acheter ▸' : '◂ Shop ▸'}
                  </span>
                </div>
                <div className="ice-product-trap p-2 flex items-center justify-center">
                  <ProductImage
                    src={card.image}
                    alt={card.titleFr}
                    className="w-full h-24 object-contain"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LES INCONTOURNABLES DU MOMENT + FULL-WIDTH CRYSTAL PROMO BANNER */}
      <ProductCarouselRow
        title={t.trendingNow}
        products={coolingList}
        locale={locale}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
        waitlistIds={waitlistIds}
        recentlyAddedId={recentlyAddedId}
        viewAllCategory="petit-electromenager"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onToggleCompare={onToggleCompare}
        onNotifyMe={onNotifyMe}
        onViewAll={onSelectCategory}
      />

      <section className="max-w-[1360px] mx-auto px-3 sm:px-4">
        <div
          onClick={() => onSelectProduct(findProduct('kettle-winning-18'))}
          className="ice-obsidian rounded-3xl overflow-hidden text-white px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-5 cursor-pointer"
        >
          <div className="ice-product-trap w-28 h-24 rounded-2xl p-2 shrink-0 flex items-center justify-center">
            <ProductImage
              src={IMAGES.kettle}
              alt="Électro compact"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-display text-lg sm:text-2xl font-extrabold uppercase">
              {locale === 'fr'
                ? 'ÉQUIPEMENT CUISINE INOX 1.8L'
                : 'STAINLESS KITCHEN GEAR 1.8L'}
            </h3>
            <p className="text-xs text-white/80 mt-0.5">
              {locale === 'fr'
                ? 'COMPACT, RAPIDE & ÉCONOMIQUE'
                : 'COMPACT, FAST & ENERGY SAVING'}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="glass-pill-gold px-4 py-1 rounded-full text-[#000000] font-display text-xl sm:text-2xl font-extrabold tabular-nums">
                14 500 Fcfa
              </span>
              <span className="text-sm text-white/60 line-through tabular-nums">
                25 000 Fcfa
              </span>
            </div>
          </div>
          <span className="glass-pill-cta px-6 py-2.5 rounded-full text-white font-display text-xs font-extrabold uppercase shrink-0">
            {locale === 'fr' ? 'CLIQUEZ ICI !' : 'SHOP DEAL!'}
          </span>
        </div>
      </section>

      {/* 7. L'UNIVERS DES SUSPENDUS (SECONDE MAIN) + DUAL PROMO BANNERS */}
      <ProductCarouselRow
        title={t.secondHandUniverse}
        products={secondHandList}
        locale={locale}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
        waitlistIds={waitlistIds}
        recentlyAddedId={recentlyAddedId}
        viewAllCategory="telephones-tablettes"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onToggleCompare={onToggleCompare}
        onNotifyMe={onNotifyMe}
        onViewAll={onSelectCategory}
      />

      <section className="max-w-[1360px] mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => onSelectCategory('petit-electromenager')}
            className="ice-violet rounded-3xl text-white p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
          >
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase text-[#F4BE38]">
                {locale === 'fr' ? 'Blenders & Cuisine' : 'Blenders & Kitchen'}
              </span>
              <h3 className="font-display text-lg sm:text-xl font-extrabold mt-1">
                17 500 F — 57 000 F
              </h3>
              <span className="glass-pill-black mt-3 inline-block px-4 py-1.5 rounded-full text-white text-xs font-bold">
                {locale === 'fr' ? 'ACHETEZ !' : 'BUY NOW!'}
              </span>
            </div>
            <div className="ice-product-trap w-24 h-20 sm:w-28 sm:h-24 rounded-2xl p-2 shrink-0 flex items-center justify-center">
              <ProductImage
                src={IMAGES.blender}
                alt="Blender Cuisine"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div
            onClick={() => onSelectCategory('electronique')}
            className="ice-obsidian rounded-3xl text-white p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
          >
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase text-[#38BDF8]">
                Smart TV 4K LG · Hisense · Cosmic
              </span>
              <h3 className="font-display text-lg sm:text-xl font-extrabold mt-1">
                62 500 F — 279 000 F
              </h3>
              <span className="glass-pill-cta mt-3 inline-block px-4 py-1.5 rounded-full text-white text-xs font-bold">
                {locale === 'fr' ? 'ACHETEZ !' : 'BUY NOW!'}
              </span>
            </div>
            <div className="ice-product-trap w-24 h-20 sm:w-28 sm:h-24 rounded-2xl p-2 shrink-0 flex items-center justify-center">
              <ProductImage
                src={IMAGES.smartTv}
                alt="Smart TV 4K"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. HIGH-TECH À PRIX DOUX (POSTER LEFT + AUTO-SCROLLING CAROUSEL) */}
      <section className="max-w-[1360px] mx-auto px-3 sm:px-4 space-y-4">
        <div className="ice-surface rounded-3xl px-4 sm:px-5 py-3 flex items-center justify-between gap-2">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#000000]">
            {t.highTechSoftPrice}
          </h2>
          <button
            type="button"
            onClick={() => onSelectCategory('telephones-tablettes')}
            className="glass-pill-frost px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold text-[#5A5AA1] cursor-pointer"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          <div
            onClick={() => onSelectCategory('telephones-tablettes')}
            className="ice-obsidian lg:col-span-3 rounded-3xl overflow-hidden text-white p-5 flex flex-col justify-between min-h-[280px] cursor-pointer"
          >
            <div className="ice-product-trap h-36 sm:h-40 rounded-2xl p-3 flex items-center justify-center">
              <ProductImage
                src={IMAGES.smartphone}
                alt="High-tech Smartphones"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4">
              <span className="glass-pill-gold inline-block px-2.5 py-0.5 rounded-full text-[#000000] text-[10px] font-extrabold uppercase">
                HIGH-TECH
              </span>
              <h3 className="mt-2 font-display text-xl font-bold">
                {locale === 'fr' ? 'À prix doux' : 'Smart prices'}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                {locale === 'fr' ? 'Smartphones & tablettes' : 'Smartphones & tablets'}
              </p>
              <span className="glass-pill-frost mt-3 inline-block px-4 py-1.5 rounded-full text-[#000000] text-xs font-extrabold">
                {t.discoverBtn}
              </span>
            </div>
          </div>

          <div className="lg:col-span-9 min-w-0 flex items-center">
            {renderAutoScrollingProducts(hightechList, 'hightech')}
          </div>
        </div>
      </section>

      {/* 9. BEAUTÉ & SOINS (POSTER LEFT + AUTO-SCROLLING CAROUSEL) */}
      <section className="max-w-[1360px] mx-auto px-3 sm:px-4 space-y-4">
        <div className="ice-surface rounded-3xl px-4 sm:px-5 py-3 flex items-center justify-between gap-2">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#000000]">
            {t.beautyCare}
          </h2>
          <button
            type="button"
            onClick={() => onSelectCategory('sante-beaute')}
            className="glass-pill-frost px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold text-[#5A5AA1] cursor-pointer"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          <div
            onClick={() => onSelectCategory('sante-beaute')}
            className="ice-violet lg:col-span-3 rounded-3xl overflow-hidden text-white p-5 flex flex-col justify-between min-h-[280px] cursor-pointer"
          >
            <div className="ice-product-trap h-36 sm:h-40 rounded-2xl p-3 flex items-center justify-center">
              <ProductImage
                src={IMAGES.beauty}
                alt="Beauté & soins"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4">
              <span className="glass-pill-gold inline-block px-2.5 py-0.5 rounded-full text-[#000000] text-[10px] font-extrabold uppercase">
                {locale === 'fr' ? 'BEAUTÉ' : 'BEAUTY'}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold">
                {t.beautyCare}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                {locale === 'fr' ? 'Soins hydratants & bien-être' : 'Skincare & wellness'}
              </p>
              <span className="glass-pill-frost mt-3 inline-block px-4 py-1.5 rounded-full text-[#000000] text-xs font-extrabold">
                {t.discoverBtn}
              </span>
            </div>
          </div>

          <div className="lg:col-span-9 min-w-0 flex items-center">
            {renderAutoScrollingProducts(beautyList, 'beauty')}
          </div>
        </div>
      </section>

      {/* 10. SMART TV + DUAL VIOLET CRYSTAL BANNERS */}
      <ProductCarouselRow
        title={t.smartTvSection}
        products={smartTvList}
        locale={locale}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
        waitlistIds={waitlistIds}
        recentlyAddedId={recentlyAddedId}
        viewAllCategory="electronique"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onToggleCompare={onToggleCompare}
        onNotifyMe={onNotifyMe}
        onViewAll={onSelectCategory}
      />

      <section className="max-w-[1360px] mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => onSelectProduct(findProduct('ac-icona-125'))}
            className="ice-violet rounded-3xl p-4 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
          >
            <div className="text-white min-w-0">
              <p className="font-display text-sm font-bold leading-snug">
                {locale === 'fr'
                  ? 'Dites adieu à la chaleur, place au confort !'
                  : 'Say goodbye to heat, hello comfort!'}
              </p>
              <span className="glass-pill-black mt-2 inline-block px-3.5 py-1.5 rounded-full text-[#F4BE38] font-display text-lg sm:text-2xl font-extrabold tabular-nums">
                157 900 Fcfa
              </span>
            </div>
            <ActionIconTooltip
              focusable
              text={
                locale === 'fr'
                  ? 'Illustration Climatiseur Split — cliquez pour consulter la fiche produit'
                  : 'Split AC illustration — click to view product details'
              }
            >
              <div className="ice-product-trap w-24 h-20 sm:w-32 sm:h-24 rounded-2xl p-2 shrink-0 flex items-center justify-center">
                <ProductImage
                  src={IMAGES.acUnit}
                  alt="Climatiseur Split"
                  className="w-full h-full object-contain"
                />
              </div>
            </ActionIconTooltip>
          </div>

          <div
            onClick={() => onSelectProduct(findProduct('chair-ergo-study'))}
            className="ice-yellow rounded-3xl p-4 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
          >
            <div className="text-[#000000] min-w-0">
              <p className="font-display text-sm font-bold leading-snug">
                {locale === 'fr'
                  ? "Le confort au service de l'apprentissage, à partir de"
                  : 'Study comfort starting from'}
              </p>
              <span className="glass-pill-black mt-2 inline-block px-3.5 py-1.5 rounded-full text-[#F4BE38] font-display text-lg sm:text-2xl font-extrabold tabular-nums">
                55 000 Fcfa
              </span>
            </div>
            <ActionIconTooltip
              focusable
              text={
                locale === 'fr'
                  ? 'Illustration Chaise Ergonomique — cliquez pour consulter la fiche produit'
                  : 'Ergonomic Chair illustration — click to view product details'
              }
            >
              <div className="ice-product-trap w-24 h-20 sm:w-28 sm:h-24 rounded-2xl p-2 shrink-0 flex items-center justify-center">
                <ProductImage
                  src={IMAGES.heroChair}
                  alt="Chaise d'étude"
                  className="w-full h-full object-contain"
                />
              </div>
            </ActionIconTooltip>
          </div>
        </div>
      </section>

      {/* 11. GARDEZ TOUT FRAIS (#000000 HEADER) + MIXEZ + TOP RÉDUCTIONS (accuille_nkcl10 / accuille_nkcl4) */}
      <ProductCarouselRow
        title={t.keepFreshSection}
        products={freezersList}
        locale={locale}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
        waitlistIds={waitlistIds}
        recentlyAddedId={recentlyAddedId}
        darkHeaderBar
        viewAllCategory="gros-electromenager"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onToggleCompare={onToggleCompare}
        onNotifyMe={onNotifyMe}
        onViewAll={onSelectCategory}
      />

      <ProductCarouselRow
        title={t.mixSavorSection}
        products={blendersList.length > 0 ? blendersList : kitchenList}
        locale={locale}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
        waitlistIds={waitlistIds}
        recentlyAddedId={recentlyAddedId}
        viewAllCategory="petit-electromenager"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onToggleCompare={onToggleCompare}
        onNotifyMe={onNotifyMe}
        onViewAll={onSelectCategory}
      />

      <ProductCarouselRow
        title={t.topDiscountsSection}
        products={topDiscountsList}
        locale={locale}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
        waitlistIds={waitlistIds}
        recentlyAddedId={recentlyAddedId}
        viewAllCategory="electronique"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onToggleCompare={onToggleCompare}
        onNotifyMe={onNotifyMe}
        onViewAll={onSelectCategory}
      />
    </div>
  );
}
