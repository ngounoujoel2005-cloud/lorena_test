import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { FREE_DELIVERY_THRESHOLD } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { CartItem, Locale } from '../types/store';
import { formatXAF } from '../utils/format';
import { ActionIconTooltip } from './ActionIconTooltip';
import { ProductImage } from './ProductImage';

interface CartDrawerProps {
  isOpen: boolean;
  locale: Locale;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onOpenFullCart: () => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  locale,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onOpenFullCart,
  onProceedToCheckout,
}: CartDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const t = TRANSLATIONS[locale];

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progressPct = Math.min(
    100,
    Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={t.cart}
    >
      <div
        className="fixed inset-0 bg-[#000000]/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <aside className="ice-surface relative w-full max-w-md h-full flex flex-col border-l border-white/90 shadow-2xl">
        <div className="ice-obsidian px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ActionIconTooltip
              text={
                locale === 'fr'
                  ? 'Aperçu rapide de votre panier'
                  : 'Quick overview of your shopping bag'
              }
              placement="right"
              focusable
            >
              <ShoppingBag className="w-5 h-5 text-[#F4BE38]" aria-hidden="true" />
            </ActionIconTooltip>
            <h2 className="font-display text-lg font-bold">
              {locale === 'fr' ? 'Mon Panier' : 'My Shopping Bag'}
            </h2>
          </div>
          <ActionIconTooltip
            text={locale === 'fr' ? 'Fermer le tiroir du panier' : 'Close cart drawer'}
            placement="left"
          >
            <button
              type="button"
              aria-label={locale === 'fr' ? 'Fermer le panier' : 'Close cart'}
              onClick={onClose}
              className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-full hover:bg-white/15 text-white cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </ActionIconTooltip>
        </div>

        {items.length > 0 && (
          <div className="ice-surface-subtle px-5 py-3 border-b border-white/80">
            <p className="text-xs font-semibold text-[#000000] mb-2">
              {remainingForFree === 0 ? (
                <span className="text-[#5A5AA1] font-bold">
                  {t.freeDeliveryUnlocked}
                </span>
              ) : (
                <>
                  {t.freeDeliveryRemaining}{' '}
                  <span className="font-bold tabular-nums text-[#5A5AA1]">
                    {formatXAF(remainingForFree)}
                  </span>
                </>
              )}
            </p>
            <div className="w-full h-2.5 bg-white/75 border border-white/90 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F4BE38] via-[#A084E8] to-[#5A5AA1] transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="glass-pill-frost w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-[#5A5AA1]" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base font-bold text-[#000000]">
                {t.emptyBagTitle}
              </h3>
              <p className="mt-1 text-sm text-[#3F3F56] max-w-xs">
                {t.emptyBagDesc}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="glass-pill-cta mt-6 min-h-[44px] px-6 py-2.5 text-white text-sm font-bold rounded-full cursor-pointer"
              >
                {t.browseCatalog}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="ice-surface-subtle rounded-2xl p-3.5 flex gap-3.5"
              >
                <div className="ice-product-trap w-20 h-20 rounded-2xl shrink-0 p-1.5 flex items-center justify-center">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#3F3F56] uppercase font-bold">
                        {item.brand}
                      </p>
                      <h4 className="font-display text-sm font-bold text-[#000000] line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#3F3F56] mt-0.5">
                        {item.variantLabel}
                      </p>
                    </div>
                    <ActionIconTooltip
                      text={
                        locale === 'fr'
                          ? 'Retirer cet article du panier'
                          : 'Remove this item from cart'
                      }
                      placement="left"
                    >
                      <button
                        type="button"
                        aria-label={
                          locale === 'fr'
                            ? `Supprimer ${item.name} du panier`
                            : `Remove ${item.name} from cart`
                        }
                        onClick={() => onRemoveItem(item.productId, item.variantId)}
                        className="p-1.5 text-[#3F3F56] hover:text-[#ba1a1a] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </ActionIconTooltip>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="glass-input-recessed inline-flex items-center rounded-full">
                      <ActionIconTooltip
                        text={locale === 'fr' ? 'Réduire la quantité' : 'Decrease quantity'}
                        placement="top"
                      >
                        <button
                          type="button"
                          aria-label={
                            locale === 'fr'
                              ? `Diminuer la quantité pour ${item.name}`
                              : `Decrease quantity for ${item.name}`
                          }
                          onClick={() =>
                            onUpdateQuantity(item.productId, item.variantId, -1)
                          }
                          className="w-8 h-8 rounded-l-full inline-flex items-center justify-center text-[#000000] hover:bg-white/60 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </ActionIconTooltip>
                      <span className="px-2.5 text-sm font-bold tabular-nums text-[#000000]">
                        {item.quantity}
                      </span>
                      <ActionIconTooltip
                        text={locale === 'fr' ? 'Augmenter la quantité' : 'Increase quantity'}
                        placement="top"
                      >
                        <button
                          type="button"
                          aria-label={
                            locale === 'fr'
                              ? `Augmenter la quantité pour ${item.name}`
                              : `Increase quantity for ${item.name}`
                          }
                          onClick={() =>
                            onUpdateQuantity(item.productId, item.variantId, 1)
                          }
                          className="w-8 h-8 rounded-r-full inline-flex items-center justify-center text-[#000000] hover:bg-white/60 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </ActionIconTooltip>
                    </div>

                    <span className="font-display text-sm font-extrabold text-[#000000] tabular-nums">
                      {formatXAF(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="ice-surface-subtle p-5 border-t border-white/85 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#3F3F56]">{t.subtotal}</span>
              <span className="font-display text-lg font-extrabold text-[#000000] tabular-nums">
                {formatXAF(subtotal)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5A5AA1] font-bold">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Paiements mobiles et livraison protégés'
                    : 'Protected mobile money and cash-on-delivery payments'
                }
                placement="right"
                focusable
              >
                <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              </ActionIconTooltip>
              <span>
                {locale === 'fr'
                  ? 'MTN MoMo, Orange Money ou Paiement à la livraison'
                  : 'MTN MoMo, Orange Money or Cash on Delivery'}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Passer à la saisie d’adresse et au paiement'
                    : 'Proceed to delivery address and payment'
                }
                placement="top"
                className="w-full"
              >
                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="glass-pill-cta w-full min-h-[46px] px-5 py-3 text-white font-bold text-sm rounded-full inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.proceedCheckout}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </ActionIconTooltip>
              <button
                type="button"
                onClick={onOpenFullCart}
                className="glass-pill-frost w-full min-h-[40px] px-4 py-2 text-[#000000] font-bold text-xs rounded-full cursor-pointer"
              >
                {locale === 'fr'
                  ? 'Voir le panier complet (Code promo)'
                  : 'View full cart (Promo code)'}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
