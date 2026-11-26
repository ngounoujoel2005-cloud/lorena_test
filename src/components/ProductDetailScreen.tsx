import {
  AlertTriangle,
  ArrowLeft,
  BellRing,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Flag,
  Heart,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  RefreshCw,
  Scale,
  Share2,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  ThumbsUp,
  Truck,
  X,
  Zap,
  ZoomIn,
} from 'lucide-react';
import { FormEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { CATEGORIES_META, LOGISTICS_REGIONS, PRODUCTS } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { Locale, Product, ProductReview } from '../types/store';
import { formatXAF } from '../utils/format';
import { ActionIconTooltip } from './ActionIconTooltip';
import { ProductCarouselRow } from './ProductCarouselRow';
import { ProductFaqAccordion } from './ProductFaqAccordion';
import { ProductImage } from './ProductImage';

interface ProductDetailScreenProps {
  product: Product;
  locale: Locale;
  isWishlisted: boolean;
  wishlistIds: string[];
  compareIds?: string[];
  waitlistIds?: string[];
  waitlistEmail?: string;
  recentlyAddedId: string | null;
  reviews: ProductReview[];
  onBackToCatalog: () => void;
  onSelectCategory: (slug: Product['category']) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onAddToCart: (product: Product, variantId: string, quantity: number) => void;
  onBuyNow: (product: Product, variantId: string, quantity: number) => void;
  onOpenCartPage: () => void;
  onGoToReturnPolicy: () => void;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onNotifyMe?: (product: Product) => void;
  onAddReview: (review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => void;
  onMarkReviewHelpful: (reviewId: string) => void;
}

export function ProductDetailScreen({
  product,
  locale,
  isWishlisted,
  wishlistIds,
  compareIds = [],
  waitlistIds = [],
  waitlistEmail,
  recentlyAddedId,
  reviews,
  onBackToCatalog,
  onSelectCategory,
  onSelectProduct,
  onQuickAdd,
  onAddToCart,
  onBuyNow,
  onOpenCartPage,
  onGoToReturnPolicy,
  onToggleWishlist,
  onToggleCompare,
  onNotifyMe,
  onAddReview,
  onMarkReviewHelpful,
}: ProductDetailScreenProps) {
  const t = TRANSLATIONS[locale];
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [copiedSku, setCopiedSku] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'shared' | 'copied'>('idle');
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  const allCities = useMemo(() => LOGISTICS_REGIONS.flatMap((r) => r.cities), []);
  const [estimatorCity, setEstimatorCity] = useState(allCities[0].name);
  const activeCity =
    allCities.find((c) => c.name === estimatorCity) ?? allCities[0];
  const [estimatorQuarter, setEstimatorQuarter] = useState(
    activeCity.quarters[0].name
  );
  const activeQuarter =
    activeCity.quarters.find((q) => q.name === estimatorQuarter) ??
    activeCity.quarters[0];

  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportSent, setReportSent] = useState(false);

  const [reviewFilter, setReviewFilter] = useState<'all' | 'verified' | number>('all');
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const [whatsappTipOpen, setWhatsappTipOpen] = useState(false);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [zoomPinned, setZoomPinned] = useState(false);
  const [zoomZone, setZoomZone] = useState<{ row: number; col: number }>({
    row: 2,
    col: 2,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (shareMenuOpen) setShareMenuOpen(false);
        if (reportOpen) setReportOpen(false);
        if (whatsappTipOpen) setWhatsappTipOpen(false);
        if (zoomPinned || isZoomActive) {
          setZoomPinned(false);
          setIsZoomActive(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomActive, reportOpen, shareMenuOpen, whatsappTipOpen, zoomPinned]);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
  const unitPrice = product.price + selectedVariant.priceDelta;
  const isOutOfStock = product.stockQty <= 0;

  const title = locale === 'fr' ? product.nameFr : product.nameEn;
  const shortNote = locale === 'fr' ? product.shortNoteFr : product.shortNoteEn;
  const description = locale === 'fr' ? product.descriptionFr : product.descriptionEn;
  const categoryMeta = CATEGORIES_META.find((c) => c.slug === product.category);
  const categoryLabel = categoryMeta
    ? locale === 'fr'
      ? categoryMeta.labelFr
      : categoryMeta.labelEn
    : product.category;

  const productReviews = useMemo(
    () => reviews.filter((r) => r.productId === product.id),
    [product.id, reviews]
  );

  const avgRating = useMemo(() => {
    if (productReviews.length === 0) return 0;
    const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
    return Number((total / productReviews.length).toFixed(1));
  }, [productReviews]);

  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'all') return productReviews;
    if (reviewFilter === 'verified') return productReviews.filter((r) => r.verified);
    return productReviews.filter((r) => r.rating === reviewFilter);
  }, [productReviews, reviewFilter]);

  const relatedProducts = useMemo(() => {
    const sameCat = PRODUCTS.filter(
      (p) => p.id !== product.id && p.category === product.category
    );
    const others = PRODUCTS.filter(
      (p) => p.id !== product.id && p.category !== product.category
    );
    return [...sameCat, ...others].slice(0, 8);
  }, [product.category, product.id]);

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedVariant.id, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1600);
  };

  const handleCopySku = () => {
    navigator.clipboard?.writeText(product.sku).catch(() => {});
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 1800);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const selectedVariantLabel =
    locale === 'fr' ? selectedVariant.labelFr : selectedVariant.labelEn;
  const shareText =
    locale === 'fr'
      ? `${title} (${product.brand} · ${selectedVariantLabel}) à ${formatXAF(
          unitPrice
        )} sur Lorena Market — ${shortNote}`
      : `${title} (${product.brand} · ${selectedVariantLabel}) for ${formatXAF(
          unitPrice
        )} on Lorena Market — ${shortNote}`;

  const copyShareDetails = async () => {
    try {
      await navigator.clipboard?.writeText(`${shareText}\n${shareUrl}`);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2200);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${title} | Lorena Market`,
          text: shareText,
          url: shareUrl,
        });
        setShareStatus('shared');
        setShareMenuOpen(false);
        setTimeout(() => setShareStatus('idle'), 2200);
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        // Fall through to clipboard + social/messaging share panel if blocked or unsupported
      }
    }

    await copyShareDetails();
    setShareMenuOpen((prev) => !prev);
  };

  const handleSubmitReport = (e: FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setReportSent(true);
    setReportText('');
    setTimeout(() => {
      setReportSent(false);
      setReportOpen(false);
    }, 2200);
  };

  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    if (reviewAuthor.trim().length < 2 || reviewComment.trim().length < 5) return;
    onAddReview({
      productId: product.id,
      author: reviewAuthor.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      verified: true,
    });
    setReviewAuthor('');
    setReviewComment('');
    setReviewRating(5);
    setReviewFormOpen(false);
  };

  const ZOOM_ORIGINS = [
    ['origin-[10%_10%]', 'origin-[30%_10%]', 'origin-[50%_10%]', 'origin-[70%_10%]', 'origin-[90%_10%]'],
    ['origin-[10%_30%]', 'origin-[30%_30%]', 'origin-[50%_30%]', 'origin-[70%_30%]', 'origin-[90%_30%]'],
    ['origin-[10%_50%]', 'origin-[30%_50%]', 'origin-[50%_50%]', 'origin-[70%_50%]', 'origin-[90%_50%]'],
    ['origin-[10%_70%]', 'origin-[30%_70%]', 'origin-[50%_70%]', 'origin-[70%_70%]', 'origin-[90%_70%]'],
    ['origin-[10%_90%]', 'origin-[30%_90%]', 'origin-[50%_90%]', 'origin-[70%_90%]', 'origin-[90%_90%]'],
  ];

  const handleGalleryMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    const col = Math.min(4, Math.max(0, Math.floor(rx * 5)));
    const row = Math.min(4, Math.max(0, Math.floor(ry * 5)));
    setZoomZone((prev) =>
      prev.row === row && prev.col === col ? prev : { row, col }
    );
  };

  const zoomed = isZoomActive || zoomPinned;

  const galleryFrames = [
    { labelFr: 'Vue principale', transform: '' },
    { labelFr: 'Vue zoom', transform: 'scale-110' },
    { labelFr: 'Détail angle', transform: 'scale-105 -rotate-2' },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-6 pb-28 space-y-10">
      {/* Breadcrumb Encased in Frosted Ice */}
      <nav
        aria-label={locale === 'fr' ? 'Fil d’Ariane' : 'Breadcrumb'}
        className="ice-surface rounded-full px-4 py-2 w-fit flex flex-wrap items-center gap-2 text-xs text-[#3F3F56]"
      >
        <ActionIconTooltip
          text={
            locale === 'fr'
              ? 'Retourner à l’accueil et au catalogue'
              : 'Return to homepage and catalog'
          }
          placement="bottom"
        >
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1 font-bold text-[#5A5AA1] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{locale === 'fr' ? 'Accueil' : 'Home'}</span>
          </button>
        </ActionIconTooltip>
        <span aria-hidden="true">&gt;</span>
        <button
          type="button"
          onClick={() => onSelectCategory(product.category)}
          className="font-medium hover:text-[#5A5AA1] cursor-pointer"
        >
          {categoryLabel}
        </button>
        <span aria-hidden="true">&gt;</span>
        <span className="text-[#000000] font-bold truncate max-w-md">{title}</span>
      </nav>

      {/* Top 3-Column Section (Gallery | Purchase Core | Delivery Card) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column 1: Gallery + Thumbnails + Report Link */}
        <div className="lg:col-span-4 space-y-3">
          <div
            onMouseEnter={() => setIsZoomActive(true)}
            onMouseLeave={() => {
              setIsZoomActive(false);
              setZoomPinned(false);
            }}
            onMouseMove={handleGalleryMouseMove}
            onClick={() => setZoomPinned((p) => !p)}
            role="button"
            tabIndex={0}
            aria-pressed={zoomPinned}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setZoomPinned((p) => !p);
              }
            }}
            aria-label={
              locale === 'fr'
                ? 'Inspecter le produit en zoom'
                : 'Inspect product zoom'
            }
            className={`ice-product-trap group relative aspect-square w-full rounded-3xl p-6 flex items-center justify-center transition-all select-none ${
              zoomed
                ? 'border-[#5A5AA1] cursor-zoom-out ring-2 ring-[#5A5AA1]/35'
                : 'hover:border-[#A084E8] cursor-zoom-in'
            }`}
          >
            {product.discountPct && (
              <span className="glass-pill-gold absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-full text-[#000000] font-display text-xs font-extrabold pointer-events-none">
                -{product.discountPct} %
              </span>
            )}
            <span
              className={`absolute bottom-3 right-3 z-10 px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 pointer-events-none transition-colors ${
                zoomed
                  ? 'glass-pill-cta text-white'
                  : 'glass-pill-black text-white'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#F4BE38]" aria-hidden="true" />
              <span>
                {zoomed
                  ? 'Zoom 2.2×'
                  : locale === 'fr'
                  ? 'Survolez pour zoomer'
                  : 'Hover to zoom'}
              </span>
            </span>
            <div
              className={`w-full h-full flex items-center justify-center transition-transform duration-150 ease-out will-change-transform ${
                ZOOM_ORIGINS[zoomZone.row][zoomZone.col]
              } ${zoomed ? 'scale-[2.2]' : 'scale-100'}`}
            >
              <ActionIconTooltip
                className="w-full h-full flex items-center justify-center"
                text={
                  locale === 'fr'
                    ? 'Illustration haute précision — déplacez le curseur pour inspecter les détails en zoom 2.2×'
                    : 'High-detail product illustration — move cursor to inspect details at 2.2× zoom'
                }
              >
                <ProductImage
                  src={product.image}
                  alt={title}
                  className={`w-full h-full object-contain transition-transform duration-200 ${galleryFrames[activeThumbIndex].transform}`}
                />
              </ActionIconTooltip>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {galleryFrames.map((frame, idx) => (
              <ActionIconTooltip
                key={frame.labelFr}
                className="w-full"
                text={
                  locale === 'fr'
                    ? `Angle d’illustration : ${frame.labelFr} — cliquez pour afficher`
                    : `Illustration angle: ${
                        idx === 0
                          ? 'Front view'
                          : idx === 1
                          ? 'Studio angle'
                          : 'Close-up detail'
                      } — click to preview`
                }
              >
                <button
                  type="button"
                  onClick={() => setActiveThumbIndex(idx)}
                  aria-pressed={activeThumbIndex === idx}
                  aria-label={
                    locale === 'fr'
                      ? `${title} — ${frame.labelFr}`
                      : `${title} — ${
                          idx === 0
                            ? 'Front view'
                            : idx === 1
                            ? 'Studio angle'
                            : 'Close-up detail'
                        }`
                  }
                  className={`ice-product-trap w-full aspect-square rounded-2xl p-2 cursor-pointer transition-all ${
                    activeThumbIndex === idx
                      ? 'border-[#5A5AA1] ring-2 ring-[#5A5AA1]/35'
                      : 'hover:border-[#A084E8]'
                  }`}
                >
                  <ProductImage
                    src={product.image}
                    alt={`${title} - ${frame.labelFr}`}
                    className={`w-full h-full object-contain ${frame.transform}`}
                  />
                </button>
              </ActionIconTooltip>
            ))}
          </div>

          <ActionIconTooltip
            text={
              locale === 'fr'
                ? 'Signaler une erreur sur le prix, la photo ou la fiche'
                : 'Report an issue with price, image, or specs'
            }
            placement="top"
          >
            <button
              type="button"
              aria-expanded={reportOpen}
              aria-controls="product-report-form"
              onClick={() => setReportOpen((o) => !o)}
              className="glass-pill-frost px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs font-bold text-[#ba1a1a] cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {locale === 'fr'
                  ? 'Signaler des informations incorrectes'
                  : 'Report incorrect product details'}
              </span>
            </button>
          </ActionIconTooltip>

          {reportOpen && (
            <form
              id="product-report-form"
              onSubmit={handleSubmitReport}
              className="ice-surface p-4 rounded-2xl space-y-2.5"
            >
              <textarea
                rows={2}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                aria-label={
                  locale === 'fr'
                    ? 'Préciser l’erreur constatée sur le produit'
                    : 'Describe the incorrect product details'
                }
                placeholder={
                  locale === 'fr'
                    ? 'Précisez l’erreur constatée (prix, photo, fiche technique)...'
                    : 'Describe the issue (price, photo, specs)...'
                }
                className="glass-input-recessed w-full p-2.5 rounded-xl text-xs text-[#000000] focus:outline-none"
              />
              <div className="flex items-center justify-between gap-2">
                {reportSent ? (
                  <span role="status" className="text-[11px] font-bold text-[#5A5AA1]">
                    {locale === 'fr'
                      ? 'Merci, signalement envoyé !'
                      : 'Thank you, report submitted!'}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#3F3F56]">
                    {locale === 'fr' ? 'Réponse rapide' : 'Reviewed promptly'}
                  </span>
                )}
                <button
                  type="submit"
                  className="glass-pill-black px-3.5 py-1.5 rounded-full text-white text-xs font-bold cursor-pointer"
                >
                  {locale === 'fr' ? 'Envoyer' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Column 2: Main Product Info & CTAs */}
        <div className="ice-surface lg:col-span-5 rounded-3xl p-6 space-y-5">
          <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#000000] leading-snug min-w-0">
              {title}
            </h1>
            <div className="flex items-center gap-1.5 shrink-0">
              {onToggleCompare && (
                <ActionIconTooltip
                  text={
                    compareIds.includes(product.id)
                      ? locale === 'fr'
                        ? 'Sélectionné pour comparer — cliquez pour retirer'
                        : 'Selected to compare — click to remove'
                      : locale === 'fr'
                      ? 'Sélectionner pour comparer les produits'
                      : 'Select to compare products'
                  }
                  placement="bottom"
                >
                  <button
                    type="button"
                    aria-pressed={compareIds.includes(product.id)}
                    aria-label={
                      compareIds.includes(product.id)
                        ? locale === 'fr'
                          ? `Retirer ${title} du comparatif`
                          : `Remove ${title} from comparison`
                        : locale === 'fr'
                        ? `Comparer ${title}`
                        : `Compare ${title}`
                    }
                    onClick={() => onToggleCompare(product.id)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                      compareIds.includes(product.id)
                        ? 'glass-pill-gold text-[#000000]'
                        : 'glass-pill-frost text-[#3F3F56] hover:text-[#5A5AA1]'
                    }`}
                  >
                    <Scale className="w-4 h-4" aria-hidden="true" />
                  </button>
                </ActionIconTooltip>
              )}
              <ActionIconTooltip
                text={
                  isWishlisted
                    ? locale === 'fr'
                      ? 'Produit liké — cliquez pour retirer des favoris'
                      : 'Liked — click to remove from wishlist'
                    : locale === 'fr'
                    ? 'Cliquez pour liker si ce produit vous plaît'
                    : 'Click to like if you love this product'
                }
                placement="bottom"
              >
                <button
                  type="button"
                  aria-pressed={isWishlisted}
                  aria-label={
                    isWishlisted
                      ? locale === 'fr'
                        ? `Retirer ${title} des favoris`
                        : `Remove ${title} from wishlist`
                      : locale === 'fr'
                      ? `Ajouter ${title} aux favoris`
                      : `Add ${title} to wishlist`
                  }
                  onClick={() => onToggleWishlist(product.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
                    isWishlisted
                      ? 'glass-pill-cta text-white'
                      : 'glass-pill-frost text-[#3F3F56] hover:text-[#5A5AA1]'
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={isWishlisted ? 'currentColor' : 'none'}
                    aria-hidden="true"
                  />
                </button>
              </ActionIconTooltip>
              <ActionIconTooltip
                text={
                  shareStatus === 'shared'
                    ? locale === 'fr'
                      ? 'Produit partagé !'
                      : 'Product shared!'
                    : shareStatus === 'copied'
                    ? locale === 'fr'
                      ? 'Détails et lien copiés !'
                      : 'Details & link copied!'
                    : locale === 'fr'
                    ? 'Partager ce produit via vos applications ou réseaux sociaux'
                    : 'Share this product via social platforms or messaging apps'
                }
                placement="left"
              >
                <button
                  type="button"
                  aria-expanded={shareMenuOpen}
                  aria-controls="product-share-menu"
                  aria-label={locale === 'fr' ? 'Partager ce produit' : 'Share this product'}
                  onClick={() => void handleShare()}
                  className={`min-h-[36px] px-3 rounded-full inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer whitespace-nowrap transition-all ${
                    shareStatus !== 'idle' || shareMenuOpen
                      ? 'glass-pill-gold text-[#000000]'
                      : 'glass-pill-frost text-[#3F3F56] hover:text-[#5A5AA1]'
                  }`}
                >
                  {shareStatus !== 'idle' ? (
                    <Check className="w-3.5 h-3.5 text-[#000000]" aria-hidden="true" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>
                    {shareStatus === 'shared'
                      ? locale === 'fr'
                        ? 'Partagé !'
                        : 'Shared!'
                      : shareStatus === 'copied'
                      ? locale === 'fr'
                        ? 'Copié !'
                        : 'Copied!'
                      : locale === 'fr'
                      ? 'Partager'
                      : 'Share'}
                  </span>
                </button>
              </ActionIconTooltip>
            </div>
          </div>

          {shareMenuOpen && (
            <div
              id="product-share-menu"
              className="ice-surface-subtle rounded-2xl p-3.5 space-y-2.5 border border-white/85"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#5A5AA1]">
                  {locale === 'fr'
                    ? 'Partager ce produit sur'
                    : 'Share this product via'}
                </p>
                <button
                  type="button"
                  aria-label={locale === 'fr' ? 'Fermer' : 'Close'}
                  onClick={() => setShareMenuOpen(false)}
                  className="w-6 h-6 rounded-full glass-pill-frost flex items-center justify-center text-[#3F3F56] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${shareText} ${shareUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-pill-frost px-3 py-1.5 rounded-full text-xs font-bold text-[#000000] inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#16A34A]" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    shareUrl
                  )}&text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-pill-frost px-3 py-1.5 rounded-full text-xs font-bold text-[#000000] inline-flex items-center gap-1.5"
                >
                  <span>Telegram</span>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-pill-frost px-3 py-1.5 rounded-full text-xs font-bold text-[#000000] inline-flex items-center gap-1.5"
                >
                  <span>Facebook</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    shareText
                  )}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-pill-frost px-3 py-1.5 rounded-full text-xs font-bold text-[#000000] inline-flex items-center gap-1.5"
                >
                  <span>X / Twitter</span>
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    `${title} — Lorena Market`
                  )}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`}
                  className="glass-pill-frost px-3 py-1.5 rounded-full text-xs font-bold text-[#000000] inline-flex items-center gap-1.5"
                >
                  <span>Email</span>
                </a>
                <button
                  type="button"
                  onClick={() => void copyShareDetails()}
                  className="glass-pill-cta px-3 py-1.5 rounded-full text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {locale === 'fr' ? 'Copier le lien' : 'Copy link'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Category + Stars Summary */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#3F3F56]">
            <button
              type="button"
              onClick={() => onSelectCategory(product.category)}
              className="font-bold text-[#5A5AA1] hover:underline cursor-pointer"
            >
              {categoryLabel}
            </button>
            <span>·</span>
            <div className="flex items-center gap-0.5 text-[#F4BE38]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-3.5 h-3.5"
                  fill={star <= Math.round(avgRating) ? '#F4BE38' : 'none'}
                  stroke="#F4BE38"
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="font-bold text-[#000000] tabular-nums">
              {avgRating.toFixed(1)}
            </span>
            <span>
              ({productReviews.length} {locale === 'fr' ? 'avis' : 'reviews'})
            </span>
          </div>

          {/* Price Block */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#000000] tabular-nums">
              {formatXAF(unitPrice)}
            </span>
            {product.discountPct && (
              <span className="glass-pill-gold px-2.5 py-0.5 rounded-full text-[#000000] font-display text-xs font-extrabold">
                -{product.discountPct}%
              </span>
            )}
            {product.oldPrice && (
              <span className="text-sm text-[#3F3F56] line-through tabular-nums">
                {formatXAF(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Variant Option Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#3F3F56]">
                {locale === 'fr' ? 'Option / Version' : 'Select Option'}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => {
                  const isSelected = variant.id === selectedVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer ${
                        isSelected
                          ? 'glass-pill-cta text-white'
                          : 'glass-pill-frost text-[#000000]'
                      }`}
                    >
                      {locale === 'fr' ? variant.labelFr : variant.labelEn}
                      {variant.priceDelta > 0
                        ? ` (+${formatXAF(variant.priceDelta)})`
                        : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity + Dual CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3F3F56]">
                {locale === 'fr' ? 'Quantité' : 'Quantity'}
              </span>
              <div className="glass-input-recessed inline-flex items-center rounded-full">
                <ActionIconTooltip
                  text={locale === 'fr' ? 'Réduire la quantité' : 'Decrease quantity'}
                  placement="top"
                >
                  <button
                    type="button"
                    aria-label={
                      locale === 'fr'
                        ? `Diminuer la quantité de ${title}`
                        : `Decrease quantity of ${title}`
                    }
                    disabled={isOutOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-l-full inline-flex items-center justify-center text-[#000000] hover:bg-white/60 cursor-pointer disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </ActionIconTooltip>
                <span className="px-4 text-sm font-bold tabular-nums text-[#000000]">
                  {quantity}
                </span>
                <ActionIconTooltip
                  text={locale === 'fr' ? 'Augmenter la quantité' : 'Increase quantity'}
                  placement="top"
                >
                  <button
                    type="button"
                    aria-label={
                      locale === 'fr'
                        ? `Augmenter la quantité de ${title}`
                        : `Increase quantity of ${title}`
                    }
                    disabled={isOutOfStock}
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stockQty || 1, q + 1))
                    }
                    className="glass-pill-cta w-9 h-9 inline-flex items-center justify-center text-white rounded-full cursor-pointer disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </ActionIconTooltip>
              </div>
            </div>

            {isOutOfStock ? (
              <div className="space-y-2.5">
                <div className="ice-surface-subtle w-full px-4 py-2 rounded-full text-center text-[#ba1a1a] font-bold text-xs uppercase tracking-wide">
                  {t.outOfStock}
                </div>
                <ActionIconTooltip
                  className="w-full"
                  text={
                    waitlistIds.includes(product.id)
                      ? locale === 'fr'
                        ? 'Vous êtes sur la liste d’attente — cliquez pour gérer ou simuler l’alerte'
                        : 'You are on the waitlist — click to manage or simulate restock alert'
                      : locale === 'fr'
                      ? 'Saisir votre e-mail pour recevoir une alerte dès le retour en stock'
                      : 'Enter your email to get notified when this product is restocked'
                  }
                >
                  <button
                    type="button"
                    onClick={() => onNotifyMe?.(product)}
                    className={`w-full min-h-[46px] px-5 py-3 rounded-full font-display font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer ${
                      waitlistIds.includes(product.id)
                        ? 'glass-pill-black text-[#F4BE38]'
                        : 'glass-pill-gold text-[#000000]'
                    }`}
                  >
                    {waitlistIds.includes(product.id) ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {locale === 'fr'
                            ? `Liste d’attente active (${waitlistEmail || ''})`
                            : `On Waitlist (${waitlistEmail || ''})`}
                        </span>
                      </>
                    ) : (
                      <>
                        <BellRing className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {locale === 'fr'
                            ? 'Me prévenir dès le retour en stock'
                            : 'Notify Me When Restocked'}
                        </span>
                      </>
                    )}
                  </button>
                </ActionIconTooltip>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <ActionIconTooltip
                  text={
                    locale === 'fr'
                      ? 'Ajouter cet article à votre panier'
                      : 'Add this item to your cart'
                  }
                  placement="top"
                  className="w-full"
                >
                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`w-full min-h-[46px] px-4 py-2.5 rounded-full font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer ${
                      addedFeedback
                        ? 'glass-pill-black text-[#F4BE38]'
                        : 'glass-pill-frost text-[#000000]'
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
                        <span>{t.addToBag}</span>
                      </>
                    )}
                  </button>
                </ActionIconTooltip>

                <button
                  type="button"
                  onClick={() => onBuyNow(product, selectedVariant.id, quantity)}
                  className="glass-pill-cta min-h-[46px] px-4 py-2.5 rounded-full text-white font-display font-bold text-sm cursor-pointer"
                >
                  {locale === 'fr' ? 'Acheter' : 'Buy Now'}
                </button>
              </div>
            )}

            {/* WhatsApp Order Helper Card */}
            <div className="ice-surface-subtle rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <ActionIconTooltip
                    text={
                      locale === 'fr'
                        ? 'Assistance WhatsApp pour commander rapidement'
                        : 'WhatsApp ordering assistance'
                    }
                    placement="right"
                    focusable
                  >
                    <span className="glass-pill-black w-9 h-9 rounded-full text-[#F4BE38] flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </ActionIconTooltip>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#000000]">
                      {locale === 'fr'
                        ? 'Commander sur WhatsApp'
                        : 'Order via WhatsApp'}
                    </p>
                    <p className="text-[11px] text-[#3F3F56] truncate">
                      {locale === 'fr'
                        ? 'Un conseiller vous aide à finaliser · COD'
                        : 'Live advisor assists checkout · COD'}
                    </p>
                  </div>
                </div>
                <ActionIconTooltip
                  text={
                    locale === 'fr'
                      ? 'Afficher la référence SKU et le numéro WhatsApp'
                      : 'Show SKU reference and WhatsApp number'
                  }
                  placement="left"
                >
                  <button
                    type="button"
                    aria-expanded={whatsappTipOpen}
                    aria-controls="product-whatsapp-tip"
                    onClick={() => setWhatsappTipOpen((o) => !o)}
                    className="glass-pill-cta px-3.5 py-1.5 rounded-full text-white text-xs font-bold shrink-0 cursor-pointer"
                  >
                    {locale === 'fr' ? 'Contacter' : 'Contact'}
                  </button>
                </ActionIconTooltip>
              </div>

              {whatsappTipOpen && (
                <p
                  id="product-whatsapp-tip"
                  className="text-[11px] text-[#000000] pt-2 border-t border-white/75"
                >
                  {locale === 'fr'
                    ? `Référence à indiquer au +237 693 71 25 25 : « ${product.sku} (${quantity}x) »`
                    : `Share SKU "${product.sku} (${quantity}x)" on WhatsApp +237 693 71 25 25.`}
                </p>
              )}
            </div>

            {/* Availability Status */}
            <div className="flex items-center gap-2 text-xs font-medium">
              {isOutOfStock ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" aria-hidden="true" />
                  <span className="text-[#ba1a1a] font-semibold">
                    {t.outOfStock}
                  </span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
                  <span className="text-[#000000] font-semibold">
                    {locale === 'fr'
                      ? 'En stock · expédition rapide'
                      : 'In stock · fast dispatch'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Petite description */}
          <div className="pt-3 border-t border-white/75 space-y-1.5 text-xs">
            <h2 className="font-bold text-[#000000]">
              {locale === 'fr' ? 'Petite description' : 'Quick Overview'}
            </h2>
            <p className="text-[#3F3F56] leading-relaxed">{shortNote}</p>
            <p className="text-[#3F3F56]">
              • {locale === 'fr' ? 'Marque' : 'Brand'} :{' '}
              <strong className="text-[#000000]">{product.brand}</strong>
            </p>
          </div>

          {/* 5 Trust Badges Row */}
          <div className="pt-3 border-t border-white/75 grid grid-cols-5 gap-2 text-center">
            {[
              {
                icon: Zap,
                labelFr: 'Lorena Prime',
                labelEn: 'Lorena Prime',
                tipFr: 'Expédition prioritaire le jour même',
                tipEn: 'Priority same-day dispatch',
              },
              {
                icon: ShieldCheck,
                labelFr: 'Lorena Pay',
                labelEn: 'Lorena Pay',
                tipFr: 'Paiement MTN & Orange Money protégé',
                tipEn: 'Protected MTN & Orange Money checkout',
              },
              {
                icon: Truck,
                labelFr: 'Livraison Rapide',
                labelEn: 'Fast Delivery',
                tipFr: 'Livraison suivie partout au Cameroun',
                tipEn: 'Tracked delivery across Cameroon',
              },
              {
                icon: ShieldCheck,
                labelFr: 'Paiement Sécurisé',
                labelEn: 'Secure Pay',
                tipFr: 'Transactions chiffrées et vérifiées',
                tipEn: 'Encrypted and verified checkout',
              },
              {
                icon: RefreshCw,
                labelFr: 'SAV Certifié',
                labelEn: 'After-Sales',
                tipFr: 'Service après-vente et retours garantis',
                tipEn: 'Certified after-sales and return support',
              },
            ].map((badge) => (
              <ActionIconTooltip
                key={badge.labelFr}
                text={locale === 'fr' ? badge.tipFr : badge.tipEn}
                placement="top"
                focusable
                className="w-full"
              >
                <div className="ice-surface-subtle w-full flex flex-col items-center gap-1 p-1.5 rounded-2xl">
                  <badge.icon className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
                  <span className="text-[10px] font-semibold text-[#000000] leading-tight">
                    {locale === 'fr' ? badge.labelFr : badge.labelEn}
                  </span>
                </div>
              </ActionIconTooltip>
            ))}
          </div>
        </div>

        {/* Column 3: Delivery Calculator & Return Policy */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="ice-surface rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#000000]">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Calculez les frais et délais selon votre quartier'
                    : 'Estimate delivery fees and timing for your area'
                }
                placement="right"
                focusable
              >
                <MapPin className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
              </ActionIconTooltip>
              <span>
                {locale === 'fr'
                  ? 'OÙ SOUHAITEZ-VOUS ÊTRE LIVRÉ ?'
                  : 'WHERE SHOULD WE DELIVER?'}
              </span>
            </div>

            <div className="space-y-2.5">
              <select
                value={activeCity.name}
                onChange={(e) => {
                  const newCity =
                    allCities.find((c) => c.name === e.target.value) ??
                    allCities[0];
                  setEstimatorCity(newCity.name);
                  setEstimatorQuarter(newCity.quarters[0].name);
                }}
                aria-label={locale === 'fr' ? 'Ville de livraison' : 'Delivery city'}
                className="glass-input-recessed min-h-[40px] w-full px-3.5 rounded-full text-xs font-bold text-[#000000] cursor-pointer focus:outline-none"
              >
                {allCities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={activeQuarter.name}
                onChange={(e) => setEstimatorQuarter(e.target.value)}
                aria-label={locale === 'fr' ? 'Quartier de livraison' : 'Delivery quarter'}
                className="glass-input-recessed min-h-[40px] w-full px-3.5 rounded-full text-xs font-bold text-[#000000] cursor-pointer focus:outline-none"
              >
                {activeCity.quarters.map((q) => (
                  <option key={q.name} value={q.name}>
                    {q.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="ice-surface-subtle p-3 rounded-2xl space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[#3F3F56]">
                  <ActionIconTooltip
                    text={
                      locale === 'fr'
                        ? 'Tarif de livraison calculé pour ce quartier'
                        : 'Estimated shipping rate for this area'
                    }
                    placement="left"
                    focusable
                  >
                    <Truck className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
                  </ActionIconTooltip>
                  <span>{locale === 'fr' ? 'Coût :' : 'Fee:'}</span>
                </span>
                <span className="font-display font-extrabold text-[#5A5AA1] tabular-nums">
                  {formatXAF(activeQuarter.fee)}
                </span>
              </div>
              <p className="text-[11px] text-[#3F3F56]">
                {locale === 'fr' ? 'Délai estimé :' : 'ETA:'}{' '}
                <strong className="text-[#000000]">
                  {locale === 'fr' ? activeQuarter.etaFr : activeQuarter.etaEn}
                </strong>
              </p>
            </div>

            <div className="pt-3 border-t border-white/75 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#000000]">
                <ActionIconTooltip
                  text={
                    locale === 'fr'
                      ? 'Consultez les conditions de retour et échange'
                      : 'View product return and exchange conditions'
                  }
                  placement="left"
                  focusable
                >
                  <RefreshCw className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
                </ActionIconTooltip>
                <span>
                  {locale === 'fr' ? 'POLITIQUE DE RETOUR' : 'RETURN POLICY'}
                </span>
              </div>
              <button
                type="button"
                onClick={onGoToReturnPolicy}
                className="glass-pill-frost px-3 py-1 rounded-full text-xs font-bold text-[#000000] cursor-pointer"
              >
                {locale === 'fr' ? 'Tout lire' : 'Read policy'}
              </button>
            </div>

            <div className="pt-3 border-t border-white/75 flex items-center justify-between gap-2 text-xs">
              <span className="text-[#3F3F56]">SKU :</span>
              <ActionIconTooltip
                text={
                  copiedSku
                    ? locale === 'fr'
                      ? 'Référence copiée !'
                      : 'SKU copied!'
                    : locale === 'fr'
                    ? 'Cliquer pour copier la référence SKU'
                    : 'Click to copy product SKU'
                }
                placement="left"
              >
                <button
                  type="button"
                  onClick={handleCopySku}
                  className="inline-flex items-center gap-1.5 font-mono font-bold text-[#000000] hover:text-[#5A5AA1] cursor-pointer"
                >
                  <span>{product.sku}</span>
                  {copiedSku ? (
                    <Check className="w-3.5 h-3.5 text-[#5A5AA1]" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#3F3F56]" aria-hidden="true" />
                  )}
                </button>
              </ActionIconTooltip>
            </div>
          </div>

          <div className="ice-obsidian p-4 rounded-3xl text-white space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-[#F4BE38] font-bold">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Garantie officielle Lorena vérifiable en ligne'
                    : 'Official Lorena warranty verifiable online'
                }
                placement="top"
                focusable
              >
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </ActionIconTooltip>
              <span>
                {product.warrantyMonths} {t.warrantyMonthsLabel}
              </span>
            </div>
            <p className="text-white/80 leading-relaxed">
              {locale === 'fr'
                ? 'Garantie vérifiable en ligne via votre numéro de série Lorena Market.'
                : 'Warranty verifiable online using your Lorena Market certificate number.'}
            </p>
          </div>
        </aside>
      </section>

      {/* Caractéristiques Table */}
      <section className="ice-surface rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/75">
          <h2 className="font-display text-lg font-bold text-[#000000]">
            {locale === 'fr' ? 'Caractéristiques' : 'Key Specifications'}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="ice-obsidian text-white">
                <th className="px-5 py-3 font-semibold">
                  {locale === 'fr' ? 'Marque' : 'Brand'}
                </th>
                <th className="px-5 py-3 font-semibold">
                  {locale === 'fr' ? 'Référence' : 'SKU'}
                </th>
                <th className="px-5 py-3 font-semibold">
                  {locale === 'fr' ? 'Catégorie' : 'Category'}
                </th>
                <th className="px-5 py-3 font-semibold">
                  {locale === 'fr' ? 'Garantie' : 'Warranty'}
                </th>
                <th className="px-5 py-3 font-semibold">
                  {locale === 'fr' ? 'Stockage' : 'Stock'}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/75 text-[#000000] font-semibold">
                <td className="px-5 py-3.5">{product.brand}</td>
                <td className="px-5 py-3.5 font-mono">{product.sku}</td>
                <td className="px-5 py-3.5">{categoryLabel}</td>
                <td className="px-5 py-3.5">
                  {product.warrantyMonths} {locale === 'fr' ? 'mois' : 'months'}
                </td>
                <td className="px-5 py-3.5">
                  {product.stockQty > 0
                    ? `(${product.stockQty}) ${locale === 'fr' ? 'articles en stock' : 'items in stock'}`
                    : t.outOfStock}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ice-surface-subtle px-6 py-3 text-xs text-[#3F3F56] font-medium">
          {title} — {shortNote}
        </div>
      </section>

      {/* Collapsible Détail du produit + Plus d'information */}
      <section className="ice-surface rounded-3xl">
        <button
          type="button"
          aria-expanded={detailsExpanded}
          aria-controls="product-details-panel"
          onClick={() => setDetailsExpanded((e) => !e)}
          className="w-full px-6 py-4 flex items-center justify-between text-left border-b border-white/75 hover:bg-white/40 rounded-t-3xl cursor-pointer"
        >
          <span className="font-display text-lg font-bold text-[#000000]">
            {locale === 'fr' ? 'Détail du produit' : 'Product Details'}
          </span>
          <ActionIconTooltip
            text={
              detailsExpanded
                ? locale === 'fr'
                  ? 'Replier la fiche technique'
                  : 'Collapse technical sheet'
                : locale === 'fr'
                ? 'Déplier la fiche technique'
                : 'Expand technical sheet'
            }
            placement="left"
          >
            {detailsExpanded ? (
              <ChevronUp className="w-5 h-5 text-[#5A5AA1]" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#5A5AA1]" aria-hidden="true" />
            )}
          </ActionIconTooltip>
        </button>

        {detailsExpanded && (
          <div id="product-details-panel" className="p-6 space-y-6">
            <div className="space-y-3">
              <h3 className="font-display text-base font-bold text-[#000000]">
                {title}
              </h3>
              <p className="text-sm text-[#3F3F56] leading-relaxed">
                {description}
              </p>
            </div>

            {product.specs.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#000000]">
                  {locale === 'fr' ? "Plus d'information" : 'Technical Sheet'}
                </h4>
                <div className="rounded-2xl border border-white/80 overflow-hidden">
                  {product.specs.map((spec, idx) => (
                    <div
                      key={spec.labelFr}
                      className={`px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm ${
                        idx % 2 === 0 ? 'ice-surface-subtle' : 'bg-white/50'
                      }`}
                    >
                      <span className="font-semibold text-[#3F3F56]">
                        {locale === 'fr' ? spec.labelFr : spec.labelEn}
                      </span>
                      <span className="sm:col-span-2 font-semibold text-[#000000]">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Product-Specific Frequently Asked Questions Accordion */}
      <ProductFaqAccordion product={product} locale={locale} />

      {/* Customer Reviews Section */}
      <section className="ice-surface rounded-3xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-6 border-b border-white/75">
          {/* Overall Score */}
          <div className="md:col-span-3 text-center md:text-left">
            <h2 className="font-display text-base font-bold text-[#000000]">
              {locale === 'fr' ? 'Avis des internautes' : 'Customer Reviews'}
            </h2>
            <div className="mt-2 flex items-baseline justify-center md:justify-start gap-1">
              <span className="font-display text-4xl font-extrabold text-[#000000] tabular-nums">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-[#3F3F56]">/5</span>
            </div>
            <p className="text-xs text-[#3F3F56] mt-1">
              {productReviews.length === 0
                ? locale === 'fr'
                  ? '(Aucun avis)'
                  : '(No reviews yet)'
                : `${productReviews.length} ${locale === 'fr' ? 'avis clients' : 'reviews'}`}
            </p>
          </div>

          {/* 5-Star Breakdown Bars */}
          <div className="md:col-span-6 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = productReviews.filter((r) => r.rating === star).length;
              const pct =
                productReviews.length > 0
                  ? Math.round((count / productReviews.length) * 100)
                  : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 w-8 font-bold text-[#000000] shrink-0">
                    <Star className="w-3.5 h-3.5 fill-[#F4BE38] stroke-[#F4BE38]" />
                    <span>{star}</span>
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-white/70 border border-white/90 overflow-hidden">
                    <div
                      className="h-full bg-[#F4BE38] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[#3F3F56] tabular-nums">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Write Review Button */}
          <div className="md:col-span-3 text-center space-y-2">
            <h3 className="font-display text-sm font-bold text-[#000000]">
              {locale === 'fr' ? 'Évaluer ce produit' : 'Rate this product'}
            </h3>
            <p className="text-xs text-[#3F3F56]">
              {locale === 'fr'
                ? 'Partagez votre expérience avec les autres clients'
                : 'Share your experience with other shoppers'}
            </p>
            <button
              type="button"
              aria-expanded={reviewFormOpen}
              aria-controls="product-review-form"
              onClick={() => setReviewFormOpen((o) => !o)}
              className="glass-pill-frost w-full min-h-[42px] px-4 py-2 rounded-full text-xs font-bold text-[#000000] cursor-pointer"
            >
              {locale === 'fr' ? 'Écrire un avis client' : 'Write a customer review'}
            </button>
          </div>
        </div>

        {/* Inline Review Form */}
        {reviewFormOpen && (
          <form
            id="product-review-form"
            onSubmit={handleSubmitReview}
            className="ice-surface-subtle p-5 rounded-2xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-sm font-bold text-[#000000]">
                {locale === 'fr' ? 'Publier votre avis' : 'Post your review'}
              </h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <ActionIconTooltip
                    key={star}
                    text={
                      locale === 'fr'
                        ? `Attribuer la note de ${star} étoile${star > 1 ? 's' : ''}`
                        : `Rate ${star} star${star > 1 ? 's' : ''}`
                    }
                    placement="top"
                  >
                    <button
                      type="button"
                      onClick={() => setReviewRating(star)}
                      aria-pressed={star <= reviewRating}
                      aria-label={
                        locale === 'fr'
                          ? `${star} étoile${star > 1 ? 's' : ''}`
                          : `${star} star${star > 1 ? 's' : ''}`
                      }
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className="w-5 h-5"
                        fill={star <= reviewRating ? '#F4BE38' : 'none'}
                        stroke="#F4BE38"
                        aria-hidden="true"
                      />
                    </button>
                  </ActionIconTooltip>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                aria-label={locale === 'fr' ? 'Votre nom complet' : 'Your full name'}
                placeholder={locale === 'fr' ? 'Votre nom complet' : 'Your full name'}
                className="glass-input-recessed min-h-[42px] px-4 rounded-full text-sm text-[#000000] focus:outline-none"
              />
              <input
                type="text"
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                aria-label={locale === 'fr' ? 'Votre avis client' : 'Your review comment'}
                placeholder={
                  locale === 'fr'
                    ? 'Votre retour d’expérience...'
                    : 'Your review comment...'
                }
                className="glass-input-recessed min-h-[42px] px-4 rounded-full text-sm text-[#000000] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewFormOpen(false)}
                className="glass-pill-frost min-h-[38px] px-4 rounded-full text-xs font-bold text-[#000000] cursor-pointer"
              >
                {locale === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="glass-pill-cta min-h-[38px] px-5 rounded-full text-white text-xs font-bold cursor-pointer"
              >
                {locale === 'fr' ? 'Publier l’avis' : 'Publish review'}
              </button>
            </div>
          </form>
        )}

        {/* Filter Pills */}
        {productReviews.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all' as const, label: locale === 'fr' ? 'Tout' : 'All' },
              {
                id: 'verified' as const,
                label: locale === 'fr' ? 'Achat vérifié' : 'Verified purchase',
              },
              { id: 5, label: '5 ★' },
              { id: 4, label: '4 ★' },
              { id: 3, label: '3 ★' },
            ].map((pill) => (
              <button
                key={String(pill.id)}
                type="button"
                aria-pressed={reviewFilter === pill.id}
                onClick={() => setReviewFilter(pill.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-bold cursor-pointer ${
                  reviewFilter === pill.id
                    ? 'glass-pill-black text-[#F4BE38]'
                    : 'glass-pill-frost text-[#3F3F56]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        )}

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <p className="text-xs text-[#3F3F56]">
            {locale === 'fr'
              ? 'Soyez le premier à partager votre avis sur cet article.'
              : 'Be the first customer to review this product.'}
          </p>
        ) : (
          <div className="divide-y divide-white/75">
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="py-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-[#000000]">
                      {rev.author}
                    </span>
                    {rev.verified && (
                      <span className="glass-pill-gold px-2.5 py-0.5 rounded-full text-[#000000] text-[10px] font-extrabold">
                        {locale === 'fr' ? 'Achat vérifié' : 'Verified'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#3F3F56]">{rev.date}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5"
                      fill={s <= rev.rating ? '#F4BE38' : 'none'}
                      stroke="#F4BE38"
                    />
                  ))}
                </div>
                <p className="text-sm text-[#3F3F56] leading-relaxed">
                  {rev.comment}
                </p>
                <ActionIconTooltip
                  text={
                    locale === 'fr'
                      ? 'Indiquer que cet avis client vous a été utile'
                      : 'Mark this customer review as helpful'
                  }
                  placement="right"
                >
                  <button
                    type="button"
                    onClick={() => onMarkReviewHelpful(rev.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3F3F56] hover:text-[#5A5AA1] cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {locale === 'fr' ? 'Utile' : 'Helpful'} ({rev.helpfulCount})
                    </span>
                  </button>
                </ActionIconTooltip>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Vous aimerez aussi Carousel */}
      <ProductCarouselRow
        title={locale === 'fr' ? 'Vous aimerez aussi' : 'You may also like'}
        products={relatedProducts}
        locale={locale}
        wishlistIds={wishlistIds}
        compareIds={compareIds}
        waitlistIds={waitlistIds}
        recentlyAddedId={recentlyAddedId}
        viewAllCategory={product.category}
        onSelectProduct={onSelectProduct}
        onQuickAdd={onQuickAdd}
        onToggleWishlist={onToggleWishlist}
        onToggleCompare={onToggleCompare}
        onNotifyMe={onNotifyMe}
        onViewAll={onSelectCategory}
      />

      {/* Sticky Bottom Purchase / Waitlist Bar Encased in Frosted Ice */}
      <div className="fixed bottom-0 inset-x-0 z-30 ice-surface border-t border-white/90">
        {isOutOfStock ? (
          <div className="max-w-[1360px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase text-[#ba1a1a]">
                {t.outOfStock}
              </span>
              <span className="font-display text-sm sm:text-base font-extrabold text-[#000000] tabular-nums">
                {formatXAF(unitPrice)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Recevoir une alerte par e-mail lors du retour en stock'
                    : 'Get an email alert when back in stock'
                }
              >
                <button
                  type="button"
                  onClick={() => onNotifyMe?.(product)}
                  className={`min-h-[40px] px-5 rounded-full text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer ${
                    waitlistIds.includes(product.id)
                      ? 'glass-pill-black text-[#F4BE38]'
                      : 'glass-pill-gold text-[#000000]'
                  }`}
                >
                  {waitlistIds.includes(product.id) ? (
                    <>
                      <Check className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {locale === 'fr' ? 'Sur liste d’attente' : 'On Waitlist'}
                      </span>
                    </>
                  ) : (
                    <>
                      <BellRing className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {locale === 'fr' ? 'M’alerter' : 'Notify Me'}
                      </span>
                    </>
                  )}
                </button>
              </ActionIconTooltip>
            </div>
          </div>
        ) : (
          <div className="max-w-[1360px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="glass-input-recessed hidden sm:inline-flex items-center rounded-full">
                <ActionIconTooltip
                  text={locale === 'fr' ? 'Réduire la quantité' : 'Decrease quantity'}
                  placement="top"
                >
                  <button
                    type="button"
                    aria-label={
                      locale === 'fr'
                        ? `Diminuer la quantité de ${title}`
                        : `Decrease quantity of ${title}`
                    }
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-l-full inline-flex items-center justify-center text-[#000000] hover:bg-white/60 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </ActionIconTooltip>
                <span className="px-3 text-xs font-bold tabular-nums text-[#000000]">
                  {quantity}
                </span>
                <ActionIconTooltip
                  text={locale === 'fr' ? 'Augmenter la quantité' : 'Increase quantity'}
                  placement="top"
                >
                  <button
                    type="button"
                    aria-label={
                      locale === 'fr'
                        ? `Augmenter la quantité de ${title}`
                        : `Increase quantity of ${title}`
                    }
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stockQty || 1, q + 1))
                    }
                    className="glass-pill-cta w-8 h-8 inline-flex items-center justify-center text-white rounded-full cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </ActionIconTooltip>
              </div>

              <div>
                <span className="block text-[10px] font-semibold text-[#3F3F56]">
                  {t.subtotal}
                </span>
                <span className="font-display text-sm sm:text-base font-extrabold text-[#000000] tabular-nums">
                  {formatXAF(unitPrice * quantity)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ActionIconTooltip
                text={locale === 'fr' ? 'Ouvrir votre panier' : 'Open your shopping bag'}
                placement="top"
              >
                <button
                  type="button"
                  onClick={onOpenCartPage}
                  className="glass-pill-frost min-h-[38px] px-3.5 sm:px-4 rounded-full text-[#000000] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.cart}</span>
                </button>
              </ActionIconTooltip>

              <button
                type="button"
                onClick={() => onBuyNow(product, selectedVariant.id, quantity)}
                className="glass-pill-cta min-h-[38px] px-5 sm:px-6 rounded-full text-white text-xs font-bold cursor-pointer"
              >
                {locale === 'fr' ? 'Acheter' : 'Buy Now'}
              </button>

              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Contacter un conseiller Lorena sur WhatsApp'
                    : 'Contact a Lorena advisor on WhatsApp'
                }
                placement="left"
              >
                <button
                  type="button"
                  onClick={() => setWhatsappTipOpen(true)}
                  className="glass-pill-frost hidden md:inline-flex min-h-[38px] px-3.5 rounded-full text-[#000000] text-xs font-bold items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#5A5AA1]" aria-hidden="true" />
                  <span>WhatsApp</span>
                </button>
              </ActionIconTooltip>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
