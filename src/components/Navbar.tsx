import {
  ChevronRight,
  Globe,
  Heart,
  HelpCircle,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
} from 'lucide-react';
import { FormEvent, useRef } from 'react';
import { CATEGORIES_META } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { AppScreen, CategorySlug, Locale } from '../types/store';

interface NavbarProps {
  locale: Locale;
  activeScreen: AppScreen;
  activeCategory: CategorySlug;
  searchQuery: string;
  cartCount: number;
  wishlistCount: number;
  onToggleLocale: () => void;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onSelectCategory: (slug: CategorySlug) => void;
  onNavigate: (screen: AppScreen) => void;
  onOpenCart: () => void;
}

export function Navbar({
  locale,
  activeScreen,
  activeCategory,
  searchQuery,
  cartCount,
  wishlistCount,
  onToggleLocale,
  onSearchChange,
  onSearchSubmit,
  onSelectCategory,
  onNavigate,
  onOpenCart,
}: NavbarProps) {
  const t = TRANSLATIONS[locale];
  const catScrollRef = useRef<HTMLDivElement>(null);

  const topCategories = CATEGORIES_META.filter((c) => c.showInTopNav);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  const scrollCatsRight = () => {
    if (catScrollRef.current) {
      catScrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#000000] text-white shadow-md">
      {/* Slim Top Campaign Banner */}
      <div className="bg-[#000000] border-b border-white/10">
        <div className="max-w-[1360px] mx-auto px-4 py-1.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#5A5AA1] text-white font-display font-bold text-[11px] uppercase tracking-wide">
              Lorena Promo
            </span>
            <span className="text-white/85 hidden sm:inline">
              {t.topPromoPrefix}
            </span>
          </div>
          <div className="flex items-center gap-2 font-display font-bold tracking-wide">
            <span className="px-2.5 py-0.5 rounded bg-[#F4BE38] text-[#000000] text-xs">
              {t.topPromoDates}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-[1360px] mx-auto px-4 py-3 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 lg:gap-6">
        {/* Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F4BE38] rounded"
        >
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5A5AA1] to-[#A084E8] flex items-center justify-center border border-[#F4BE38]">
            <ShoppingCart className="w-4 h-4 text-[#F4BE38]" aria-hidden="true" />
          </span>
          <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white whitespace-nowrap">
            Lorena<span className="text-[#F4BE38]">Market</span>
          </span>
        </button>

        {/* Search Bar */}
        <form
          onSubmit={handleFormSubmit}
          className="order-3 lg:order-2 w-full lg:flex-1 lg:max-w-xl flex items-center bg-white/10 border border-white/20 rounded-full p-1 focus-within:border-[#A084E8]"
        >
          <Search
            className="w-4 h-4 text-white/60 ml-3 shrink-0"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="flex-1 bg-transparent px-3 py-1.5 text-sm text-white placeholder:text-white/60 focus:outline-none min-w-0"
          />
          <button
            type="submit"
            className="min-h-[36px] px-4 py-1.5 rounded-full bg-[#5A5AA1] hover:bg-[#474789] text-white text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            {t.searchBtn}
          </button>
        </form>

        {/* Right Utility Actions */}
        <div className="order-2 lg:order-3 flex items-center gap-2 sm:gap-4 shrink-0">
          {/* FR / EN Selector */}
          <button
            type="button"
            onClick={onToggleLocale}
            aria-label="Changer de langue"
            className="min-h-[38px] px-2.5 py-1.5 rounded-full border border-white/25 hover:border-[#F4BE38] text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-[#F4BE38]" aria-hidden="true" />
            <span>{locale.toUpperCase()}</span>
          </button>

          {/* Favoris */}
          <button
            type="button"
            onClick={() => onNavigate('wishlist')}
            className={`relative min-h-[40px] px-2 py-1 rounded flex items-center gap-2 text-left cursor-pointer transition-colors ${
              activeScreen === 'wishlist'
                ? 'text-[#F4BE38]'
                : 'text-white hover:text-[#F4BE38]'
            }`}
          >
            <div className="relative">
              <Heart className="w-5 h-5" aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#F4BE38] text-[#000000] text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </div>
            <div className="hidden xl:block leading-tight">
              <span className="block text-[10px] text-white/60">Wishlist</span>
              <span className="block text-xs font-semibold">{t.favorites}</span>
            </div>
          </button>

          {/* Panier */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative min-h-[40px] px-2 py-1 rounded flex items-center gap-2 text-left text-white hover:text-[#F4BE38] cursor-pointer transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[#F4BE38] text-[#000000] text-[10px] font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            </div>
            <div className="hidden xl:block leading-tight">
              <span className="block text-[10px] text-white/60">
                {locale === 'fr' ? 'Mes articles' : 'My items'}
              </span>
              <span className="block text-xs font-semibold">{t.cart}</span>
            </div>
          </button>

          {/* Compte */}
          <button
            type="button"
            onClick={() => onNavigate('account')}
            className={`min-h-[40px] px-2 py-1 rounded flex items-center gap-2 text-left cursor-pointer transition-colors ${
              activeScreen === 'account'
                ? 'text-[#F4BE38]'
                : 'text-white hover:text-[#F4BE38]'
            }`}
          >
            <User className="w-5 h-5 shrink-0" aria-hidden="true" />
            <div className="hidden xl:block leading-tight">
              <span className="block text-[10px] text-white/60">
                {locale === 'fr' ? 'Mon profil' : 'My profile'}
              </span>
              <span className="block text-xs font-semibold">{t.account}</span>
            </div>
          </button>

          {/* Aide */}
          <button
            type="button"
            onClick={() => onNavigate('help')}
            className={`min-h-[40px] px-2 py-1 rounded flex items-center gap-2 text-left cursor-pointer transition-colors ${
              activeScreen === 'help' || activeScreen === 'tracking'
                ? 'text-[#F4BE38]'
                : 'text-white hover:text-[#F4BE38]'
            }`}
          >
            <HelpCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <div className="hidden xl:block leading-tight">
              <span className="block text-[10px] text-white/60">FAQ & Support</span>
              <span className="block text-xs font-semibold">{t.help}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Category Pill Strip */}
      <div className="border-t border-white/10 bg-[#000000]">
        <div className="max-w-[1360px] mx-auto px-4 py-2 flex items-center gap-2">
          <div
            ref={catScrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1"
          >
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`min-h-[34px] px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                activeScreen === 'category' && activeCategory === 'all'
                  ? 'bg-[#5A5AA1] text-white border-[#A084E8]'
                  : 'bg-white/5 text-white/90 border-white/15 hover:border-[#A084E8]'
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
                  className={`min-h-[34px] px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#5A5AA1] text-white border-[#A084E8]'
                      : 'bg-white/5 text-white/90 border-white/15 hover:border-[#A084E8]'
                  }`}
                >
                  {locale === 'fr' ? cat.labelFr : cat.labelEn}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Défiler les catégories"
            onClick={scrollCatsRight}
            className="w-8 h-8 rounded-full bg-[#5A5AA1] hover:bg-[#A084E8] text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
