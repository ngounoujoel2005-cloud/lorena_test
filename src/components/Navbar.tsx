import {
  ChevronDown,
  ChevronRight,
  FileText,
  Globe,
  Heart,
  HelpCircle,
  Info,
  LayoutGrid,
  LogOut,
  Package,
  Scale,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  User,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES_META, PRODUCTS } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { AppScreen, CategorySlug, Locale, Product, UserSession } from '../types/store';
import { formatXAF } from '../utils/format';
import { ActionIconTooltip } from './ActionIconTooltip';
import { ProductImage } from './ProductImage';

interface NavbarProps {
  locale: Locale;
  activeScreen: AppScreen;
  activeCategory: CategorySlug;
  searchQuery: string;
  cartCount: number;
  wishlistCount: number;
  compareCount: number;
  userSession: UserSession | null;
  onToggleLocale: () => void;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onSelectCategory: (slug: CategorySlug) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (screen: AppScreen) => void;
  onOpenCart: () => void;
  onOpenCategoryDrawer: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export function Navbar({
  locale,
  activeScreen,
  activeCategory,
  searchQuery,
  cartCount,
  wishlistCount,
  compareCount,
  userSession,
  onToggleLocale,
  onSearchChange,
  onSearchSubmit,
  onSelectCategory,
  onSelectProduct,
  onNavigate,
  onOpenCart,
  onOpenCategoryDrawer,
  onOpenAuth,
  onLogout,
}: NavbarProps) {
  const t = TRANSLATIONS[locale];
  const catScrollRef = useRef<HTMLDivElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const [searchFocused, setSearchFocused] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const topCategories = CATEGORIES_META.filter((c) => c.showInTopNav);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return PRODUCTS.filter(
      (p) =>
        p.nameFr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchFocused(false);
    onSearchSubmit();
  };

  const scrollCatsRight = () => {
    if (catScrollRef.current) {
      catScrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const showSuggestionsDropdown = searchFocused && searchQuery.trim().length >= 2;

  return (
    <header className="no-print sticky top-0 z-40 shadow-[0_10px_30px_-10px_rgba(45,36,12,0.22)]">
      {/* Slim Top Campaign Banner (Obsidian Ice) */}
      <div className="ice-obsidian border-x-0 border-t-0 border-b border-white/25 text-white">
        <div className="max-w-[1360px] mx-auto px-4 py-1.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="glass-pill-cta px-2.5 py-0.5 rounded-full text-white font-display font-bold text-[11px] uppercase tracking-wide">
              Lorena Promo
            </span>
            <span className="text-white/90 hidden sm:inline">
              {t.topPromoPrefix}
            </span>
          </div>
          <div className="flex items-center gap-2 font-display font-bold tracking-wide">
            <span className="glass-pill-gold px-3 py-0.5 rounded-full text-[#000000] text-xs">
              {t.topPromoDates}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Row (Yellow Frosted Ice Glass) */}
      <div className="bg-gradient-to-r from-[#FFF7CC]/90 via-[#FFE47A]/86 to-[#F4BE38]/88 backdrop-blur-xl border-b border-white/80 text-[#000000]">
        <div className="max-w-[1360px] mx-auto px-4 py-3 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 lg:gap-6">
          {/* Brand Logo */}
          <ActionIconTooltip
            placement="bottom"
            text={
              locale === 'fr'
                ? 'Retour à la page d’accueil Lorena Market'
                : 'Return to Lorena Market homepage'
            }
          >
            <button
              type="button"
              onClick={() => onNavigate('home')}
              aria-label="Lorena Market"
              className="glass-pill-frost flex items-center shrink-0 px-3.5 py-1.5 rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-[#5A5AA1]"
            >
              {!logoFailed ? (
                <img
                  src="/assets/aistudio/lorena-logo-noir-transparent_36764768.png"
                  alt="Lorena Market"
                  onError={() => setLogoFailed(true)}
                  className="h-7 sm:h-8 w-auto object-contain"
                />
              ) : (
                <span className="inline-flex items-center gap-1.5 py-0.5 font-display text-sm font-extrabold text-[#000000]">
                  <ShoppingBag className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
                  <span>Lorena Market</span>
                </span>
              )}
            </button>
          </ActionIconTooltip>

          {/* Search Bar + Live Suggestions Dropdown (Liquid Glass Pill) */}
          <div
            ref={searchWrapperRef}
            className="relative order-3 lg:order-2 w-full lg:flex-1 lg:max-w-xl"
          >
            <form
              onSubmit={handleFormSubmit}
              className="glass-search-bar flex items-center rounded-full p-1"
            >
              <ActionIconTooltip
                focusable
                placement="bottom"
                className="inline-flex items-center shrink-0 ml-3"
                text={
                  locale === 'fr'
                    ? 'Rechercher par nom, marque ou code SKU'
                    : 'Search by product name, brand, or SKU'
                }
              >
                <span className="flex items-center shrink-0">
                  <Search
                    className="w-4 h-4 text-[#5A5AA1]"
                    aria-hidden="true"
                  />
                </span>
              </ActionIconTooltip>
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setSearchFocused(true);
                }}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                className="flex-1 bg-transparent px-3 py-1.5 text-sm text-[#000000] font-medium placeholder:text-[#3F3F56]/75 focus:outline-none min-w-0"
              />
              <button
                type="submit"
                className="glass-pill-cta min-h-[36px] px-4 py-1.5 rounded-full text-white text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.searchBtn}
              </button>
            </form>

            {showSuggestionsDropdown && (
              <div className="ice-surface absolute left-0 right-0 top-full mt-2 text-[#000000] rounded-3xl overflow-hidden z-50">
                {/* Language Tip Banner */}
                <div className="px-4 py-2.5 bg-[#F4BE38]/30 border-b border-white/70 flex items-start gap-2 text-[11px] text-[#000000]">
                  <Info
                    className="w-4 h-4 text-[#5A5AA1] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    {locale === 'fr'
                      ? 'Pour obtenir les meilleurs résultats de recherche, vérifiez la langue sélectionnée (FR/EN) ou tapez une référence SKU.'
                      : 'For best search accuracy, check your selected site language (FR/EN) or enter a product SKU.'}
                  </span>
                </div>

                <div className="px-4 py-2 bg-white/45 border-b border-white/70 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#3F3F56]">
                  <span>{locale === 'fr' ? 'Suggestions' : 'Suggestions'}</span>
                  <span className="tabular-nums">
                    {suggestions.length}{' '}
                    {locale === 'fr' ? 'résultat(s)' : 'match(es)'}
                  </span>
                </div>

                {suggestions.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-[#3F3F56]">
                    {locale === 'fr'
                      ? `Aucun produit trouvé pour « ${searchQuery} ».`
                      : `No products matching "${searchQuery}".`}
                  </div>
                ) : (
                  <div className="max-h-[320px] overflow-y-auto divide-y divide-white/60">
                    {suggestions.map((p) => {
                      const name = locale === 'fr' ? p.nameFr : p.nameEn;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSearchFocused(false);
                            onSelectProduct(p);
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/55 text-left cursor-pointer transition-colors"
                        >
                          <div className="ice-product-trap w-11 h-11 rounded-xl p-1 shrink-0">
                            <ProductImage
                              src={p.image}
                              alt={name}
                              className="w-full h-full object-contain relative z-10"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#000000] truncate">
                              {name}
                            </p>
                            <p className="text-[11px] font-mono text-[#3F3F56]">
                              {p.sku} · {p.brand}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="block font-display text-xs font-bold text-[#000000] tabular-nums">
                              {formatXAF(p.price)}
                            </span>
                            {p.oldPrice && (
                              <span className="block text-[10px] text-[#3F3F56] line-through tabular-nums">
                                {formatXAF(p.oldPrice)}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="bg-[#5A5AA1]/15 border-t border-white/75 divide-y divide-white/50">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchFocused(false);
                      onSelectCategory('all');
                    }}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-[#000000] hover:bg-white/40 cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2">
                      <SlidersHorizontal
                        className="w-3.5 h-3.5 text-[#5A5AA1]"
                        aria-hidden="true"
                      />
                      <span>
                        {locale === 'fr' ? 'Recherche avancée' : 'Advanced search'}
                      </span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchFocused(false);
                      onSearchSubmit();
                    }}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-[#5A5AA1] hover:bg-white/40 cursor-pointer"
                  >
                    <span>
                      {locale === 'fr'
                        ? `Voir tous les résultats pour « ${searchQuery} »`
                        : `View all results for "${searchQuery}"`}
                    </span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Utility Actions (Crystal Glass Pills) */}
          <div className="order-2 lg:order-3 flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* FR / EN Selector */}
            <ActionIconTooltip
              placement="bottom"
              text={
                locale === 'fr'
                  ? 'Basculer la langue du site (Français / Anglais)'
                  : 'Switch site language (French / English)'
              }
            >
              <button
                type="button"
                onClick={onToggleLocale}
                aria-label="Changer de langue"
                className="glass-pill-frost min-h-[38px] px-3 py-1.5 rounded-full text-xs font-bold text-[#000000] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Globe className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
                <span>{locale.toUpperCase()}</span>
              </button>
            </ActionIconTooltip>

            {/* Comparateur */}
            <ActionIconTooltip
              placement="bottom"
              text={
                locale === 'fr'
                  ? 'Ouvrir le comparateur côte à côte (jusqu’à 3 produits)'
                  : 'Open side-by-side product comparison (up to 3 items)'
              }
            >
              <button
                type="button"
                onClick={() => onNavigate('compare')}
                className={`relative min-h-[40px] px-2.5 py-1.5 rounded-full flex items-center gap-2 text-left cursor-pointer transition-all ${
                  activeScreen === 'compare'
                    ? 'glass-pill-cta text-white'
                    : 'glass-pill-frost text-[#000000]'
                }`}
              >
                <div className="relative">
                  <Scale className="w-4 h-4" aria-hidden="true" />
                  {compareCount > 0 && (
                    <span className="glass-pill-gold absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full text-[#000000] text-[10px] font-extrabold flex items-center justify-center tabular-nums">
                      {compareCount}
                    </span>
                  )}
                </div>
                <div className="hidden xl:block leading-tight">
                  <span className="block text-xs font-bold">
                    {locale === 'fr' ? 'Comparer' : 'Compare'}
                  </span>
                </div>
              </button>
            </ActionIconTooltip>

            {/* Favoris */}
            <ActionIconTooltip
              placement="bottom"
              text={
                locale === 'fr'
                  ? 'Consulter vos produits likés et favoris enregistrés'
                  : 'View your liked and saved favorite products'
              }
            >
              <button
                type="button"
                onClick={() => onNavigate('wishlist')}
                className={`relative min-h-[40px] px-2.5 py-1.5 rounded-full flex items-center gap-2 text-left cursor-pointer transition-all ${
                  activeScreen === 'wishlist'
                    ? 'glass-pill-cta text-white'
                    : 'glass-pill-frost text-[#000000]'
                }`}
              >
                <div className="relative">
                  <Heart className="w-4 h-4" aria-hidden="true" />
                  {wishlistCount > 0 && (
                    <span className="glass-pill-gold absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full text-[#000000] text-[10px] font-extrabold flex items-center justify-center tabular-nums">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <div className="hidden xl:block leading-tight">
                  <span className="block text-xs font-bold">{t.favorites}</span>
                </div>
              </button>
            </ActionIconTooltip>

            {/* Panier */}
            <ActionIconTooltip
              placement="bottom"
              text={
                locale === 'fr'
                  ? 'Ouvrir votre panier pour vérifier ou commander'
                  : 'Open your shopping bag to review or checkout'
              }
            >
              <button
                type="button"
                onClick={onOpenCart}
                className={`relative min-h-[40px] px-2.5 py-1.5 rounded-full flex items-center gap-2 text-left cursor-pointer transition-all ${
                  activeScreen === 'cart'
                    ? 'glass-pill-cta text-white'
                    : 'glass-pill-frost text-[#000000]'
                }`}
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  <span className="glass-pill-cta absolute -top-2 -right-2 min-w-[17px] h-[17px] px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {cartCount}
                  </span>
                </div>
                <div className="hidden xl:block leading-tight">
                  <span className="block text-xs font-bold">{t.cart}</span>
                </div>
              </button>
            </ActionIconTooltip>

            {/* Compte Dropdown */}
            <div ref={accountMenuRef} className="relative">
              <ActionIconTooltip
                placement="bottom"
                disabled={accountOpen}
                text={
                  locale === 'fr'
                    ? 'Gérer votre compte, commandes et factures PDF'
                    : 'Manage your account, orders, and PDF invoices'
                }
              >
                <button
                  type="button"
                  onClick={() => setAccountOpen((o) => !o)}
                  className={`min-h-[40px] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-left cursor-pointer transition-all ${
                    activeScreen === 'account' || accountOpen
                      ? 'glass-pill-cta text-white'
                      : 'glass-pill-frost text-[#000000]'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <div className="hidden xl:flex items-center gap-1 leading-tight">
                    <span className="text-xs font-bold">
                      {userSession ? userSession.fullName.split(' ')[0] : t.account}
                    </span>
                    <ChevronDown className="w-3 h-3" aria-hidden="true" />
                  </div>
                </button>
              </ActionIconTooltip>

              {accountOpen && (
                <div className="ice-surface absolute right-0 top-full mt-2 w-64 text-[#000000] rounded-3xl overflow-hidden z-50">
                  {!userSession ? (
                    <div className="p-3.5 bg-white/45 border-b border-white/70 space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          onOpenAuth('login');
                        }}
                        className="glass-pill-cta w-full min-h-[38px] px-3 py-1.5 rounded-full text-white text-xs font-bold cursor-pointer"
                      >
                        {locale === 'fr' ? 'Se connecter' : 'Sign in'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          onOpenAuth('register');
                        }}
                        className="glass-pill-frost w-full min-h-[36px] px-3 py-1.5 rounded-full text-[#000000] text-xs font-semibold cursor-pointer"
                      >
                        {locale === 'fr' ? 'Créer un compte' : 'Create account'}
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 ice-obsidian text-white">
                      <p className="text-xs font-bold text-[#F4BE38]">
                        {userSession.fullName}
                      </p>
                      <p className="text-[11px] text-white/75 truncate">
                        {userSession.phone || userSession.email}
                      </p>
                    </div>
                  )}

                  <div className="py-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        onNavigate('account');
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 hover:bg-white/50 text-left font-semibold cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
                      <span>{locale === 'fr' ? 'Mon compte' : 'My account'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        onNavigate('tracking');
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 hover:bg-white/50 text-left font-semibold cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
                      <span>{locale === 'fr' ? 'Mes commandes' : 'My orders'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        onNavigate('invoice');
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 hover:bg-white/50 text-left font-semibold cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                      <span>{locale === 'fr' ? 'Factures PDF' : 'PDF Invoices'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        onNavigate('help');
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 hover:bg-white/50 text-left font-semibold cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
                      <span>{locale === 'fr' ? "Centre d'aide" : 'Help Center'}</span>
                    </button>
                    {userSession && (
                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-2.5 hover:bg-[#ffdad6]/50 text-[#ba1a1a] text-left font-semibold border-t border-white/60 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        <span>{locale === 'fr' ? 'Déconnexion' : 'Sign out'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Aide */}
            <ActionIconTooltip
              placement="left"
              text={
                locale === 'fr'
                  ? 'Centre d’aide, garanties et suivi de colis'
                  : 'Help center, warranty lookup, and parcel tracking'
              }
            >
              <button
                type="button"
                onClick={() => onNavigate('help')}
                className={`min-h-[40px] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-left cursor-pointer transition-all ${
                  activeScreen === 'help' || activeScreen === 'tracking'
                    ? 'glass-pill-cta text-white'
                    : 'glass-pill-frost text-[#000000]'
                }`}
              >
                <HelpCircle className="w-4 h-4 shrink-0 text-[#5A5AA1]" aria-hidden="true" />
                <div className="hidden xl:block leading-tight">
                  <span className="block text-xs font-bold">{t.help}</span>
                </div>
              </button>
            </ActionIconTooltip>
          </div>
        </div>
      </div>

      {/* Category Pill Strip + Drawer Button (Frosted Ice Strip) */}
      <div className="border-b border-white/75 bg-white/55 backdrop-blur-xl">
        <div className="max-w-[1360px] mx-auto px-4 py-2 flex items-center gap-2">
          <ActionIconTooltip
            placement="bottom"
            text={
              locale === 'fr'
                ? 'Ouvrir le menu latéral de tous les rayons'
                : 'Open the full department & category drawer'
            }
          >
            <button
              type="button"
              onClick={onOpenCategoryDrawer}
              className="glass-pill-gold min-h-[34px] px-3.5 py-1 rounded-full text-[#000000] text-xs font-extrabold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{locale === 'fr' ? 'Catégories' : 'Categories'}</span>
            </button>
          </ActionIconTooltip>

          <div
            ref={catScrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 py-0.5"
          >
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`min-h-[34px] px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeScreen === 'category' && activeCategory === 'all'
                  ? 'glass-pill-cta text-white'
                  : 'glass-pill-frost text-[#000000]'
              }`}
            >
              {t.allCategories}
            </button>

            {topCategories.map((cat) => {
              const isActive =
                activeScreen === 'category' && activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`min-h-[34px] px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'glass-pill-cta text-white'
                      : 'glass-pill-frost text-[#000000]'
                  }`}
                >
                  {locale === 'fr' ? cat.labelFr : cat.labelEn}
                </button>
              );
            })}
          </div>

          <ActionIconTooltip
            placement="left"
            text={
              locale === 'fr'
                ? 'Faire défiler la barre des catégories vers la droite'
                : 'Scroll categories bar to the right'
            }
          >
            <button
              type="button"
              aria-label="Défiler les catégories"
              onClick={scrollCatsRight}
              className="glass-pill-cta w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </ActionIconTooltip>
        </div>
      </div>
    </header>
  );
}
