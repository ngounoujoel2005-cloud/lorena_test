import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import { CategorySlug, Locale, Product } from '../types/store';
import { ActionIconTooltip } from './ActionIconTooltip';
import { ProductCard } from './ProductCard';

interface ProductCarouselRowProps {
  title: string;
  subtitle?: string;
  promoBadge?: string;
  products: Product[];
  locale: Locale;
  wishlistIds: string[];
  compareIds?: string[];
  waitlistIds?: string[];
  recentlyAddedId: string | null;
  darkHeaderBar?: boolean;
  autoScroll?: boolean;
  viewAllCategory?: CategorySlug;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onNotifyMe?: (product: Product) => void;
  onViewAll: (category: CategorySlug) => void;
}

export function ProductCarouselRow({
  title,
  subtitle,
  promoBadge,
  products,
  locale,
  wishlistIds,
  compareIds = [],
  waitlistIds = [],
  recentlyAddedId,
  darkHeaderBar = false,
  autoScroll = true,
  viewAllCategory = 'all',
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  onToggleCompare,
  onNotifyMe,
  onViewAll,
}: ProductCarouselRowProps) {
  const t = TRANSLATIONS[locale];
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Ensure each half-deck has enough cards (>= 6) so the -50% marquee never leaves a gap on wide viewports
  const deckProducts: Product[] = [];
  if (products.length > 0) {
    while (deckProducts.length < 6) {
      deckProducts.push(...products);
    }
  }

  const renderDeck = (deckKey: string, isDuplicate = false) => (
    <div
      aria-hidden={isDuplicate}
      className="flex items-stretch gap-3.5 pr-3.5 shrink-0"
    >
      {deckProducts.map((product, idx) => (
        <ProductCard
          key={`${deckKey}-${idx}-${product.id}`}
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
  );

  return (
    <section className="max-w-[1360px] mx-auto px-3 sm:px-4 space-y-4">
      {darkHeaderBar ? (
        <div className="ice-obsidian text-white rounded-3xl px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {promoBadge && (
              <span className="glass-pill-gold px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#000000] shrink-0">
                {promoBadge}
              </span>
            )}
            <h2 className="font-display text-base sm:text-xl font-bold truncate">
              {title}
            </h2>
            {subtitle && (
              <span className="text-xs text-white/75 hidden md:inline">
                · {subtitle}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Précédent"
                onClick={() => scrollBy(-400)}
                className="glass-pill-frost w-8 h-8 rounded-full text-[#000000] flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Suivant"
                onClick={() => scrollBy(400)}
                className="glass-pill-cta w-8 h-8 rounded-full text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => onViewAll(viewAllCategory)}
              className="glass-pill-gold px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#000000] cursor-pointer whitespace-nowrap"
            >
              {t.viewAll}
            </button>
          </div>
        </div>
      ) : (
        <div className="ice-surface rounded-3xl px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {promoBadge && (
              <span className="glass-pill-gold px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#000000] shrink-0">
                {promoBadge}
              </span>
            )}
            <h2 className="font-display text-base sm:text-xl font-bold text-[#000000] truncate">
              {title}
            </h2>
            {subtitle && (
              <span className="text-xs text-[#3F3F56] hidden md:inline">
                · {subtitle}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
                  onClick={() => scrollBy(-420)}
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
                  onClick={() => scrollBy(420)}
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

      {autoScroll && products.length > 0 ? (
        <div
          ref={scrollRef}
          className="lorena-rtl-track w-full overflow-x-auto no-scrollbar py-1"
        >
          <div className="animate-lorena-rtl-products">
            {renderDeck('deck-a', false)}
            {renderDeck('deck-b', true)}
          </div>
        </div>
      ) : (
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
      )}
    </section>
  );
}
