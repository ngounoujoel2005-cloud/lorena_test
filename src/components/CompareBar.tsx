import { ArrowRight, Scale, Trash2, X } from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { Locale } from '../types/store';
import { formatXAF } from '../utils/format';
import { ActionIconTooltip } from './ActionIconTooltip';
import { ProductImage } from './ProductImage';

interface CompareBarProps {
  locale: Locale;
  compareIds: string[];
  elevated?: boolean;
  onRemoveCompare: (productId: string) => void;
  onClearCompare: () => void;
  onOpenCompareScreen: () => void;
}

export function CompareBar({
  locale,
  compareIds,
  elevated = false,
  onRemoveCompare,
  onClearCompare,
  onOpenCompareScreen,
}: CompareBarProps) {
  if (compareIds.length === 0) return null;

  const selectedProducts = compareIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const emptySlots = Math.max(0, 3 - selectedProducts.length);

  return (
    <div
      className={`no-print fixed left-4 right-32 sm:right-40 z-30 pointer-events-none ${
        elevated ? 'bottom-20' : 'bottom-4'
      }`}
    >
      <div className="max-w-[940px] mx-auto ice-obsidian text-white rounded-3xl px-4 py-3 pointer-events-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <ActionIconTooltip
              text={
                locale === 'fr'
                  ? 'Articles sélectionnés pour la comparaison côte à côte'
                  : 'Products selected for side-by-side comparison'
              }
              placement="top"
              focusable
            >
              <span className="glass-pill-cta inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11px] font-bold shrink-0">
                <Scale className="w-3.5 h-3.5 text-[#F4BE38]" aria-hidden="true" />
                <span>
                  {selectedProducts.length}/3
                </span>
              </span>
            </ActionIconTooltip>

            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 bg-white/12 backdrop-blur-md border border-white/30 rounded-2xl pl-1.5 pr-2.5 py-1.5 shrink-0 max-w-[205px]"
              >
                <div className="w-8 h-8 rounded-xl ice-product-trap p-0.5 shrink-0">
                  <ProductImage
                    src={product.image}
                    alt={locale === 'fr' ? product.nameFr : product.nameEn}
                    className="w-full h-full object-contain relative z-10"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-white truncate">
                    {locale === 'fr' ? product.nameFr : product.nameEn}
                  </p>
                  <p className="text-[10px] font-bold text-[#F4BE38] tabular-nums">
                    {formatXAF(product.price)}
                  </p>
                </div>
                <ActionIconTooltip
                  text={
                    locale === 'fr'
                      ? 'Retirer cet article du comparateur'
                      : 'Remove this item from comparison'
                  }
                  placement="top"
                >
                  <button
                    type="button"
                    aria-label="Retirer du comparatif"
                    onClick={() => onRemoveCompare(product.id)}
                    className="p-0.5 text-white/65 hover:text-white cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </ActionIconTooltip>
              </div>
            ))}

            {Array.from({ length: emptySlots }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="hidden sm:flex items-center justify-center px-3.5 py-2 rounded-2xl border border-dashed border-white/30 bg-white/5 text-[11px] text-white/55 shrink-0"
              >
                {locale === 'fr' ? '+ Produit' : '+ Product'}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <ActionIconTooltip
              text={
                locale === 'fr'
                  ? 'Tout retirer du comparateur'
                  : 'Clear all compared items'
              }
              placement="top"
            >
              <button
                type="button"
                onClick={onClearCompare}
                aria-label={locale === 'fr' ? 'Vider le comparatif' : 'Clear comparison'}
                className="min-h-[38px] px-3 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">
                  {locale === 'fr' ? 'Vider' : 'Clear'}
                </span>
              </button>
            </ActionIconTooltip>

            <ActionIconTooltip
              text={
                locale === 'fr'
                  ? 'Ouvrir le tableau comparatif détaillé'
                  : 'Open detailed comparison table'
              }
              placement="top"
            >
              <button
                type="button"
                onClick={onOpenCompareScreen}
                className="glass-pill-gold min-h-[38px] px-4 py-1.5 rounded-full text-[#000000] font-display font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>
                  {locale === 'fr'
                    ? `Comparer (${selectedProducts.length})`
                    : `Compare (${selectedProducts.length})`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </ActionIconTooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
