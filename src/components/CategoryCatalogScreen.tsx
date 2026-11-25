import { ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CATEGORIES_META, PRODUCTS } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { CategorySlug, Locale, Product } from '../types/store';
import { ProductCard } from './ProductCard';

interface CategoryCatalogScreenProps {
  locale: Locale;
  activeCategory: CategorySlug;
  searchQuery: string;
  wishlistIds: string[];
  recentlyAddedId: string | null;
  onSelectCategory: (slug: CategorySlug) => void;
  onClearSearch: () => void;
  onBackHome: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
}

export function CategoryCatalogScreen({
  locale,
  activeCategory,
  searchQuery,
  wishlistIds,
  recentlyAddedId,
  onSelectCategory,
  onClearSearch,
  onBackHome,
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
}: CategoryCatalogScreenProps) {
  const t = TRANSLATIONS[locale];
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');

  const activeCategoryMeta = CATEGORIES_META.find((c) => c.slug === activeCategory);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      const catOk = activeCategory === 'all' || p.category === activeCategory;
      const stockOk = !onlyInStock || p.stockQty > 0;
      const searchOk =
        q.length === 0 ||
        p.nameFr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortNoteFr.toLowerCase().includes(q);
      return catOk && stockOk && searchOk;
    });

    if (sortBy === 'price_asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price_desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [activeCategory, onlyInStock, searchQuery, sortBy]);

  const headingTitle = searchQuery.trim()
    ? `${locale === 'fr' ? 'Résultats pour' : 'Results for'} « ${searchQuery.trim()} »`
    : activeCategoryMeta
    ? locale === 'fr'
      ? activeCategoryMeta.labelFr
      : activeCategoryMeta.labelEn
    : locale === 'fr'
    ? 'Tout le catalogue Lorena Market'
    : 'All Lorena Market Products';

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5AA1] hover:underline mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.backToHome}</span>
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
            {headingTitle}
          </h1>
          <p className="text-xs text-[#6C757D] mt-1 tabular-nums">
            {filtered.length}{' '}
            {locale === 'fr' ? 'articles disponibles' : 'products found'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-[#000000] bg-white px-3 py-2 rounded-lg border border-[#E5E7EB] cursor-pointer">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="accent-[#5A5AA1]"
            />
            <span>{locale === 'fr' ? 'En stock uniquement' : 'In stock only'}</span>
          </label>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'featured' | 'price_asc' | 'price_desc')
            }
            aria-label="Trier les produits"
            className="min-h-[38px] px-3 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#000000] cursor-pointer"
          >
            <option value="featured">
              {locale === 'fr' ? 'Tri : Pertinence' : 'Sort: Featured'}
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

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#000000] text-[#F4BE38] border-[#000000]'
              : 'bg-white text-[#000000] border-[#E5E7EB] hover:border-[#5A5AA1]'
          }`}
        >
          {t.allCategories}
        </button>
        {CATEGORIES_META.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => onSelectCategory(cat.slug)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border cursor-pointer ${
              activeCategory === cat.slug
                ? 'bg-[#000000] text-[#F4BE38] border-[#000000]'
                : 'bg-white text-[#000000] border-[#E5E7EB] hover:border-[#5A5AA1]'
            }`}
          >
            {locale === 'fr' ? cat.labelFr : cat.labelEn}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-10 text-center space-y-3">
          <p className="font-display text-lg font-bold text-[#000000]">
            {locale === 'fr'
              ? 'Aucun produit trouvé dans ce rayon'
              : 'No matching products found'}
          </p>
          <p className="text-sm text-[#6C757D]">
            {locale === 'fr'
              ? 'Essayez un autre mot-clé ou affichez toutes les catégories.'
              : 'Try another search term or view all categories.'}
          </p>
          <button
            type="button"
            onClick={() => {
              onClearSearch();
              onSelectCategory('all');
              setOnlyInStock(false);
            }}
            className="min-h-[42px] px-5 py-2 rounded-lg bg-[#5A5AA1] text-white text-sm font-semibold cursor-pointer"
          >
            {locale === 'fr' ? 'Réinitialiser' : 'Reset filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              isWishlisted={wishlistIds.includes(product.id)}
              justAdded={recentlyAddedId === product.id}
              onSelectProduct={onSelectProduct}
              onQuickAdd={onQuickAdd}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
