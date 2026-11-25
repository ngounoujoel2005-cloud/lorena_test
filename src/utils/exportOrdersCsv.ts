import { Locale, OrderRecord } from '../types/store';
import { formatOrderDate } from './format';

function escapeCsvCell(value: string | number | boolean | undefined): string {
  const str = value === undefined ? '' : String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replaceAll('"', '""')}"`;
  }
  return str;
}

function getStageLabel(stageIndex: OrderRecord['stageIndex'], locale: Locale): string {
  const labelsFr = [
    'Commande passée',
    'En préparation',
    'En cours de livraison',
    'Livrée',
  ];
  const labelsEn = [
    'Order Placed',
    'Processing',
    'Out for Delivery',
    'Delivered',
  ];
  return (locale === 'fr' ? labelsFr : labelsEn)[stageIndex] ?? '';
}

function getPaymentMethodLabel(
  method: OrderRecord['paymentMethod'],
  locale: Locale
): string {
  if (method === 'mtn_momo') return 'MTN Mobile Money';
  if (method === 'orange_money') return 'Orange Money';
  return locale === 'fr' ? 'Paiement à la livraison' : 'Cash on Delivery';
}

export function exportOrdersToCsv(orders: OrderRecord[], locale: Locale): void {
  if (orders.length === 0) return;

  const headers =
    locale === 'fr'
      ? [
          'ID Commande',
          'N° Facture',
          'Date',
          'Statut Livraison',
          'Client',
          'Téléphone',
          'Région',
          'Ville',
          'Quartier',
          'Mode de Paiement',
          'Statut Paiement',
          'Réf. Paiement',
          'N° Garantie',
          'Articles',
          'Quantité Totale',
          'Sous-total (XAF)',
          'Remise Promo (XAF)',
          'Livraison (XAF)',
          'Total (XAF)',
        ]
      : [
          'Order ID',
          'Invoice #',
          'Date',
          'Delivery Stage',
          'Customer',
          'Phone',
          'Region',
          'City',
          'Quarter',
          'Payment Method',
          'Payment Status',
          'Payment Reference',
          'Warranty Serial',
          'Items',
          'Total Qty',
          'Subtotal (XAF)',
          'Promo Discount (XAF)',
          'Delivery Fee (XAF)',
          'Total (XAF)',
        ];

  const rows = orders.map((order) => {
    const itemsSummary = order.items
      .map(
        (item) =>
          `${item.name} (${item.variantLabel}) x${item.quantity} @ ${item.unitPrice} XAF`
      )
      .join(' | ');
    const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const paymentStatus = order.paymentVerified
      ? locale === 'fr'
        ? 'Vérifié'
        : 'Verified'
      : locale === 'fr'
      ? 'À la livraison'
      : 'Due on delivery';

    return [
      order.id,
      `FAC-${order.id}`,
      formatOrderDate(order.createdAt),
      getStageLabel(order.stageIndex, locale),
      order.customer.fullName,
      order.customer.phone,
      order.customer.region,
      order.customer.city,
      order.customer.quarter,
      getPaymentMethodLabel(order.paymentMethod, locale),
      paymentStatus,
      order.paymentReference,
      order.warrantySerial,
      itemsSummary,
      totalQty,
      order.subtotal,
      order.discountAmount ?? 0,
      order.deliveryFee,
      order.total,
    ]
      .map(escapeCsvCell)
      .join(',');
  });

  const csvContent = `\uFEFF${[headers.map(escapeCsvCell).join(','), ...rows].join(
    '\r\n'
  )}`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dateStamp = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lorena-market-orders-${dateStamp}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
