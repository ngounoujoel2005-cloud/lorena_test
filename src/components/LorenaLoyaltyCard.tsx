import {
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Crown,
  Gift,
  Lock,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Locale, LoyaltyBonusEvent, OrderRecord, RedeemedReward } from '../types/store';
import { formatOrderDate, formatXAF } from '../utils/format';
import {
  computeLoyaltySummary,
  getTierLabel,
  LOYALTY_TIERS,
  POINTS_PER_XAF_STEP,
} from '../utils/loyalty';
import { ActionIconTooltip } from './ActionIconTooltip';

interface LorenaLoyaltyCardProps {
  locale: Locale;
  orders: OrderRecord[];
  bonusEvents?: LoyaltyBonusEvent[];
  redeemedRewards?: RedeemedReward[];
  onInspectOrder: (orderId: string) => void;
  onOpenRewards?: () => void;
}

export function LorenaLoyaltyCard({
  locale,
  orders,
  bonusEvents = [],
  redeemedRewards = [],
  onInspectOrder,
  onOpenRewards,
}: LorenaLoyaltyCardProps) {
  const summary = useMemo(
    () => computeLoyaltySummary(orders, bonusEvents, redeemedRewards),
    [orders, bonusEvents, redeemedRewards]
  );
  const [selectedTierId, setSelectedTierId] = useState(summary.currentTier.id);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const inspectedTier =
    LOYALTY_TIERS.find((tier) => tier.id === selectedTierId) ?? summary.currentTier;

  const isInspectedUnlocked = summary.totalPoints >= inspectedTier.minPoints;
  const isInspectedCurrent = inspectedTier.id === summary.currentTier.id;

  return (
    <section
      aria-labelledby="lorena-loyalty-heading"
      className="ice-obsidian text-white rounded-3xl p-5 sm:p-6 space-y-5"
    >
      {/* Top Row: Program Title, Current Tier & Points Balance */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <ActionIconTooltip
            focusable
            placement="right"
            text={
              locale === 'fr'
                ? `Programme fidélité Lorena Loyalty : 1 point cumulé par tranche de ${formatXAF(
                    POINTS_PER_XAF_STEP
                  )} commandée`
                : `Lorena Loyalty rewards: earn 1 point for every ${formatXAF(
                    POINTS_PER_XAF_STEP
                  )} in order totals`
            }
          >
            <span className="glass-pill-gold w-11 h-11 rounded-2xl text-[#000000] flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" aria-hidden="true" />
            </span>
          </ActionIconTooltip>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="lorena-loyalty-heading"
                className="font-display text-lg sm:text-xl font-extrabold text-white"
              >
                Lorena Loyalty
              </h2>
              <span
                className={`${summary.currentTier.accentClass} px-3 py-0.5 rounded-full text-[11px] font-extrabold`}
              >
                {getTierLabel(summary.currentTier, locale)}
              </span>
            </div>
            <p className="mt-1 text-xs text-white/75">
              {locale === 'fr'
                ? `1 pt = ${formatXAF(POINTS_PER_XAF_STEP)} dépensés · Total cumulé : ${formatXAF(
                    summary.totalSpentXaf
                  )}`
                : `1 pt per ${formatXAF(POINTS_PER_XAF_STEP)} spent · Lifetime spend: ${formatXAF(
                    summary.totalSpentXaf
                  )}`}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right flex flex-col sm:items-end gap-1.5">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/70">
              {locale === 'fr' ? 'Points disponibles' : 'Available Points'}
            </span>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#F4BE38] tabular-nums leading-tight">
              {summary.availablePoints.toLocaleString('fr-FR')}{' '}
              <span className="text-sm font-bold text-white">pts</span>
            </p>
            {summary.totalRedeemedPoints > 0 && (
              <span className="text-[10px] text-white/70 font-mono tabular-nums">
                {locale === 'fr'
                  ? `${summary.totalPoints} cumulés · ${summary.totalRedeemedPoints} échangés`
                  : `${summary.totalPoints} lifetime · ${summary.totalRedeemedPoints} redeemed`}
              </span>
            )}
          </div>
          {onOpenRewards && (
            <button
              type="button"
              onClick={onOpenRewards}
              className="glass-pill-gold min-h-[34px] px-3.5 py-1 rounded-full text-[#000000] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {locale === 'fr'
                  ? 'Ouvrir Lorena Rewards'
                  : 'Open Lorena Rewards'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar Toward Next Reward Tier */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 space-y-2.5">
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
                    ? 'Palier maximal Diamant Obsidian atteint !'
                    : 'Top tier Diamond Obsidian unlocked!'}
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
              ? 'Progression vers le prochain palier Lorena Loyalty'
              : 'Progress toward the next Lorena Loyalty reward tier'
          }
          aria-valuenow={summary.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="w-full h-3 rounded-full bg-black/45 border border-white/20 overflow-hidden p-0.5"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F4BE38] via-[#A084E8] to-[#38BDF8] transition-all duration-500"
            style={{ width: `${Math.max(summary.totalPoints > 0 ? 4 : 0, summary.progressPercent)}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/80">
          {summary.nextTier ? (
            <span>
              {locale === 'fr'
                ? `Plus que ${summary.pointsRemaining} pts (${formatXAF(
                    summary.pointsRemaining * POINTS_PER_XAF_STEP
                  )}) pour débloquer ${getTierLabel(summary.nextTier, locale)}.`
                : `${summary.pointsRemaining} pts (${formatXAF(
                    summary.pointsRemaining * POINTS_PER_XAF_STEP
                  )}) away from ${getTierLabel(summary.nextTier, locale)}.`}
            </span>
          ) : (
            <span>
              {locale === 'fr'
                ? 'Vous bénéficiez de tous les avantages VIP Lorena Market.'
                : 'You enjoy all top-tier Lorena Market VIP benefits.'}
            </span>
          )}
          <span className="font-mono text-white/70 tabular-nums">
            {orders.length}{' '}
            {locale === 'fr'
              ? orders.length > 1
                ? 'commandes'
                : 'commande'
              : orders.length > 1
              ? 'orders'
              : 'order'}
          </span>
        </div>
      </div>

      {/* Reward Tiers Interactive Explorer */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LOYALTY_TIERS.map((tier) => {
            const unlocked = summary.totalPoints >= tier.minPoints;
            const selected = tier.id === inspectedTier.id;
            return (
              <button
                key={tier.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedTierId(tier.id)}
                className={`min-h-[44px] px-3 py-2 rounded-2xl text-left border transition-all cursor-pointer ${
                  selected
                    ? 'bg-white/20 border-[#F4BE38] text-white'
                    : unlocked
                    ? 'bg-white/10 border-white/25 text-white/90 hover:border-white/50'
                    : 'bg-black/25 border-white/15 text-white/60 hover:border-white/35'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-display text-xs font-bold truncate">
                    {getTierLabel(tier, locale)}
                  </span>
                  {unlocked ? (
                    <Check className="w-3.5 h-3.5 text-[#F4BE38] shrink-0" aria-hidden="true" />
                  ) : (
                    <Lock className="w-3 h-3 text-white/45 shrink-0" aria-hidden="true" />
                  )}
                </div>
                <span className="block text-[10px] font-mono text-white/75 tabular-nums mt-0.5">
                  {tier.minPoints}+ pts
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Perks Detail */}
        <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <ActionIconTooltip
              focusable
              placement="top"
              text={
                locale === 'fr'
                  ? 'Avantages inclus pour ce palier de fidélité'
                  : 'Included rewards for this loyalty tier'
              }
            >
              <Gift className="w-4 h-4 text-[#F4BE38] shrink-0 mt-0.5" aria-hidden="true" />
            </ActionIconTooltip>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white">
                {getTierLabel(inspectedTier, locale)} ·{' '}
                <span className="text-[#F4BE38] font-normal">
                  {isInspectedCurrent
                    ? locale === 'fr'
                      ? 'Palier actuel'
                      : 'Current tier'
                    : isInspectedUnlocked
                    ? locale === 'fr'
                      ? 'Débloqué'
                      : 'Unlocked'
                    : locale === 'fr'
                    ? `À ${inspectedTier.minPoints} pts`
                    : `Unlocks at ${inspectedTier.minPoints} pts`}
                </span>
              </p>
              <p className="text-xs text-white/80 mt-0.5">
                {locale === 'fr' ? inspectedTier.perkFr : inspectedTier.perkEn}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-expanded={showBreakdown}
            aria-controls="loyalty-points-breakdown"
            onClick={() => setShowBreakdown((prev) => !prev)}
            className="glass-pill-frost min-h-[36px] px-3.5 py-1.5 rounded-full text-[#000000] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>
              {locale === 'fr' ? 'Détail des points' : 'Points History'}
            </span>
            {showBreakdown ? (
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Order-by-Order Points Ledger */}
        {showBreakdown && (
          <div
            id="loyalty-points-breakdown"
            className="bg-black/30 border border-white/15 rounded-2xl divide-y divide-white/10 overflow-hidden"
          >
            {summary.orderBreakdown.length === 0 ? (
              <p className="px-4 py-4 text-xs text-white/75 text-center">
                {locale === 'fr'
                  ? 'Passez votre première commande pour commencer à cumuler des points Lorena Loyalty.'
                  : 'Place your first order to start earning Lorena Loyalty points.'}
              </p>
            ) : (
              summary.orderBreakdown.map((entry) => (
                <div
                  key={entry.orderId}
                  className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => onInspectOrder(entry.orderId)}
                      aria-label={
                        locale === 'fr'
                          ? `Voir le suivi de la commande #${entry.orderId}`
                          : `Inspect order #${entry.orderId}`
                      }
                      className="font-mono font-bold text-white hover:text-[#F4BE38] underline decoration-white/30 cursor-pointer"
                    >
                      #{entry.orderId}
                    </button>
                    <span className="text-white/65 ml-2">
                      {formatOrderDate(entry.createdAt)} · {formatXAF(entry.totalXaf)}
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-[#F4BE38] tabular-nums">
                    +{entry.pointsEarned} pts
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
