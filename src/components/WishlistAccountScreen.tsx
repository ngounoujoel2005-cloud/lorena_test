import { ArrowLeft, Heart, MapPin, Package, User } from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { Locale, OrderRecord, Product } from '../types/store';
import { formatOrderDate, formatXAF } from '../utils/format';
import { ProductCard } from './ProductCard';

interface WishlistAccountScreenProps {
  mode: 'wishlist' | 'account';
  locale: Locale;
  wishlistIds: string[];
  orders: OrderRecord[];
  recentlyAddedId: string | null;
  onBackHome: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onInspectOrder: (orderId: string) => void;
}

export function WishlistAccountScreen({
  mode,
  locale,
  wishlistIds,
  orders,
  recentlyAddedId,
  onBackHome,
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  onInspectOrder,
}: WishlistAccountScreenProps) {
  const t = TRANSLATIONS[locale];
  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 space-y-8">
      <div className="pb-4 border-b border-[#E5E7EB]">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5AA1] hover:underline mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.backToHome}</span>
        </button>
        <div className="flex items-center gap-3">
          {mode === 'wishlist' ? (
            <Heart className="w-6 h-6 text-[#5A5AA1]" aria-hidden="true" />
          ) : (
            <User className="w-6 h-6 text-[#5A5AA1]" aria-hidden="true" />
          )}
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
            {mode === 'wishlist'
              ? locale === 'fr'
                ? 'Mes Favoris'
                : 'My Wishlist'
              : locale === 'fr'
              ? 'Mon Compte Lorena'
              : 'My Lorena Account'}
          </h1>
        </div>
      </div>

      {mode === 'wishlist' ? (
        wishlistedProducts.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-10 text-center space-y-3">
            <p className="font-display text-lg font-bold text-[#000000]">
              {locale === 'fr'
                ? 'Aucun article enregistré en favoris'
                : 'No saved wishlist items yet'}
            </p>
            <p className="text-sm text-[#6C757D]">
              {locale === 'fr'
                ? "Cliquez sur l'icône cœur sur n'importe quel produit pour le retrouver ici."
                : 'Click the heart icon on any product card to save it here.'}
            </p>
            <button
              type="button"
              onClick={onBackHome}
              className="min-h-[42px] px-5 py-2 rounded-lg bg-[#5A5AA1] text-white text-sm font-semibold cursor-pointer"
            >
              {t.browseCatalog}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                isWishlisted
                justAdded={recentlyAddedId === product.id}
                onSelectProduct={onSelectProduct}
                onQuickAdd={onQuickAdd}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile & Saved Address */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-3">
              <span className="px-2.5 py-0.5 rounded bg-[#F4BE38] text-[#000000] text-xs font-bold">
                {locale === 'fr' ? 'Client Vérifié +237' : 'Verified Customer +237'}
              </span>
              <h2 className="font-display text-xl font-bold text-[#000000]">
                {orders[0]?.customer.fullName || 'Client Lorena Market'}
              </h2>
              <p className="text-sm font-mono text-[#6C757D]">
                {orders[0]?.customer.phone || '+237 693 71 25 25'}
              </p>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#5A5AA1]">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>
                  {locale === 'fr' ? 'Adresse par défaut' : 'Default Address'}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#000000]">
                {orders[0]?.customer.quarter || 'Bonapriso'},{' '}
                {orders[0]?.customer.city || 'Douala'} (
                {orders[0]?.customer.region || 'Littoral'})
              </p>
              <p className="text-xs text-[#6C757D]">
                {orders[0]?.customer.landmark || 'Rue Njo-Njo'}
              </p>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#5A5AA1]" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-[#000000]">
                  {locale === 'fr' ? 'Mes Commandes' : 'My Orders'} ({orders.length})
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 hover:border-[#5A5AA1] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#000000]">
                        #{order.id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#F4BE38] text-[#000000] text-[11px] font-bold">
                        {order.paymentVerified
                          ? 'Mobile Money OK'
                          : locale === 'fr'
                          ? 'Paiement Livraison'
                          : 'Cash on Delivery'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6C757D] mt-1">
                      {formatOrderDate(order.createdAt)} · {order.customer.city} (
                      {order.customer.quarter})
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-display font-bold text-base text-[#000000] tabular-nums">
                      {formatXAF(order.total)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onInspectOrder(order.id)}
                      className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#5A5AA1] hover:bg-[#474789] text-white text-xs font-semibold cursor-pointer"
                    >
                      {locale === 'fr' ? 'Suivre' : 'Track'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
