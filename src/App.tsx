/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CartPageScreen } from './components/CartPageScreen';
import { CategoryCatalogScreen } from './components/CategoryCatalogScreen';
import { CategoryDrawer } from './components/CategoryDrawer';
import { CheckoutScreen } from './components/CheckoutScreen';
import { CompareBar } from './components/CompareBar';
import { CompareScreen } from './components/CompareScreen';
import { Footer } from './components/Footer';
import { GeminiChatbot } from './components/GeminiChatbot';
import { HomePageScreen } from './components/HomePageScreen';
import { InvoiceView } from './components/InvoiceView';
import { Navbar } from './components/Navbar';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { TrackingScreen } from './components/TrackingScreen';
import { WarrantyScreen } from './components/WarrantyScreen';
import { WishlistAccountScreen } from './components/WishlistAccountScreen';
import { INITIAL_ORDERS, PRODUCTS } from './data/catalog';
import { INITIAL_REVIEWS } from './data/helpAndCategories';
import {
  AppScreen,
  CartItem,
  CategorySlug,
  ChatMessage,
  Locale,
  OrderRecord,
  PaymentMethod,
  Product,
  ProductReview,
  UserSession,
} from './types/store';

const CART_STORAGE_KEY = 'lorena_market_cart_v1';
const ORDERS_STORAGE_KEY = 'lorena_market_orders_v1';
const WISHLIST_STORAGE_KEY = 'lorena_market_wishlist_v1';
const COMPARE_STORAGE_KEY = 'lorena_market_compare_v1';
const CHAT_STORAGE_KEY = 'lorena_market_chat_v1';
const LOCALE_STORAGE_KEY = 'lorena_market_locale_v1';
const REVIEWS_STORAGE_KEY = 'lorena_market_reviews_v1';
const SESSION_STORAGE_KEY = 'lorena_market_session_v1';
const HISTORY_STORAGE_KEY = 'lorena_market_history_v1';

