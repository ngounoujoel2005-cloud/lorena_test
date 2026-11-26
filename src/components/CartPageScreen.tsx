import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Headphones,
  Lock,
  Minus,
  Package,
  Phone,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { FREE_DELIVERY_THRESHOLD, PRODUCTS } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { CartItem, Locale, Product } from '../types/store';
import { formatXAF } from '../utils/format';
import { ActionIconTooltip } from './ActionIconTooltip';
import { ProductCarouselRow } from './ProductCarouselRow';
import { ProductImage } from './ProductImage';

interface CartPageScreenProps {
  locale: Locale;
  items: CartItem[];
  appliedPromoCode: string | null;
  historyIds: string[];
  wishlistIds: string[];
  compareIds?: string[];
  waitlistIds?: string[];
  recentlyAddedId: string | null;
  onApplyPromoCode: (code: string | null) => void;
  onUpdateQuantity: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onNotifyMe?: (product: Product) => void;
}

export function getPromoDiscount(subtotal: number, promoCode: string | null): number {
  if (!promoCode) return 0;
  const normalized = promoCode.trim().toUpperCase();
  if (normalized === 'LORENA10') {
    return Math.round(subtotal * 0.1);
  }
  if (normalized === 'BIENVENUE') {
    return Math.min(5000, subtotal);
  }
  return 0;
}

