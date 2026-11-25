import {
  ArrowLeft,
  Check,
  Plus,
  Scale,
  ShoppingCart,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { CATEGORIES_META, PRODUCTS } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { Locale, Product } from '../types/store';
import { formatXAF } from '../utils/format';
import { ProductImage } from './ProductImage';

interface CompareScreenProps {
  locale: Locale;
  compareIds: string[];
  recentlyAddedId: string | null;
  onAddCompare: (productId: string) => void;
  onRemoveCompare: (productId: string) => void;
  onClearCompare: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onBackHome: () => void;
  onAskAiComparison: (prompt: string) => void;
}

export function CompareScreen({
  locale,
  compareIds,
  recentlyAddedId,
  onAddCompare,
  onRemoveCompare,
  onClearCompare,
  onSelectProduct,
  onQuickAdd,
  onBackHome,
  onAskAiComparison,
}: CompareScreenProps) {
  const t = TRANSLATIONS[locale];
  const [differencesOnly, setDifferencesOnly] = useState(false);

  const selectedProducts = useMemo(
    () =>
      compareIds
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 3),
    [compareIds]
  );

  const availableToAdd = useMemo(
    () => PRODUCTS.filter((p) => !compareIds.includes(p.id)),
    [compareIds]
  );

  const lowestPrice = useMemo(() => {
    if (selectedProducts.length === 0) return 0;
    return Math.min(...selectedProducts.map((p) => p.price));
  }, [selectedProducts]);

  const highestPrice = useMemo(() => {
    if (selectedProducts.length === 0) return 0;
    return Math.max(...selectedProducts.map((p) => p.price));
  }, [selectedProducts]);

  const specKeys = useMemo(() => {
    const map = new Map<string, { labelFr: string; labelEn: string }>();
    for (const p of selectedProducts) {
      for (const spec of p.specs) {
        if (!map.has(spec.labelFr)) {
          map.set(spec.labelFr, {
            labelFr: spec.labelFr,
            labelEn: spec.labelEn,
          });
        }
      }
    }
    return Array.from(map.values());
  }, [selectedProducts]);

  const emptyColumnCount = Math.max(0, 3 - selectedProducts.length);

  const getCategoryLabel = (slug: Product['category']) => {
    const meta = CATEGORIES_META.find((c) => c.slug === slug);
    if (!meta) return slug;
    return locale === 'fr' ? meta.labelFr : meta.labelEn;
  };

  const buildRowDiffCheck = (values: string[]) => {
    if (!differencesOnly || values.length < 2) return true;
    return new Set(values).size > 1;
  };

  const handleAskAssistant = () => {
    const names = selectedProducts
      .map((p) => `${locale === 'fr' ? p.nameFr : p.nameEn} (${formatXAF(p.price)})`)
      .join(' vs ');
    const prompt =
      locale === 'fr'
        ? `Compare ces produits pour moi en résumant les différences clés de caractéristiques, le meilleur rapport qualité/prix en XAF et lequel choisir : ${names}`
        : `Compare these products for me, highlighting key spec differences, best value in XAF, and which one to pick: ${names}`;
    onAskAiComparison(prompt);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 pb-24 space-y-6">
      {/* Header */}
      <div className="ice-surface rounded-3xl p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="glass-pill-frost inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#5A5AA1] mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.backToHome}</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="glass-pill-black w-11 h-11 rounded-2xl text-[#F4BE38] flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#000000]">
                {locale === 'fr'
                  ? 'Comparateur de produits'
                  : 'Product Comparison'}
              </h1>
              <p className="text-xs sm:text-sm text-[#3F3F56] font-medium">
                {locale === 'fr'
                  ? `Comparez jusqu'à 3 articles côte à côte (${selectedProducts.length}/3 sélectionnés)`
                  : `Compare up to 3 products side by side (${selectedProducts.length}/3 selected)`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedProducts.length >= 2 && (
            <>
              <label className="ice-surface-subtle min-h-[40px] px-4 py-2 rounded-full inline-flex items-center gap-2 text-xs font-bold text-[#000000] cursor-pointer">
                <input
                  type="checkbox"
                  checked={differencesOnly}
                  onChange={(e) => setDifferencesOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#5A5AA1]"
                />
                <span>
                  {locale === 'fr'
                    ? 'Différences uniquement'
                    : 'Differences only'}
                </span>
              </label>

              <button
                type="button"
                onClick={handleAskAssistant}
                className="glass-pill-cta min-h-[40px] px-4 py-2 rounded-full text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FFE066]" aria-hidden="true" />
                <span>
                  {locale === 'fr' ? 'Analyser avec Gemini IA' : 'Ask Gemini AI'}
                </span>
              </button>
            </>
          )}

          {selectedProducts.length > 0 && (
            <button
              type="button"
              onClick={onClearCompare}
              className="glass-pill-frost min-h-[40px] px-4 py-2 rounded-full text-xs font-bold text-[#3F3F56] hover:text-[#ba1a1a] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{locale === 'fr' ? 'Tout retirer' : 'Clear all'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Price Spread Banner when >= 2 */}
      {selectedProducts.length >= 2 && (
        <div className="ice-yellow rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <span className="glass-pill-black px-3 py-0.5 rounded-full text-[#F4BE38] font-bold text-xs">
              {locale === 'fr' ? 'Écart de prix' : 'Price Spread'}
            </span>
            <span className="text-[#000000] font-medium">
              {locale === 'fr'
                ? 'Différence entre l’option la plus économique et la plus élevée :'
                : 'Difference between lowest and highest priced item:'}
            </span>
          </div>
          <span className="font-display text-base font-extrabold text-[#000000] tabular-nums">
            {formatXAF(highestPrice - lowestPrice)}
          </span>
        </div>
      )}

      {selectedProducts.length === 0 ? (
        <div className="ice-surface rounded-3xl p-10 text-center space-y-5">
          <div className="glass-pill-frost w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            <Scale className="w-7 h-7 text-[#5A5AA1]" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-display text-lg font-bold text-[#000000]">
              {locale === 'fr'
                ? 'Aucun produit sélectionné pour la comparaison'
                : 'No products selected for comparison'}
            </h2>
            <p className="text-sm text-[#3F3F56] max-w-md mx-auto">
              {locale === 'fr'
                ? 'Choisissez jusqu’à 3 produits ci-dessous ou cliquez sur l’icône balance sur n’importe quelle carte produit.'
                : 'Pick up to 3 products below or click the compare icon on any product card.'}
            </p>
          </div>
          <div className="max-w-sm mx-auto">
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) onAddCompare(e.target.value);
              }}
              className="glass-input-recessed min-h-[44px] w-full px-4 rounded-full text-sm font-semibold text-[#000000] cursor-pointer focus:outline-none"
            >
              <option value="" disabled>
                {locale === 'fr'
                  ? '+ Sélectionner un 1er produit...'
                  : '+ Choose a 1st product...'}
              </option>
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {locale === 'fr' ? p.nameFr : p.nameEn} — {formatXAF(p.price)}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="ice-surface rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-left">
              {/* Product Cards Header Row */}
              <thead>
                <tr className="border-b border-white/75 align-top">
                  <th className="w-[210px] p-5 ice-obsidian text-white">
                    <span className="glass-pill-gold inline-block px-2.5 py-0.5 rounded-full text-[#000000] text-[10px] font-extrabold uppercase mb-2">
                      Lorena Comparatif
                    </span>
                    <p className="font-display text-base font-bold leading-snug">
                      {locale === 'fr'
                        ? 'Fiche technique & prix'
                        : 'Specs & Pricing'}
                    </p>
                    <p className="text-xs text-white/75 font-normal mt-1">
                      {locale === 'fr'
                        ? 'Comparez jusqu’à 3 références en XAF'
                        : 'Compare up to 3 items in XAF'}
                    </p>
                  </th>

                  {selectedProducts.map((product) => {
                    const name = locale === 'fr' ? product.nameFr : product.nameEn;
                    const priceDelta = product.price - lowestPrice;
                    const isCheapest =
                      selectedProducts.length >= 2 && priceDelta === 0;
                    const isAdded = recentlyAddedId === product.id;
                    const isOutOfStock = product.stockQty <= 0;

                    return (
                      <th
                        key={product.id}
                        className="w-[260px] p-5 bg-white/30 border-l border-white/70 font-normal relative"
                      >
                        <button
                          type="button"
                          aria-label={`Retirer ${name}`}
                          onClick={() => onRemoveCompare(product.id)}
                          className="glass-pill-frost absolute top-3 right-3 w-7 h-7 rounded-full text-[#3F3F56] hover:text-[#ba1a1a] flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectProduct(product)}
                          className="w-full h-36 rounded-2xl ice-product-trap p-3 mb-3 flex items-center justify-center cursor-pointer"
                        >
                          <ProductImage
                            src={product.image}
                            alt={name}
                            className="w-full h-full object-contain relative z-10"
                          />
                        </button>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {isCheapest && (
                              <span className="glass-pill-gold px-2.5 py-0.5 rounded-full text-[#000000] text-[10px] font-extrabold uppercase">
                                {locale === 'fr' ? 'Meilleur prix' : 'Best price'}
                              </span>
                            )}
                            {product.discountPct && (
                              <span className="glass-pill-black px-2.5 py-0.5 rounded-full text-[#F4BE38] text-[10px] font-bold">
                                -{product.discountPct}%
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => onSelectProduct(product)}
                            className="text-left font-display text-sm font-bold text-[#000000] hover:text-[#5A5AA1] line-clamp-2 min-h-[40px] cursor-pointer"
                          >
                            {name}
                          </button>

                          <div className="pt-1">
                            <span className="block font-display text-lg font-extrabold text-[#000000] tabular-nums">
                              {formatXAF(product.price)}
                            </span>
                            {product.oldPrice && (
                              <span className="block text-xs text-[#3F3F56] line-through tabular-nums">
                                {formatXAF(product.oldPrice)}
                              </span>
                            )}
                          </div>

                          <div className="pt-2 flex flex-col gap-2">
                            <button
                              type="button"
                              disabled={isOutOfStock}
                              onClick={() => onQuickAdd(product)}
                              className={`w-full min-h-[38px] px-3 rounded-full text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                                isAdded
                                  ? 'glass-pill-black text-[#F4BE38]'
                                  : 'glass-pill-cta text-white'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>{t.addedBtn}</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingCart
                                    className="w-3.5 h-3.5"
                                    aria-hidden="true"
                                  />
                                  <span>
                                    {isOutOfStock ? t.outOfStock : t.buyBtn}
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </th>
                    );
                  })}

                  {Array.from({ length: emptyColumnCount }).map((_, idx) => (
                    <th
                      key={`add-slot-${idx}`}
                      className="w-[240px] p-5 bg-white/20 border-l border-white/70 font-normal align-middle text-center"
                    >
                      <div className="ice-surface-subtle border-2 border-dashed border-white/85 rounded-2xl p-4 space-y-3">
                        <div className="glass-pill-frost w-10 h-10 mx-auto rounded-full flex items-center justify-center text-[#5A5AA1]">
                          <Plus className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <p className="text-xs font-bold text-[#000000]">
                          {locale === 'fr'
                            ? 'Ajouter un produit'
                            : 'Add another product'}
                        </p>
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) onAddCompare(e.target.value);
                          }}
                          aria-label="Ajouter un produit au comparatif"
                          className="glass-input-recessed min-h-[38px] w-full px-3 rounded-full text-xs text-[#000000] font-medium cursor-pointer focus:outline-none"
                        >
                          <option value="" disabled>
                            {locale === 'fr' ? 'Choisir...' : 'Select...'}
                          </option>
                          {availableToAdd.map((p) => (
                            <option key={p.id} value={p.id}>
                              {locale === 'fr' ? p.nameFr : p.nameEn} (
                              {formatXAF(p.price)})
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Spec Comparison Body */}
              <tbody className="divide-y divide-white/70 text-xs sm:text-sm">
                {/* Price Difference Row */}
                {buildRowDiffCheck(selectedProducts.map((p) => String(p.price))) && (
                  <tr className="bg-white/25">
                    <td className="px-5 py-3.5 font-bold text-[#000000]">
                      {locale === 'fr'
                        ? 'Différence de prix'
                        : 'Price Difference'}
                    </td>
                    {selectedProducts.map((p) => {
                      const diff = p.price - lowestPrice;
                      return (
                        <td
                          key={p.id}
                          className="px-5 py-3.5 border-l border-white/70 tabular-nums"
                        >
                          {selectedProducts.length < 2 ? (
                            <span className="text-[#3F3F56]">—</span>
                          ) : diff === 0 ? (
                            <span className="glass-pill-gold inline-block px-2.5 py-0.5 rounded-full text-[#000000] font-bold text-xs">
                              {locale === 'fr'
                                ? 'Prix le plus bas'
                                : 'Lowest price'}
                            </span>
                          ) : (
                            <span className="font-bold text-[#5A5AA1]">
                              +{formatXAF(diff)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    {Array.from({ length: emptyColumnCount }).map((_, idx) => (
                      <td
                        key={`diff-empty-${idx}`}
                        className="px-5 py-3.5 border-l border-white/70 text-[#3F3F56]/55"
                      >
                        —
                      </td>
                    ))}
                  </tr>
                )}

                {/* Brand */}
                {buildRowDiffCheck(selectedProducts.map((p) => p.brand)) && (
                  <tr className="bg-white/45">
                    <td className="px-5 py-3.5 font-bold text-[#000000]">
                      {locale === 'fr' ? 'Marque' : 'Brand'}
                    </td>
                    {selectedProducts.map((p) => (
                      <td
                        key={p.id}
                        className="px-5 py-3.5 border-l border-white/70 font-semibold text-[#000000]"
                      >
                        {p.brand}
                      </td>
                    ))}
                    {Array.from({ length: emptyColumnCount }).map((_, idx) => (
                      <td
                        key={`brand-empty-${idx}`}
                        className="px-5 py-3.5 border-l border-white/70 text-[#3F3F56]/55"
                      >
                        —
                      </td>
                    ))}
                  </tr>
                )}

                {/* Category */}
                {buildRowDiffCheck(selectedProducts.map((p) => p.category)) && (
                  <tr className="bg-white/25">
                    <td className="px-5 py-3.5 font-bold text-[#000000]">
                      {locale === 'fr' ? 'Catégorie' : 'Category'}
                    </td>
                    {selectedProducts.map((p) => (
                      <td
                        key={p.id}
                        className="px-5 py-3.5 border-l border-white/70 text-[#3F3F56] font-medium"
                      >
                        {getCategoryLabel(p.category)}
                      </td>
                    ))}
                    {Array.from({ length: emptyColumnCount }).map((_, idx) => (
                      <td
                        key={`cat-empty-${idx}`}
                        className="px-5 py-3.5 border-l border-white/70 text-[#3F3F56]/55"
                      >
                        —
                      </td>
                    ))}
                  </tr>
                )}

                {/* Warranty */}
                {buildRowDiffCheck(
                  selectedProducts.map((p) => String(p.warrantyMonths))
                ) && (
                  <tr className="bg-white/45">
                    <td className="px-5 py-3.5 font-bold text-[#000000]">
                      {locale === 'fr' ? 'Garantie certifiée' : 'Warranty'}
                    </td>
                    {selectedProducts.map((p) => (
                      <td
                        key={p.id}
                        className="px-5 py-3.5 border-l border-white/70 font-bold text-[#5A5AA1]"
                      >
                        {p.warrantyMonths}{' '}
                        {locale === 'fr' ? 'mois' : 'months'}
                      </td>
                    ))}
                    {Array.from({ length: emptyColumnCount }).map((_, idx) => (
                      <td
                        key={`wrn-empty-${idx}`}
                        className="px-5 py-3.5 border-l border-white/70 text-[#3F3F56]/55"
                      >
                        —
                      </td>
                    ))}
                  </tr>
                )}

                {/* Stock */}
                {buildRowDiffCheck(
                  selectedProducts.map((p) => (p.stockQty > 0 ? 'in' : 'out'))
                ) && (
                  <tr className="bg-white/25">
                    <td className="px-5 py-3.5 font-bold text-[#000000]">
                      {locale === 'fr' ? 'Disponibilité' : 'Availability'}
                    </td>
                    {selectedProducts.map((p) => (
                      <td
                        key={p.id}
                        className="px-5 py-3.5 border-l border-white/70"
                      >
                        {p.stockQty > 0 ? (
                          <span className="font-bold text-[#000000]">
                            {p.stockQty}{' '}
                            {locale === 'fr' ? 'en stock' : 'in stock'}
                          </span>
                        ) : (
                          <span className="font-bold text-[#ba1a1a]">
                            {t.outOfStock}
                          </span>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: emptyColumnCount }).map((_, idx) => (
                      <td
                        key={`stk-empty-${idx}`}
                        className="px-5 py-3.5 border-l border-white/70 text-[#3F3F56]/55"
                      >
                        —
                      </td>
                    ))}
                  </tr>
                )}

                {/* Dynamic Merged Technical Specs */}
                {specKeys.map((specKey, rowIdx) => {
                  const rowValues = selectedProducts.map(
                    (p) =>
                      p.specs.find((s) => s.labelFr === specKey.labelFr)?.value ??
                      '—'
                  );
                  if (!buildRowDiffCheck(rowValues)) return null;

                  return (
                    <tr
                      key={specKey.labelFr}
                      className={rowIdx % 2 === 0 ? 'bg-white/45' : 'bg-white/25'}
                    >
                      <td className="px-5 py-3.5 font-bold text-[#000000]">
                        {locale === 'fr' ? specKey.labelFr : specKey.labelEn}
                      </td>
                      {rowValues.map((val, colIdx) => (
                        <td
                          key={`${specKey.labelFr}-${selectedProducts[colIdx].id}`}
                          className="px-5 py-3.5 border-l border-white/70 text-[#3F3F56] font-medium"
                        >
                          {val}
                        </td>
                      ))}
                      {Array.from({ length: emptyColumnCount }).map((_, idx) => (
                        <td
                          key={`spec-empty-${idx}`}
                          className="px-5 py-3.5 border-l border-white/70 text-[#3F3F56]/55"
                        >
                          —
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
