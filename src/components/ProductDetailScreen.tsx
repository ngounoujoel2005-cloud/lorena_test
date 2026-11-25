import { ArrowLeft, Check, Heart, MapPin, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from 'lucide-react';
import { useState } from 'react';
import { LOGISTICS_REGIONS } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { Locale, Product } from '../types/store';
import { formatXAF } from '../utils/format';
import { ProductImage } from './ProductImage';

interface ProductDetailScreenProps {
  product: Product;
  locale: Locale;
  isWishlisted: boolean;
  onBackToCatalog: () => void;
  onAddToCart: (product: Product, variantId: string, quantity: number) => void;
  onBuyNow: (product: Product, variantId: string, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
}

export function ProductDetailScreen({
  product,
  locale,
  isWishlisted,
  onBackToCatalog,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
}: ProductDetailScreenProps) {
  const t = TRANSLATIONS[locale];
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [estimatorCity, setEstimatorCity] = useState('Douala');

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
  const unitPrice = product.price + selectedVariant.priceDelta;
  const isOutOfStock = product.stockQty <= 0;

  const title = locale === 'fr' ? product.nameFr : product.nameEn;
  const description = locale === 'fr' ? product.descriptionFr : product.descriptionEn;

  const cityEstimate =
    LOGISTICS_REGIONS.flatMap((r) => r.cities).find((c) => c.name === estimatorCity) ??
    LOGISTICS_REGIONS[0].cities[0];

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedVariant.id, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1600);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 pb-24 md:pb-16">
      <div className="mb-6 flex items-center gap-3 text-sm">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="min-h-[40px] inline-flex items-center gap-1.5 text-[#5A5AA1] hover:underline font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t.backToHome}</span>
        </button>
        <span className="text-[#D1D5DB]" aria-hidden="true">
          /
        </span>
        <span className="text-[#000000] font-medium truncate">{title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Gallery & Specs */}
        <div className="lg:col-span-7 lg:sticky lg:top-28 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] p-6 flex items-center justify-center">
            {product.discountPct && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded bg-[#F4BE38] text-[#000000] font-display text-xs font-extrabold">
                -{product.discountPct} %
              </span>
            )}
            <ProductImage
              src={product.image}
              alt={title}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold text-[#000000] mb-4">
              {locale === 'fr' ? 'Caractéristiques techniques' : 'Technical Specifications'}
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {product.specs.map((spec) => (
                <div key={spec.labelFr} className="py-2 border-b border-[#F3F4F6]">
                  <dt className="text-xs text-[#6C757D] uppercase tracking-wide">
                    {locale === 'fr' ? spec.labelFr : spec.labelEn}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-[#000000]">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Right Purchase Module */}
        <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-[#6C757D]">
              <span className="uppercase tracking-wider font-semibold">
                {product.brand} · {product.sku}
              </span>
              <span
                className={`font-bold ${
                  isOutOfStock ? 'text-[#9CA3AF]' : 'text-[#5A5AA1]'
                }`}
              >
                {isOutOfStock
                  ? t.outOfStock
                  : `${product.stockQty} ${
                      locale === 'fr' ? 'en stock' : 'in stock'
                    }`}
              </span>
            </div>

            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-display text-2xl font-bold text-[#000000] leading-tight">
                {title}
              </h1>
              <button
                type="button"
                aria-label="Favoris"
                onClick={() => onToggleWishlist(product.id)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 cursor-pointer ${
                  isWishlisted
                    ? 'bg-[#5A5AA1] border-[#5A5AA1] text-white'
                    : 'bg-white border-[#E5E7EB] text-[#6C757D] hover:text-[#5A5AA1]'
                }`}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isWishlisted ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-2xl font-extrabold text-[#000000] tabular-nums">
                {formatXAF(unitPrice)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-[#6C757D] line-through tabular-nums">
                  {formatXAF(product.oldPrice)}
                </span>
              )}
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded bg-[#F4BE38] text-[#000000]">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                {product.warrantyMonths} {t.warrantyMonthsLabel}
              </span>
            </div>
          </div>

          <p className="text-sm text-[#4B5563] leading-relaxed">{description}</p>

          {/* Variants */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#000000]">
              {locale === 'fr' ? 'Option / Version' : 'Select Option'}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {product.variants.map((variant) => {
                const isSelected = variant.id === selectedVariant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`min-h-[44px] px-4 py-2.5 rounded-lg border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#5A5AA1] bg-[#5A5AA1]/5 text-[#000000] font-semibold'
                        : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#A084E8]'
                    }`}
                  >
                    <span className="text-sm">
                      {locale === 'fr' ? variant.labelFr : variant.labelEn}
                    </span>
                    <span className="text-xs tabular-nums font-semibold">
                      {variant.priceDelta === 0
                        ? locale === 'fr'
                          ? 'Inclus'
                          : 'Included'
                        : `+${formatXAF(variant.priceDelta)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2 border-t border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#000000]">
                {locale === 'fr' ? 'Quantité' : 'Quantity'}
              </span>
              <div className="inline-flex items-center border border-[#E5E7EB] rounded-lg bg-[#F8F9FA]">
                <button
                  type="button"
                  aria-label="Diminuer"
                  disabled={isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 inline-flex items-center justify-center text-[#000000] hover:bg-[#E5E7EB] cursor-pointer disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="px-4 text-sm font-bold tabular-nums text-[#000000]">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Augmenter"
                  disabled={isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(product.stockQty || 1, q + 1))}
                  className="w-10 h-10 inline-flex items-center justify-center text-[#000000] hover:bg-[#E5E7EB] cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {isOutOfStock ? (
              <button
                type="button"
                disabled
                className="min-h-[48px] w-full px-5 py-3 rounded-lg bg-[#F3F4F6] text-[#9CA3AF] font-bold text-sm"
              >
                {t.outOfStock}
              </button>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`min-h-[48px] w-full px-5 py-3 rounded-lg font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    addedFeedback
                      ? 'bg-[#000000] text-[#F4BE38]'
                      : 'bg-[#5A5AA1] hover:bg-[#474789] text-white'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" aria-hidden="true" />
                      <span>{t.addedBtn}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {t.addToBag} · {formatXAF(unitPrice * quantity)}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onBuyNow(product, selectedVariant.id, quantity)}
                  className="min-h-[48px] w-full px-5 py-3 rounded-lg bg-[#000000] hover:bg-[#1f1f2e] text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  {t.buyNowMomo}
                </button>
              </div>
            )}
          </div>

          {/* Delivery Estimator */}
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#000000]">
                <MapPin className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
                <span>
                  {locale === 'fr' ? 'Livraison Cameroun' : 'Cameroon Delivery'}
                </span>
              </div>
              <select
                value={estimatorCity}
                onChange={(e) => setEstimatorCity(e.target.value)}
                aria-label="Ville"
                className="text-xs font-semibold bg-white border border-[#E5E7EB] rounded px-2.5 py-1.5 text-[#000000] cursor-pointer"
              >
                {LOGISTICS_REGIONS.flatMap((r) => r.cities).map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#4B5563]">
              <Truck className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
              <span>
                {cityEstimate.name}:{' '}
                <strong className="text-[#000000]">
                  {locale === 'fr'
                    ? cityEstimate.quarters[0]?.etaFr
                    : cityEstimate.quarters[0]?.etaEn}
                </strong>{' '}
                ({formatXAF(cityEstimate.quarters[0]?.fee ?? 1500)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
