import {
  ArrowLeft,
  Check,
  Download,
  FileText,
  Heart,
  LogIn,
  LogOut,
  MapPin,
  Package,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { PRODUCTS } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { Locale, OrderRecord, Product, UserSession } from '../types/store';
import { exportOrdersToCsv } from '../utils/exportOrdersCsv';
import { formatOrderDate, formatXAF } from '../utils/format';
import { ProductCard } from './ProductCard';

interface WishlistAccountScreenProps {
  mode: 'wishlist' | 'account';
  locale: Locale;
  wishlistIds: string[];
  compareIds?: string[];
  orders: OrderRecord[];
  userSession: UserSession | null;
  recentlyAddedId: string | null;
  onBackHome: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onInspectOrder: (orderId: string) => void;
  onOpenInvoice?: (orderId: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export function WishlistAccountScreen({
  mode,
  locale,
  wishlistIds,
  compareIds = [],
  orders,
  userSession,
  recentlyAddedId,
  onBackHome,
  onSelectProduct,
  onQuickAdd,
  onToggleWishlist,
  onToggleCompare,
  onInspectOrder,
  onOpenInvoice,
  onOpenAuth,
  onLogout,
}: WishlistAccountScreenProps) {
  const t = TRANSLATIONS[locale];
  const [csvExported, setCsvExported] = useState(false);
  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const handleExportCsv = () => {
    if (orders.length === 0) return;
    exportOrdersToCsv(orders, locale);
    setCsvExported(true);
    setTimeout(() => setCsvExported(false), 3000);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 pb-16 space-y-8">
      <div className="ice-surface rounded-3xl p-6 flex flex-wrap items-end justify-between gap-4">
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
            {mode === 'wishlist' ? (
              <span className="glass-pill-black w-10 h-10 rounded-2xl text-[#F4BE38] flex items-center justify-center">
                <Heart className="w-5 h-5" aria-hidden="true" />
              </span>
            ) : (
              <span className="glass-pill-black w-10 h-10 rounded-2xl text-[#F4BE38] flex items-center justify-center">
                <User className="w-5 h-5" aria-hidden="true" />
              </span>
            )}
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#000000]">
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

        {mode === 'account' && (
          <div>
            {userSession ? (
              <button
                type="button"
                onClick={onLogout}
                className="glass-pill-frost min-h-[40px] px-4 py-2 rounded-full text-xs font-bold text-[#ba1a1a] inline-flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>{locale === 'fr' ? 'Déconnexion' : 'Sign out'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="glass-pill-cta min-h-[40px] px-5 py-2 rounded-full text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>
                  {locale === 'fr' ? 'Se connecter / S’inscrire' : 'Sign in / Register'}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {mode === 'wishlist' ? (
        wishlistedProducts.length === 0 ? (
          <div className="ice-surface rounded-3xl p-10 text-center space-y-4">
            <p className="font-display text-lg font-bold text-[#000000]">
              {locale === 'fr'
                ? 'Aucun article enregistré en favoris'
                : 'No saved wishlist items yet'}
            </p>
            <p className="text-sm text-[#3F3F56]">
              {locale === 'fr'
                ? "Cliquez sur l'icône cœur sur n'importe quel produit pour le retrouver ici."
                : 'Click the heart icon on any product card to save it here.'}
            </p>
            <button
              type="button"
              onClick={onBackHome}
              className="glass-pill-cta min-h-[42px] px-6 py-2 rounded-full text-white text-sm font-bold cursor-pointer"
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
                isCompared={compareIds.includes(product.id)}
                justAdded={recentlyAddedId === product.id}
                onSelectProduct={onSelectProduct}
                onQuickAdd={onQuickAdd}
                onToggleWishlist={onToggleWishlist}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile & Saved Address */}
          <div className="lg:col-span-4 space-y-4">
            <div className="ice-obsidian text-white rounded-3xl p-6 space-y-3">
              <span className="glass-pill-gold inline-block px-3 py-0.5 rounded-full text-[#000000] text-xs font-extrabold">
                {userSession
                  ? locale === 'fr'
                    ? 'Compte connecté'
                    : 'Signed In'
                  : locale === 'fr'
                  ? 'Client Vérifié +237'
                  : 'Verified Customer +237'}
              </span>
              <h2 className="font-display text-xl font-bold text-white">
                {userSession?.fullName ||
                  orders[0]?.customer.fullName ||
                  'Client Lorena Market'}
              </h2>
              <p className="text-sm font-mono text-[#F4BE38]">
                {userSession?.phone || orders[0]?.customer.phone || '+237 693 71 25 25'}
              </p>
              {userSession?.email && (
                <p className="text-xs text-white/75">{userSession.email}</p>
              )}
              {!userSession && (
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="glass-pill-gold mt-2 w-full min-h-[40px] px-4 py-2 rounded-full text-[#000000] text-xs font-extrabold cursor-pointer"
                >
                  {locale === 'fr'
                    ? 'Se connecter avec téléphone ou Google'
                    : 'Sign in with Phone or Google'}
                </button>
              )}
            </div>

            <div className="ice-surface rounded-3xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#5A5AA1]">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>
                  {locale === 'fr' ? 'Adresse par défaut' : 'Default Address'}
                </span>
              </div>
              <p className="text-sm font-bold text-[#000000]">
                {orders[0]?.customer.quarter || 'Bonapriso'},{' '}
                {orders[0]?.customer.city || 'Douala'} (
                {orders[0]?.customer.region || 'Littoral'})
              </p>
              <p className="text-xs text-[#3F3F56]">
                {orders[0]?.customer.landmark || 'Rue Njo-Njo'}
              </p>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-8 ice-surface rounded-3xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/75">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#5A5AA1]" aria-hidden="true" />
                <h2 className="font-display text-lg font-extrabold text-[#000000]">
                  {locale === 'fr' ? 'Mes Commandes' : 'My Orders'} ({orders.length})
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                {csvExported && (
                  <span
                    role="status"
                    className="glass-pill-gold inline-flex items-center gap-1 px-3 py-1 rounded-full text-[#000000] text-xs font-bold"
                  >
                    <Check className="w-3.5 h-3.5 text-[#5A5AA1]" aria-hidden="true" />
                    <span>{locale === 'fr' ? 'CSV téléchargé' : 'CSV downloaded'}</span>
                  </span>
                )}
                <button
                  type="button"
                  disabled={orders.length === 0}
                  onClick={handleExportCsv}
                  className="glass-pill-frost min-h-[38px] px-4 py-1.5 rounded-full text-[#000000] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-3.5 h-3.5 text-[#5A5AA1]" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Exporter CSV' : 'Export CSV'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="ice-surface-subtle p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 hover:border-[#5A5AA1] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#000000]">
                        #{order.id}
                      </span>
                      <span className="glass-pill-gold px-2.5 py-0.5 rounded-full text-[#000000] text-[11px] font-bold">
                        {order.paymentVerified
                          ? 'Mobile Money OK'
                          : locale === 'fr'
                          ? 'Paiement Livraison'
                          : 'Cash on Delivery'}
                      </span>
                    </div>
                    <p className="text-xs text-[#3F3F56] font-medium mt-1">
                      {formatOrderDate(order.createdAt)} · {order.customer.city} (
                      {order.customer.quarter})
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-display font-extrabold text-base text-[#000000] tabular-nums mr-1">
                      {formatXAF(order.total)}
                    </span>
                    {onOpenInvoice && (
                      <button
                        type="button"
                        onClick={() => onOpenInvoice(order.id)}
                        className="glass-pill-black min-h-[38px] px-3.5 py-1.5 rounded-full text-[#F4BE38] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{locale === 'fr' ? 'Facture PDF' : 'PDF Invoice'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onInspectOrder(order.id)}
                      className="glass-pill-cta min-h-[38px] px-4 py-1.5 rounded-full text-white text-xs font-bold cursor-pointer"
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
