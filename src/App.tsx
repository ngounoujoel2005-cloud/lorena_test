/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { BellRing, X } from 'lucide-react';
import { ActionIconTooltip } from './components/ActionIconTooltip';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CartPageScreen } from './components/CartPageScreen';
import { CategoryCatalogScreen } from './components/CategoryCatalogScreen';
import { CategoryDrawer } from './components/CategoryDrawer';
import { CheckoutScreen } from './components/CheckoutScreen';
import { CompareBar } from './components/CompareBar';
import { CompareScreen } from './components/CompareScreen';
import { FloatingScrollControls } from './components/FloatingScrollControls';
import { Footer } from './components/Footer';
import { GeminiChatbot } from './components/GeminiChatbot';
import { HomePageScreen } from './components/HomePageScreen';
import { InvoiceView } from './components/InvoiceView';
import { LorenaRewardsScreen } from './components/LorenaRewardsScreen';
import { Navbar } from './components/Navbar';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { RestockWaitlistModal } from './components/RestockWaitlistModal';
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
  LoyaltyBonusEvent,
  OrderRecord,
  PaymentMethod,
  Product,
  ProductReview,
  RedeemedReward,
  RewardCatalogItem,
  UserSession,
  WaitlistEntry,
} from './types/store';
import { computeLoyaltySummary } from './utils/loyalty';

