import { Check, Heart, ShoppingCart } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { Locale, Product } from '../types/store';
import { formatXAF } from '../utils/format';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  locale: Locale;
  isWishlisted: boolean;
  justAdded: boolean;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  compact?: boolean;
}

export function ProductCard({
  product,
  locale,
  isWishlisted,
  justAdded,
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  compact = false,
}: ProductCardProps) {
  const t = TRANSLATIONS[locale];
  const title = locale === 'fr' ? product.nameFr : product.nameEn;
  const isOutOfStock = product.stockQty <= 0;

  return (
    <article
      className={`bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${
        compact ? 'min-w-[205px] w-[205px] sm:min-w-[216px] sm:w-[216px] shrink-0' : 'w-full'
      }`}
    >
      {/* Image Box with Discount & Category Badges */}
      <div className="relative aspect-[4/3] w-full bg-white p-3 flex items-center justify-center overflow-hidden">
        {/* Top-Left Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1">
          {product.badgeType === 'new' && (
            <span className="px-2 py-0.5 rounded bg-[#000000] text-white text-[11px] font-semibold">
              {t.newBadge}
            </span>
          )}
          {product.badgeType === 'clearance' && (
            <span className="px-2 py-0.5 rounded bg-[#5A5AA1] text-white text-[11px] font-semibold">
              {t.clearanceBadge}
            </span>
          )}
          {product.discountPct && (
            <span className="px-2 py-0.5 rounded bg-[#F4BE38] text-[#000000] text-[11px] font-bold tabular-nums">
              -{product.discountPct} %
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          type="button"
          aria-label={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
            isWishlisted
              ? 'bg-[#5A5AA1] border-[#5A5AA1] text-white'
              : 'bg-white/90 border-[#E5E7EB] text-[#6C757D] hover:text-[#5A5AA1]'
          }`}
        >
          <Heart
            className="w-4 h-4"
            fill={isWishlisted ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        </button>

        {/* Second Hand Verified Badge (Bottom Left of Image) */}
        {product.badgeType === 'second_hand' && (
          <span className="absolute bottom-2 left-2.5 z-10 px-2 py-0.5 rounded bg-[#F4BE38] text-[#000000] text-[10px] font-extrabold tracking-wide inline-flex items-center gap-1">
            <Check className="w-3 h-3" aria-hidden="true" />
            <span>{t.secondHandBadge}</span>
          </span>
        )}

        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="w-full h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-[#5A5AA1] rounded"
        >
          <ProductImage
            src={product.image}
            alt={title}
            className="w-full h-full object-contain"
          />
        </button>
      </div>

      {/* Card Content */}
      <div className="px-3.5 pb-3.5 pt-1 flex flex-col flex-1 border-t border-[#F3F4F6]">
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="text-left cursor-pointer"
        >
          <h3 className="text-[13px] font-medium text-[#000000] leading-snug line-clamp-2 min-h-[36px] hover:text-[#5A5AA1] transition-colors">
            {title}
          </h3>
        </button>

        {/* Prices */}
        <div className="mt-2">
          <span className="block font-display text-[15px] font-bold text-[#000000] tabular-nums">
            {formatXAF(product.price)}
          </span>
          {product.oldPrice && (
            <span className="block text-[11px] text-[#6C757D] line-through tabular-nums">
              {formatXAF(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Optional Color Swatches */}
        {product.swatches && product.swatches.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {product.swatches.map((swatch) => (
              <span
                key={swatch.name}
                title={swatch.name}
                className="w-4 h-4 rounded-full border border-[#D1D5DB]"
                style={{ backgroundColor: swatch.hex }}
              />
            ))}
          </div>
        )}

        {/* Primary CTA Button (#5A5AA1 with white text, or disabled out of stock) */}
        <div className="mt-auto pt-3">
          {isOutOfStock ? (
            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="w-full min-h-[38px] px-3 py-2 rounded-lg bg-[#F3F4F6] text-[#9CA3AF] text-[11px] font-bold tracking-wide uppercase cursor-pointer"
            >
              {t.outOfStock}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onQuickAdd(product)}
              className={`w-full min-h-[38px] px-3 py-2 rounded-lg text-xs font-bold tracking-wide inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                justAdded
                  ? 'bg-[#000000] text-[#F4BE38]'
                  : 'bg-[#5A5AA1] hover:bg-[#474789] text-white'
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
          )}
        </div>
      </div>
    </article>
  );
}
