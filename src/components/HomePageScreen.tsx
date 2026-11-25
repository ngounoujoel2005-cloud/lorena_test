import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  CATEGORIES_META,
  IMAGES,
  PRODUCTS,
  SUGGESTED_BENTO_CARDS,
} from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { CategorySlug, Locale, Product } from '../types/store';
import { ProductCard } from './ProductCard';
import { ProductCarouselRow } from './ProductCarouselRow';
import { ProductImage } from './ProductImage';

interface HomePageScreenProps {
  locale: Locale;
  wishlistIds: string[];
  recentlyAddedId: string | null;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onSelectCategory: (slug: CategorySlug) => void;
}

export function HomePageScreen({
  locale,
  wishlistIds,
  recentlyAddedId,
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  onSelectCategory,
}: HomePageScreenProps) {
  const t = TRANSLATIONS[locale];
  const [bestOfferTab, setBestOfferTab] = useState<'new' | 'clearance'>('new');
  const [secondsLeft, setSecondsLeft] = useState(2 * 86400 + 3600 + 8);
  const bestOffersRef = useRef<HTMLDivElement>(null);

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

  const bestOffersList = PRODUCTS.filter((p) =>
    bestOfferTab === 'new'
      ? p.sections.includes('best_offers_new')
      : p.sections.includes('best_offers_clearance')
  );

  const dailySelectionList = PRODUCTS.filter((p) =>
    p.sections.includes('daily_selection')
  ).concat(PRODUCTS.filter((p) => p.sections.includes('freezers')).slice(0, 2));

  const kitchenList = PRODUCTS.filter(
    (p) => p.sections.includes('kitchen') || p.sections.includes('blenders')
  ).slice(0, 6);

  const coolingList = PRODUCTS.filter(
    (p) => p.sections.includes('cooling')
  ).concat(PRODUCTS.filter((p) => p.sections.includes('best_offers_new')).slice(1, 5));

  const secondHandList = PRODUCTS.filter((p) =>
    p.sections.includes('second_hand')
  ).concat(PRODUCTS.filter((p) => p.sections.includes('hightech')).slice(0, 4));

  const hightechList = PRODUCTS.filter((p) =>
    p.sections.includes('hightech')
  ).slice(0, 4);

  const beautyList = PRODUCTS.filter((p) =>
    p.sections.includes('beauty')
  ).concat(PRODUCTS.filter((p) => p.id === 'watch-chronos-steel' || p.id === 'kettle-winning-18')).slice(0, 4);

  const smartTvList = PRODUCTS.filter((p) =>
    p.sections.includes('smart_tv')
  ).concat(PRODUCTS.filter((p) => p.id === 'speaker-sonus-360' || p.id === 'headphones-studio-anc'));

  const freezersList = PRODUCTS.filter((p) =>
    p.sections.includes('freezers')
  ).concat(PRODUCTS.filter((p) => p.sections.includes('daily_selection')).slice(0, 2));

  const blendersList = PRODUCTS.filter((p) =>
    p.sections.includes('blenders') || p.sections.includes('kitchen')
  ).slice(0, 6);

  const topDiscountsList = PRODUCTS.filter((p) =>
    p.sections.includes('top_discounts')
  );

  const findProduct = (id: string) =>
    PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];

  const scrollBestOffers = (delta: number) => {
    if (bestOffersRef.current) {
      bestOffersRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-10 pb-8 bg-[#F8F9FA]">
      {/* 1. HERO MULTI-COLUMN PROMO GRID (accuuille_nkcl1) */}
      <section className="max-w-[1360px] mx-auto px-4 pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-stretch">
          {/* Card 1: Brand Relaunch Story */}
          <div
            onClick={() => onSelectCategory('all')}
            className="lg:col-span-2 rounded-2xl overflow-hidden bg-gradient-to-b from-[#000000] via-[#1b1b38] to-[#5A5AA1] text-white p-4 flex flex-col justify-between min-h-[300px] cursor-pointer group"
          >
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#F4BE38] text-[#000000] font-display text-[10px] font-extrabold uppercase tracking-wider">
                Lorena Market
              </span>
              <h1 className="mt-3 font-display text-xl font-extrabold leading-tight">
                {locale === 'fr' ? 'FAIT PEAU NEUVE' : 'NEW EXPERIENCE'}
              </h1>
              <p className="mt-2 text-xs text-white/80 leading-relaxed">
                {locale === 'fr'
                  ? "Une nouvelle identité. Une expérience d'achat fluide en XAF."
                  : 'A fresh storefront experience in XAF with Mobile Money.'}
              </p>
            </div>
            <div className="mt-4 rounded-xl overflow-hidden aspect-[4/3] bg-white/10 border border-white/15">
              <ProductImage
                src={IMAGES.heroAudio}
                alt="Lorena Market sélection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Card 2: Ergonomic Comfort (#A084E8 -> #5A5AA1) */}
          <div
            onClick={() => onSelectProduct(findProduct('chair-ergo-study'))}
            className="lg:col-span-3 rounded-2xl overflow-hidden bg-gradient-to-br from-[#A084E8] to-[#5A5AA1] text-white p-5 flex flex-col justify-between min-h-[300px] cursor-pointer group"
          >
            <div>
              <p className="font-display text-sm font-semibold leading-snug text-white/95">
                {locale === 'fr'
                  ? "Le confort au service de l'apprentissage, à partir de"
                  : 'Study & office comfort starting from'}
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold text-[#F4BE38] tabular-nums">
                55 000 Fcfa
              </p>
            </div>
            <div className="my-3 h-40 rounded-xl overflow-hidden bg-white/95 p-2 flex items-center justify-center">
              <ProductImage
                src={IMAGES.heroChair}
                alt="Chaise ergonomique bureau"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full bg-white text-[#000000] text-xs font-bold">
                {locale === 'fr' ? "Voir l'offre" : 'View offer'}
              </span>
              <span className="w-8 h-8 rounded-full bg-[#000000]/30 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-white fill-white" aria-hidden="true" />
              </span>
            </div>
          </div>

          {/* Card 3: Freshness Appliances */}
          <div
            onClick={() => onSelectCategory('gros-electromenager')}
            className="lg:col-span-2 rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] p-4 flex flex-col justify-between min-h-[300px] cursor-pointer group"
          >
            <div>
              <span className="inline-block px-2 py-0.5 rounded bg-[#F4BE38] text-[#000000] font-display text-xs font-extrabold">
                {locale === 'fr' ? 'Dites oui à la fraîcheur !' : 'Stay cool & fresh!'}
              </span>
              <p className="mt-2 text-xs text-[#000000] font-medium leading-snug">
                {locale === 'fr'
                  ? 'Découvrez nos réfrigérateurs de qualité à prix imbattables.'
                  : 'Explore top refrigerators at unbeatable XAF prices.'}
              </p>
            </div>
            <div className="my-2 h-36 flex items-center justify-center">
              <ProductImage
                src={IMAGES.fridge}
                alt="Réfrigérateurs Lorena"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="inline-block w-fit px-3 py-1.5 rounded bg-[#5A5AA1] text-white text-[11px] font-bold uppercase">
              {locale === 'fr' ? 'DÉCOUVRIR !' : 'DISCOVER!'}
            </span>
          </div>

          {/* Card 4: Future Smartphones */}
          <div
            onClick={() => onSelectProduct(findProduct('titan-x5-pro'))}
            className="lg:col-span-3 rounded-2xl overflow-hidden bg-[#000000] text-white p-5 flex flex-col justify-between min-h-[300px] cursor-pointer group"
          >
            <div>
              <h2 className="font-display text-lg font-extrabold leading-tight">
                {locale === 'fr'
                  ? "Le futur n'attend pas. Passez au Pro !"
                  : 'The future awaits. Go Pro today!'}
              </h2>
              <p className="mt-1.5 text-xs text-white/75">
                {locale === 'fr'
                  ? "Le luxe, la puissance et l'innovation réunis dans un seul smartphone."
                  : 'Titanium power and 5G clarity in one flagship phone.'}
              </p>
            </div>
            <div className="my-3 h-40 rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center">
              <ProductImage
                src={IMAGES.smartphone}
                alt="Smartphone Pro 5G"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="inline-block w-fit px-3.5 py-1.5 rounded bg-[#5A5AA1] text-white text-[11px] font-bold uppercase">
              {locale === 'fr' ? 'ACHETEZ !' : 'SHOP NOW!'}
            </span>
          </div>

          {/* Column 5: 2 Stacked Promo Cards */}
          <div className="lg:col-span-2 flex flex-col gap-3.5">
            <div
              onClick={() => onSelectCategory('all')}
              className="flex-1 rounded-2xl bg-gradient-to-br from-[#5A5AA1] to-[#000000] text-white p-4 flex flex-col justify-center cursor-pointer hover:opacity-95 transition-opacity"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4BE38]">
                {locale === 'fr' ? 'Logistique Nationale' : 'Nationwide Logistics'}
              </span>
              <p className="mt-1 font-display text-base font-extrabold leading-snug">
                {locale === 'fr'
                  ? 'et EXPÉDIONS dans les autres villes'
                  : 'Fast dispatch to Douala, Yaoundé & all regions'}
              </p>
            </div>

            <div
              onClick={() => onSelectProduct(findProduct('kettle-winning-18'))}
              className="flex-1 rounded-2xl bg-white border border-[#E5E7EB] p-3.5 flex items-center gap-3 cursor-pointer hover:border-[#5A5AA1] transition-colors"
            >
              <div className="w-16 h-16 shrink-0">
                <ProductImage
                  src={IMAGES.kettle}
                  alt="Bouilloire Inox"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#000000] leading-tight">
                  {locale === 'fr' ? 'Bouilloire Inox 1.8L' : 'Steel Kettle 1.8L'}
                </p>
                <p className="mt-1 px-1.5 py-0.5 rounded bg-[#F4BE38] text-[#000000] font-display text-xs font-extrabold w-fit tabular-nums">
                  14 500 Fcfa
                </p>
                <span className="mt-1 inline-block text-[11px] font-bold text-[#5A5AA1]">
                  {locale === 'fr' ? 'Acheter ▸' : 'Buy ▸'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARCOURIR PAR CATÉGORIE — CIRCULAR MEDALLIONS (accuuille_nkcl1 / accuille_nkcl3) */}
      <section className="max-w-[1360px] mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#000000]">
            {t.browseByCategory}
          </h2>
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="text-xs sm:text-sm font-semibold text-[#5A5AA1] hover:underline cursor-pointer"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES_META.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className="group flex flex-col items-center text-center w-[92px] shrink-0 cursor-pointer"
            >
              <div className="relative w-20 h-20 rounded-full bg-[#000000] border-2 border-[#5A5AA1]/50 group-hover:border-[#F4BE38] overflow-hidden flex items-center justify-center p-2 transition-all group-hover:scale-105">
                <img
                  src={cat.image}
                  alt=""
                  aria-hidden="true"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-25"
                />
                <span className="relative z-10 font-display text-[10px] font-extrabold text-white leading-tight uppercase tracking-tight">
                  {locale === 'fr' ? cat.badgeTextFr : cat.badgeTextEn}
                </span>
              </div>
              <span className="mt-2 text-xs font-medium text-[#000000] group-hover:text-[#5A5AA1] leading-tight line-clamp-2">
                {locale === 'fr' ? cat.labelFr : cat.labelEn}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. MEILLEURES OFFRES — DARK #000000 CONTAINER WITH TIMER & TABS (accuille_nkcl3) */}
      <section className="max-w-[1360px] mx-auto px-4">
        <div className="bg-[#000000] rounded-2xl p-5 sm:p-6 text-white space-y-5 border border-[#5A5AA1]/40">
          {/* Top Row: Title + Countdown + Carousel Arrows */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                {t.bestOffers}
              </h2>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBestOfferTab('new')}
                  className={`min-h-[34px] px-4 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    bestOfferTab === 'new'
                      ? 'bg-[#5A5AA1] text-white'
                      : 'border border-white/25 text-white/80 hover:border-[#A084E8]'
                  }`}
                >
                  {t.newTab}
                </button>
                <button
                  type="button"
                  onClick={() => setBestOfferTab('clearance')}
                  className={`min-h-[34px] px-4 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    bestOfferTab === 'clearance'
                      ? 'bg-[#5A5AA1] text-white'
                      : 'border border-white/25 text-white/80 hover:border-[#A084E8]'
                  }`}
                >
                  {t.clearanceTab}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/75">{t.limitedTime}</span>
                <div className="flex items-center gap-1 font-mono font-bold tabular-nums">
                  {[days, hours, mins, secs].map((unit, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="px-2 py-1 rounded bg-[#F4BE38] text-[#000000] text-xs">
                        {unit}
                      </span>
                      {i < 3 && <span className="text-white/50">:</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Précédent"
                  onClick={() => scrollBestOffers(-450)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-[#5A5AA1] text-white flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Suivant"
                  onClick={() => scrollBestOffers(450)}
                  className="w-8 h-8 rounded-full bg-[#5A5AA1] hover:bg-[#A084E8] text-white flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className="ml-1 min-h-[34px] px-4 py-1 rounded-full bg-white text-[#000000] text-xs font-bold hover:bg-[#F4BE38] transition-colors cursor-pointer"
                >
                  {t.viewMore}
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Product Cards */}
          <div
            ref={bestOffersRef}
            className="flex items-stretch gap-3.5 overflow-x-auto no-scrollbar pb-1"
          >
            {bestOffersList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                compact
                isWishlisted={wishlistIds.includes(product.id)}
                justAdded={recentlyAddedId === product.id}
                onSelectProduct={onSelectProduct}
                onQuickAdd={onQuickAdd}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SÉLECTION DU JOUR + 3-COLUMN REASSURANCE BAR (accuille_nkcl_11) */}
      <ProductCarouselRow
        title={t.dailySelection}
        products={dailySelectionList}
        locale={locale}
        wishlistIds={wishlistIds}
        recentlyAddedId={recentlyAddedId}
        darkHeaderBar
        viewAllCategory="gros-electromenager"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onViewAll={onSelectCategory}
      />

      {/* 3-Column Trust & Logistics Bar */}
      <section className="max-w-[1360px] mx-auto px-4">
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
            <div className="p-6">
              <span className="font-mono text-xs font-bold text-[#5A5AA1]">01</span>
              <h3 className="mt-1 font-display text-sm font-bold text-[#000000]">
                {t.reassurance01Title}
              </h3>
              <p className="mt-1 text-xs text-[#6C757D] leading-relaxed">
                {t.reassurance01Desc}
              </p>
            </div>
            <div className="p-6">
              <span className="font-mono text-xs font-bold text-[#5A5AA1]">02</span>
              <h3 className="mt-1 font-display text-sm font-bold text-[#000000]">
                {t.reassurance02Title}
              </h3>
              <p className="mt-1 text-xs text-[#6C757D] leading-relaxed">
                {t.reassurance02Desc}
              </p>
            </div>
            <div className="p-6">
              <span className="font-mono text-xs font-bold text-[#5A5AA1]">03</span>
              <h3 className="mt-1 font-display text-sm font-bold text-[#000000]">
                {t.reassurance03Title}
              </h3>
              <p className="mt-1 text-xs text-[#6C757D] leading-relaxed">
                {t.reassurance03Desc}
              </p>
            </div>
          </div>

          <div className="px-6 py-2.5 bg-[#F8F9FA] border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6C757D]">
            <span>{t.customerServiceHours}</span>
            <span className="font-mono font-semibold text-[#000000]">
              693 71 25 25
            </span>
          </div>
        </div>
      </section>

      {/* 5. CATÉGORIES PROPOSÉES — BENTO GRID (accuille_nkcl_5) */}
      <section className="max-w-[1360px] mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#000000]">
            {t.suggestedCategories}
          </h2>
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="text-xs sm:text-sm font-semibold text-[#5A5AA1] hover:underline cursor-pointer"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left Vertical Feature Poster */}
          <div
            onClick={() => onSelectCategory('electronique')}
            className="lg:col-span-3 rounded-2xl overflow-hidden bg-gradient-to-b from-[#000000] via-[#2d2b5e] to-[#5A5AA1] text-white p-5 flex flex-col justify-between min-h-[280px] cursor-pointer group"
          >
            <div>
              <h3 className="font-display text-2xl font-extrabold italic">
                {locale === 'fr' ? 'Du bon son' : 'Studio Sound'}
              </h3>
              <p className="mt-1.5 text-xs text-white/80">
                {locale === 'fr' ? 'À partir de ' : 'Starting from '}
                <span className="px-2 py-0.5 rounded bg-[#F4BE38] text-[#000000] font-bold">
                  14 990 FCFA
                </span>
              </p>
            </div>
            <div className="my-4 h-36 rounded-xl bg-white/95 p-3 flex items-center justify-center">
              <ProductImage
                src={IMAGES.speaker}
                alt="Audio Hi-Fi"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex justify-end">
              <span className="px-3 py-1 rounded bg-white text-[#000000] text-xs font-bold">
                {t.visitBtn} ▸
              </span>
            </div>
          </div>

          {/* Right 2x4 Grid of Compact Split Cards */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
            {SUGGESTED_BENTO_CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelectCategory(card.category)}
                className="bg-white border border-[#E5E7EB] hover:border-[#5A5AA1] rounded-xl overflow-hidden grid grid-cols-2 text-left transition-all hover:shadow-sm cursor-pointer min-h-[126px]"
              >
                <div className="bg-[#000000] text-white p-3 flex flex-col justify-between">
                  <span className="font-display text-[11px] font-bold leading-tight">
                    {locale === 'fr' ? card.titleFr : card.titleEn}
                  </span>
                  <span className="mt-2 inline-block w-fit px-2 py-0.5 rounded-full bg-[#5A5AA1] text-white text-[10px] font-bold">
                    {locale === 'fr' ? '◂ Acheter ▸' : '◂ Shop ▸'}
                  </span>
                </div>
                <div className="bg-white p-2 flex items-center justify-center">
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

      {/* 6. LES INCONTOURNABLES DU MOMENT + FULL-WIDTH PROMO BANNER (accuille_nkcl_7) */}
      <ProductCarouselRow
        title={t.trendingNow}
        products={coolingList}
        locale={locale}
        wishlistIds={wishlistIds}
        recentlyAddedId={recentlyAddedId}
        viewAllCategory="petit-electromenager"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onViewAll={onSelectCategory}
      />

      <section className="max-w-[1360px] mx-auto px-4">
        <div
          onClick={() => onSelectProduct(findProduct('kettle-winning-18'))}
          className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#000000] via-[#2b2957] to-[#5A5AA1] text-white px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer"
        >
          <div className="w-28 h-24 rounded-xl bg-white p-2 shrink-0">
            <ProductImage
              src={IMAGES.kettle}
              alt="Électro compact"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase">
              {locale === 'fr'
                ? 'ÉQUIPEMENT CUISINE INOX 1.8L'
                : 'STAINLESS KITCHEN GEAR 1.8L'}
            </h3>
            <p className="text-xs text-white/80 mt-0.5">
              {locale === 'fr'
                ? 'COMPACT, RAPIDE & ÉCONOMIQUE'
                : 'COMPACT, FAST & ENERGY SAVING'}
            </p>
            <div className="mt-2.5 flex items-center justify-center md:justify-start gap-3">
              <span className="px-4 py-1 rounded bg-[#F4BE38] text-[#000000] font-display text-2xl font-extrabold tabular-nums">
                14 500 Fcfa
              </span>
              <span className="text-sm text-white/60 line-through tabular-nums">
                25 000 Fcfa
              </span>
            </div>
          </div>
          <span className="px-5 py-2.5 rounded bg-[#A084E8] text-[#000000] font-display text-xs font-extrabold uppercase shrink-0">
            {locale === 'fr' ? 'CLIQUEZ ICI !' : 'SHOP DEAL!'}
          </span>
        </div>
      </section>

      {/* 7. L'UNIVERS DES SUSPENDUS (SECONDE MAIN) + DUAL PROMO BANNERS (accuille_nkcl_6) */}
      <ProductCarouselRow
        title={t.secondHandUniverse}
        products={secondHandList}
        locale={locale}
        wishlistIds={wishlistIds}
        recentlyAddedId={recentlyAddedId}
        viewAllCategory="telephones-tablettes"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onViewAll={onSelectCategory}
      />

      <section className="max-w-[1360px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => onSelectCategory('petit-electromenager')}
            className="rounded-2xl bg-gradient-to-r from-[#5A5AA1] to-[#A084E8] text-white p-5 flex items-center justify-between gap-4 cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold uppercase text-[#F4BE38]">
                {locale === 'fr' ? 'Blenders & Cuisine' : 'Blenders & Kitchen'}
              </span>
              <h3 className="font-display text-xl font-extrabold mt-1">
                17 500 F — 57 000 F
              </h3>
              <span className="mt-3 inline-block px-3 py-1 rounded bg-[#000000] text-white text-xs font-bold">
                {locale === 'fr' ? 'ACHETEZ !' : 'BUY NOW!'}
              </span>
            </div>
            <div className="w-28 h-24 rounded-xl bg-white p-2 shrink-0">
              <ProductImage
                src={IMAGES.blender}
                alt="Blender Cuisine"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div
            onClick={() => onSelectCategory('electronique')}
            className="rounded-2xl bg-[#000000] text-white p-5 flex items-center justify-between gap-4 cursor-pointer border border-[#5A5AA1]/50"
          >
            <div>
              <span className="text-xs font-bold uppercase text-[#F4BE38]">
                Smart TV 4K LG · Hisense · Cosmic
              </span>
              <h3 className="font-display text-xl font-extrabold mt-1">
                62 500 F — 279 000 F
              </h3>
              <span className="mt-3 inline-block px-3 py-1 rounded bg-[#5A5AA1] text-white text-xs font-bold">
                {locale === 'fr' ? 'ACHETEZ !' : 'BUY NOW!'}
              </span>
            </div>
            <div className="w-28 h-24 rounded-xl bg-white p-2 shrink-0">
              <ProductImage
                src={IMAGES.smartTv}
                alt="Smart TV 4K"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. HIGH-TECH À PRIX DOUX (POSTER LEFT + 4 CARDS) (accuille_nkcl8) */}
      <section className="max-w-[1360px] mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#000000]">
            {t.highTechSoftPrice}
          </h2>
          <button
            type="button"
            onClick={() => onSelectCategory('telephones-tablettes')}
            className="text-xs sm:text-sm font-semibold text-[#5A5AA1] hover:underline cursor-pointer"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          <div
            onClick={() => onSelectCategory('telephones-tablettes')}
            className="lg:col-span-3 rounded-2xl overflow-hidden bg-gradient-to-b from-[#000000] via-[#262552] to-[#5A5AA1] text-white p-5 flex flex-col justify-between min-h-[300px] cursor-pointer"
          >
            <div className="h-40 rounded-xl bg-white/95 p-3 flex items-center justify-center">
              <ProductImage
                src={IMAGES.smartphone}
                alt="High-tech Smartphones"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4">
              <span className="inline-block px-2 py-0.5 rounded bg-[#F4BE38] text-[#000000] text-[10px] font-extrabold uppercase">
                HIGH-TECH
              </span>
              <h3 className="mt-2 font-display text-xl font-bold">
                {locale === 'fr' ? 'À prix doux' : 'Smart prices'}
              </h3>
              <p className="text-xs text-white/75 mt-0.5">
                {locale === 'fr' ? 'Smartphones & tablettes' : 'Smartphones & tablets'}
              </p>
              <span className="mt-3 inline-block px-4 py-1.5 rounded bg-white text-[#000000] text-xs font-bold">
                {t.discoverBtn}
              </span>
            </div>
          </div>

          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
            {hightechList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                isWishlisted={wishlistIds.includes(product.id)}
                justAdded={recentlyAddedId === product.id}
                onSelectProduct={onSelectProduct}
                onQuickAdd={onQuickAdd}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 9. BEAUTÉ & SOINS (POSTER LEFT + 4 CARDS) (accuille_nkcl8) */}
      <section className="max-w-[1360px] mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#000000]">
            {t.beautyCare}
          </h2>
          <button
            type="button"
            onClick={() => onSelectCategory('sante-beaute')}
            className="text-xs sm:text-sm font-semibold text-[#5A5AA1] hover:underline cursor-pointer"
          >
            {t.viewAll}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          <div
            onClick={() => onSelectCategory('sante-beaute')}
            className="lg:col-span-3 rounded-2xl overflow-hidden bg-gradient-to-b from-[#5A5AA1] to-[#000000] text-white p-5 flex flex-col justify-between min-h-[300px] cursor-pointer"
          >
            <div className="h-40 rounded-xl bg-white p-3 flex items-center justify-center">
              <ProductImage
                src={IMAGES.beauty}
                alt="Beauté & soins"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4">
              <span className="inline-block px-2 py-0.5 rounded bg-[#F4BE38] text-[#000000] text-[10px] font-extrabold uppercase">
                {locale === 'fr' ? 'BEAUTÉ' : 'BEAUTY'}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold">
                {t.beautyCare}
              </h3>
              <p className="text-xs text-white/75 mt-0.5">
                {locale === 'fr' ? 'Soins hydratants & bien-être' : 'Skincare & wellness'}
              </p>
              <span className="mt-3 inline-block px-4 py-1.5 rounded bg-white text-[#000000] text-xs font-bold">
                {t.discoverBtn}
              </span>
            </div>
          </div>

          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
            {beautyList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                isWishlisted={wishlistIds.includes(product.id)}
                justAdded={recentlyAddedId === product.id}
                onSelectProduct={onSelectProduct}
                onQuickAdd={onQuickAdd}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 10. SMART TV + DUAL VIOLET BANNERS (accuille_nkcl9) */}
      <ProductCarouselRow
        title={t.smartTvSection}
        products={smartTvList}
        locale={locale}
        wishlistIds={wishlistIds}
        recentlyAddedId={recentlyAddedId}
        viewAllCategory="electronique"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onViewAll={onSelectCategory}
      />

      <section className="max-w-[1360px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => onSelectProduct(findProduct('ac-icona-125'))}
            className="rounded-2xl bg-gradient-to-r from-[#A084E8] to-[#5A5AA1] p-6 flex items-center justify-between gap-4 cursor-pointer"
          >
            <div className="text-white">
              <p className="font-display text-sm font-bold leading-snug">
                {locale === 'fr'
                  ? 'Dites adieu à la chaleur, place au confort !'
                  : 'Say goodbye to heat, hello comfort!'}
              </p>
              <span className="mt-2 inline-block px-3.5 py-1.5 rounded bg-[#000000] text-[#F4BE38] font-display text-2xl font-extrabold tabular-nums">
                157 900 Fcfa
              </span>
            </div>
            <div className="w-32 h-24 rounded-xl bg-white p-2 shrink-0">
              <ProductImage
                src={IMAGES.acUnit}
                alt="Climatiseur Split"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div
            onClick={() => onSelectProduct(findProduct('chair-ergo-study'))}
            className="rounded-2xl bg-gradient-to-r from-[#5A5AA1] to-[#A084E8] p-6 flex items-center justify-between gap-4 cursor-pointer"
          >
            <div className="text-white">
              <p className="font-display text-sm font-bold leading-snug">
                {locale === 'fr'
                  ? "Le confort au service de l'apprentissage, à partir de"
                  : 'Study comfort starting from'}
              </p>
              <span className="mt-2 inline-block px-3.5 py-1.5 rounded bg-[#000000] text-[#F4BE38] font-display text-2xl font-extrabold tabular-nums">
                55 000 Fcfa
              </span>
            </div>
            <div className="w-28 h-24 rounded-xl bg-white p-2 shrink-0">
              <ProductImage
                src={IMAGES.heroChair}
                alt="Chaise d'étude"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 11. GARDEZ TOUT FRAIS (#000000 HEADER) + MIXEZ + TOP RÉDUCTIONS (accuille_nkcl10 / accuille_nkcl4) */}
      <ProductCarouselRow
        title={t.keepFreshSection}
        products={freezersList}
        locale={locale}
        wishlistIds={wishlistIds}
        recentlyAddedId={recentlyAddedId}
        darkHeaderBar
        viewAllCategory="gros-electromenager"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onViewAll={onSelectCategory}
      />

      <ProductCarouselRow
        title={t.mixSavorSection}
        products={blendersList.length > 0 ? blendersList : kitchenList}
        locale={locale}
        wishlistIds={wishlistIds}
        recentlyAddedId={recentlyAddedId}
        viewAllCategory="petit-electromenager"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onViewAll={onSelectCategory}
      />

      <ProductCarouselRow
        title={t.topDiscountsSection}
        products={topDiscountsList}
        locale={locale}
        wishlistIds={wishlistIds}
        recentlyAddedId={recentlyAddedId}
        viewAllCategory="electronique"
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onViewAll={onSelectCategory}
      />
    </div>
  );
}
