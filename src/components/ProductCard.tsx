import { Check, Heart, Scale, ShoppingCart } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { Locale, Product } from '../types/store';
import { formatXAF } from '../utils/format';
import { ActionIconTooltip } from './ActionIconTooltip';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  locale: Locale;
  isWishlisted: boolean;
  isCompared?: boolean;
  justAdded: boolean;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  compact?: boolean;
}

export function ProductCard({
  product,
  locale,
  isWishlisted,
  isCompared = false,
  justAdded,
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  onToggleCompare,
  compact = false,
}: ProductCardProps) {
  const t = TRANSLATIONS[locale];
  const title = locale === 'fr' ? product.nameFr : product.nameEn;
  const isOutOfStock = product.stockQty <= 0;

  return (
    <article
      className={`ice-surface rounded-3xl flex flex-col transition-all duration-200 hover:-translate-y-1 ${
        compact ? 'min-w-[205px] w-[205px] sm:min-w-[216px] sm:w-[216px] shrink-0' : 'w-full'
      }`}
    >
      {/* Ice-Encapsulated Product Chamber */}
      <div className="p-2.5 pb-0 relative">
        <div className="ice-product-trap relative aspect-[4/3] w-full rounded-2xl p-3 flex items-center justify-center">
          {/* Top-Left Crystal Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col items-start gap-1">
            {product.badgeType === 'new' && (
              <span className="glass-pill-black px-2 py-0.5 rounded-full text-white text-[10px] font-bold">
                {t.newBadge}
              </span>
            )}
            {product.badgeType === 'clearance' && (
              <span className="glass-pill-blue px-2 py-0.5 rounded-full text-white text-[10px] font-bold">
                {t.clearanceBadge}
              </span>
            )}
            {product.discountPct && (
              <span className="glass-pill-gold px-2 py-0.5 rounded-full text-[#000000] text-[10px] font-extrabold tabular-nums">
                -{product.discountPct} %
              </span>
            )}
          </div>

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

        {/* Top-Right Wishlist & Compare Frost Pills (outside overflow-hidden chamber so tooltips never clip) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
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
              aria-label={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
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
                    ? 'Ajouter au comparatif'
                    : 'Add to comparison'
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

        {/* Second Hand Verified Badge (Bottom Left outside chamber for unclipped tooltip) */}
        {product.badgeType === 'second_hand' && (
          <div className="absolute bottom-2 left-4 z-20">
            <ActionIconTooltip
              focusable
              placement="right"
              text={
                locale === 'fr'
                  ? 'Article seconde main contrôlé sur 32 points techniques'
                  : 'Pre-owned item verified across 32 hardware checks'
              }
            >
              <span className="glass-pill-gold px-2 py-0.5 rounded-full text-[#000000] text-[10px] font-extrabold tracking-wide inline-flex items-center gap-1">
                <Check className="w-3 h-3" aria-hidden="true" />
                <span>{t.secondHandBadge}</span>
              </span>
            </ActionIconTooltip>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="px-3.5 pb-3.5 pt-2.5 flex flex-col flex-1">
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="text-left cursor-pointer"
        >
          <h3 className="text-[13px] font-semibold text-[#000000] leading-snug line-clamp-2 min-h-[36px] hover:text-[#5A5AA1] transition-colors">
            {title}
          </h3>
        </button>

        {/* Prices */}
        <div className="mt-2">
          <span className="block font-display text-[15px] font-extrabold text-[#000000] tabular-nums">
            {formatXAF(product.price)}
          </span>
          {product.oldPrice && (
            <span className="block text-[11px] text-[#3F3F56] line-through tabular-nums">
              {formatXAF(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Optional Color Swatches */}
        {product.swatches && product.swatches.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {product.swatches.map((swatch) => (
              <ActionIconTooltip
                key={swatch.name}
                focusable
                placement="top"
                text={`${locale === 'fr' ? 'Coloris disponible :' : 'Available finish:'} ${swatch.name}`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-white shadow-sm block"
                  style={{ backgroundColor: swatch.hex }}
                />
              </ActionIconTooltip>
            ))}
          </div>
        )}

        {/* Primary CTA Button */}
        <div className="mt-auto pt-3">
          {isOutOfStock ? (
            <ActionIconTooltip
              placement="top"
              className="w-full flex"
              text={
                locale === 'fr'
                  ? 'Voir la fiche pour les alertes de réapprovisionnement'
                  : 'Open details for restock information'
              }
            >
              <button
                type="button"
                onClick={() => onSelectProduct(product)}
                className="glass-pill-frost w-full min-h-[38px] px-3 py-2 rounded-full text-[#3F3F56] text-[11px] font-bold tracking-wide uppercase cursor-pointer opacity-75"
              >
                {t.outOfStock}
              </button>
            </ActionIconTooltip>
          ) : (
            <ActionIconTooltip
              placement="top"
              className="w-full flex"
              text={
                justAdded
                  ? locale === 'fr'
                    ? 'Produit ajouté — cliquez pour ajouter une autre quantité'
                    : 'Added to bag — click to add another unit'
                  : locale === 'fr'
                  ? 'Ajouter ce produit directement à votre panier'
                  : 'Add this product directly to your shopping bag'
              }
            >
              <button
                type="button"
                onClick={() => onQuickAdd(product)}
                className={`w-full min-h-[38px] px-3 py-2 rounded-full text-xs font-bold tracking-wide inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  justAdded
                    ? 'glass-pill-black text-[#F4BE38]'
                    : 'glass-pill-cta text-white'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.addedBtn}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.buyBtn}</span>
                  </>
                )}
              </button>
            </ActionIconTooltip>
          )}
        </div>
      </div>
    </article>
  );
}
