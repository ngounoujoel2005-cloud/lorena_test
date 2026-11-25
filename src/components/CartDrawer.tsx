import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, X } from 'lucide-react';
import { FREE_DELIVERY_THRESHOLD } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { CartItem, Locale } from '../types/store';
import { formatXAF } from '../utils/format';
import { ProductImage } from './ProductImage';

interface CartDrawerProps {
  isOpen: boolean;
  locale: Locale;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  locale,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
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
        className="fixed inset-0 bg-[#000000]/55 transition-opacity"
        onClick={onClose}
      />

      <aside className="relative w-full max-w-md bg-[#F8F9FA] h-full flex flex-col border-l border-[#E5E7EB] shadow-2xl">
        <div className="px-5 py-4 bg-[#000000] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#F4BE38]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold">
              {locale === 'fr' ? 'Mon Panier' : 'My Shopping Bag'}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Fermer le panier"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-full hover:bg-white/10 text-white cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {items.length > 0 && (
          <div className="px-5 py-3 bg-white border-b border-[#E5E7EB]">
            <p className="text-xs font-medium text-[#000000] mb-2">
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
            <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5A5AA1] transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-[#5A5AA1]/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-[#5A5AA1]" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base font-bold text-[#000000]">
                {t.emptyBagTitle}
              </h3>
              <p className="mt-1 text-sm text-[#6C757D] max-w-xs">
                {t.emptyBagDesc}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 min-h-[44px] px-5 py-2.5 bg-[#5A5AA1] hover:bg-[#474789] text-white text-sm font-semibold rounded-lg cursor-pointer"
              >
                {t.browseCatalog}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 flex gap-3.5"
              >
                <div className="w-20 h-20 rounded-lg bg-white overflow-hidden shrink-0 border border-[#E5E7EB] p-1">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#6C757D] uppercase font-semibold">
                        {item.brand}
                      </p>
                      <h4 className="font-display text-sm font-bold text-[#000000] line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#6C757D] mt-0.5">
                        {item.variantLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Supprimer ${item.name}`}
                      onClick={() => onRemoveItem(item.productId, item.variantId)}
                      className="p-1.5 text-[#6C757D] hover:text-[#ba1a1a] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center border border-[#E5E7EB] rounded-lg bg-[#F8F9FA]">
                      <button
                        type="button"
                        aria-label="Diminuer la quantité"
                        onClick={() =>
                          onUpdateQuantity(item.productId, item.variantId, -1)
                        }
                        className="w-8 h-8 inline-flex items-center justify-center text-[#000000] hover:bg-[#E5E7EB] cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <span className="px-2.5 text-sm font-semibold tabular-nums text-[#000000]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Augmenter la quantité"
                        onClick={() =>
                          onUpdateQuantity(item.productId, item.variantId, 1)
                        }
                        className="w-8 h-8 inline-flex items-center justify-center text-[#000000] hover:bg-[#E5E7EB] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <span className="font-display text-sm font-bold text-[#000000] tabular-nums">
                      {formatXAF(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E5E7EB] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6C757D]">{t.subtotal}</span>
              <span className="font-display text-lg font-bold text-[#000000] tabular-nums">
                {formatXAF(subtotal)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5A5AA1] font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                {locale === 'fr'
                  ? 'MTN MoMo, Orange Money ou Paiement à la livraison'
                  : 'MTN MoMo, Orange Money or Cash on Delivery'}
              </span>
            </div>
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full min-h-[48px] px-5 py-3 bg-[#5A5AA1] hover:bg-[#474789] text-white font-semibold text-sm rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{t.proceedCheckout}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
