import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { IMAGES, PRODUCTS } from '../data/catalog';
import { CategorySlug, Locale, Product } from '../types/store';
import { ActionIconTooltip } from './ActionIconTooltip';
import { ProductImage } from './ProductImage';

interface HeroShowcaseCarouselProps {
  locale: Locale;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (slug: CategorySlug) => void;
}

const FEATURED_PRODUCT_PHOTO = '/assets/aistudio/photo_lorena_produit_9ace9663.jpg';

export function HeroShowcaseCarousel({
  locale,
  onSelectProduct,
  onSelectCategory,
}: HeroShowcaseCarouselProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [montageBeat, setMontageBeat] = useState<0 | 1 | 2>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setMontageBeat((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 2600);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const findProduct = (id: string) =>
    PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];

  const nudgeCarousel = (delta: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  const renderDeck = (deckKey: string, isDuplicate = false) => (
    <div
      aria-hidden={isDuplicate}
      className="flex items-stretch gap-3 sm:gap-4 pr-3 sm:pr-4 shrink-0"
    >
      {/* SLIDE 1: Kinetic Brand Montage (modeled after video_animation_menu) */}
      <div
        key={`${deckKey}-montage`}
        onClick={() => onSelectCategory('all')}
        className="ice-obsidian relative w-[275px] sm:w-[340px] lg:w-[360px] min-h-[320px] sm:min-h-[340px] rounded-3xl overflow-hidden text-white p-5 sm:p-6 flex flex-col justify-between cursor-pointer group shrink-0"
      >
        {/* Ambient Animated Light Sweep & Glows */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#5A5AA1]/45 blur-2xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-[#38BDF8]/30 blur-2xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-kinetic-sweep pointer-events-none"
        />

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <ActionIconTooltip
            focusable={!isDuplicate}
            placement="right"
            text={
              locale === 'fr'
                ? 'Animation vitrine des offres phares Lorena Market'
                : 'Animated spotlight of featured Lorena Market deals'
            }
          >
            <span className="glass-pill-gold px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#000000] inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              <span>{locale === 'fr' ? 'Animation Lorena' : 'Lorena Showcase'}</span>
            </span>
          </ActionIconTooltip>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((b) => (
              <span
                key={b}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  montageBeat === b ? 'w-5 bg-[#F4BE38]' : 'w-1.5 bg-white/35'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Center Kinetic Stage */}
        <div className="relative z-10 my-auto py-4 text-center space-y-3">
          {montageBeat === 0 && (
            <div key="beat-0" className="animate-kinetic-in space-y-2">
              <p className="font-display text-xl sm:text-[26px] font-extrabold leading-tight bg-gradient-to-r from-[#60A5FA] via-[#A084E8] to-[#F4BE38] bg-clip-text text-transparent">
                {locale === 'fr'
                  ? 'Des Solutions Impressionnantes'
                  : 'Impressive Solutions At'}
              </p>
              <div className="inline-flex items-center gap-1.5 font-display text-lg sm:text-xl font-black tracking-tight text-white">
                <span>LOR</span>
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#60A5FA] to-[#5A5AA1] text-white inline-flex items-center justify-center shadow-md animate-lorena-float border border-white/50">
                  <ShoppingCart className="w-4 h-4 text-[#F4BE38]" aria-hidden="true" />
                </span>
                <span>NA</span>
                <span className="text-[#F4BE38]">MARKET</span>
              </div>
            </div>
          )}

          {montageBeat === 1 && (
            <div key="beat-1" className="animate-kinetic-in space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-[11px] font-bold tracking-widest uppercase text-[#F4BE38]">
                www.lorena.cm
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {locale === 'fr'
                  ? 'Tech · Électro · Mode'
                  : 'Tech · Appliances · Fashion'}
              </h2>
              <p className="text-xs text-white/80">
                {locale === 'fr'
                  ? 'Paiement MTN MoMo & Orange Money · Livraison Cameroun'
                  : 'MTN MoMo & Orange Money · Fast Cameroon Dispatch'}
              </p>
            </div>
          )}

          {montageBeat === 2 && (
            <div key="beat-2" className="animate-kinetic-in space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#38BDF8]">
                {locale === 'fr' ? 'Nouvelle Collection' : 'New Arrivals'}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {['Smart TV 4K', 'Smartphones', 'Électro', 'Garantie 12M'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-[11px] font-semibold text-white"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
              <p className="font-display text-lg font-extrabold text-[#F4BE38]">
                {locale === 'fr' ? 'Jusqu’à -40% cette semaine' : 'Up to -40% this week'}
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className="glass-pill-cta px-4 py-2 rounded-full text-xs font-bold text-white inline-flex items-center gap-1.5">
            <span>{locale === 'fr' ? 'Explorer la boutique' : 'Explore Store'}</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <span className="text-[11px] font-mono text-white/70">24/7 CM</span>
        </div>
      </div>

      {/* SLIDE 2: Rotating Product Showcase (photo_lorena_produit rotating inside crystal ice sphere) */}
      <div
        key={`${deckKey}-rotating`}
        onClick={() => onSelectCategory('fashion')}
        className="ice-yellow relative w-[275px] sm:w-[330px] lg:w-[350px] min-h-[320px] sm:min-h-[340px] rounded-3xl overflow-hidden text-[#000000] p-5 flex flex-col justify-between cursor-pointer group shrink-0"
      >
        <div className="flex items-center justify-between gap-2 z-10">
          <span className="glass-pill-black px-2.5 py-1 rounded-full text-[#F4BE38] font-display text-[10px] font-extrabold uppercase tracking-wider">
            {locale === 'fr' ? 'Sélection Mode & Tech' : 'Style & Tech Drop'}
          </span>
          <span className="glass-pill-frost px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-[#000000] animate-lorena-float">
            -35%
          </span>
        </div>

        {/* Rotating Self-Spinning Product Medallion Trapped in Crystal Ice */}
        <div className="relative my-auto py-2 flex items-center justify-center">
          <ActionIconTooltip
            focusable={!isDuplicate}
            text={
              locale === 'fr'
                ? 'Illustration rotative Collection Lorena — cliquez pour voir la sélection mode et accessoires'
                : 'Rotating Lorena Collection illustration — click to explore fashion & accessories'
            }
          >
            <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border-2 border-dashed border-[#5A5AA1]/60 animate-orbit-reverse"
              />
              <div
                aria-hidden="true"
                className="absolute inset-2 rounded-full border-2 border-white/90 shadow-[0_0_28px_rgba(255,255,255,0.85)]"
              />
              <div
                className={`ice-product-trap w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl ${
                  isPlaying ? 'animate-self-spin' : ''
                }`}
              >
                <img
                  src={FEATURED_PRODUCT_PHOTO}
                  alt="Lorena Produit Sélection"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </ActionIconTooltip>
        </div>

        <div className="z-10 flex items-center justify-between gap-2">
          <div>
            <p className="font-display text-sm font-extrabold leading-tight text-[#000000]">
              {locale === 'fr' ? 'Collection Lorena' : 'Lorena Collection'}
            </p>
            <p className="text-[11px] text-[#3F3F56] font-medium">
              {locale === 'fr' ? 'Accessoires, Mode & Audio' : 'Fashion, Audio & Gear'}
            </p>
          </div>
          <span className="glass-pill-cta px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white shrink-0">
            {locale === 'fr' ? 'Voir ▸' : 'Shop ▸'}
          </span>
        </div>
      </div>

      {/* SLIDE 3: Ergonomic Comfort Chair (Violet Frosted Ice) */}
      <div
        key={`${deckKey}-chair`}
        onClick={() => onSelectProduct(findProduct('chair-ergo-study'))}
        className="ice-violet w-[255px] sm:w-[290px] min-h-[320px] sm:min-h-[340px] rounded-3xl overflow-hidden text-white p-5 flex flex-col justify-between cursor-pointer group shrink-0"
      >
        <div>
          <p className="font-display text-sm font-semibold leading-snug text-white">
            {locale === 'fr'
              ? "Le confort au service de l'apprentissage, à partir de"
              : 'Study & office comfort starting from'}
          </p>
          <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-[#F4BE38] tabular-nums drop-shadow-sm">
            55 000 Fcfa
          </p>
        </div>
        <ActionIconTooltip
          className="block w-full my-3"
          focusable={!isDuplicate}
          text={
            locale === 'fr'
              ? 'Illustration Chaise Ergonomique — cliquez pour voir le prix et commander'
              : 'Ergonomic Chair illustration — click to inspect price and order'
          }
        >
          <div className="ice-product-trap h-36 sm:h-40 rounded-2xl p-2 flex items-center justify-center">
            <ProductImage
              src={IMAGES.heroChair}
              alt="Chaise ergonomique bureau"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </ActionIconTooltip>
        <div className="flex items-center justify-between">
          <span className="glass-pill-frost px-4 py-1.5 rounded-full text-[#000000] text-xs font-bold">
            {locale === 'fr' ? "Voir l'offre" : 'View offer'}
          </span>
          <ActionIconTooltip
            focusable={!isDuplicate}
            placement="left"
            text={
              locale === 'fr'
                ? 'Cliquez sur la carte pour voir la fiche produit'
                : 'Click the card to open the product details'
            }
          >
            <span className="glass-pill-blue w-8 h-8 rounded-full flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-white fill-white" aria-hidden="true" />
            </span>
          </ActionIconTooltip>
        </div>
      </div>

      {/* SLIDE 4: Freshness Refrigerators (Clear Frosted Crystal Ice) */}
      <div
        key={`${deckKey}-fridge`}
        onClick={() => onSelectCategory('gros-electromenager')}
        className="ice-surface w-[235px] sm:w-[260px] min-h-[320px] sm:min-h-[340px] rounded-3xl overflow-hidden p-4 flex flex-col justify-between cursor-pointer group shrink-0"
      >
        <div>
          <span className="glass-pill-gold inline-block px-2.5 py-0.5 rounded-full text-[#000000] font-display text-xs font-extrabold">
            {locale === 'fr' ? 'Dites oui à la fraîcheur !' : 'Stay cool & fresh!'}
          </span>
          <p className="mt-2 text-xs text-[#000000] font-semibold leading-snug">
            {locale === 'fr'
              ? 'Découvrez nos réfrigérateurs de qualité à prix imbattables.'
              : 'Explore top refrigerators at unbeatable XAF prices.'}
          </p>
        </div>
        <ActionIconTooltip
          className="block w-full my-2"
          focusable={!isDuplicate}
          text={
            locale === 'fr'
              ? 'Illustration Réfrigérateurs — cliquez pour parcourir le gros électroménager'
              : 'Refrigerator illustration — click to browse home appliances'
          }
        >
          <div className="ice-product-trap h-36 sm:h-40 rounded-2xl p-2 flex items-center justify-center">
            <ProductImage
              src={IMAGES.fridge}
              alt="Réfrigérateurs Lorena"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </ActionIconTooltip>
        <span className="glass-pill-cta inline-block w-fit px-4 py-1.5 rounded-full text-white text-[11px] font-bold uppercase">
          {locale === 'fr' ? 'DÉCOUVRIR !' : 'DISCOVER!'}
        </span>
      </div>

      {/* SLIDE 5: Future Smartphones Pro 5G (Obsidian Crystal Ice + Blue Accent) */}
      <div
        key={`${deckKey}-phone`}
        onClick={() => onSelectProduct(findProduct('titan-x5-pro'))}
        className="ice-obsidian w-[255px] sm:w-[295px] min-h-[320px] sm:min-h-[340px] rounded-3xl overflow-hidden text-white p-5 flex flex-col justify-between cursor-pointer group shrink-0"
      >
        <div>
          <h3 className="font-display text-lg font-extrabold leading-tight">
            {locale === 'fr'
              ? "Le futur n'attend pas. Passez au Pro !"
              : 'The future awaits. Go Pro today!'}
          </h3>
          <p className="mt-1.5 text-xs text-white/80">
            {locale === 'fr'
              ? "Le luxe, la puissance et l'innovation réunis dans un seul smartphone."
              : 'Titanium power and 5G clarity in one flagship phone.'}
          </p>
        </div>
        <ActionIconTooltip
          className="block w-full my-3"
          focusable={!isDuplicate}
          text={
            locale === 'fr'
              ? 'Illustration Smartphone Pro 5G — cliquez pour consulter la fiche technique'
              : 'Pro 5G Smartphone illustration — click to view specifications'
          }
        >
          <div className="ice-product-trap h-36 sm:h-40 rounded-2xl p-2 flex items-center justify-center">
            <ProductImage
              src={IMAGES.smartphone}
              alt="Smartphone Pro 5G"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </ActionIconTooltip>
        <span className="glass-pill-blue inline-block w-fit px-4 py-1.5 rounded-full text-white text-[11px] font-bold uppercase">
          {locale === 'fr' ? 'ACHETEZ !' : 'SHOP NOW!'}
        </span>
      </div>

      {/* SLIDE 6: Logistics + Kitchen Kettle Stacked Column */}
      <div
        key={`${deckKey}-stacked`}
        className="w-[230px] sm:w-[250px] min-h-[320px] sm:min-h-[340px] flex flex-col gap-3.5 shrink-0"
      >
        <div
          onClick={() => onSelectCategory('all')}
          className="ice-violet flex-1 rounded-3xl text-white p-4 flex flex-col justify-center cursor-pointer hover:brightness-105 transition-all"
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
          className="ice-surface flex-1 rounded-3xl p-3.5 flex items-center gap-3 cursor-pointer hover:border-[#5A5AA1] transition-all"
        >
          <div className="ice-product-trap w-16 h-16 rounded-2xl p-1.5 shrink-0 flex items-center justify-center">
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
            <p className="glass-pill-gold mt-1 px-2 py-0.5 rounded-full text-[#000000] font-display text-xs font-extrabold w-fit tabular-nums">
              14 500 Fcfa
            </p>
            <span className="mt-1 inline-block text-[11px] font-bold text-[#5A5AA1]">
              {locale === 'fr' ? 'Acheter ▸' : 'Buy ▸'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full pt-4 sm:pt-5">
      {/* Carousel Header & Liquid Glass Controls */}
      <div className="max-w-[1360px] mx-auto px-3 sm:px-4 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="glass-pill-gold px-3.5 py-1 rounded-full text-[11px] font-extrabold text-[#000000] uppercase tracking-wider">
            {locale === 'fr' ? 'En vedette · Carrousel' : 'Featured · Carousel'}
          </span>
          <h1 className="font-display text-sm sm:text-base font-bold text-[#000000]">
            {locale === 'fr'
              ? 'Vitrine animée Lorena Market'
              : 'Lorena Market Live Showcase'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <ActionIconTooltip
            placement="bottom"
            text={
              isPlaying
                ? locale === 'fr'
                  ? 'Mettre en pause le défilement automatique du carrousel'
                  : 'Pause automatic carousel sliding & rotation'
                : locale === 'fr'
                ? 'Relancer le défilement automatique de droite à gauche'
                : 'Resume automatic right-to-left scrolling'
            }
          >
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="glass-pill-frost min-h-[34px] px-3 py-1 rounded-full text-xs font-bold text-[#000000] inline-flex items-center gap-1.5 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#5A5AA1]" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Pause' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#5A5AA1]" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Défiler' : 'Play'}</span>
                </>
              )}
            </button>
          </ActionIconTooltip>

          <ActionIconTooltip
            placement="bottom"
            text={
              locale === 'fr'
                ? 'Revenir à la carte précédente du carrousel'
                : 'Jump to previous carousel slide'
            }
          >
            <button
              type="button"
              onClick={() => nudgeCarousel(-340)}
              aria-label={locale === 'fr' ? 'Carte précédente' : 'Previous slide'}
              className="glass-pill-frost w-9 h-9 rounded-full flex items-center justify-center text-[#000000] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
          </ActionIconTooltip>
          <ActionIconTooltip
            placement="left"
            text={
              locale === 'fr'
                ? 'Avancer vers la carte suivante du carrousel'
                : 'Advance to next carousel slide'
            }
          >
            <button
              type="button"
              onClick={() => nudgeCarousel(340)}
              aria-label={locale === 'fr' ? 'Carte suivante' : 'Next slide'}
              className="glass-pill-cta w-9 h-9 rounded-full flex items-center justify-center text-white cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </ActionIconTooltip>
        </div>
      </div>

      {/* Full-Width Borderless Continuous Right-to-Left Sliding Carousel */}
      <div
        ref={scrollContainerRef}
        className="lorena-rtl-track w-full overflow-x-auto no-scrollbar border-0 rounded-none py-2 px-3 sm:px-4"
      >
        <div
          className={`animate-lorena-rtl ${
            isPlaying ? '' : 'animate-lorena-rtl-paused'
          }`}
        >
          {renderDeck('deck-a', false)}
          {renderDeck('deck-b', true)}
        </div>
      </div>
    </section>
  );
}
