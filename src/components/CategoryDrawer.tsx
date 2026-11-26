import {
  Baby,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Laptop,
  LayoutGrid,
  Monitor,
  MoreHorizontal,
  Refrigerator,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Utensils,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CATEGORIES_META } from '../data/catalog';
import { CATEGORY_SUBMENUS } from '../data/helpAndCategories';
import { CategorySlug, Locale } from '../types/store';
import { ActionIconTooltip } from './ActionIconTooltip';

interface CategoryDrawerProps {
  isOpen: boolean;
  locale: Locale;
  onClose: () => void;
  onSelectCategory: (slug: CategorySlug, query?: string) => void;
}

function getCategoryIcon(slug: CategorySlug) {
  switch (slug) {
    case 'electronique':
      return Monitor;
    case 'fashion':
      return Shirt;
    case 'gros-electromenager':
      return Refrigerator;
    case 'sante-beaute':
      return HeartPulse;
    case 'maison-bureau':
      return Sofa;
    case 'telephones-tablettes':
      return Smartphone;
    case 'petit-electromenager':
      return Utensils;
    case 'informatique':
      return Laptop;
    case 'bebe':
      return Baby;
    case 'supermarche':
      return ShoppingBasket;
    default:
      return MoreHorizontal;
  }
}

export function CategoryDrawer({
  isOpen,
  locale,
  onClose,
  onSelectCategory,
}: CategoryDrawerProps) {
  const [drillSlug, setDrillSlug] = useState<CategorySlug | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrillSlug(null);
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeDrillMeta = drillSlug
    ? CATEGORIES_META.find((c) => c.slug === drillSlug)
    : null;
  const subGroups = drillSlug ? CATEGORY_SUBMENUS[drillSlug] ?? [] : [];

  const handleChoose = (slug: CategorySlug, query?: string) => {
    setDrillSlug(null);
    onClose();
    onSelectCategory(slug, query);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-start"
      role="dialog"
      aria-modal="true"
      aria-label={locale === 'fr' ? 'Catégories' : 'Categories'}
    >
      <div
        className="fixed inset-0 bg-[#000000]/45 backdrop-blur-sm"
        onClick={() => {
          setDrillSlug(null);
          onClose();
        }}
      />

      <aside className="ice-surface relative w-full max-w-[360px] h-full flex flex-col shadow-2xl border-r border-white/90">
        {/* Header (Obsidian Crystal) */}
        <div className="ice-obsidian px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ActionIconTooltip
              text={
                locale === 'fr'
                  ? 'Parcourez tous les rayons Lorena Market'
                  : 'Browse all Lorena Market departments'
              }
              placement="right"
              focusable
            >
              <LayoutGrid className="w-5 h-5 text-[#F4BE38]" aria-hidden="true" />
            </ActionIconTooltip>
            <h2 className="font-display text-lg font-bold">
              {locale === 'fr' ? 'Catégories' : 'Categories'}
            </h2>
          </div>
          <ActionIconTooltip
            text={locale === 'fr' ? 'Fermer le menu des catégories' : 'Close categories menu'}
            placement="left"
          >
            <button
              type="button"
              aria-label={locale === 'fr' ? 'Fermer les catégories' : 'Close categories'}
              onClick={() => {
                setDrillSlug(null);
                onClose();
              }}
              className="w-9 h-9 rounded-full hover:bg-white/15 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </ActionIconTooltip>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-3">
          {!drillSlug ? (
            <nav
              aria-label={
                locale === 'fr'
                  ? 'Rayons Lorena Market'
                  : 'Lorena Market departments'
              }
              className="space-y-1.5"
            >
              {CATEGORIES_META.map((cat) => {
                const Icon = getCategoryIcon(cat.slug);
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setDrillSlug(cat.slug)}
                    className="ice-surface-subtle w-full px-4 py-3 rounded-2xl flex items-center justify-between gap-3 text-left hover:border-[#5A5AA1] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Icon
                        className="w-5 h-5 text-[#5A5AA1] group-hover:text-[#000000] shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-sm font-semibold text-[#000000] truncate">
                        {locale === 'fr' ? cat.labelFr : cat.labelEn}
                      </span>
                    </div>
                    <ActionIconTooltip
                      text={
                        locale === 'fr'
                          ? `Voir les sous-rayons de ${cat.labelFr}`
                          : `Explore ${cat.labelEn} subcategories`
                      }
                      placement="left"
                    >
                      <ChevronRight
                        className="w-4 h-4 text-[#3F3F56] group-hover:text-[#5A5AA1] shrink-0"
                        aria-hidden="true"
                      />
                    </ActionIconTooltip>
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="p-2 space-y-5">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Revenir à la liste des catégories'
                    : 'Back to all categories'
                }
                placement="right"
              >
                <button
                  type="button"
                  onClick={() => setDrillSlug(null)}
                  className="glass-pill-frost px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs font-bold text-[#000000] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Retour' : 'Back'}</span>
                </button>
              </ActionIconTooltip>

              {activeDrillMeta && (
                <div className="ice-surface-subtle p-3.5 rounded-2xl">
                  <h3 className="font-display text-lg font-bold text-[#000000]">
                    {locale === 'fr' ? activeDrillMeta.labelFr : activeDrillMeta.labelEn}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleChoose(activeDrillMeta.slug)}
                    className="mt-1 text-xs font-bold text-[#5A5AA1] hover:underline cursor-pointer"
                  >
                    {locale === 'fr' ? 'Voir la catégorie' : 'View full category'}
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {subGroups.map((group) => (
                  <div key={group.groupFr} className="ice-surface-subtle p-3.5 rounded-2xl space-y-2">
                    <h4 className="font-display text-sm font-bold text-[#000000]">
                      {locale === 'fr' ? group.groupFr : group.groupEn}
                    </h4>
                    <div className="divide-y divide-white/75">
                      {group.items.map((item) => (
                        <button
                          key={item.labelFr}
                          type="button"
                          onClick={() => handleChoose(drillSlug, item.query)}
                          className="w-full py-2.5 flex items-center justify-between gap-2 text-left text-sm text-[#3F3F56] hover:text-[#5A5AA1] font-medium cursor-pointer group"
                        >
                          <span>{locale === 'fr' ? item.labelFr : item.labelEn}</span>
                          <ActionIconTooltip
                            text={
                              locale === 'fr'
                                ? `Afficher les produits « ${item.labelFr} »`
                                : `Show "${item.labelEn}" products`
                            }
                            placement="left"
                          >
                            <ChevronRight
                              className="w-4 h-4 text-[#3F3F56] group-hover:text-[#5A5AA1] shrink-0"
                              aria-hidden="true"
                            />
                          </ActionIconTooltip>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer CTA */}
        <div className="ice-surface-subtle p-4 border-t border-white/85">
          <button
            type="button"
            onClick={() => handleChoose('all')}
            className="glass-pill-cta w-full min-h-[44px] px-4 py-2.5 rounded-full text-white font-display font-bold text-sm cursor-pointer"
          >
            {locale === 'fr' ? 'Voir tout le shop' : 'View entire shop'}
          </button>
        </div>
      </aside>
    </div>
  );
}
