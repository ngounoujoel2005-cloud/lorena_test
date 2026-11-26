import {
  Locale,
  LoyaltyBonusEvent,
  OrderRecord,
  PointActionEntry,
  RedeemedReward,
  RewardCatalogItem,
} from '../types/store';
import { formatXAF } from './format';

export interface LoyaltyTier {
  id: 'bronze' | 'silver' | 'gold' | 'diamond';
  nameFr: string;
  nameEn: string;
  minPoints: number;
  perkFr: string;
  perkEn: string;
  accentClass: string;
}

export const POINTS_PER_XAF_STEP = 1000;

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'bronze',
    nameFr: 'Bronze Ice',
    nameEn: 'Bronze Ice',
    minPoints: 0,
    perkFr: '1 pt par 1 000 XAF · Accès prioritaire aux ventes flash',
    perkEn: '1 pt per 1,000 XAF · Early access to flash sales',
    accentClass: 'glass-pill-frost text-[#000000]',
  },
  {
    id: 'silver',
    nameFr: 'Argent Frost',
    nameEn: 'Silver Frost',
    minPoints: 250,
    perkFr: 'Bon d’achat 5 000 XAF + Expédition prioritaire Douala/Yaoundé',
    perkEn: '5,000 XAF reward voucher + Priority Douala/Yaoundé dispatch',
    accentClass: 'glass-pill-blue text-white',
  },
  {
    id: 'gold',
    nameFr: 'Or Prestige',
    nameEn: 'Gold Prestige',
    minPoints: 750,
    perkFr: 'Remise VIP -10 % (LORENA10) + Garantie étendue offerte',
    perkEn: 'VIP -10% discount (LORENA10) + Complimentary extended warranty',
    accentClass: 'glass-pill-gold text-[#000000]',
  },
  {
    id: 'diamond',
    nameFr: 'Diamant Obsidian',
    nameEn: 'Diamond Obsidian',
    minPoints: 2000,
    perkFr: 'Livraison offerte illimitée + Bon cadeau 25 000 XAF & Conciergerie',
    perkEn: 'Unlimited free delivery + 25,000 XAF gift credit & VIP concierge',
    accentClass: 'glass-pill-cta text-white',
  },
];

