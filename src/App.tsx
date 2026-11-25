/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CategoryCatalogScreen } from './components/CategoryCatalogScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { Footer } from './components/Footer';
import { HomePageScreen } from './components/HomePageScreen';
import { Navbar } from './components/Navbar';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { TrackingScreen } from './components/TrackingScreen';
import { WarrantyScreen } from './components/WarrantyScreen';
import { WishlistAccountScreen } from './components/WishlistAccountScreen';
import { INITIAL_ORDERS, PRODUCTS } from './data/catalog';
import {
  AppScreen,
  CartItem,
  CategorySlug,
  Locale,
  OrderRecord,
  Product,
} from './types/store';

const CART_STORAGE_KEY = 'lorena_market_cart_v1';
const ORDERS_STORAGE_KEY = 'lorena_market_orders_v1';
const WISHLIST_STORAGE_KEY = 'lorena_market_wishlist_v1';
const LOCALE_STORAGE_KEY = 'lorena_market_locale_v1';

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
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

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

  const [activeOrderId, setActiveOrderId] = useState<string | null>(
    orders[0]?.id ?? null
  );

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
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      document.documentElement.lang = locale;
    } catch {
      // Ignore
    }
  }, [locale]);

  const navigateTo = (screen: AppScreen) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (slug: CategorySlug) => {
    setActiveCategory(slug);
    navigateTo('category');
  };

  const handleSearchSubmit = () => {
    navigateTo('category');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigateTo('product');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addItemToCart = (product: Product, variantId: string, quantity: number) => {
    if (product.stockQty <= 0) return;
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
    navigateTo('tracking');
  };

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#000000]">
      <Navbar
        locale={locale}
        activeScreen={activeScreen}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        cartCount={totalBagCount}
        wishlistCount={wishlistIds.length}
        onToggleLocale={() => setLocale((l) => (l === 'fr' ? 'en' : 'fr'))}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onSelectCategory={handleSelectCategory}
        onNavigate={navigateTo}
        onOpenCart={() => setCartOpen(true)}
      />

      <main className="flex-1">
        {activeScreen === 'home' && (
          <HomePageScreen
            locale={locale}
            wishlistIds={wishlistIds}
            recentlyAddedId={recentlyAddedId}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onToggleWishlist={handleToggleWishlist}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {activeScreen === 'category' && (
          <CategoryCatalogScreen
            locale={locale}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            wishlistIds={wishlistIds}
            recentlyAddedId={recentlyAddedId}
            onSelectCategory={setActiveCategory}
            onClearSearch={() => setSearchQuery('')}
            onBackHome={() => navigateTo('home')}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeScreen === 'product' && (
          <ProductDetailScreen
            key={selectedProduct.id}
            product={selectedProduct}
            locale={locale}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onBackToCatalog={() => navigateTo('home')}
            onAddToCart={addItemToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeScreen === 'checkout' && (
          <CheckoutScreen
            locale={locale}
            items={cart}
            onBackToCatalog={() => navigateTo('home')}
            onCompleteOrder={handleCompleteOrder}
          />
        )}

        {activeScreen === 'tracking' && (
          <TrackingScreen
            locale={locale}
            orders={orders}
            activeOrderId={activeOrderId}
            onSelectOrder={setActiveOrderId}
            onBackToCatalog={() => navigateTo('home')}
          />
        )}

        {(activeScreen === 'wishlist' || activeScreen === 'account') && (
          <WishlistAccountScreen
            mode={activeScreen}
            locale={locale}
            wishlistIds={wishlistIds}
            orders={orders}
            recentlyAddedId={recentlyAddedId}
            onBackHome={() => navigateTo('home')}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onToggleWishlist={handleToggleWishlist}
            onInspectOrder={(orderId) => {
              setActiveOrderId(orderId);
              navigateTo('tracking');
            }}
          />
        )}

        {activeScreen === 'help' && (
          <WarrantyScreen
            locale={locale}
            orders={orders}
            onBackToCatalog={() => navigateTo('home')}
            onGoToTracking={() => navigateTo('tracking')}
          />
        )}
      </main>

      <Footer locale={locale} onNavigate={navigateTo} />

      <CartDrawer
        isOpen={cartOpen}
        locale={locale}
        items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          navigateTo('checkout');
        }}
      />
    </div>
  );
}
