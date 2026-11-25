import {
  CalendarDays,
  Check,
  Heart,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { useMemo } from 'react';
import { PRODUCTS } from '../data/catalog';
import { Locale, Product } from '../types/store';
import { formatXAF } from '../utils/format';
import { ActionIconTooltip } from './ActionIconTooltip';
import { ProductImage } from './ProductImage';

interface DailySpecialsSectionProps {
  locale: Locale;
  wishlistIds: string[];
  compareIds?: string[];
  recentlyAddedId: string | null;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
}

const WEEKDAYS_FR = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];

const WEEKDAYS_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function DailySpecialsSection({
  locale,
  wishlistIds,
  compareIds = [],
  recentlyAddedId,
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  onToggleCompare,
}: DailySpecialsSectionProps) {
  const dayOfWeek = new Date().getDay();
  const dayLabel =
    locale === 'fr' ? WEEKDAYS_FR[dayOfWeek] : WEEKDAYS_EN[dayOfWeek];

  const featuredDeals = useMemo(() => {
    const eligible = PRODUCTS.filter(
      (p) => p.stockQty > 0 && (p.discountPct ?? 0) > 0
    ).sort((a, b) => (b.discountPct ?? 0) - (a.discountPct ?? 0));

    if (eligible.length <= 4) return eligible;

    const picks: Product[] = [];
    const seen = new Set<string>();
    const startOffset = (dayOfWeek * 3) % eligible.length;

    for (let step = 0; step < eligible.length && picks.length < 4; step++) {
      const idx = (startOffset + step * 2) % eligible.length;
      const candidate = eligible[idx];
      if (!seen.has(candidate.id)) {
        seen.add(candidate.id);
        picks.push(candidate);
      }
    }

    for (const candidate of eligible) {
      if (picks.length >= 4) break;
      if (!seen.has(candidate.id)) {
        seen.add(candidate.id);
        picks.push(candidate);
      }
    }

    return picks;
  }, [dayOfWeek]);

  return (
    <section
      aria-labelledby="daily-specials-heading"
      className="max-w-[1360px] mx-auto px-4"
    >
      <div className="ice-surface rounded-3xl p-5 sm:p-6 space-y-5">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/80">
          <div className="flex items-center gap-3">
            <ActionIconTooltip
              focusable
              placement="bottom"
              text={
                locale === 'fr'
                  ? 'Sélection dynamique actualisée chaque jour de la semaine'
                  : 'Dynamic selection refreshed every day of the week'
              }
            >
              <span className="glass-pill-black w-10 h-10 rounded-full text-[#F4BE38] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </span>
            </ActionIconTooltip>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="daily-specials-heading"
                  className="font-display text-xl sm:text-2xl font-extrabold text-[#000000]"
                >
                  {locale === 'fr'
                    ? 'Offres Spéciales du Jour'
                    : 'Daily Specials'}
                </h2>
                <span className="glass-pill-gold px-3 py-0.5 rounded-full text-[#000000] text-[11px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1">
                  <ActionIconTooltip
                    focusable
                    placement="bottom"
                    text={
                      locale === 'fr'
                        ? `Offres rotatives actives pour ${dayLabel}`
                        : `Rotating featured deals active for ${dayLabel}`
                    }
                  >
                    <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                  </ActionIconTooltip>
                  <span>{dayLabel}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3F3F56] font-medium mt-0.5">
                {locale === 'fr'
                  ? '4 promotions exclusives qui changent automatiquement selon le jour de la semaine.'
                  : '4 rotating featured deals that update automatically by day of the week.'}
              </p>
            </div>
          </div>

          <span className="glass-pill-frost px-3.5 py-1.5 rounded-full text-xs font-bold text-[#5A5AA1]">
            {locale === 'fr' ? '4 Offres · Stock vérifié' : '4 Deals · In Stock'}
          </span>
        </div>

        {/* 4 Rotating Featured Deal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredDeals.map((product) => {
            const title = locale === 'fr' ? product.nameFr : product.nameEn;
            const isWishlisted = wishlistIds.includes(product.id);
            const isCompared = compareIds.includes(product.id);
            const justAdded = recentlyAddedId === product.id;

            return (
              <article
                key={product.id}
                className="ice-surface-subtle rounded-3xl p-3.5 flex flex-col transition-all duration-200 hover:-translate-y-1"
              >
                {/* Product Ice Chamber with unclipped top-right action tooltips */}
                <div className="relative">
                  <div className="ice-product-trap relative aspect-[4/3] w-full rounded-2xl p-3 flex items-center justify-center">
                    {product.discountPct && (
                      <span className="glass-pill-gold absolute top-2 left-2 z-10 px-2.5 py-0.5 rounded-full text-[#000000] text-[11px] font-extrabold tabular-nums">
                        -{product.discountPct}%
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="w-full h-full relative z-[5] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#5A5AA1] rounded-xl"
                    >
                      <ProductImage
                        src={product.image}
                        alt={title}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  </div>

                  {/* Like & Compare Floating Buttons outside overflow-hidden chamber */}
                  <div className="absolute top-2 right-2 z-20 flex flex-col gap-1.5">
                    <ActionIconTooltip
                      placement="left"
                      text={
                        isWishlisted
                          ? locale === 'fr'
                            ? 'Produit liké — cliquez pour retirer des favoris'
                            : 'Liked — click to remove from favorites'
                          : locale === 'fr'
                          ? 'Cliquez pour liker si ce produit vous plaît'
                          : 'Click to like if you enjoy this product'
                      }
                    >
                      <button
                        type="button"
                        aria-label={
                          isWishlisted
                            ? locale === 'fr'
                              ? 'Retirer des favoris'
                              : 'Remove from favorites'
                            : locale === 'fr'
                            ? 'Liker ce produit'
                            : 'Like this product'
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product.id);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isWishlisted
                            ? 'glass-pill-cta text-white'
                            : 'glass-pill-frost text-[#3F3F56] hover:text-[#5A5AA1]'
                        }`}
                      >
                        <Heart
                          className="w-3.5 h-3.5"
                          fill={isWishlisted ? 'currentColor' : 'none'}
                          aria-hidden="true"
                        />
                      </button>
                    </ActionIconTooltip>

                    {onToggleCompare && (
                      <ActionIconTooltip
                        placement="left"
                        text={
                          isCompared
                            ? locale === 'fr'
                              ? 'Sélectionné — cliquez pour retirer du comparatif'
                              : 'Selected — click to remove from comparison'
                            : locale === 'fr'
                            ? 'Sélectionner pour comparer les produits'
                            : 'Select to compare products'
                        }
                      >
                        <button
                          type="button"
                          aria-label={
                            isCompared
                              ? locale === 'fr'
                                ? 'Retirer du comparatif'
                                : 'Remove from comparison'
                              : locale === 'fr'
                              ? 'Sélectionner pour comparer'
                              : 'Select to compare'
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCompare(product.id);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isCompared
                              ? 'glass-pill-gold text-[#000000]'
                              : 'glass-pill-frost text-[#3F3F56] hover:text-[#5A5AA1]'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </ActionIconTooltip>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="pt-3 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider text-[#5A5AA1]">
                    <span>{product.brand}</span>
                    <ActionIconTooltip
                      focusable
                      placement="left"
                      text={
                        locale === 'fr'
                          ? `Garantie certifiée ${product.warrantyMonths} mois incluse`
                          : `${product.warrantyMonths}-month certified warranty included`
                      }
                    >
                      <span className="inline-flex items-center gap-1 text-[#3F3F56]">
                        <ShieldCheck className="w-3 h-3 text-[#5A5AA1]" aria-hidden="true" />
                        <span>
                          {product.warrantyMonths}
                          {locale === 'fr' ? 'm' : 'm'}
                        </span>
                      </span>
                    </ActionIconTooltip>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="mt-1 text-left cursor-pointer"
                  >
                    <h3 className="font-display text-sm font-bold text-[#000000] leading-snug line-clamp-2 min-h-[38px] hover:text-[#5A5AA1] transition-colors">
                      {title}
                    </h3>
                  </button>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-base font-extrabold text-[#000000] tabular-nums">
                      {formatXAF(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-[11px] text-[#3F3F56] line-through tabular-nums">
                        {formatXAF(product.oldPrice)}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-3">
                    <ActionIconTooltip
                      placement="top"
                      className="w-full flex"
                      text={
                        justAdded
                          ? locale === 'fr'
                            ? 'Ajouté au panier — cliquez pour ajouter une autre unité'
                            : 'Added to cart — click to add another'
                          : locale === 'fr'
                          ? 'Ajouter cette offre du jour à votre panier'
                          : 'Add this daily special directly to your cart'
                      }
                    >
                      <button
                        type="button"
                        onClick={() => onQuickAdd(product)}
                        className={`w-full min-h-[40px] px-3.5 py-2 rounded-full text-xs font-extrabold tracking-wide inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          justAdded
                            ? 'glass-pill-black text-[#F4BE38]'
                            : 'glass-pill-gold text-[#000000]'
                        }`}
                      >
                        {justAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>
                              {locale === 'fr' ? 'Ajouté au panier' : 'Added to Cart'}
                            </span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>
                              {locale === 'fr' ? 'Ajouter au panier' : 'Add to Cart'}
                            </span>
                          </>
                        )}
                      </button>
                    </ActionIconTooltip>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