export function CartPageScreen({
  locale,
  items,
  appliedPromoCode,
  historyIds,
  wishlistIds,
  compareIds = [],
  waitlistIds = [],
  recentlyAddedId,
  onApplyPromoCode,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  onToggleCompare,
  onNotifyMe,
}: CartPageScreenProps) {
  const t = TRANSLATIONS[locale];
  const [promoInput, setPromoInput] = useState(appliedPromoCode ?? '');
  const [promoFeedback, setPromoFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [savePhone, setSavePhone] = useState('');
  const [savePhoneConfirmed, setSavePhoneConfirmed] = useState(false);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const discount = getPromoDiscount(subtotal, appliedPromoCode);
  const estimatedTotal = Math.max(0, subtotal - discount);

  const historyProducts =
    historyIds.length > 0
      ? PRODUCTS.filter((p) => historyIds.includes(p.id))
      : PRODUCTS.slice(0, 6);

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) {
      onApplyPromoCode(null);
      setPromoFeedback(null);
      return;
    }
    if (cleaned === 'LORENA10' || cleaned === 'BIENVENUE') {
      onApplyPromoCode(cleaned);
      setPromoFeedback({
        ok: true,
        message:
          cleaned === 'LORENA10'
            ? locale === 'fr'
              ? 'Code LORENA10 appliqué (-10 %).'
              : 'Code LORENA10 applied (-10%).'
            : locale === 'fr'
            ? 'Code BIENVENUE appliqué (-5 000 XAF).'
            : 'Code BIENVENUE applied (-5,000 XAF).',
      });
    } else {
      setPromoFeedback({
        ok: false,
        message:
          locale === 'fr'
            ? 'Code invalide. Essayez LORENA10 ou BIENVENUE.'
            : 'Invalid code. Try LORENA10 or BIENVENUE.',
      });
    }
  };

  const handleSaveCartLink = (e: FormEvent) => {
    e.preventDefault();
    const digits = savePhone.replace(/\D/g, '');
    if (digits.length < 9) return;
    setSavePhoneConfirmed(true);
    setTimeout(() => setSavePhoneConfirmed(false), 4000);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 pb-16 space-y-10">
      {/* 3-Step Checkout Progress Bar (Step 1 Active) */}
      <div className="ice-surface max-w-lg mx-auto rounded-full px-6 py-3 flex items-center justify-between gap-2">
        <div className="flex flex-col items-center gap-1">
          <ActionIconTooltip
            text={
              locale === 'fr'
                ? 'Étape 1 : vérifiez vos articles et codes promo'
                : 'Step 1: review your items and promo codes'
            }
            placement="bottom"
            focusable
          >
            <span className="glass-pill-black w-10 h-10 rounded-full text-[#F4BE38] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            </span>
          </ActionIconTooltip>
          <span className="text-xs font-bold text-[#000000]">
            {locale === 'fr' ? 'Panier' : 'Cart'}
          </span>
        </div>
        <div className="flex-1 h-0.5 bg-white/80 mb-4 rounded-full" />
        <div className="flex flex-col items-center gap-1">
          <ActionIconTooltip
            text={
              locale === 'fr'
                ? 'Étape 2 : adresse de livraison et mode de paiement'
                : 'Step 2: delivery address and payment method'
            }
            placement="bottom"
            focusable
          >
            <span className="glass-pill-frost w-10 h-10 rounded-full text-[#3F3F56] flex items-center justify-center">
              <ClipboardList className="w-4 h-4" aria-hidden="true" />
            </span>
          </ActionIconTooltip>
          <span className="text-xs font-medium text-[#3F3F56]">
            {locale === 'fr' ? 'Commande' : 'Checkout'}
          </span>
        </div>
        <div className="flex-1 h-0.5 bg-white/80 mb-4 rounded-full" />
        <div className="flex flex-col items-center gap-1">
          <ActionIconTooltip
            text={
              locale === 'fr'
                ? 'Étape 3 : reçu PDF et suivi de livraison'
                : 'Step 3: PDF invoice and delivery tracking'
            }
            placement="bottom"
            focusable
          >
            <span className="glass-pill-frost w-10 h-10 rounded-full text-[#3F3F56] flex items-center justify-center">
              <Package className="w-4 h-4" aria-hidden="true" />
            </span>
          </ActionIconTooltip>
          <span className="text-xs font-medium text-[#3F3F56]">
            {locale === 'fr' ? 'Confirmation' : 'Confirmation'}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="ice-surface rounded-3xl p-5 sm:p-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
            {locale === 'fr' ? 'Mon panier' : 'My Shopping Cart'}
          </h1>
          <p className="text-xs sm:text-sm text-[#3F3F56] mt-1">
            {locale === 'fr'
              ? 'Détails de vos articles avant commande'
              : 'Review your items before checkout'}
          </p>
        </div>
        <span className="glass-pill-gold px-3.5 py-1 rounded-full text-xs sm:text-sm font-extrabold text-[#000000] tabular-nums">
          {itemCount} {itemCount > 1 ? (locale === 'fr' ? 'articles' : 'items') : locale === 'fr' ? 'article' : 'item'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="ice-surface rounded-3xl p-10 text-center space-y-4">
          <div className="glass-pill-frost w-14 h-14 mx-auto rounded-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-[#5A5AA1]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#000000]">
            {t.emptyBagTitle}
          </h2>
          <p className="text-sm text-[#3F3F56] max-w-md mx-auto">{t.emptyBagDesc}</p>
          <button
            type="button"
            onClick={onContinueShopping}
            className="glass-pill-cta min-h-[44px] px-6 py-2.5 rounded-full text-white text-sm font-bold cursor-pointer"
          >
            {t.browseCatalog}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="ice-surface rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="ice-product-trap w-24 h-24 rounded-2xl p-2 shrink-0 flex items-center justify-center">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-sm sm:text-base font-bold text-[#000000] leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#3F3F56] mt-0.5">
                        {locale === 'fr' ? 'Prix unitaire' : 'Unit price'} :{' '}
                        {formatXAF(item.unitPrice)} · {item.variantLabel}
                      </p>
                    </div>
                    <ActionIconTooltip
                      text={
                        locale === 'fr'
                          ? 'Supprimer cet article du panier'
                          : 'Remove this item from cart'
                      }
                      placement="left"
                    >
                      <button
                        type="button"
                        aria-label={`Supprimer ${item.name}`}
                        onClick={() => onRemoveItem(item.productId, item.variantId)}
                        className="p-2 text-[#3F3F56] hover:text-[#ba1a1a] cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </ActionIconTooltip>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div className="glass-input-recessed inline-flex items-center rounded-full">
                      <ActionIconTooltip
                        text={locale === 'fr' ? 'Réduire la quantité' : 'Decrease quantity'}
                        placement="top"
                      >
                        <button
                          type="button"
                          aria-label="Diminuer"
                          onClick={() =>
                            onUpdateQuantity(item.productId, item.variantId, -1)
                          }
                          className="w-9 h-9 rounded-l-full inline-flex items-center justify-center text-[#000000] hover:bg-white/60 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </ActionIconTooltip>
                      <span className="px-3.5 text-sm font-bold tabular-nums text-[#000000]">
                        {item.quantity}
                      </span>
                      <ActionIconTooltip
                        text={locale === 'fr' ? 'Augmenter la quantité' : 'Increase quantity'}
                        placement="top"
                      >
                        <button
                          type="button"
                          aria-label="Augmenter"
                          onClick={() =>
                            onUpdateQuantity(item.productId, item.variantId, 1)
                          }
                          className="glass-pill-cta w-9 h-9 inline-flex items-center justify-center text-white rounded-full cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </ActionIconTooltip>
                    </div>

                    <span className="font-display text-base sm:text-lg font-extrabold text-[#000000] tabular-nums">
                      {formatXAF(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Summary Sidebar */}
          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
            <div className="ice-surface rounded-3xl p-6 space-y-5">
              <div>
                <h2 className="font-display text-lg font-bold text-[#000000]">
                  {locale === 'fr' ? 'Résumé de la commande' : 'Order Summary'}
                </h2>
                <p className="text-xs text-[#3F3F56]">
                  {itemCount}{' '}
                  {itemCount > 1
                    ? locale === 'fr'
                      ? 'articles'
                      : 'items'
                    : locale === 'fr'
                    ? 'article'
                    : 'item'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/75 space-y-2.5 text-sm">
                <div className="flex justify-between text-[#3F3F56]">
                  <span>{t.subtotal}</span>
                  <span className="font-bold text-[#000000] tabular-nums">
                    {formatXAF(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#5A5AA1] font-bold">
                    <span>
                      {locale === 'fr' ? 'Réduction' : 'Discount'} ({appliedPromoCode})
                    </span>
                    <span className="tabular-nums">-{formatXAF(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#3F3F56]">
                  <span>{locale === 'fr' ? 'Livraison' : 'Delivery'}</span>
                  <span className="text-xs font-semibold text-[#5A5AA1]">
                    {subtotal >= FREE_DELIVERY_THRESHOLD
                      ? locale === 'fr'
                        ? 'Offerte (Douala/Yaoundé)'
                        : 'Free (Douala/Yaoundé)'
                      : locale === 'fr'
                      ? "Calculée à l'étape suivante"
                      : 'Calculated at next step'}
                  </span>
                </div>
                <div className="pt-3 border-t border-white/75 flex justify-between items-baseline">
                  <span className="font-display text-base font-bold text-[#000000]">
                    Total
                  </span>
                  <span className="font-display text-xl font-extrabold text-[#000000] tabular-nums">
                    {formatXAF(estimatedTotal)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onProceedToCheckout}
                className="glass-pill-cta w-full min-h-[48px] px-5 py-3 rounded-full text-white font-display font-bold text-sm uppercase tracking-wide cursor-pointer"
              >
                {locale === 'fr' ? 'PASSER LA COMMANDE' : 'PROCEED TO CHECKOUT'}
              </button>

              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Retourner parcourir la boutique Lorena'
                    : 'Return to browse the Lorena store'
                }
                placement="top"
                className="w-full"
              >
                <button
                  type="button"
                  onClick={onContinueShopping}
                  className="glass-pill-frost w-full py-2 rounded-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#000000] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {locale === 'fr' ? 'Continuer vos achats' : 'Continue shopping'}
                  </span>
                </button>
              </ActionIconTooltip>

              {/* Promo Code Box */}
              <form
                onSubmit={handleApplyPromo}
                className="ice-surface-subtle p-3.5 rounded-2xl space-y-2.5"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#000000]">
                  <ActionIconTooltip
                    text={
                      locale === 'fr'
                        ? 'Saisissez LORENA10 ou BIENVENUE pour obtenir une remise'
                        : 'Enter LORENA10 or BIENVENUE to get a discount'
                    }
                    placement="top"
                    focusable
                  >
                    <Tag className="w-3.5 h-3.5 text-[#5A5AA1]" aria-hidden="true" />
                  </ActionIconTooltip>
                  <span>{locale === 'fr' ? 'Code promo' : 'Promo code'}</span>
                  <span className="ml-auto text-[10px] text-[#3F3F56]">
                    LORENA10 · BIENVENUE
                  </span>
                </div>
                <div className="flex items-stretch gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder={
                      locale === 'fr' ? 'Entrez votre code' : 'Enter promo code'
                    }
                    className="glass-input-recessed min-h-[38px] flex-1 px-3.5 rounded-full text-xs text-[#000000] uppercase focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="glass-pill-black min-h-[38px] px-4 rounded-full text-white text-xs font-bold cursor-pointer"
                  >
                    {locale === 'fr' ? 'Appliquer' : 'Apply'}
                  </button>
                </div>
                {promoFeedback && (
                  <p
                    className={`text-[11px] font-semibold ${
                      promoFeedback.ok ? 'text-[#5A5AA1]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {promoFeedback.message}
                  </p>
                )}
              </form>

              {/* 3 Trust Rows */}
              <div className="pt-2 border-t border-white/75 space-y-2.5 text-xs text-[#3F3F56] font-medium">
                <div className="flex items-center gap-2.5">
                  <ActionIconTooltip
                    text={
                      locale === 'fr'
                        ? 'Livraison rapide suivie en temps réel'
                        : 'Fast delivery with live tracking'
                    }
                    placement="left"
                    focusable
                  >
                    <Truck className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                  </ActionIconTooltip>
                  <span>
                    {locale === 'fr'
                      ? 'Livraison suivie au Cameroun'
                      : 'Tracked delivery across Cameroon'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ActionIconTooltip
                    text={
                      locale === 'fr'
                        ? 'Paiement sécurisé Mobile Money ou à la livraison'
                        : 'Secure Mobile Money or Cash on Delivery payment'
                    }
                    placement="left"
                    focusable
                  >
                    <Lock className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                  </ActionIconTooltip>
                  <span>
                    {locale === 'fr' ? 'Paiement sécurisé' : 'Secure payment'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ActionIconTooltip
                    text={
                      locale === 'fr'
                        ? 'Assistance client dédiée 6 jours sur 7'
                        : 'Dedicated customer support 6 days a week'
                    }
                    placement="left"
                    focusable
                  >
                    <Headphones className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                  </ActionIconTooltip>
                  <span>
                    {locale === 'fr' ? 'SAV réactif 6j/7' : 'Responsive support 6d/wk'}
                  </span>
                </div>
              </div>
            </div>

            {/* Save Cart Link via +237 WhatsApp/SMS */}
            <form
              onSubmit={handleSaveCartLink}
              className="ice-surface rounded-3xl p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <ActionIconTooltip
                  text={
                    locale === 'fr'
                      ? 'Sauvegardez ce panier via WhatsApp ou SMS'
                      : 'Save this cart link via WhatsApp or SMS'
                  }
                  placement="left"
                  focusable
                >
                  <span className="glass-pill-black w-7 h-7 rounded-full text-[#F4BE38] flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </ActionIconTooltip>
                <h3 className="font-display text-sm font-bold text-[#000000]">
                  {locale === 'fr'
                    ? 'Recevoir un lien pour finaliser plus tard'
                    : 'Get a link to finish later'}
                </h3>
              </div>
              <p className="text-[11px] text-[#3F3F56] leading-relaxed">
                {locale === 'fr'
                  ? 'Optionnel : on vous envoie un WhatsApp ou SMS pour retrouver ce panier. Ce n’est pas une commande.'
                  : 'Optional: we send a WhatsApp/SMS link to reopen this bag later.'}
              </p>
              <div className="flex items-stretch gap-2">
                <div className="glass-input-recessed flex items-stretch flex-1 rounded-full overflow-hidden">
                  <span className="px-3 flex items-center gap-1 border-r border-white/80 text-[11px] font-bold text-[#000000]">
                    🇨🇲 +237
                  </span>
                  <input
                    type="tel"
                    value={savePhone}
                    onChange={(e) => setSavePhone(e.target.value)}
                    placeholder="670123123"
                    className="min-h-[38px] flex-1 px-2.5 bg-transparent text-xs text-[#000000] tabular-nums focus:outline-none min-w-0"
                  />
                </div>
                <button
                  type="submit"
                  className="glass-pill-black min-h-[38px] px-4 rounded-full text-white text-xs font-bold cursor-pointer shrink-0"
                >
                  {locale === 'fr' ? 'Enregistrer' : 'Save'}
                </button>
              </div>
              {savePhoneConfirmed && (
                <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5A5AA1]">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {locale === 'fr'
                      ? 'Lien panier enregistré pour ce numéro.'
                      : 'Cart link saved for this number.'}
                  </span>
                </p>
              )}
            </form>
          </aside>
        </div>
      )}

      {/* Navigation History Recommendations */}
      <div className="pt-6 border-t border-white/75">
        <ProductCarouselRow
          title={
            locale === 'fr'
              ? 'Inspiré de votre historique de navigation'
              : 'Inspired by your browsing history'
          }
          products={historyProducts}
          locale={locale}
          wishlistIds={wishlistIds}
          compareIds={compareIds}
          waitlistIds={waitlistIds}
          recentlyAddedId={recentlyAddedId}
          viewAllCategory="all"
          onSelectProduct={onSelectProduct}
          onQuickAdd={onQuickAdd}
          onToggleWishlist={onToggleWishlist}
          onToggleCompare={onToggleCompare}
          onNotifyMe={onNotifyMe}
          onViewAll={onContinueShopping}
        />
      </div>
    </div>
  );
}