const CART_STORAGE_KEY = 'lorena_market_cart_v1';
const ORDERS_STORAGE_KEY = 'lorena_market_orders_v1';
const WISHLIST_STORAGE_KEY = 'lorena_market_wishlist_v1';
const COMPARE_STORAGE_KEY = 'lorena_market_compare_v1';
const CHAT_STORAGE_KEY = 'lorena_market_chat_v1';
const LOCALE_STORAGE_KEY = 'lorena_market_locale_v1';
const REVIEWS_STORAGE_KEY = 'lorena_market_reviews_v1';
const SESSION_STORAGE_KEY = 'lorena_market_session_v1';
const HISTORY_STORAGE_KEY = 'lorena_market_history_v1';
const WAITLIST_STORAGE_KEY = 'lorena_market_waitlist_v1';
const LOYALTY_BONUS_STORAGE_KEY = 'lorena_market_loyalty_bonus_v1';
const REDEEMED_REWARDS_STORAGE_KEY = 'lorena_market_redeemed_rewards_v1';

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

  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>(() => {
    try {
      const saved = localStorage.getItem(WAITLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return [];
  });

  const [loyaltyBonusEvents, setLoyaltyBonusEvents] = useState<
    LoyaltyBonusEvent[]
  >(() => {
    try {
      const saved = localStorage.getItem(LOYALTY_BONUS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return [];
  });

  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>(() => {
    try {
      const saved = localStorage.getItem(REDEEMED_REWARDS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore
    }
    return [];
  });

  const [waitlistProduct, setWaitlistProduct] = useState<Product | null>(null);
  const [restockAlert, setRestockAlert] = useState<{
    product: Product;
    email: string;
  } | null>(null);
  const restockTimerRef = useRef<number | null>(null);

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

  useEffect(() => {
    try {
      localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(waitlistEntries));
    } catch {
      // Ignore
    }
  }, [waitlistEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOYALTY_BONUS_STORAGE_KEY,
        JSON.stringify(loyaltyBonusEvents)
      );
    } catch {
      // Ignore
    }
  }, [loyaltyBonusEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(
        REDEEMED_REWARDS_STORAGE_KEY,
        JSON.stringify(redeemedRewards)
      );
    } catch {
      // Ignore
    }
  }, [redeemedRewards]);

  useEffect(() => {
    if (!userSession) return;
    setLoyaltyBonusEvents((prev) => {
      if (prev.some((ev) => ev.id === 'signup-bonus')) return prev;
      return [
        {
          id: 'signup-bonus',
          type: 'signup',
          titleFr: 'Bonus compte vérifié Lorena',
          titleEn: 'Verified Lorena Account Bonus',
          points: 25,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  }, [userSession]);

  useEffect(() => {
    if (wishlistIds.length < 2) return;
    setLoyaltyBonusEvents((prev) => {
      if (prev.some((ev) => ev.id === 'wishlist-collector')) return prev;
      return [
        {
          id: 'wishlist-collector',
          type: 'wishlist',
          titleFr: 'Bonus Collectionneur (2+ favoris)',
          titleEn: 'Wishlist Collector Bonus (2+ items)',
          points: 15,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  }, [wishlistIds.length]);

  useEffect(() => {
    return () => {
      if (restockTimerRef.current !== null) {
        window.clearTimeout(restockTimerRef.current);
      }
    };
  }, []);

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

    const reviewBonusId = `review-${input.productId}`;
    setLoyaltyBonusEvents((prev) => {
      if (prev.some((ev) => ev.id === reviewBonusId)) return prev;
      return [
        {
          id: reviewBonusId,
          type: 'review',
          titleFr: 'Avis produit publié',
          titleEn: 'Product review submitted',
          points: 20,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
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

  const triggerRestockAlert = (product: Product, email: string) => {
    if (restockTimerRef.current !== null) {
      window.clearTimeout(restockTimerRef.current);
      restockTimerRef.current = null;
    }
    setRestockAlert({ product, email });
  };

  const handleJoinWaitlist = (product: Product, email: string) => {
    const cleanEmail = email.trim();
    setWaitlistEntries((prev) => {
      const filtered = prev.filter((entry) => entry.productId !== product.id);
      return [
        {
          productId: product.id,
          email: cleanEmail,
          createdAt: new Date().toISOString(),
        },
        ...filtered,
      ];
    });
    if (restockTimerRef.current !== null) {
      window.clearTimeout(restockTimerRef.current);
    }
    restockTimerRef.current = window.setTimeout(() => {
      setRestockAlert({ product, email: cleanEmail });
      restockTimerRef.current = null;
    }, 5000);
  };

  const handleLeaveWaitlist = (productId: string) => {
    setWaitlistEntries((prev) =>
      prev.filter((entry) => entry.productId !== productId)
    );
  };

  const todayCheckinKey = `checkin-${new Date().toISOString().slice(0, 10)}`;
  const canClaimDailyCheckin = !loyaltyBonusEvents.some(
    (ev) => ev.id === todayCheckinKey
  );

  const handleClaimDailyCheckin = () => {
    setLoyaltyBonusEvents((prev) => {
      if (prev.some((ev) => ev.id === todayCheckinKey)) return prev;
      return [
        {
          id: todayCheckinKey,
          type: 'checkin',
          titleFr: 'Check-in quotidien Lorena',
          titleEn: 'Daily Lorena Check-in',
          points: 10,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const handleRedeemReward = (reward: RewardCatalogItem) => {
    const summary = computeLoyaltySummary(
      orders,
      loyaltyBonusEvents,
      redeemedRewards
    );
    if (summary.availablePoints < reward.pointsCost) return;
    setRedeemedRewards((prev) => [
      {
        redemptionId: `red-${Date.now()}`,
        rewardId: reward.id,
        titleFr: reward.titleFr,
        titleEn: reward.titleEn,
        pointsCost: reward.pointsCost,
        promoCode: reward.promoCode,
        redeemedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleApplyPromoToCart = (promoCode: string) => {
    setAppliedPromoCode(promoCode);
    navigateTo('cart');
  };

  const waitlistIds = waitlistEntries.map((entry) => entry.productId);
  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const comparedProducts = compareIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="min-h-screen flex flex-col lorena-ice-canvas text-[#000000]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[120] glass-pill-black text-[#F4BE38] px-4 py-2 rounded-full text-xs font-extrabold shadow-xl"
      >
        {locale === 'fr'
          ? 'Aller au contenu principal'
          : 'Skip to main content'}
      </a>
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
        onSelectCategory={handleSelectCategory}
        onSelectProduct={handleSelectProduct}
        onNavigate={navigateTo}
        onOpenCart={() => setCartOpen(true)}
        onOpenCategoryDrawer={() => setCategoryDrawerOpen(true)}
        onOpenAuth={handleOpenAuth}
        onLogout={() => setUserSession(null)}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {activeScreen === 'home' && (
          <HomePageScreen
            locale={locale}
            wishlistIds={wishlistIds}
            compareIds={compareIds}
            historyIds={historyIds}
            waitlistIds={waitlistIds}
            recentlyAddedId={recentlyAddedId}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onNotifyMe={setWaitlistProduct}
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
            waitlistIds={waitlistIds}
            recentlyAddedId={recentlyAddedId}
            onSelectCategory={(slug) => setActiveCategory(slug)}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            onBackHome={() => navigateTo('home')}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onNotifyMe={setWaitlistProduct}
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
            waitlistIds={waitlistIds}
            waitlistEmail={
              waitlistEntries.find((e) => e.productId === selectedProduct.id)
                ?.email
            }
            recentlyAddedId={recentlyAddedId}
            reviews={reviews}
            onBackToCatalog={() => navigateTo('home')}
            onSelectCategory={(slug) => handleSelectCategory(slug)}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onNotifyMe={setWaitlistProduct}
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
            waitlistIds={waitlistIds}
            recentlyAddedId={recentlyAddedId}
            onAddCompare={handleAddCompare}
            onRemoveCompare={(id) =>
              setCompareIds((prev) => prev.filter((item) => item !== id))
            }
            onClearCompare={() => setCompareIds([])}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onNotifyMe={setWaitlistProduct}
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
            waitlistIds={waitlistIds}
            recentlyAddedId={recentlyAddedId}
            onApplyPromoCode={setAppliedPromoCode}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProceedToCheckout={() => navigateTo('checkout')}
            onContinueShopping={() => navigateTo('home')}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onNotifyMe={setWaitlistProduct}
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
            waitlistIds={waitlistIds}
            orders={orders}
            bonusEvents={loyaltyBonusEvents}
            redeemedRewards={redeemedRewards}
            userSession={userSession}
            recentlyAddedId={recentlyAddedId}
            onBackHome={() => navigateTo('home')}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onNotifyMe={setWaitlistProduct}
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
            onOpenRewards={() => navigateTo('rewards')}
            onOpenAuth={handleOpenAuth}
            onLogout={() => setUserSession(null)}
          />
        )}

        {activeScreen === 'rewards' && (
          <LorenaRewardsScreen
            locale={locale}
            orders={orders}
            bonusEvents={loyaltyBonusEvents}
            redeemedRewards={redeemedRewards}
            userSession={userSession}
            wishlistCount={wishlistIds.length}
            appliedPromoCode={appliedPromoCode}
            canClaimDailyCheckin={canClaimDailyCheckin}
            onClaimDailyCheckin={handleClaimDailyCheckin}
            onRedeemReward={handleRedeemReward}
            onApplyPromoToCart={handleApplyPromoToCart}
            onInspectOrder={(orderId) => {
              setActiveOrderId(orderId);
              navigateTo('tracking');
            }}
            onOpenAuth={() => handleOpenAuth('register')}
            onOpenAccount={() => navigateTo('account')}
            onBrowseCatalog={() => handleSelectCategory('all')}
            onBackHome={() => navigateTo('home')}
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

      {restockAlert && (
        <div
          role="status"
          className="fixed top-28 right-4 z-[95] max-w-sm p-4 rounded-2xl ice-obsidian text-[#FFFDF5] shadow-2xl border border-[#F4BE38]/60"
        >
          <div className="flex items-start gap-3">
            <ActionIconTooltip
              text={
                locale === 'fr'
                  ? 'Notification de réapprovisionnement simulée.'
                  : 'Simulated restock notification.'
              }
            >
              <div className="w-9 h-9 rounded-xl bg-[#F4BE38] text-[#1A1033] flex items-center justify-center shrink-0">
                <BellRing className="w-4 h-4" />
              </div>
            </ActionIconTooltip>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#F4BE38]">
                {locale === 'fr'
                  ? 'Alerte Réapprovisionnement'
                  : 'Restock Alert'}
              </p>
              <p className="text-xs font-bold text-white mt-0.5 line-clamp-2">
                {locale === 'fr'
                  ? restockAlert.product.nameFr
                  : restockAlert.product.nameEn}
              </p>
              <p className="text-[11px] text-[#E6DCF8] mt-1">
                {locale === 'fr'
                  ? `Notification prête pour ${restockAlert.email}`
                  : `Alert ready for ${restockAlert.email}`}
              </p>
              <button
                type="button"
                onClick={() => {
                  const target = restockAlert.product;
                  setRestockAlert(null);
                  handleSelectProduct(target);
                }}
                className="mt-2 px-3 py-1 rounded-full glass-pill-gold text-[11px] font-extrabold"
              >
                {locale === 'fr' ? 'Voir l’article' : 'View Item'}
              </button>
            </div>
            <ActionIconTooltip
              text={
                locale === 'fr'
                  ? 'Fermer cette alerte de réapprovisionnement.'
                  : 'Dismiss this restock alert.'
              }
            >
              <button
                type="button"
                onClick={() => setRestockAlert(null)}
                aria-label={locale === 'fr' ? 'Fermer' : 'Close'}
                className="w-7 h-7 rounded-lg ice-surface flex items-center justify-center text-[#1A1033]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </ActionIconTooltip>
          </div>
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

      <FloatingScrollControls
        locale={locale}
        elevated={activeScreen === 'product'}
        hidden={chatOpen}
      />

      <GeminiChatbot
        locale={locale}
        isOpen={chatOpen}
        onOpenChange={setChatOpen}
        messages={chatMessages}
        onMessagesChange={setChatMessages}
        activeScreen={activeScreen}
        activeCategory={activeCategory}
        activeProduct={activeScreen === 'product' ? selectedProduct : null}
        comparedProducts={comparedProducts}
        cart={cart}
        appliedPromoCode={appliedPromoCode}
        wishlistIds={wishlistIds}
        waitlistIds={waitlistIds}
        orders={orders}
        userSession={userSession}
        queuedPrompt={queuedChatPrompt}
        onClearQueuedPrompt={() => setQueuedChatPrompt(null)}
        onNavigate={navigateTo}
        onSelectCategory={(slug) => handleSelectCategory(slug)}
        onSelectProduct={handleSelectProduct}
        onInspectOrder={(orderId) => {
          setActiveOrderId(orderId);
          navigateTo('tracking');
        }}
        elevated={activeScreen === 'product'}
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

      <RestockWaitlistModal
        product={waitlistProduct}
        locale={locale}
        defaultEmail={userSession?.email}
        existingEntry={
          waitlistProduct
            ? waitlistEntries.find(
                (entry) => entry.productId === waitlistProduct.id
              )
            : undefined
        }
        onClose={() => setWaitlistProduct(null)}
        onJoinWaitlist={handleJoinWaitlist}
        onLeaveWaitlist={handleLeaveWaitlist}
        onSimulateRestockAlert={triggerRestockAlert}
      />
    </div>
  );
}
