import {
  ArrowLeft,
  Award,
  CalendarCheck,
  Check,
  Copy,
  Crown,
  Gift,
  Heart,
  History,
  Lock,
  Package,
  ShieldCheck,
  ShoppingBag,
  Star,
  Tag,
  Truck,
  UserCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import {
  Locale,
  LoyaltyBonusEvent,
  OrderRecord,
  RedeemedReward,
  RewardCatalogItem,
  RewardCategory,
  UserSession,
} from '../types/store';
import { formatOrderDate, formatXAF } from '../utils/format';
import {
  computeLoyaltySummary,
  getTierLabel,
  POINTS_PER_XAF_STEP,
  REWARDS_CATALOG,
} from '../utils/loyalty';
import { ActionIconTooltip } from './ActionIconTooltip';

interface LorenaRewardsScreenProps {
  locale: Locale;
  orders: OrderRecord[];
  bonusEvents: LoyaltyBonusEvent[];
  redeemedRewards: RedeemedReward[];
  userSession: UserSession | null;
  wishlistCount: number;
  appliedPromoCode: string | null;
  canClaimDailyCheckin: boolean;
  onClaimDailyCheckin: () => void;
  onRedeemReward: (reward: RewardCatalogItem) => void;
  onApplyPromoToCart: (promoCode: string) => void;
  onInspectOrder: (orderId: string) => void;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onBrowseCatalog: () => void;
  onBackHome: () => void;
}

export function LorenaRewardsScreen({
  locale,
  orders,
  bonusEvents,
  redeemedRewards,
  userSession,
  wishlistCount,
  appliedPromoCode,
  canClaimDailyCheckin,
  onClaimDailyCheckin,
  onRedeemReward,
  onApplyPromoToCart,
  onInspectOrder,
  onOpenAuth,
  onOpenAccount,
  onBrowseCatalog,
  onBackHome,
}: LorenaRewardsScreenProps) {
  const t = TRANSLATIONS[locale];
  const [rewardFilter, setRewardFilter] = useState<'all' | RewardCategory>('all');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'earn' | 'redeem'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [justRedeemedBanner, setJustRedeemedBanner] = useState<RewardCatalogItem | null>(
    null
  );

  const summary = useMemo(
    () => computeLoyaltySummary(orders, bonusEvents, redeemedRewards),
    [orders, bonusEvents, redeemedRewards]
  );

  const filteredRewards = useMemo(() => {
    if (rewardFilter === 'all') return REWARDS_CATALOG;
    return REWARDS_CATALOG.filter((item) => item.category === rewardFilter);
  }, [rewardFilter]);

  const filteredHistory = useMemo(() => {
    if (historyFilter === 'all') return summary.pointHistory;
    return summary.pointHistory.filter((entry) => entry.kind === historyFilter);
  }, [historyFilter, summary.pointHistory]);

  const hasSignupBonus = bonusEvents.some((ev) => ev.type === 'signup');
  const hasWishlistBonus = bonusEvents.some((ev) => ev.type === 'wishlist');

  const handleRedeem = (reward: RewardCatalogItem) => {
    if (summary.availablePoints < reward.pointsCost) return;
    onRedeemReward(reward);
    setJustRedeemedBanner(reward);
    window.setTimeout(() => {
      setJustRedeemedBanner((curr) => (curr?.id === reward.id ? null : curr));
    }, 5000);
  };

  const handleCopyCode = async (redemptionId: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(redemptionId);
      window.setTimeout(() => setCopiedId(null), 2200);
    } catch {
      // Ignore clipboard failure
    }
  };

  const getRewardIcon = (category: RewardCategory) => {
    if (category === 'shipping') return Truck;
    if (category === 'vip') return ShieldCheck;
    return Tag;
  };

  return (
    <div className="max-w-[1360px] mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-16 space-y-6 sm:space-y-8">
      {/* Top Header & Navigation */}
      <div className="ice-surface rounded-3xl p-4 sm:p-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <ActionIconTooltip
              text={
                locale === 'fr'
                  ? "Revenir à la page d'accueil Lorena Market"
                  : 'Return to Lorena Market homepage'
              }
              placement="bottom"
            >
              <button
                type="button"
                onClick={onBackHome}
                className="glass-pill-frost inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#5A5AA1] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.backToHome}</span>
              </button>
            </ActionIconTooltip>
            <button
              type="button"
              onClick={onOpenAccount}
              className="glass-pill-frost inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#000000] cursor-pointer"
            >
              <span>{locale === 'fr' ? 'Mon Compte' : 'My Account'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <ActionIconTooltip
              focusable
              placement="right"
              text={
                locale === 'fr'
                  ? 'Espace Lorena Rewards : consultez vos points et échangez-les contre des récompenses'
                  : 'Lorena Rewards hub: inspect earned points and redeem exclusive rewards'
              }
            >
              <span className="glass-pill-black w-11 h-11 rounded-2xl text-[#F4BE38] flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" aria-hidden="true" />
              </span>
            </ActionIconTooltip>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#000000]">
                Lorena Rewards
              </h1>
              <p className="text-xs sm:text-sm text-[#3F3F56] font-medium">
                {locale === 'fr'
                  ? `Cumulez 1 point par ${formatXAF(
                      POINTS_PER_XAF_STEP
                    )} d'achat et débloquez des bons de réduction et privilèges VIP.`
                  : `Earn 1 point per ${formatXAF(
                      POINTS_PER_XAF_STEP
                    )} spent and redeem vouchers, free shipping & VIP perks.`}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onBrowseCatalog}
          className="glass-pill-cta min-h-[42px] px-5 py-2 rounded-full text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          <span>
            {locale === 'fr' ? 'Commander & gagner des points' : 'Shop & Earn Points'}
          </span>
        </button>
      </div>

      {/* Redemption Confirmation Toast */}
      {justRedeemedBanner && (
        <div
          role="status"
          className="ice-obsidian text-white rounded-3xl p-4 sm:p-5 border border-[#F4BE38]/70 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="glass-pill-gold w-10 h-10 rounded-full text-[#000000] flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-sm sm:text-base font-extrabold text-[#F4BE38]">
                {locale === 'fr'
                  ? `Récompense débloquée : ${justRedeemedBanner.titleFr}`
                  : `Reward unlocked: ${justRedeemedBanner.titleEn}`}
              </p>
              <p className="text-xs text-white/85">
                {justRedeemedBanner.promoCode
                  ? locale === 'fr'
                    ? `Code promo ${justRedeemedBanner.promoCode} ajouté à vos récompenses actives.`
                    : `Promo code ${justRedeemedBanner.promoCode} added to your active rewards.`
                  : locale === 'fr'
                  ? 'Avantage enregistré sur votre compte Lorena Market.'
                  : 'Benefit saved to your Lorena Market account.'}
              </p>
            </div>
          </div>

          {justRedeemedBanner.promoCode && (
            <button
              type="button"
              onClick={() => onApplyPromoToCart(justRedeemedBanner.promoCode!)}
              className="glass-pill-gold min-h-[38px] px-4 py-1.5 rounded-full text-[#000000] text-xs font-extrabold cursor-pointer"
            >
              {locale === 'fr' ? 'Appliquer au panier' : 'Apply to Cart'}
            </button>
          )}
        </div>
      )}

      {/* Points Summary + Tier Progress + Point-Earning Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Balance & Tier Progress (Obsidian Ice) */}
        <div className="lg:col-span-7 ice-obsidian text-white rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                {locale === 'fr'
                  ? 'Points disponibles à échanger'
                  : 'Available Points to Redeem'}
              </span>
              <p className="mt-1 font-display text-4xl sm:text-5xl font-extrabold text-[#F4BE38] tabular-nums">
                {summary.availablePoints.toLocaleString('fr-FR')}{' '}
                <span className="text-base font-bold text-white">pts</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`${summary.currentTier.accentClass} px-3.5 py-1 rounded-full text-xs font-extrabold`}
              >
                {getTierLabel(summary.currentTier, locale)}
              </span>
            </div>
          </div>

          {/* Metrics Strip */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
              <span className="block text-[10px] sm:text-[11px] text-white/70">
                {locale === 'fr' ? 'Cumulés à vie' : 'Lifetime Earned'}
              </span>
              <span className="mt-0.5 block font-display text-base sm:text-lg font-extrabold text-white tabular-nums">
                {summary.totalPoints.toLocaleString('fr-FR')} pts
              </span>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
              <span className="block text-[10px] sm:text-[11px] text-white/70">
                {locale === 'fr' ? 'Points échangés' : 'Redeemed'}
              </span>
              <span className="mt-0.5 block font-display text-base sm:text-lg font-extrabold text-[#F4BE38] tabular-nums">
                {summary.totalRedeemedPoints.toLocaleString('fr-FR')} pts
              </span>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
              <span className="block text-[10px] sm:text-[11px] text-white/70">
                {locale === 'fr' ? 'Achats cumulés' : 'Total Spend'}
              </span>
              <span className="mt-0.5 block font-display text-sm sm:text-base font-extrabold text-white tabular-nums truncate">
                {formatXAF(summary.totalSpentXaf)}
              </span>
            </div>
          </div>

          {/* Tier Progress Bar */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              {summary.nextTier ? (
                <>
                  <span className="font-semibold text-white">
                    {getTierLabel(summary.currentTier, locale)} →{' '}
                    <span className="text-[#F4BE38] font-bold">
                      {getTierLabel(summary.nextTier, locale)}
                    </span>{' '}
                    ({summary.nextTier.minPoints} pts)
                  </span>
                  <span className="font-mono font-bold text-[#F4BE38] tabular-nums">
                    {summary.progressPercent}%
                  </span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-[#F4BE38] inline-flex items-center gap-1.5">
                    <Award className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {locale === 'fr'
                        ? 'Palier maximal Diamant Obsidian atteint'
                        : 'Top tier Diamond Obsidian reached'}
                    </span>
                  </span>
                  <span className="font-mono font-bold text-[#F4BE38] tabular-nums">
                    100%
                  </span>
                </>
              )}
            </div>

            <div
              role="progressbar"
              aria-label={
                locale === 'fr'
                  ? 'Progression vers le prochain palier Lorena Rewards'
                  : 'Progress toward the next Lorena Rewards tier'
              }
              aria-valuenow={summary.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="w-full h-3 rounded-full bg-black/45 border border-white/20 overflow-hidden p-0.5"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F4BE38] via-[#A084E8] to-[#38BDF8] transition-all duration-500"
                style={{
                  width: `${Math.max(
                    summary.totalPoints > 0 ? 4 : 0,
                    summary.progressPercent
                  )}%`,
                }}
              />
            </div>

            <p className="text-[11px] text-white/80">
              {summary.nextTier
                ? locale === 'fr'
                  ? `Encore ${summary.pointsRemaining} pts cumulés pour atteindre ${getTierLabel(
                      summary.nextTier,
                      locale
                    )}.`
                  : `${summary.pointsRemaining} more lifetime pts needed for ${getTierLabel(
                      summary.nextTier,
                      locale
                    )}.`
                : locale === 'fr'
                ? 'Tous les avantages VIP du programme sont débloqués.'
                : 'All top-tier VIP program perks are unlocked.'}
            </p>
          </div>
        </div>

        {/* Right: Quick Point-Earning Actions */}
        <div className="lg:col-span-5 ice-surface rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-extrabold text-[#000000]">
              {locale === 'fr'
                ? 'Comment gagner plus de points'
                : 'Ways to Earn Points'}
            </h2>
            <p className="text-xs text-[#3F3F56] mt-0.5">
              {locale === 'fr'
                ? 'Chaque action validée crédite votre solde immédiatement.'
                : 'Each completed action credits your Lorena Rewards balance immediately.'}
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Daily Check-in */}
            <div className="ice-surface-subtle rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="glass-pill-gold w-9 h-9 rounded-xl text-[#000000] flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-4 h-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#000000] truncate">
                    {locale === 'fr' ? 'Bonus connexion du jour' : 'Daily Check-In Bonus'}
                  </p>
                  <p className="text-[11px] font-mono font-bold text-[#5A5AA1]">
                    +10 pts / {locale === 'fr' ? 'jour' : 'day'}
                  </p>
                </div>
              </div>
              {canClaimDailyCheckin ? (
                <button
                  type="button"
                  onClick={onClaimDailyCheckin}
                  className="glass-pill-cta min-h-[36px] px-3.5 py-1.5 rounded-full text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {locale === 'fr' ? 'Réclamer +10' : 'Claim +10'}
                </button>
              ) : (
                <span className="glass-pill-frost px-3 py-1 rounded-full text-[#3F3F56] text-[11px] font-bold inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                  <Check className="w-3 h-3 text-[#5A5AA1]" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Reçu aujourd’hui' : 'Claimed today'}</span>
                </span>
              )}
            </div>

            {/* Order Earnings */}
            <div className="ice-surface-subtle rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="glass-pill-black w-9 h-9 rounded-xl text-[#F4BE38] flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#000000] truncate">
                    {locale === 'fr' ? 'Achats sur la boutique' : 'Storefront Orders'}
                  </p>
                  <p className="text-[11px] font-mono font-bold text-[#5A5AA1]">
                    1 pt / {formatXAF(POINTS_PER_XAF_STEP)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onBrowseCatalog}
                className="glass-pill-frost min-h-[36px] px-3.5 py-1.5 rounded-full text-[#000000] text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
              >
                {locale === 'fr' ? 'Acheter' : 'Shop'}
              </button>
            </div>

            {/* Account Sign-In Bonus */}
            <div className="ice-surface-subtle rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="glass-pill-frost w-9 h-9 rounded-xl text-[#5A5AA1] flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#000000] truncate">
                    {locale === 'fr' ? 'Compte client activé' : 'Verified Member Sign-In'}
                  </p>
                  <p className="text-[11px] font-mono font-bold text-[#5A5AA1]">
                    +25 pts
                  </p>
                </div>
              </div>
              {userSession || hasSignupBonus ? (
                <span className="glass-pill-gold px-3 py-1 rounded-full text-[#000000] text-[11px] font-extrabold inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                  <Check className="w-3 h-3" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Validé' : 'Earned'}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="glass-pill-cta min-h-[36px] px-3.5 py-1.5 rounded-full text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {locale === 'fr' ? 'Connexion' : 'Sign in'}
                </button>
              )}
            </div>

            {/* Wishlist Collector & Review Info */}
            <div className="ice-surface-subtle rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="glass-pill-frost w-9 h-9 rounded-xl text-[#5A5AA1] flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#000000] truncate">
                    {locale === 'fr'
                      ? 'Collectionneur (2+ favoris) & Avis'
                      : 'Wishlist Collector (2+) & Reviews'}
                  </p>
                  <p className="text-[11px] font-mono font-bold text-[#5A5AA1]">
                    +15 pts / +20 pts
                  </p>
                </div>
              </div>
              {hasWishlistBonus ? (
                <span className="glass-pill-gold px-3 py-1 rounded-full text-[#000000] text-[11px] font-extrabold inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                  <Check className="w-3 h-3" aria-hidden="true" />
                  <span>+15 pts</span>
                </span>
              ) : (
                <span className="text-[11px] font-mono font-bold text-[#3F3F56] shrink-0">
                  {wishlistCount}/2
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Redeemed Rewards Vault */}
      {redeemedRewards.length > 0 && (
        <section aria-labelledby="active-rewards-heading" className="space-y-4">
          <div className="ice-surface rounded-3xl px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#5A5AA1]" aria-hidden="true" />
              <h2
                id="active-rewards-heading"
                className="font-display text-lg font-extrabold text-[#000000]"
              >
                {locale === 'fr'
                  ? `Mes Récompenses Débloquées (${redeemedRewards.length})`
                  : `My Redeemed Rewards (${redeemedRewards.length})`}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {redeemedRewards.map((item) => {
              const isApplied =
                Boolean(item.promoCode) &&
                appliedPromoCode?.toUpperCase() === item.promoCode?.toUpperCase();
              return (
                <div
                  key={item.redemptionId}
                  className="ice-surface rounded-3xl p-4 sm:p-5 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-[#3F3F56]">
                      <span>{formatOrderDate(item.redeemedAt)}</span>
                      <span className="font-mono font-bold text-[#5A5AA1] tabular-nums">
                        -{item.pointsCost} pts
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-extrabold text-[#000000]">
                      {locale === 'fr' ? item.titleFr : item.titleEn}
                    </h3>
                  </div>

                  {item.promoCode ? (
                    <div className="space-y-2.5">
                      <div className="glass-input-recessed rounded-2xl px-3.5 py-2 flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-extrabold tracking-wider text-[#000000]">
                          {item.promoCode}
                        </span>
                        <button
                          type="button"
                          aria-label={
                            locale === 'fr'
                              ? `Copier le code promo ${item.promoCode}`
                              : `Copy promo code ${item.promoCode}`
                          }
                          onClick={() =>
                            handleCopyCode(item.redemptionId, item.promoCode!)
                          }
                          className="glass-pill-frost px-2.5 py-1 rounded-full text-[11px] font-bold text-[#5A5AA1] inline-flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === item.redemptionId ? (
                            <>
                              <Check className="w-3 h-3" aria-hidden="true" />
                              <span>{locale === 'fr' ? 'Copié' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" aria-hidden="true" />
                              <span>{locale === 'fr' ? 'Copier' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        aria-pressed={isApplied}
                        aria-label={
                          locale === 'fr'
                            ? `Appliquer le code ${item.promoCode} au panier`
                            : `Apply promo code ${item.promoCode} to cart`
                        }
                        onClick={() => onApplyPromoToCart(item.promoCode!)}
                        className={`w-full min-h-[40px] px-4 py-2 rounded-full text-xs font-extrabold cursor-pointer ${
                          isApplied
                            ? 'glass-pill-black text-[#F4BE38]'
                            : 'glass-pill-gold text-[#000000]'
                        }`}
                      >
                        {isApplied
                          ? locale === 'fr'
                            ? 'Actif dans votre panier ▸'
                            : 'Active in your cart ▸'
                          : locale === 'fr'
                          ? 'Appliquer au panier'
                          : 'Apply to Cart'}
                      </button>
                    </div>
                  ) : (
                    <span className="glass-pill-black px-3.5 py-2 rounded-full text-xs font-bold text-[#F4BE38] text-center">
                      {locale === 'fr'
                        ? 'Privilège actif sur votre compte'
                        : 'Perk active on your account'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Rewards Catalog */}
      <section aria-labelledby="rewards-catalog-heading" className="space-y-4">
        <div className="ice-surface rounded-3xl px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#F4BE38] fill-[#F4BE38]" aria-hidden="true" />
            <h2
              id="rewards-catalog-heading"
              className="font-display text-lg sm:text-xl font-extrabold text-[#000000]"
            >
              {locale === 'fr'
                ? 'Catalogue des Récompenses'
                : 'Rewards Catalog'}
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', fr: 'Toutes', en: 'All' },
                { id: 'voucher', fr: "Bons d'achat", en: 'Vouchers' },
                { id: 'shipping', fr: 'Livraison', en: 'Shipping' },
                { id: 'vip', fr: 'Privilèges VIP', en: 'VIP Perks' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={rewardFilter === tab.id}
                onClick={() => setRewardFilter(tab.id)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  rewardFilter === tab.id
                    ? 'glass-pill-cta text-white'
                    : 'glass-pill-frost text-[#000000]'
                }`}
              >
                {locale === 'fr' ? tab.fr : tab.en}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRewards.map((reward) => {
            const Icon = getRewardIcon(reward.category);
            const canAfford = summary.availablePoints >= reward.pointsCost;
            const pointsMissing = Math.max(
              0,
              reward.pointsCost - summary.availablePoints
            );
            const progressPct = Math.min(
              100,
              Math.round((summary.availablePoints / reward.pointsCost) * 100)
            );

            return (
              <article
                key={reward.id}
                className="ice-surface rounded-3xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          canAfford
                            ? 'glass-pill-gold text-[#000000]'
                            : 'glass-pill-frost text-[#5A5AA1]'
                        }`}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </span>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A5AA1]">
                          {locale === 'fr' ? reward.badgeFr : reward.badgeEn}
                        </span>
                        <span className="block font-display text-sm font-extrabold text-[#000000]">
                          {locale === 'fr' ? reward.valueLabelFr : reward.valueLabelEn}
                        </span>
                      </div>
                    </div>

                    <span className="glass-pill-black px-3 py-1 rounded-full text-xs font-extrabold text-[#F4BE38] tabular-nums shrink-0">
                      {reward.pointsCost.toLocaleString('fr-FR')} pts
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-base font-extrabold text-[#000000] leading-snug">
                      {locale === 'fr' ? reward.titleFr : reward.titleEn}
                    </h3>
                    <p className="mt-1 text-xs text-[#3F3F56] leading-relaxed">
                      {locale === 'fr' ? reward.descriptionFr : reward.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-white/70">
                  {!canAfford && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-[#3F3F56]">
                        <span>
                          {locale === 'fr'
                            ? `Il manque ${pointsMissing} pts`
                            : `${pointsMissing} pts needed`}
                        </span>
                        <span className="font-mono font-bold tabular-nums">
                          {progressPct}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/70 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#5A5AA1]"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => handleRedeem(reward)}
                    className={`w-full min-h-[42px] px-4 py-2 rounded-full text-xs font-extrabold inline-flex items-center justify-center gap-2 transition-all ${
                      canAfford
                        ? 'glass-pill-cta text-white cursor-pointer'
                        : 'bg-white/50 border border-white/80 text-[#3F3F56] cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Gift className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {locale === 'fr'
                            ? `Échanger pour ${reward.pointsCost} pts`
                            : `Redeem for ${reward.pointsCost} pts`}
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>
                          {locale === 'fr'
                            ? `Verrouillé (${reward.pointsCost} pts)`
                            : `Locked (${reward.pointsCost} pts)`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* History of Point-Earning & Redemption Actions */}
      <section aria-labelledby="points-history-heading" className="ice-surface rounded-3xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/75">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#5A5AA1]" aria-hidden="true" />
            <h2
              id="points-history-heading"
              className="font-display text-lg sm:text-xl font-extrabold text-[#000000]"
            >
              {locale === 'fr'
                ? 'Historique des actions & points'
                : 'Point-Earning & Redemption History'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', fr: 'Tout', en: 'All' },
                { id: 'earn', fr: 'Gains', en: 'Earned' },
                { id: 'redeem', fr: 'Échanges', en: 'Redeemed' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={historyFilter === tab.id}
                onClick={() => setHistoryFilter(tab.id)}
                className={`min-h-[34px] px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer ${
                  historyFilter === tab.id
                    ? 'glass-pill-black text-[#F4BE38]'
                    : 'glass-pill-frost text-[#000000]'
                }`}
              >
                {locale === 'fr' ? tab.fr : tab.en}
              </button>
            ))}
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#3F3F56]">
            {locale === 'fr'
              ? 'Aucune activité enregistrée dans cette catégorie pour le moment.'
              : 'No point activity recorded in this filter yet.'}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredHistory.map((entry) => {
              const isEarn = entry.kind === 'earn';
              return (
                <div
                  key={entry.id}
                  className="ice-surface-subtle rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isEarn
                          ? 'glass-pill-gold text-[#000000]'
                          : 'glass-pill-black text-[#F4BE38]'
                      }`}
                    >
                      {isEarn ? (
                        <Award className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Gift className="w-4 h-4" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {entry.orderId ? (
                          <button
                            type="button"
                            aria-label={
                              locale === 'fr'
                                ? `Voir le suivi pour ${entry.titleFr}`
                                : `Inspect tracking for ${entry.titleEn}`
                            }
                            onClick={() => onInspectOrder(entry.orderId!)}
                            className="font-display text-sm font-extrabold text-[#000000] hover:text-[#5A5AA1] underline decoration-[#5A5AA1]/40 cursor-pointer"
                          >
                            {locale === 'fr' ? entry.titleFr : entry.titleEn}
                          </button>
                        ) : (
                          <span className="font-display text-sm font-extrabold text-[#000000]">
                            {locale === 'fr' ? entry.titleFr : entry.titleEn}
                          </span>
                        )}
                        <span className="text-xs text-[#3F3F56]">
                          · {formatOrderDate(entry.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-[#3F3F56]">
                        {locale === 'fr' ? entry.subtitleFr : entry.subtitleEn}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-sm font-extrabold tabular-nums px-3 py-1 rounded-full ${
                      isEarn
                        ? 'glass-pill-frost text-[#000000]'
                        : 'glass-pill-black text-[#F4BE38]'
                    }`}
                  >
                    {isEarn ? `+${entry.pointsDelta}` : entry.pointsDelta} pts
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