export const REWARDS_CATALOG: RewardCatalogItem[] = [
  {
    id: 'reward-free-ship',
    category: 'shipping',
    titleFr: 'Livraison Express Offerte',
    titleEn: 'Free Express Delivery',
    descriptionFr:
      'Débloque le code FREESHIP valable sur votre prochaine commande à Douala, Yaoundé ou régions (-2 500 XAF sur le panier).',
    descriptionEn:
      'Unlocks code FREESHIP valid on your next order in Douala, Yaoundé, or nationwide (-2,500 XAF off checkout).',
    badgeFr: 'Livraison',
    badgeEn: 'Shipping',
    pointsCost: 50,
    promoCode: 'FREESHIP',
    valueLabelFr: '2 500 XAF offerts',
    valueLabelEn: '2,500 XAF value',
  },
  {
    id: 'reward-voucher-2500',
    category: 'voucher',
    titleFr: 'Bon d’achat Lorena 2 500 XAF',
    titleEn: '2,500 XAF Store Voucher',
    descriptionFr:
      'Réduction immédiate de 2 500 XAF applicable dans votre panier sur tout le catalogue Lorena Market.',
    descriptionEn:
      'Instant 2,500 XAF discount applicable in your shopping bag across all Lorena Market items.',
    badgeFr: 'Bon d’achat',
    badgeEn: 'Voucher',
    pointsCost: 80,
    promoCode: 'REWARD2500',
    valueLabelFr: '-2 500 XAF',
    valueLabelEn: '-2,500 XAF',
  },
  {
    id: 'reward-voucher-5000',
    category: 'voucher',
    titleFr: 'Bon d’achat Lorena 5 000 XAF',
    titleEn: '5,000 XAF Store Voucher',
    descriptionFr:
      'Coupon de 5 000 XAF activable instantanément dans votre panier ou lors du paiement Mobile Money.',
    descriptionEn:
      '5,000 XAF discount coupon ready to apply in your cart or during Mobile Money checkout.',
    badgeFr: 'Populaire',
    badgeEn: 'Popular',
    pointsCost: 120,
    promoCode: 'REWARD5000',
    valueLabelFr: '-5 000 XAF',
    valueLabelEn: '-5,000 XAF',
  },
  {
    id: 'reward-vip-10pct',
    category: 'vip',
    titleFr: 'Pass VIP -10 % Boutique',
    titleEn: 'VIP -10% Storewide Pass',
    descriptionFr:
      'Active le privilège LORENA10 (-10 % sur tout votre panier), idéal pour les Smart TV, réfrigérateurs et smartphones.',
    descriptionEn:
      'Unlocks LORENA10 (-10% off your entire cart), ideal for Smart TVs, fridges, and smartphones.',
    badgeFr: 'Privilège VIP',
    badgeEn: 'VIP Perk',
    pointsCost: 250,
    promoCode: 'LORENA10',
    valueLabelFr: '-10 % panier',
    valueLabelEn: '-10% cart',
  },
  {
    id: 'reward-voucher-15000',
    category: 'voucher',
    titleFr: 'Bon Cadeau Prestige 15 000 XAF',
    titleEn: '15,000 XAF Prestige Gift Credit',
    descriptionFr:
      'Crédit fidélité majeur de 15 000 XAF sur les équipements Électronique, Électroménager ou High-Tech.',
    descriptionEn:
      'Major 15,000 XAF loyalty credit across Electronics, Appliances, or High-Tech gear.',
    badgeFr: 'Prestige',
    badgeEn: 'Prestige',
    pointsCost: 500,
    promoCode: 'REWARD15000',
    valueLabelFr: '-15 000 XAF',
    valueLabelEn: '-15,000 XAF',
  },
  {
    id: 'reward-vip-warranty',
    category: 'vip',
    titleFr: 'Extension Garantie +12 Mois VIP',
    titleEn: 'VIP +12 Month Extended Warranty',
    descriptionFr:
      'Ajoute 12 mois de couverture technique officielle supplémentaire et un enlèvement SAV prioritaire à domicile.',
    descriptionEn:
      'Adds 12 extra months of official technical coverage plus priority doorstep after-sales pickup.',
    badgeFr: 'Service VIP',
    badgeEn: 'VIP Care',
    pointsCost: 750,
    valueLabelFr: '+12 mois SAV',
    valueLabelEn: '+12m Warranty',
  },
  {
    id: 'reward-voucher-35000',
    category: 'voucher',
    titleFr: 'Bon Cadeau Diamant 35 000 XAF',
    titleEn: '35,000 XAF Diamond Gift Voucher',
    descriptionFr:
      'Notre plus grande récompense fidélité : 35 000 XAF déduits immédiatement sur votre prochaine commande.',
    descriptionEn:
      'Our highest loyalty voucher: 35,000 XAF deducted immediately on your next purchase.',
    badgeFr: 'Diamant',
    badgeEn: 'Diamond',
    pointsCost: 1200,
    promoCode: 'REWARD35000',
    valueLabelFr: '-35 000 XAF',
    valueLabelEn: '-35,000 XAF',
  },
];

export interface LoyaltySummary {
  totalPoints: number;
  earnedFromOrders: number;
  earnedFromActions: number;
  totalRedeemedPoints: number;
  availablePoints: number;
  totalSpentXaf: number;
  currentTier: LoyaltyTier;
  nextTier: LoyaltyTier | null;
  pointsInCurrentTier: number;
  pointsNeededForNextTier: number;
  pointsRemaining: number;
  progressPercent: number;
  orderBreakdown: Array<{
    orderId: string;
    createdAt: string;
    totalXaf: number;
    pointsEarned: number;
  }>;
  pointHistory: PointActionEntry[];
}

export function calculateOrderPoints(totalXaf: number): number {
  if (!Number.isFinite(totalXaf) || totalXaf <= 0) return 0;
  return Math.floor(totalXaf / POINTS_PER_XAF_STEP);
}

