import {
  ChevronDown,
  ChevronRight,
  Crown,
  FileText,
  Flame,
  Gift,
  Globe,
  Heart,
  HelpCircle,
  Info,
  LayoutGrid,
  LogOut,
  Package,
  Percent,
  Scale,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Ticket,
  Truck,
  User,
  Zap,
} from 'lucide-react';
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { PRODUCTS } from '../data/catalog';
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
  onSelectCategory: (slug: CategorySlug, query?: string) => void;
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
  const accountBtnRef = useRef<HTMLButtonElement>(null);
  const accountPanelRef = useRef<HTMLDivElement>(null);

  const [searchFocused, setSearchFocused] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState<number>(-1);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [activePromoChip, setActivePromoChip] = useState<string | null>(null);

  const topAdSlides = useMemo(
    () => [
      {
        id: 'promo-dates',
        badgeFr: 'LORENA PROMO',
        badgeEn: 'LORENA PROMO',
        textFr: '27 NOV — 18 DÉC 2026 · Jusqu’à -40% sur la boutique',
        textEn: 'NOV 27 — DEC 18, 2026 · Up to -40% storewide',
        pillClass: 'glass-pill-gold text-[#000000]',
        slug: 'all' as CategorySlug,
        query: '',
      },
      {
        id: 'flash-sale',
        badgeFr: 'VENTE FLASH',
        badgeEn: 'FLASH SALE',
        textFr: 'Smart TV 4K, Réfrigérateurs & Smartphones Pro à prix cassés',
        textEn: '4K Smart TVs, Fridges & Pro Smartphones on flash markdown',
        pillClass: 'glass-pill-cta text-white',
        slug: 'electronique' as CategorySlug,
        query: '',
      },
      {
        id: 'good-deal-loto',
        badgeFr: 'GOOD DEAL & LOTO',
        badgeEn: 'GOOD DEAL & LOTO',
        textFr: 'Tentez le Jackpot Lorena à chaque commande validée',
        textEn: 'Unlock Lorena Jackpot rewards with every checkout',
        pillClass: 'glass-pill-blue text-white',
        slug: 'all' as CategorySlug,
        query: '',
      },
      {
        id: 'vip-accessories',
        badgeFr: 'ACCESSOIRES VIP',
        badgeEn: 'VIP GEAR',
        textFr: 'Montres acier, Audio ANC & Accessoires Prestige',
        textEn: 'Steel Watches, ANC Audio & Luxury Accessories',
        pillClass: 'glass-pill-gold text-[#000000]',
        slug: 'fashion' as CategorySlug,
        query: '',
      },
      {
        id: 'free-delivery',
        badgeFr: 'LIVRAISON OFFERTE',
        badgeEn: 'FREE DELIVERY',
        textFr: 'Gratuite dès 150 000 XAF à Douala & Yaoundé · MTN / Orange Money',
        textEn: 'Free from 150,000 XAF in Douala & Yaoundé · MoMo & OM',
        pillClass: 'glass-pill-frost text-[#000000]',
        slug: 'all' as CategorySlug,
        query: '',
      },
    ],
    []
  );

  const promoMenuItems = useMemo(
    () => [
      {
        id: 'promotions',
        labelFr: 'Promotions',
        labelEn: 'Promotions',
        icon: Percent,
        slug: 'all' as CategorySlug,
        query: '',
        variant: 'gold',
      },
      {
        id: 'best-deals',
        labelFr: 'Meilleurs Deals',
        labelEn: 'Best Deals',
        icon: Flame,
        slug: 'electronique' as CategorySlug,
        query: '',
        variant: 'cta',
      },
      {
        id: 'flash-sale',
        labelFr: 'Vente Flash',
        labelEn: 'Flash Sale',
        icon: Zap,
        slug: 'gros-electromenager' as CategorySlug,
        query: '',
        variant: 'frost',
      },
      {
        id: 'trending-acc',
        labelFr: 'Accessoires en vogue',
        labelEn: 'Trending Gear',
        icon: Sparkles,
        slug: 'telephones-tablettes' as CategorySlug,
        query: '',
        variant: 'frost',
      },
      {
        id: 'good-deal',
        labelFr: 'Good Deal',
        labelEn: 'Good Deal',
        icon: Tag,
        slug: 'petit-electromenager' as CategorySlug,
        query: '',
        variant: 'frost',
      },
      {
        id: 'loto',
        labelFr: 'Lorena Loto',
        labelEn: 'Lorena Loto',
        icon: Ticket,
        slug: 'all' as CategorySlug,
        query: '',
        variant: 'gold',
      },
      {
        id: 'lorena-rewards',
        labelFr: 'Lorena Rewards',
        labelEn: 'Lorena Rewards',
        icon: Crown,
        screen: 'rewards' as AppScreen,
        variant: 'gold',
      },
      {
        id: 'vip-luxury',
        labelFr: 'Accessoires VIP',
        labelEn: 'VIP Luxury',
        icon: Sparkles,
        slug: 'fashion' as CategorySlug,
        query: '',
        variant: 'black',
      },
      {
        id: 'power-packs',
        labelFr: 'Packs Énergie',
        labelEn: 'Power Packs',
        icon: Gift,
        slug: 'informatique' as CategorySlug,
        query: '',
        variant: 'frost',
      },
      {
        id: 'free-shipping',
        labelFr: 'Livraison Gratuite',
        labelEn: 'Free Delivery',
        icon: Truck,
        screen: 'help' as AppScreen,
        variant: 'frost',
      },
    ],
    []
  );

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

  useEffect(() => {
    setHighlightedIdx(-1);
  }, [searchQuery, suggestions.length]);

  useEffect(() => {
    if (!accountOpen) return;
    const firstItem = accountPanelRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]');
    firstItem?.focus();
  }, [accountOpen]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchFocused(false);
    setHighlightedIdx(-1);
    onSearchSubmit();
  };

  const scrollCatsRight = () => {
    if (catScrollRef.current) {
      catScrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const showSuggestionsDropdown = searchFocused && searchQuery.trim().length >= 2;

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && searchFocused) {
      e.preventDefault();
      e.stopPropagation();
      setSearchFocused(false);
      setHighlightedIdx(-1);
      return;
    }
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSearchFocused(true);
      setHighlightedIdx((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchFocused(true);
      setHighlightedIdx((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (
      e.key === 'Enter' &&
      showSuggestionsDropdown &&
      highlightedIdx >= 0 &&
      suggestions[highlightedIdx]
    ) {
      e.preventDefault();
      const chosen = suggestions[highlightedIdx];
      setSearchFocused(false);
      setHighlightedIdx(-1);
      onSelectProduct(chosen);
    }
  };

  const handleAccountMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setAccountOpen(false);
      accountBtnRef.current?.focus();
      return;
    }
    const items = Array.from(
      accountPanelRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []
    );
    if (items.length === 0) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[currentIndex <= 0 ? items.length - 1 : currentIndex - 1]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 shadow-[0_10px_30px_-10px_rgba(45,36,12,0.22)]">
      {/* Slim Full-Width Borderless Animated Advertising Carousel Banner */}
      <div className="relative z-20 w-full bg-gradient-to-r from-[#090913] via-[#1c1a3a] to-[#090913] text-white overflow-hidden border-0">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-[#F4BE38]/15 to-transparent animate-kinetic-sweep pointer-events-none"
        />
        <div className="lorena-rtl-track w-full overflow-hidden py-1.5">
          <div className="animate-lorena-rtl-fast items-center">
            {[0, 1].map((dupIdx) => (
              <div
                key={`top-ad-deck-${dupIdx}`}
                aria-hidden={dupIdx === 1}
                className="flex items-center gap-6 pr-6 shrink-0"
              >
                {topAdSlides.map((ad) => (
                  <button
                    key={`${dupIdx}-${ad.id}`}
                    type="button"
                    tabIndex={dupIdx === 1 ? -1 : undefined}
                    aria-label={
                      dupIdx === 1
                        ? undefined
                        : `${locale === 'fr' ? ad.badgeFr : ad.badgeEn}: ${
                            locale === 'fr' ? ad.textFr : ad.textEn
                          }`
                    }
                    onClick={() => {
                      setActivePromoChip(ad.id);
                      onSelectCategory(ad.slug, ad.query);
                    }}
                    className="inline-flex items-center gap-2 text-xs whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <span
                      className={`${ad.pillClass} px-2.5 py-0.5 rounded-full font-display font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider shrink-0`}
                    >
                      {locale === 'fr' ? ad.badgeFr : ad.badgeEn}
                    </span>
                    <span className="text-white/95 font-medium text-[11px] sm:text-xs">
                      {locale === 'fr' ? ad.textFr : ad.textEn}
                    </span>
                    <span className="text-[#F4BE38]/60 font-bold" aria-hidden="true">
                      ✦
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header Row (Yellow Frosted Ice Glass) */}
      <div className="relative z-30 bg-gradient-to-r from-[#FFF7CC]/90 via-[#FFE47A]/86 to-[#F4BE38]/88 backdrop-blur-xl border-b border-white/80 text-[#000000]">
        <div className="max-w-[1360px] mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2.5 lg:gap-6">
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
              aria-label={
                locale === 'fr'
                  ? "Lorena Market — Retour à l'accueil"
                  : 'Lorena Market — Return to homepage'
              }
              className="glass-pill-frost flex items-center shrink-0 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full cursor-pointer"
            >
              {!logoFailed ? (
                <img
                  src="/assets/aistudio/lorena-logo-noir-transparent_36764768.png"
                  alt="Lorena Market"
                  onError={() => setLogoFailed(true)}
                  className="h-6 sm:h-8 w-auto object-contain"
                />
              ) : (
                <span className="inline-flex items-center gap-1.5 py-0.5 font-display text-xs sm:text-sm font-extrabold text-[#000000]">
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
                role="combobox"
                aria-expanded={showSuggestionsDropdown}
                aria-controls="navbar-search-suggestions"
                aria-autocomplete="list"
                aria-activedescendant={
                  showSuggestionsDropdown && highlightedIdx >= 0
                    ? `navbar-search-opt-${highlightedIdx}`
                    : undefined
                }
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
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
                aria-label={t.searchBtn}
                className="glass-pill-cta min-h-[36px] px-4 py-1.5 rounded-full text-white text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.searchBtn}
              </button>
            </form>

            {showSuggestionsDropdown && (
              <div
                id="navbar-search-suggestions"
                role="listbox"
                aria-label={
                  locale === 'fr' ? 'Suggestions de produits' : 'Product suggestions'
                }
                className="ice-surface absolute left-0 right-0 top-full mt-2 text-[#000000] rounded-3xl overflow-hidden z-50"
              >
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
                    {suggestions.map((p, idx) => {
                      const name = locale === 'fr' ? p.nameFr : p.nameEn;
                      const isHighlighted = highlightedIdx === idx;
                      return (
                        <button
                          key={p.id}
                          id={`navbar-search-opt-${idx}`}
                          role="option"
                          aria-selected={isHighlighted}
                          type="button"
                          onMouseEnter={() => setHighlightedIdx(idx)}
                          onClick={() => {
                            setSearchFocused(false);
                            setHighlightedIdx(-1);
                            onSelectProduct(p);
                          }}
                          className={`w-full px-4 py-2.5 flex items-center gap-3 text-left cursor-pointer transition-colors ${
                            isHighlighted ? 'bg-white/75' : 'hover:bg-white/55'
                          }`}
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
          <div className="order-2 lg:order-3 flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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
                aria-label={
                  locale === 'fr'
                    ? 'Changer de langue (Français actif, basculer vers Anglais)'
                    : 'Switch language (English active, switch to French)'
                }
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
                aria-label={`${
                  locale === 'fr' ? 'Comparer les produits' : 'Compare products'
                } (${compareCount}/3)`}
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
                aria-label={`${t.favorites} (${wishlistCount})`}
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
                aria-label={`${t.cart} (${cartCount})`}
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
                  ref={accountBtnRef}
                  type="button"
                  onClick={() => setAccountOpen((o) => !o)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  aria-controls="navbar-account-menu"
                  aria-label={
                    userSession
                      ? `${locale === 'fr' ? 'Menu compte' : 'Account menu'} (${userSession.fullName})`
                      : locale === 'fr'
                      ? 'Menu compte et commandes'
                      : 'Account and orders menu'
                  }
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
                <div
                  ref={accountPanelRef}
                  id="navbar-account-menu"
                  role="menu"
                  aria-label={locale === 'fr' ? 'Options du compte' : 'Account options'}
                  onKeyDown={handleAccountMenuKeyDown}
                  className="ice-surface absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-1.5rem)] text-[#000000] rounded-3xl overflow-hidden z-50"
                >
                  {!userSession ? (
                    <div className="p-3.5 bg-white/45 border-b border-white/70 space-y-2">
                      <button
                        type="button"
                        role="menuitem"
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
                        role="menuitem"
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
                      role="menuitem"
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
                      role="menuitem"
                      onClick={() => {
                        setAccountOpen(false);
                        onNavigate('rewards');
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 hover:bg-white/50 text-left font-semibold cursor-pointer"
                    >
                      <Crown className="w-4 h-4 text-[#d99b16]" aria-hidden="true" />
                      <span>Lorena Rewards</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
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
                      role="menuitem"
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
                      role="menuitem"
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
                        role="menuitem"
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
                aria-label={t.help}
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

      {/* Promotional Advertising Strip + Category Drawer Button */}
      <div className="relative z-10 border-b border-white/75 bg-white/55 backdrop-blur-xl">
        <div className="max-w-[1360px] mx-auto px-3 sm:px-4 py-2 flex items-center gap-2">
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
              aria-haspopup="dialog"
              aria-label={
                locale === 'fr'
                  ? 'Ouvrir le menu des catégories'
                  : 'Open categories menu'
              }
              className="glass-pill-gold min-h-[34px] px-3 sm:px-3.5 py-1 rounded-full text-[#000000] text-xs font-extrabold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{locale === 'fr' ? 'Catégories' : 'Categories'}</span>
            </button>
          </ActionIconTooltip>

          <nav
            ref={catScrollRef}
            aria-label={
              locale === 'fr'
                ? 'Offres et accès rapides'
                : 'Promotional highlights and shortcuts'
            }
            className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 py-0.5"
          >
            {promoMenuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activePromoChip === item.id;
              const pillStyle = isSelected
                ? 'glass-pill-cta text-white'
                : item.variant === 'gold'
                ? 'glass-pill-gold text-[#000000]'
                : item.variant === 'cta'
                ? 'glass-pill-cta text-white'
                : item.variant === 'black'
                ? 'glass-pill-black text-[#F4BE38]'
                : 'glass-pill-frost text-[#000000]';

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setActivePromoChip(item.id);
                    if (item.screen) {
                      onNavigate(item.screen);
                    } else if (item.slug) {
                      onSelectCategory(item.slug, item.query ?? '');
                    }
                  }}
                  className={`min-h-[34px] px-3 sm:px-3.5 py-1 rounded-full text-xs font-extrabold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-all cursor-pointer ${pillStyle}`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{locale === 'fr' ? item.labelFr : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          <ActionIconTooltip
            placement="left"
            text={
              locale === 'fr'
                ? 'Faire défiler les offres publicitaires vers la droite'
                : 'Scroll promotional highlights right'
            }
          >
            <button
              type="button"
              aria-label={locale === 'fr' ? 'Défiler les offres' : 'Scroll offers'}
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
