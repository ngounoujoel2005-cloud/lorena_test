import { ArrowLeft, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { CATEGORIES_META, PRODUCTS } from '../data/catalog';
import { CategorySlug, Locale, Product } from '../types/store';
import { formatXAF } from '../utils/format';
import { ActionIconTooltip } from './ActionIconTooltip';
import {
  BrandFacet,
  CatalogFilterSidebar,
  WarrantyFacet,
} from './CatalogFilterSidebar';
import { ProductCard } from './ProductCard';

interface CategoryCatalogScreenProps {
  locale: Locale;
  activeCategory: CategorySlug;
  searchQuery: string;
  wishlistIds: string[];
  compareIds?: string[];
  waitlistIds?: string[];
  recentlyAddedId: string | null;
  onSelectCategory: (slug: CategorySlug) => void;
  onSearchChange: (q: string) => void;
  onClearSearch: () => void;
  onBackHome: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onNotifyMe?: (product: Product) => void;
}

export function CategoryCatalogScreen({
  locale,
  activeCategory,
  searchQuery,
  wishlistIds,
  compareIds = [],
  waitlistIds = [],
  recentlyAddedId,
  onSelectCategory,
  onSearchChange,
  onClearSearch,
  onBackHome,
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  onToggleCompare,
  onNotifyMe,
}: CategoryCatalogScreenProps) {
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedWarranties, setSelectedWarranties] = useState<number[]>([]);

  const activeCategoryMeta = CATEGORIES_META.find((c) => c.slug === activeCategory);

  const handleApplyPriceRange = (e: FormEvent) => {
    e.preventDefault();
    const minVal = minPriceInput.trim() ? Number(minPriceInput) : null;
    const maxVal = maxPriceInput.trim() ? Number(maxPriceInput) : null;
    setAppliedMinPrice(minVal !== null && !Number.isNaN(minVal) ? minVal : null);
    setAppliedMaxPrice(maxVal !== null && !Number.isNaN(maxVal) ? maxVal : null);
  };

  const handleSelectPricePreset = (min: number | null, max: number | null) => {
    setMinPriceInput(min !== null ? String(min) : '');
    setMaxPriceInput(max !== null ? String(max) : '');
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
  };

  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleToggleWarranty = (months: number) => {
    setSelectedWarranties((prev) =>
      prev.includes(months)
        ? prev.filter((m) => m !== months)
        : [...prev, months]
    );
  };

  const handleResetAll = () => {
    onClearSearch();
    onSelectCategory('all');
    setOnlyInStock(false);
    setMinPriceInput('');
    setMaxPriceInput('');
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setSelectedBrands([]);
    setSelectedWarranties([]);
  };

  const baseCategorySearchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const catOk = activeCategory === 'all' || p.category === activeCategory;
      const searchOk =
        q.length === 0 ||
        p.nameFr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortNoteFr.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [activeCategory, searchQuery]);

  const brandFacets: BrandFacet[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of baseCategorySearchMatches) {
      counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
    }
    for (const brand of selectedBrands) {
      if (!counts.has(brand)) counts.set(brand, 0);
    }
    return Array.from(counts.entries())
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand));
  }, [baseCategorySearchMatches, selectedBrands]);

  const warrantyFacets: WarrantyFacet[] = useMemo(() => {
    const counts = new Map<number, number>();
    for (const p of baseCategorySearchMatches) {
      counts.set(p.warrantyMonths, (counts.get(p.warrantyMonths) ?? 0) + 1);
    }
    for (const m of selectedWarranties) {
      if (!counts.has(m)) counts.set(m, 0);
    }
    return Array.from(counts.entries())
      .map(([months, count]) => ({ months, count }))
      .sort((a, b) => a.months - b.months);
  }, [baseCategorySearchMatches, selectedWarranties]);

  const filtered = useMemo(() => {
    const list = baseCategorySearchMatches.filter((p) => {
      const stockOk = !onlyInStock || p.stockQty > 0;
      const minOk = appliedMinPrice === null || p.price >= appliedMinPrice;
      const maxOk = appliedMaxPrice === null || p.price <= appliedMaxPrice;
      const brandOk =
        selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const warrantyOk =
        selectedWarranties.length === 0 ||
        selectedWarranties.includes(p.warrantyMonths);
      return stockOk && minOk && maxOk && brandOk && warrantyOk;
    });

    if (sortBy === 'price_asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price_desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [
    appliedMaxPrice,
    appliedMinPrice,
    baseCategorySearchMatches,
    onlyInStock,
    selectedBrands,
    selectedWarranties,
    sortBy,
  ]);

  const activeFilterCount =
    selectedBrands.length +
    selectedWarranties.length +
    (appliedMinPrice !== null || appliedMaxPrice !== null ? 1 : 0) +
    (onlyInStock ? 1 : 0);

  const headingTitle = searchQuery.trim()
    ? `${locale === 'fr' ? 'Recherche' : 'Search'} : « ${searchQuery.trim()} »`
    : activeCategoryMeta
    ? locale === 'fr'
      ? activeCategoryMeta.labelFr
      : activeCategoryMeta.labelEn
    : locale === 'fr'
    ? 'Boutique Lorena Market'
    : 'Lorena Market Store';

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 pb-16 space-y-6">
      {/* Breadcrumb & Page Title Encased in Crystal Ice */}
      <div className="ice-surface rounded-3xl p-5 sm:p-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#3F3F56] mb-2">
            <ActionIconTooltip
              text={
                locale === 'fr'
                  ? 'Revenir à la page d’accueil Lorena'
                  : 'Return to Lorena homepage'
              }
              placement="bottom"
            >
              <button
                type="button"
                onClick={onBackHome}
                className="glass-pill-frost px-3 py-1 rounded-full inline-flex items-center gap-1 font-bold text-[#5A5AA1] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{locale === 'fr' ? 'Accueil' : 'Home'}</span>
              </button>
            </ActionIconTooltip>
            <span aria-hidden="true">/</span>
            <span className="font-medium">{locale === 'fr' ? 'Boutique' : 'Shop'}</span>
            {activeCategoryMeta && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-[#000000] font-bold">
                  {locale === 'fr' ? activeCategoryMeta.labelFr : activeCategoryMeta.labelEn}
                </span>
              </>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
            {headingTitle}
          </h1>
          <p className="text-xs text-[#3F3F56] font-medium mt-1 tabular-nums">
            {filtered.length}{' '}
            {locale === 'fr' ? 'produits trouvés' : 'products found'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#3F3F56] hidden sm:inline">
            {locale === 'fr' ? 'Trier par' : 'Sort by'}
          </span>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'featured' | 'price_asc' | 'price_desc')
            }
            aria-label={locale === 'fr' ? 'Trier les produits' : 'Sort products'}
            className="glass-input-recessed min-h-[40px] px-4 rounded-full text-xs font-bold text-[#000000] cursor-pointer focus:outline-none"
          >
            <option value="featured">
              {locale === 'fr' ? 'Nouveautés' : 'Newest & Featured'}
            </option>
            <option value="price_asc">
              {locale === 'fr' ? 'Prix croissant' : 'Price: Low to High'}
            </option>
            <option value="price_desc">
              {locale === 'fr' ? 'Prix décroissant' : 'Price: High to Low'}
            </option>
          </select>
        </div>
      </div>

      {/* 2-Column Layout: Left Filter Sidebar Component + Right Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <CatalogFilterSidebar
          locale={locale}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          minPriceInput={minPriceInput}
          maxPriceInput={maxPriceInput}
          appliedMinPrice={appliedMinPrice}
          appliedMaxPrice={appliedMaxPrice}
          selectedBrands={selectedBrands}
          selectedWarranties={selectedWarranties}
          onlyInStock={onlyInStock}
          brandFacets={brandFacets}
          warrantyFacets={warrantyFacets}
          activeFilterCount={activeFilterCount}
          onSelectCategory={onSelectCategory}
          onSearchChange={onSearchChange}
          onMinPriceInputChange={setMinPriceInput}
          onMaxPriceInputChange={setMaxPriceInput}
          onApplyPriceRange={handleApplyPriceRange}
          onSelectPricePreset={handleSelectPricePreset}
          onToggleBrand={handleToggleBrand}
          onToggleWarranty={handleToggleWarranty}
          onToggleInStock={setOnlyInStock}
          onResetAll={handleResetAll}
        />

        {/* Results Grid */}
        <div className="lg:col-span-9 space-y-4">
          {/* Active Filter Pills */}
          {activeFilterCount > 0 && (
            <div className="ice-surface rounded-2xl px-4 py-2.5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F3F56]">
                {locale === 'fr' ? 'Filtres actifs :' : 'Active filters:'}
              </span>

              {selectedBrands.map((brand) => (
                <ActionIconTooltip
                  key={`chip-brand-${brand}`}
                  text={
                    locale === 'fr'
                      ? `Retirer le filtre marque « ${brand} »`
                      : `Remove brand filter "${brand}"`
                  }
                  placement="top"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleBrand(brand)}
                    aria-label={
                      locale === 'fr'
                        ? `Retirer le filtre marque ${brand}`
                        : `Remove ${brand} brand filter`
                    }
                    className="glass-pill-cta px-3 py-1 rounded-full text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{brand}</span>
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </ActionIconTooltip>
              ))}

              {selectedWarranties.map((months) => (
                <ActionIconTooltip
                  key={`chip-war-${months}`}
                  text={
                    locale === 'fr'
                      ? `Retirer le filtre garantie ${months} mois`
                      : `Remove ${months}-month warranty filter`
                  }
                  placement="top"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleWarranty(months)}
                    aria-label={
                      locale === 'fr'
                        ? `Retirer le filtre garantie ${months} mois`
                        : `Remove ${months}-month warranty filter`
                    }
                    className="glass-pill-black px-3 py-1 rounded-full text-[#F4BE38] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {locale === 'fr' ? 'Garantie' : 'Warranty'} {months}{' '}
                      {locale === 'fr' ? 'mois' : 'm'}
                    </span>
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </ActionIconTooltip>
              ))}

              {(appliedMinPrice !== null || appliedMaxPrice !== null) && (
                <ActionIconTooltip
                  text={
                    locale === 'fr'
                      ? 'Supprimer la limite de prix'
                      : 'Clear price range filter'
                  }
                  placement="top"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectPricePreset(null, null)}
                    aria-label={
                      locale === 'fr'
                        ? 'Effacer le filtre de prix'
                        : 'Clear price range filter'
                    }
                    className="glass-pill-gold px-3 py-1 rounded-full text-[#000000] text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer tabular-nums"
                  >
                    <span>
                      {appliedMinPrice !== null ? formatXAF(appliedMinPrice) : '0 XAF'} –{' '}
                      {appliedMaxPrice !== null ? formatXAF(appliedMaxPrice) : '∞'}
                    </span>
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </ActionIconTooltip>
              )}

              {onlyInStock && (
                <ActionIconTooltip
                  text={
                    locale === 'fr'
                      ? 'Afficher aussi les produits épuisés'
                      : 'Include out-of-stock products again'
                  }
                  placement="top"
                >
                  <button
                    type="button"
                    onClick={() => setOnlyInStock(false)}
                    aria-label={
                      locale === 'fr'
                        ? 'Retirer le filtre en stock uniquement'
                        : 'Clear in-stock only filter'
                    }
                    className="glass-pill-blue px-3 py-1 rounded-full text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{locale === 'fr' ? 'En stock' : 'In stock'}</span>
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </ActionIconTooltip>
              )}

              <button
                type="button"
                onClick={handleResetAll}
                className="glass-pill-frost ml-auto px-3 py-1 rounded-full text-xs font-bold text-[#5A5AA1] cursor-pointer"
              >
                {locale === 'fr' ? 'Tout effacer' : 'Clear all'}
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="ice-surface rounded-3xl p-10 text-center space-y-3">
              <p className="font-display text-lg font-bold text-[#000000]">
                {locale === 'fr'
                  ? 'Aucun produit trouvé dans ce rayon'
                  : 'No matching products found'}
              </p>
              <p className="text-sm text-[#3F3F56]">
                {locale === 'fr'
                  ? 'Essayez d’élargir la plage de prix, les marques ou la durée de garantie.'
                  : 'Try expanding the price range, brands, or warranty filters.'}
              </p>
              <button
                type="button"
                onClick={handleResetAll}
                className="glass-pill-cta min-h-[42px] px-6 py-2 rounded-full text-white text-sm font-bold cursor-pointer"
              >
                {locale === 'fr' ? 'Réinitialiser les filtres' : 'Reset all filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
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
        </div>
      </div>
    </div>
  );
}