export function computeLoyaltySummary(
  orders: OrderRecord[],
  bonusEvents: LoyaltyBonusEvent[] = [],
  redeemedRewards: RedeemedReward[] = []
): LoyaltySummary {
  const orderBreakdown = orders.map((order) => ({
    orderId: order.id,
    createdAt: order.createdAt,
    totalXaf: order.total,
    pointsEarned: calculateOrderPoints(order.total),
  }));

  const totalSpentXaf = orderBreakdown.reduce((sum, item) => sum + item.totalXaf, 0);
  const earnedFromOrders = orderBreakdown.reduce(
    (sum, item) => sum + item.pointsEarned,
    0
  );
  const earnedFromActions = bonusEvents.reduce((sum, ev) => sum + ev.points, 0);
  const totalPoints = earnedFromOrders + earnedFromActions;
  const totalRedeemedPoints = redeemedRewards.reduce(
    (sum, item) => sum + item.pointsCost,
    0
  );
  const availablePoints = Math.max(0, totalPoints - totalRedeemedPoints);

  const orderHistoryEntries: PointActionEntry[] = orderBreakdown.map((entry) => ({
    id: `order-${entry.orderId}`,
    kind: 'earn',
    source: 'order',
    titleFr: `Commande #${entry.orderId}`,
    titleEn: `Order #${entry.orderId}`,
    subtitleFr: `Achat validé de ${formatXAF(entry.totalXaf)}`,
    subtitleEn: `Completed order totaling ${formatXAF(entry.totalXaf)}`,
    pointsDelta: entry.pointsEarned,
    createdAt: entry.createdAt,
    orderId: entry.orderId,
  }));

  const bonusHistoryEntries: PointActionEntry[] = bonusEvents.map((ev) => ({
    id: `bonus-${ev.id}`,
    kind: 'earn',
    source: ev.type,
    titleFr: ev.titleFr,
    titleEn: ev.titleEn,
    subtitleFr: 'Action fidélité Lorena Rewards',
    subtitleEn: 'Lorena Rewards bonus activity',
    pointsDelta: ev.points,
    createdAt: ev.createdAt,
  }));

  const redeemHistoryEntries: PointActionEntry[] = redeemedRewards.map((item) => ({
    id: `redeem-${item.redemptionId}`,
    kind: 'redeem',
    source: 'reward',
    titleFr: `Échange : ${item.titleFr}`,
    titleEn: `Redeemed: ${item.titleEn}`,
    subtitleFr: item.promoCode
      ? `Code débloqué : ${item.promoCode}`
      : 'Avantage activé sur votre compte',
    subtitleEn: item.promoCode
      ? `Unlocked code: ${item.promoCode}`
      : 'Perk activated on your account',
    pointsDelta: -item.pointsCost,
    createdAt: item.redeemedAt,
    promoCode: item.promoCode,
  }));

  const pointHistory = [
    ...orderHistoryEntries,
    ...bonusHistoryEntries,
    ...redeemHistoryEntries,
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let currentTierIndex = 0;
  for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
    if (totalPoints >= LOYALTY_TIERS[i].minPoints) {
      currentTierIndex = i;
      break;
    }
  }

  const currentTier = LOYALTY_TIERS[currentTierIndex];
  const nextTier =
    currentTierIndex < LOYALTY_TIERS.length - 1
      ? LOYALTY_TIERS[currentTierIndex + 1]
      : null;

  if (!nextTier) {
    return {
      totalPoints,
      earnedFromOrders,
      earnedFromActions,
      totalRedeemedPoints,
      availablePoints,
      totalSpentXaf,
      currentTier,
      nextTier: null,
      pointsInCurrentTier: totalPoints - currentTier.minPoints,
      pointsNeededForNextTier: 0,
      pointsRemaining: 0,
      progressPercent: 100,
      orderBreakdown,
      pointHistory,
    };
  }

  const span = Math.max(1, nextTier.minPoints - currentTier.minPoints);
  const earnedInTier = Math.max(0, totalPoints - currentTier.minPoints);
  const pointsRemaining = Math.max(0, nextTier.minPoints - totalPoints);
  const progressPercent = Math.min(100, Math.round((earnedInTier / span) * 100));

  return {
    totalPoints,
    earnedFromOrders,
    earnedFromActions,
    totalRedeemedPoints,
    availablePoints,
    totalSpentXaf,
    currentTier,
    nextTier,
    pointsInCurrentTier: earnedInTier,
    pointsNeededForNextTier: span,
    pointsRemaining,
    progressPercent,
    orderBreakdown,
    pointHistory,
  };
}

export function getTierLabel(tier: LoyaltyTier, locale: Locale): string {
  return locale === 'fr' ? tier.nameFr : tier.nameEn;
}
