import { ChevronDown, ChevronUp, Search, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { CATEGORIES_META } from '../data/catalog';
import { CategorySlug, Locale } from '../types/store';
import { formatXAF } from '../utils/format';

export interface BrandFacet {
  brand: string;
  count: number;
}

export interface WarrantyFacet {
  months: number;
  count: number;
}

interface CatalogFilterSidebarProps {
  locale: Locale;
  activeCategory: CategorySlug;
  searchQuery: string;
  minPriceInput: string;
  maxPriceInput: string;
  appliedMinPrice: number | null;
  appliedMaxPrice: number | null;
  selectedBrands: string[];
  selectedWarranties: number[];
  onlyInStock: boolean;
  brandFacets: BrandFacet[];
  warrantyFacets: WarrantyFacet[];
  activeFilterCount: number;
  onSelectCategory: (slug: CategorySlug) => void;
  onSearchChange: (q: string) => void;
  onMinPriceInputChange: (val: string) => void;
  onMaxPriceInputChange: (val: string) => void;
  onApplyPriceRange: (e: FormEvent) => void;
  onSelectPricePreset: (min: number | null, max: number | null) => void;
  onToggleBrand: (brand: string) => void;
  onToggleWarranty: (months: number) => void;
  onToggleInStock: (checked: boolean) => void;
  onResetAll: () => void;
}

const PRICE_PRESETS: Array<{
  id: string;
  min: number | null;
  max: number | null;
  labelFr: string;
  labelEn: string;
}> = [
  {
    id: 'under-50k',
    min: null,
    max: 50000,
    labelFr: 'Moins de 50 000',
    labelEn: 'Under 50,000',
  },
  {
    id: '50k-200k',
    min: 50000,
    max: 200000,
    labelFr: '50 000 – 200 000',
    labelEn: '50,000 – 200,000',
  },
  {
    id: '200k-plus',
    min: 200000,
    max: null,
    labelFr: '200 000 et +',
    labelEn: '200,000+',
  },
];

export function CatalogFilterSidebar({
  locale,
  activeCategory,
  searchQuery,
  minPriceInput,
  maxPriceInput,
  appliedMinPrice,
  appliedMaxPrice,
  selectedBrands,
  selectedWarranties,
  onlyInStock,
  brandFacets,
  warrantyFacets,
  activeFilterCount,
  onSelectCategory,
  onSearchChange,
  onMinPriceInputChange,
  onMaxPriceInputChange,
  onApplyPriceRange,
  onSelectPricePreset,
  onToggleBrand,
  onToggleWarranty,
  onToggleInStock,
  onResetAll,
}: CatalogFilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside className="ice-surface lg:col-span-3 rounded-3xl p-5 space-y-5 lg:sticky lg:top-28">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/75">
        <div className="flex items-center gap-2.5">
          <span className="glass-pill-black w-8 h-8 rounded-full text-[#F4BE38] flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-sm font-bold text-[#000000]">
                {locale === 'fr' ? 'Filtres' : 'Filters'}
              </h2>
              {activeFilterCount > 0 && (
                <span className="glass-pill-gold px-2 py-0.5 rounded-full text-[#000000] text-[10px] font-extrabold tabular-nums">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#3F3F56]">
              {locale === 'fr' ? 'Affinez le catalogue' : 'Refine catalog'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetAll}
            className="glass-pill-frost px-2.5 py-1 rounded-full text-[11px] font-bold text-[#5A5AA1] cursor-pointer"
          >
            {locale === 'fr' ? 'Réinitialiser' : 'Reset'}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={locale === 'fr' ? 'Afficher les filtres' : 'Toggle filters'}
            className="glass-pill-frost lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-[#000000] cursor-pointer"
          >
            {mobileOpen ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className={`${mobileOpen ? 'block' : 'hidden'} lg:block space-y-6`}>
        {/* Search Input */}
        <div className="space-y-2">
          <label
            htmlFor="sidebar-catalog-search"
            className="block text-[11px] font-bold uppercase tracking-wider text-[#3F3F56]"
          >
            {locale === 'fr' ? 'RECHERCHE' : 'SEARCH'}
          </label>
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#5A5AA1] absolute left-3.5 top-1/2 -translate-y-1/2 z-10"
              aria-hidden="true"
            />
            <input
              id="sidebar-catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={locale === 'fr' ? 'Nom, marque, SKU...' : 'Name, brand, SKU...'}
              className="glass-input-recessed min-h-[40px] w-full pl-9 pr-3 rounded-full text-xs text-[#000000] placeholder:text-[#3F3F56]/70 focus:outline-none"
            />
          </div>
        </div>

        {/* Price Range Filter */}
        <form onSubmit={onApplyPriceRange} className="space-y-2.5 pt-4 border-t border-white/75">
          <div className="flex items-center justify-between">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#3F3F56]">
              {locale === 'fr' ? 'PRIX · XAF' : 'PRICE RANGE · XAF'}
            </span>
            {(appliedMinPrice !== null || appliedMaxPrice !== null) && (
              <button
                type="button"
                onClick={() => onSelectPricePreset(null, null)}
                className="text-[10px] font-bold text-[#5A5AA1] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" aria-hidden="true" />
                <span>{locale === 'fr' ? 'Effacer' : 'Clear'}</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PRICE_PRESETS.map((preset) => {
              const isSelected =
                appliedMinPrice === preset.min && appliedMaxPrice === preset.max;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    isSelected
                      ? onSelectPricePreset(null, null)
                      : onSelectPricePreset(preset.min, preset.max)
                  }
                  className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                    isSelected
                      ? 'glass-pill-gold text-[#000000]'
                      : 'glass-pill-frost text-[#3F3F56]'
                  }`}
                >
                  {locale === 'fr' ? preset.labelFr : preset.labelEn}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="sidebar-price-min"
                className="block text-[10px] font-semibold text-[#3F3F56] mb-1"
              >
                Min (XAF)
              </label>
              <input
                id="sidebar-price-min"
                type="number"
                min={0}
                value={minPriceInput}
                onChange={(e) => onMinPriceInputChange(e.target.value)}
                placeholder="0"
                className="glass-input-recessed min-h-[38px] w-full px-3 rounded-full text-xs text-[#000000] tabular-nums focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="sidebar-price-max"
                className="block text-[10px] font-semibold text-[#3F3F56] mb-1"
              >
                Max (XAF)
              </label>
              <input
                id="sidebar-price-max"
                type="number"
                min={0}
                value={maxPriceInput}
                onChange={(e) => onMaxPriceInputChange(e.target.value)}
                placeholder="∞"
                className="glass-input-recessed min-h-[38px] w-full px-3 rounded-full text-xs text-[#000000] tabular-nums focus:outline-none"
              />
            </div>
          </div>

          {(appliedMinPrice !== null || appliedMaxPrice !== null) && (
            <p className="text-[11px] font-bold text-[#5A5AA1] tabular-nums">
              {appliedMinPrice !== null ? formatXAF(appliedMinPrice) : '0 XAF'} —{' '}
              {appliedMaxPrice !== null ? formatXAF(appliedMaxPrice) : '∞'}
            </p>
          )}

          <button
            type="submit"
            className="glass-pill-black w-full min-h-[38px] px-4 py-2 rounded-full text-white text-xs font-bold cursor-pointer"
          >
            {locale === 'fr' ? 'Appliquer le prix' : 'Apply price'}
          </button>
        </form>

        {/* Brand Multi-Select Filter */}
        <div className="space-y-2.5 pt-4 border-t border-white/75">
          <div className="flex items-center justify-between">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#3F3F56]">
              {locale === 'fr' ? 'MARQUES' : 'BRANDS'}
            </span>
            {selectedBrands.length > 0 && (
              <span className="glass-pill-cta px-2 py-0.5 rounded-full text-[10px] font-bold text-white tabular-nums">
                {selectedBrands.length} {locale === 'fr' ? 'sél.' : 'sel.'}
              </span>
            )}
          </div>

          <div className="space-y-1.5 max-h-[210px] overflow-y-auto pr-1">
            {brandFacets.map(({ brand, count }) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className={`w-full px-3 py-1.5 rounded-full text-xs flex items-center justify-between gap-2 cursor-pointer transition-all ${
                    isChecked
                      ? 'ice-surface-subtle border-[#5A5AA1] text-[#000000] font-bold'
                      : 'text-[#3F3F56] hover:bg-white/60'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleBrand(brand)}
                      className="w-4 h-4 accent-[#5A5AA1] rounded shrink-0"
                    />
                    <span className="truncate">{brand}</span>
                  </span>
                  <span className="text-[11px] text-[#3F3F56] tabular-nums shrink-0">
                    ({count})
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Warranty Length Filter */}
        <div className="space-y-2.5 pt-4 border-t border-white/75">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#3F3F56]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A5AA1]" aria-hidden="true" />
              <span>
                {locale === 'fr' ? 'DURÉE DE GARANTIE' : 'WARRANTY LENGTH'}
              </span>
            </span>
          </div>

          <div className="space-y-1.5">
            {warrantyFacets.map(({ months, count }) => {
              const isChecked = selectedWarranties.includes(months);
              return (
                <label
                  key={months}
                  className={`w-full px-3 py-1.5 rounded-full text-xs flex items-center justify-between gap-2 cursor-pointer transition-all ${
                    isChecked
                      ? 'ice-surface-subtle border-[#5A5AA1] text-[#000000] font-bold'
                      : 'text-[#3F3F56] hover:bg-white/60'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleWarranty(months)}
                      className="w-4 h-4 accent-[#5A5AA1] rounded shrink-0"
                    />
                    <span>
                      {months} {locale === 'fr' ? 'mois' : months === 1 ? 'month' : 'months'}
                    </span>
                  </span>
                  <span className="text-[11px] text-[#3F3F56] tabular-nums shrink-0">
                    ({count})
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Categories Radio List */}
        <div className="space-y-2 pt-4 border-t border-white/75">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#3F3F56]">
            {locale === 'fr' ? 'CATÉGORIES' : 'CATEGORIES'}
          </span>
          <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`w-full px-3 py-2 rounded-full text-left text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'ice-surface-subtle text-[#000000] font-bold'
                  : 'text-[#3F3F56] hover:bg-white/60'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  activeCategory === 'all'
                    ? 'border-[#5A5AA1] bg-[#5A5AA1]'
                    : 'border-white/90 bg-white/80'
                }`}
              >
                {activeCategory === 'all' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
              <span>
                {locale === 'fr' ? 'Toutes les catégories' : 'All categories'}
              </span>
            </button>

            {CATEGORIES_META.map((cat) => {
              const isSelected = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`w-full px-3 py-2 rounded-full text-left text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'ice-surface-subtle text-[#000000] font-bold'
                      : 'text-[#3F3F56] hover:bg-white/60'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-[#5A5AA1] bg-[#5A5AA1]'
                        : 'border-white/90 bg-white/80'
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="truncate">
                    {locale === 'fr' ? cat.labelFr : cat.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Availability */}
        <div className="pt-4 border-t border-white/75 space-y-2">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#3F3F56]">
            {locale === 'fr' ? 'DISPONIBILITÉ' : 'AVAILABILITY'}
          </span>
          <label className="ice-surface-subtle px-3 py-2 rounded-full flex items-center gap-2.5 text-xs font-semibold text-[#000000] cursor-pointer">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => onToggleInStock(e.target.checked)}
              className="w-4 h-4 accent-[#5A5AA1]"
            />
            <span>
              {locale === 'fr' ? 'En stock uniquement' : 'In stock only'}
            </span>
          </label>
        </div>
      </div>
    </aside>
  );
}
