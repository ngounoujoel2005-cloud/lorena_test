import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import { CategorySlug, Locale, Product } from '../types/store';
import { ActionIconTooltip } from './ActionIconTooltip';
import { ProductCard } from './ProductCard';

interface ProductCarouselRowProps {
  title: string;
  products: Product[];
  locale: Locale;
  wishlistIds: string[];
  compareIds?: string[];
  recentlyAddedId: string | null;
  darkHeaderBar?: boolean;
  viewAllCategory?: CategorySlug;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onViewAll: (category: CategorySlug) => void;
}

export function ProductCarouselRow({
  title,
  products,
  locale,
  wishlistIds,
  compareIds = [],
  recentlyAddedId,
  darkHeaderBar = false,
  viewAllCategory = 'all',
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  onToggleCompare,
  onViewAll,
}: ProductCarouselRowProps) {
  const t = TRANSLATIONS[locale];
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-[1360px] mx-auto px-4 space-y-4">
      {darkHeaderBar ? (
        <div className="ice-obsidian text-white rounded-3xl px-5 py-3.5 flex items-center justify-between gap-4">
          <h2 className="font-display text-lg sm:text-xl font-bold">{title}</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onViewAll(viewAllCategory)}
              className="glass-pill-gold px-3.5 py-1 rounded-full text-xs font-extrabold text-[#000000] cursor-pointer whitespace-nowrap"
            >
              {t.viewAll}
            </button>
          </div>
        </div>
      ) : (
        <div className="ice-surface rounded-3xl px-5 py-3 flex items-center justify-between gap-4">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#000000]">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 mr-1">
              <ActionIconTooltip
                placement="top"
                text={
                  locale === 'fr'
                    ? 'Faire défiler la liste vers la gauche'
                    : 'Scroll product row left'
                }
              >
                <button
                  type="button"
                  aria-label="Précédent"
                  onClick={() => scrollBy(-450)}
                  className="glass-pill-frost w-8 h-8 rounded-full text-[#000000] flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
              </ActionIconTooltip>
              <ActionIconTooltip
                placement="top"
                text={
                  locale === 'fr'
                    ? 'Faire défiler la liste vers la droite'
                    : 'Scroll product row right'
                }
              >
                <button
                  type="button"
                  aria-label="Suivant"
                  onClick={() => scrollBy(450)}
                  className="glass-pill-cta w-8 h-8 rounded-full text-white flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </ActionIconTooltip>
            </div>
            <button
              type="button"
              onClick={() => onViewAll(viewAllCategory)}
              className="glass-pill-frost px-3.5 py-1.5 rounded-full text-xs font-bold text-[#5A5AA1] cursor-pointer whitespace-nowrap"
            >
              {t.viewAll}
            </button>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex items-stretch gap-3.5 overflow-x-auto no-scrollbar pb-1"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            compact
            isWishlisted={wishlistIds.includes(product.id)}
            isCompared={compareIds.includes(product.id)}
            justAdded={recentlyAddedId === product.id}
            onSelectProduct={onSelectProduct}
            onQuickAdd={onQuickAdd}
            onToggleWishlist={onToggleWishlist}
            onToggleCompare={onToggleCompare}
          />
        ))}
      </div>
    </section>
  );
}