const DEFAULT_CART: CartItem[] = [
  {
    productId: PRODUCTS[0].id,
    variantId: PRODUCTS[0].variants[0].id,
    variantLabel: PRODUCTS[0].variants[0].labelFr,
    name: PRODUCTS[0].nameFr,
    brand: PRODUCTS[0].brand,
    image: PRODUCTS[0].image,
    unitPrice: PRODUCTS[0].price,
    warrantyMonths: PRODUCTS[0].warrantyMonths,
    quantity: 1,
  },
];

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (saved === 'fr' || saved === 'en') return saved;
    } catch {
      // Ignore
    }
    return 'fr';
  });

  const [activeScreen, setActiveScreen] = useState<AppScreen>('home');
  const [activeCategory, setActiveCategory] = useState<CategorySlug>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [cartOpen, setCartOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [compareLimitToast, setCompareLimitToast] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [queuedChatPrompt, setQueuedChatPrompt] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return DEFAULT_CART;
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return ['iphone-13-pro-sm', 'fridge-ocean-130'];
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return INITIAL_REVIEWS;
  });

  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as UserSession;
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const [historyIds, setHistoryIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return ['fridge-ocean-130', 'iphone-13-pro-sm', 'tv-hisense-40', 'powerbank-hoco-20k'];
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(
    orders[0]?.id ?? null
  );

  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.slice(0, 3);
      }
    } catch {
      // Ignore
    }
    return [];
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch {
      // Ignore
    }
  }, [reviews]);

  useEffect(() => {
    try {
      if (userSession) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userSession));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }, [userSession]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyIds));
    } catch {
      // Ignore
    }
  }, [historyIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      document.documentElement.lang = locale;
    } catch {
      // Ignore
    }
  }, [locale]);

  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareIds));
    } catch {
      // Ignore
    }
  }, [compareIds]);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatMessages.slice(-40)));
    } catch {
      // Ignore
    }
  }, [chatMessages]);

  const navigateTo = (screen: AppScreen) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (slug: CategorySlug, query?: string) => {
    setActiveCategory(slug);
    if (query !== undefined) {
      setSearchQuery(query);
    }
    navigateTo('category');
  };

  const handleSearchSubmit = () => {
    navigateTo('category');
  };

  const pushToHistory = (productId: string) => {
    setHistoryIds((prev) =>
      [productId, ...prev.filter((id) => id !== productId)].slice(0, 8)
    );
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    pushToHistory(product.id);
    navigateTo('product');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      pushToHistory(productId);
      return [...prev, productId];
    });
  };

  const triggerCompareLimitToast = () => {
    setCompareLimitToast(true);
    setTimeout(() => setCompareLimitToast(false), 3000);
  };

  const handleToggleCompare = (productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        triggerCompareLimitToast();
        return prev;
      }
      return [...prev, productId];
    });
  };

  const handleAddCompare = (productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) return prev;
      if (prev.length >= 3) {
        triggerCompareLimitToast();
        return prev;
      }
      return [...prev, productId];
    });
  };

  const addItemToCart = (product: Product, variantId: string, quantity: number) => {
    if (product.stockQty <= 0) return;
    pushToHistory(product.id);
    const variant =
      product.variants.find((v) => v.id === variantId) ?? product.variants[0];
    const unitPrice = product.price + variant.priceDelta;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id && item.variantId === variant.id
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant.id,
          variantLabel: locale === 'fr' ? variant.labelFr : variant.labelEn,
          name: locale === 'fr' ? product.nameFr : product.nameEn,
          brand: product.brand,
          image: product.image,
          unitPrice,
          warrantyMonths: product.warrantyMonths,
          quantity,
        },
      ];
    });
  };

  const handleQuickAdd = (product: Product) => {
    addItemToCart(product, product.variants[0].id, 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1400);
  };

  const handleBuyNow = (product: Product, variantId: string, quantity: number) => {
    addItemToCart(product, variantId, quantity);
    setCartOpen(false);
    navigateTo('checkout');
  };

  const handleUpdateQuantity = (
    productId: string,
    variantId: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.variantId === variantId)
      )
    );
  };

  const handleCompleteOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setActiveOrderId(order.id);
    setCart([]);
    setAppliedPromoCode(null);
    navigateTo('invoice');
  };

  const handleUpdateOrderStage = (
    orderId: string,
    stageIndex: 0 | 1 | 2 | 3
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, stageIndex } : order
      )
    );
  };

  const handleUpdateOrderPayment = (
    orderId: string,
    paymentMethod: PaymentMethod,
    paymentPhone?: string
  ) => {
    const prefix =
      paymentMethod === 'mtn_momo'
        ? 'MOMO'
        : paymentMethod === 'orange_money'
        ? 'OM'
        : 'COD';
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              paymentMethod,
              paymentPhone:
                paymentMethod === 'cod'
                  ? undefined
                  : paymentPhone || order.paymentPhone || order.customer.phone,
              paymentVerified: paymentMethod !== 'cod',
              paymentReference: `${prefix}-237-${Math.floor(
                100000 + Math.random() * 899999
              )}`,
            }
          : order
      )
    );
  };

  const handleAddReview = (
    input: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>
  ) => {
    const newReview: ProductReview = {
      ...input,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      helpfulCount: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleMarkReviewHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      )
    );
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const comparedProducts = compareIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="min-h-screen flex flex-col lorena-ice-canvas text-[#000000]">
      <Navbar
        locale={locale}
        activeScreen={activeScreen}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        cartCount={totalBagCount}
        wishlistCount={wishlistIds.length}
        compareCount={compareIds.length}
        userSession={userSession}
        onToggleLocale={() => setLocale((l) => (l === 'fr' ? 'en' : 'fr'))}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onSelectCategory={(slug) => handleSelectCategory(slug)}
        onSelectProduct={handleSelectProduct}
        onNavigate={navigateTo}
        onOpenCart={() => setCartOpen(true)}
        onOpenCategoryDrawer={() => setCategoryDrawerOpen(true)}
        onOpenAuth={handleOpenAuth}
        onLogout={() => setUserSession(null)}
      />

      <main className="flex-1">
        {activeScreen === 'home' && (
          <HomePageScreen
            locale={locale}
            wishlistIds={wishlistIds}
            compareIds={compareIds}
            historyIds={historyIds}
            recentlyAddedId={recentlyAddedId}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onToggleWishlist={handleToggleWishlist}
            onToggleCompare={handleToggleCompare}
            onSelectCategory={(slug) => handleSelectCategory(slug)}
            onClearHistory={() => setHistoryIds([])}
          />
        )}

        {activeScreen === 'category' && (
          <CategoryCatalogScreen
            locale={locale}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            wishlistIds={wishlistIds}
            compareIds={compareIds}
            recentlyAddedId={recentlyAddedId}
            onSelectCategory={(slug) => setActiveCategory(slug)}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            onBackHome={() => navigateTo('home')}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onToggleWishlist={handleToggleWishlist}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {activeScreen === 'product' && (
          <ProductDetailScreen
            key={selectedProduct.id}
            product={selectedProduct}
            locale={locale}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            wishlistIds={wishlistIds}
            compareIds={compareIds}
            recentlyAddedId={recentlyAddedId}
            reviews={reviews}
            onBackToCatalog={() => navigateTo('home')}
            onSelectCategory={(slug) => handleSelectCategory(slug)}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onAddToCart={addItemToCart}
            onBuyNow={handleBuyNow}
            onOpenCartPage={() => navigateTo('cart')}
            onGoToReturnPolicy={() => navigateTo('help')}
            onToggleWishlist={handleToggleWishlist}
            onToggleCompare={handleToggleCompare}
            onAddReview={handleAddReview}
            onMarkReviewHelpful={handleMarkReviewHelpful}
          />
        )}

        {activeScreen === 'compare' && (
          <CompareScreen
            locale={locale}
            compareIds={compareIds}
            recentlyAddedId={recentlyAddedId}
            onAddCompare={handleAddCompare}
            onRemoveCompare={(id) =>
              setCompareIds((prev) => prev.filter((item) => item !== id))
            }
            onClearCompare={() => setCompareIds([])}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onBackHome={() => navigateTo('home')}
            onAskAiComparison={(prompt) => {
              setQueuedChatPrompt(prompt);
              setChatOpen(true);
            }}
          />
        )}

        {activeScreen === 'cart' && (
          <CartPageScreen
            locale={locale}
            items={cart}
            appliedPromoCode={appliedPromoCode}
            historyIds={historyIds}
            wishlistIds={wishlistIds}
            compareIds={compareIds}
            recentlyAddedId={recentlyAddedId}
            onApplyPromoCode={setAppliedPromoCode}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProceedToCheckout={() => navigateTo('checkout')}
            onContinueShopping={() => navigateTo('home')}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onToggleWishlist={handleToggleWishlist}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {activeScreen === 'checkout' && (
          <CheckoutScreen
            locale={locale}
            items={cart}
            appliedPromoCode={appliedPromoCode}
            userSession={userSession}
            onBackToCart={() => navigateTo('cart')}
            onBackToCatalog={() => navigateTo('home')}
            onCompleteOrder={handleCompleteOrder}
          />
        )}

        {activeScreen === 'invoice' && (
          <InvoiceView
            locale={locale}
            orders={orders}
            activeOrderId={activeOrderId}
            onSelectOrder={setActiveOrderId}
            onUpdateOrderPayment={handleUpdateOrderPayment}
            onGoToTracking={() => navigateTo('tracking')}
            onBackToCatalog={() => navigateTo('home')}
          />
        )}

        {activeScreen === 'tracking' && (
          <TrackingScreen
            locale={locale}
            orders={orders}
            activeOrderId={activeOrderId}
            onSelectOrder={setActiveOrderId}
            onUpdateOrderStage={handleUpdateOrderStage}
            onOpenInvoiceView={() => navigateTo('invoice')}
            onBackToCatalog={() => navigateTo('home')}
          />
        )}

        {(activeScreen === 'wishlist' || activeScreen === 'account') && (
          <WishlistAccountScreen
            mode={activeScreen}
            locale={locale}
            wishlistIds={wishlistIds}
            compareIds={compareIds}
            orders={orders}
            userSession={userSession}
            recentlyAddedId={recentlyAddedId}
            onBackHome={() => navigateTo('home')}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onToggleWishlist={handleToggleWishlist}
            onToggleCompare={handleToggleCompare}
            onInspectOrder={(orderId) => {
              setActiveOrderId(orderId);
              navigateTo('tracking');
            }}
            onOpenInvoice={(orderId) => {
              setActiveOrderId(orderId);
              navigateTo('invoice');
            }}
            onOpenAuth={handleOpenAuth}
            onLogout={() => setUserSession(null)}
          />
        )}

        {activeScreen === 'help' && (
          <WarrantyScreen
            locale={locale}
            orders={orders}
            onBackToCatalog={() => navigateTo('home')}
            onGoToTracking={() => navigateTo('tracking')}
            onBrowseOffers={() => handleSelectCategory('all')}
          />
        )}
      </main>

      <Footer locale={locale} onNavigate={navigateTo} />

      {compareLimitToast && (
        <div
          role="status"
          className="fixed top-28 right-4 z-50 px-4 py-2.5 rounded-full ice-obsidian text-[#F4BE38] text-xs font-bold"
        >
          {locale === 'fr'
            ? 'Maximum 3 produits dans le comparateur.'
            : 'Maximum 3 products can be compared at once.'}
        </div>
      )}

      {activeScreen !== 'compare' && (
        <CompareBar
          locale={locale}
          compareIds={compareIds}
          elevated={activeScreen === 'product'}
          onRemoveCompare={(id) =>
            setCompareIds((prev) => prev.filter((item) => item !== id))
          }
          onClearCompare={() => setCompareIds([])}
          onOpenCompareScreen={() => navigateTo('compare')}
        />
      )}

      <GeminiChatbot
        locale={locale}
        isOpen={chatOpen}
        onOpenChange={setChatOpen}
        messages={chatMessages}
        onMessagesChange={setChatMessages}
        activeProduct={activeScreen === 'product' ? selectedProduct : null}
        comparedProducts={comparedProducts}
        queuedPrompt={queuedChatPrompt}
        onClearQueuedPrompt={() => setQueuedChatPrompt(null)}
      />

      <CartDrawer
        isOpen={cartOpen}
        locale={locale}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenFullCart={() => {
          setCartOpen(false);
          navigateTo('cart');
        }}
        onProceedToCheckout={() => {
          setCartOpen(false);
          navigateTo('checkout');
        }}
      />

      <CategoryDrawer
        isOpen={categoryDrawerOpen}
        locale={locale}
        onClose={() => setCategoryDrawerOpen(false)}
        onSelectCategory={handleSelectCategory}
      />

      <AuthModal
        key={authModalMode}
        isOpen={authModalOpen}
        initialMode={authModalMode}
        locale={locale}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(session) => setUserSession(session)}
      />
    </div>
  );
}
