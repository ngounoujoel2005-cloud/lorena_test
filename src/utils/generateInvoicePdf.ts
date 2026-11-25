import { jsPDF } from 'jspdf';
import { Locale, OrderRecord } from '../types/store';
import { formatOrderDate, formatXAF } from './format';

const LETTERHEAD_BG_PATH = '/assets/aistudio/entete_lorena_bg.png';
const LORENA_LOGO_PATH = '/assets/aistudio/lorena-logo-noir-transparent_36764768.png';

interface LoadedImageAsset {
  dataUrl: string;
  width: number;
  height: number;
}

function loadImageAsDataUrl(url: string): Promise<LoadedImageAsset | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL('image/png'),
          width: canvas.width,
          height: canvas.height,
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function sanitizePdfText(value: string): string {
  return value.replace(/\u202f|\u00a0/g, ' ');
}

export async function generateInvoicePdf(
  order: OrderRecord,
  locale: Locale
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const [bgAsset, logoAsset] = await Promise.all([
    loadImageAsDataUrl(LETTERHEAD_BG_PATH),
    loadImageAsDataUrl(LORENA_LOGO_PATH),
  ]);

  if (bgAsset) {
    doc.addImage(bgAsset.dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  } else {
    // Fallback decorative header/footer bands matching Lorena palette
    doc.setFillColor(244, 190, 56);
    doc.rect(0, 0, 210, 6, 'F');
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 286, 210, 11, 'F');
  }

  const leftMargin = 16;
  const rightEdge = 194;
  const contentWidth = rightEdge - leftMargin;
  let y = 38;

  // Top Header Row (Invoice title + Lorena Logo or placeholder)
  doc.setFillColor(90, 90, 161);
  doc.roundedRect(leftMargin, y, 42, 6, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(
    locale === 'fr' ? 'FACTURE OFFICIELLE' : 'OFFICIAL INVOICE',
    leftMargin + 3,
    y + 4.2
  );

  if (logoAsset && logoAsset.width > 0 && logoAsset.height > 0) {
    const targetH = 14;
    const targetW = Math.min(48, (logoAsset.width / logoAsset.height) * targetH);
    doc.addImage(
      logoAsset.dataUrl,
      'PNG',
      rightEdge - targetW,
      y - 1,
      targetW,
      targetH,
      undefined,
      'FAST'
    );
  } else {
    doc.setFillColor(244, 190, 56);
    doc.roundedRect(rightEdge - 42, y, 42, 10, 2, 2, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('LORENA MARKET', rightEdge - 38, y + 6.5);
  }

  y += 14;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`FAC-${order.id}`, leftMargin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(75, 85, 99);
  doc.text(
    sanitizePdfText(
      `${locale === 'fr' ? 'Commande' : 'Order'} #${order.id}  ·  ${formatOrderDate(
        order.createdAt
      )}`
    ),
    leftMargin,
    y + 6
  );

  // Payment status pill at right
  const isMtn = order.paymentMethod === 'mtn_momo';
  const isOrange = order.paymentMethod === 'orange_money';
  const statusBadgeText = order.paymentVerified
    ? locale === 'fr'
      ? 'PAYEE & VERIFIEE'
      : 'PAID & VERIFIED'
    : locale === 'fr'
    ? 'PAIEMENT A LA LIVRAISON'
    : 'CASH ON DELIVERY';

  if (isMtn) {
    doc.setFillColor(244, 190, 56);
    doc.setTextColor(0, 0, 0);
  } else if (isOrange) {
    doc.setFillColor(255, 102, 0);
    doc.setTextColor(255, 255, 255);
  } else {
    doc.setFillColor(0, 0, 0);
    doc.setTextColor(255, 255, 255);
  }
  doc.roundedRect(rightEdge - 48, y - 1, 48, 7.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(statusBadgeText, rightEdge - 24, y + 4, { align: 'center' });

  y += 12;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, y, rightEdge, y);
  y += 7;

  // Client & Mobile Money Boxes
  const boxWidth = (contentWidth - 6) / 2;
  const boxHeight = 34;

  // Left box: Customer
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.35);
  doc.roundedRect(leftMargin, y, boxWidth, boxHeight, 2.5, 2.5, 'FD');

  doc.setTextColor(90, 90, 161);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(
    locale === 'fr' ? 'FACTURE ET LIVRE A' : 'BILLED & SHIPPED TO',
    leftMargin + 4,
    y + 6
  );

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.text(sanitizePdfText(order.customer.fullName), leftMargin + 4, y + 12.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(55, 65, 81);
  doc.text(sanitizePdfText(order.customer.phone), leftMargin + 4, y + 18);
  doc.text(
    sanitizePdfText(
      `${order.customer.quarter}, ${order.customer.city} (${order.customer.region})`
    ),
    leftMargin + 4,
    y + 23.5
  );
  const landmarkLines = doc.splitTextToSize(
    sanitizePdfText(order.customer.landmark),
    boxWidth - 8
  );
  doc.setFontSize(8);
  doc.setTextColor(108, 117, 125);
  doc.text(landmarkLines.slice(0, 1), leftMargin + 4, y + 29);

  // Right box: MTN / Orange Money System
  const rightBoxX = leftMargin + boxWidth + 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(rightBoxX, y, boxWidth, boxHeight, 2.5, 2.5, 'FD');

  doc.setTextColor(90, 90, 161);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(
    locale === 'fr' ? 'SYSTEME DE PAIEMENT' : 'PAYMENT SYSTEM',
    rightBoxX + 4,
    y + 6
  );

  const methodTitle = isMtn
    ? 'MTN Mobile Money (*126#)'
    : isOrange
    ? 'Orange Money (#150#)'
    : locale === 'fr'
    ? 'Paiement a la livraison (COD)'
    : 'Cash on Delivery (COD)';

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10.5);
  doc.text(methodTitle, rightBoxX + 4, y + 12.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(55, 65, 81);
  doc.text(
    sanitizePdfText(
      `${locale === 'fr' ? 'Payeur :' : 'Wallet:'} ${
        order.paymentPhone || order.customer.phone
      }`
    ),
    rightBoxX + 4,
    y + 18.5
  );
  doc.text(
    sanitizePdfText(
      `${locale === 'fr' ? 'Ref :' : 'Ref:'} ${order.paymentReference}`
    ),
    rightBoxX + 4,
    y + 24
  );
  doc.text(
    sanitizePdfText(
      `${locale === 'fr' ? 'Garantie :' : 'Warranty:'} ${order.warrantySerial}`
    ),
    rightBoxX + 4,
    y + 29.5
  );

  y += boxHeight + 8;

  // Items Table Header
  doc.setFillColor(0, 0, 0);
  doc.roundedRect(leftMargin, y, contentWidth, 9, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(
    locale === 'fr' ? 'ARTICLE & VARIANTE' : 'ITEM & VARIANT',
    leftMargin + 4,
    y + 6
  );
  doc.text(locale === 'fr' ? 'GARANTIE' : 'WARRANTY', leftMargin + 102, y + 6, {
    align: 'center',
  });
  doc.text(locale === 'fr' ? 'QTE' : 'QTY', leftMargin + 122, y + 6, {
    align: 'center',
  });
  doc.text(locale === 'fr' ? 'P.U.' : 'UNIT', leftMargin + 149, y + 6, {
    align: 'right',
  });
  doc.text(locale === 'fr' ? 'MONTANT' : 'AMOUNT', rightEdge - 4, y + 6, {
    align: 'right',
  });

  y += 10;

  // Items Rows
  for (const item of order.items) {
    if (y > 205) break;
    const nameLines = doc.splitTextToSize(sanitizePdfText(item.name), 84);
    const rowHeight = Math.max(13, nameLines.length * 4.5 + 6);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 231, 235);
    doc.rect(leftMargin, y, contentWidth, rowHeight, 'FD');

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.text(nameLines.slice(0, 2), leftMargin + 4, y + 5.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(108, 117, 125);
    doc.text(
      sanitizePdfText(`${item.brand} · ${item.variantLabel}`),
      leftMargin + 4,
      y + rowHeight - 2.2
    );

    doc.setTextColor(55, 65, 81);
    doc.setFontSize(8.5);
    doc.text(
      `${item.warrantyMonths} ${locale === 'fr' ? 'mois' : 'mo'}`,
      leftMargin + 102,
      y + rowHeight / 2 + 1,
      { align: 'center' }
    );
    doc.text(String(item.quantity), leftMargin + 122, y + rowHeight / 2 + 1, {
      align: 'center',
    });
    doc.text(
      sanitizePdfText(formatXAF(item.unitPrice)),
      leftMargin + 149,
      y + rowHeight / 2 + 1,
      { align: 'right' }
    );
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(
      sanitizePdfText(formatXAF(item.unitPrice * item.quantity)),
      rightEdge - 4,
      y + rowHeight / 2 + 1,
      { align: 'right' }
    );

    y += rowHeight;
  }

  y += 8;

  // Warranty Box (Left) + Totals Box (Right)
  const totalsWidth = 84;
  const totalsX = rightEdge - totalsWidth;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(leftMargin, y, contentWidth - totalsWidth - 6, 34, 2.5, 2.5, 'FD');
  doc.setTextColor(90, 90, 161);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.text(
    locale === 'fr'
      ? 'CERTIFICAT GARANTIE & SERVICE'
      : 'WARRANTY & SERVICE CERTIFICATE',
    leftMargin + 4,
    y + 6
  );
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text(order.warrantySerial, leftMargin + 4, y + 12.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(75, 85, 99);
  const warrantyNote = doc.splitTextToSize(
    locale === 'fr'
      ? 'Valable dans nos comptoirs Lorena Market Douala (Yassa / Akwa) et Yaounde. Conservez cette facture PDF.'
      : 'Valid at Lorena Market Douala (Yassa / Akwa) and Yaounde service counters. Keep this PDF invoice.',
    contentWidth - totalsWidth - 14
  );
  doc.text(warrantyNote, leftMargin + 4, y + 18.5);

  const totalsHeight = order.discountAmount ? 38 : 33;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.roundedRect(totalsX, y, totalsWidth, totalsHeight, 2.5, 2.5, 'FD');

  let ty = y + 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(75, 85, 89);
  doc.text(locale === 'fr' ? 'Sous-total' : 'Subtotal', totalsX + 4, ty);
  doc.text(sanitizePdfText(formatXAF(order.subtotal)), rightEdge - 4, ty, {
    align: 'right',
  });

  if (order.discountAmount && order.discountAmount > 0) {
    ty += 6;
    doc.setTextColor(90, 90, 161);
    doc.text(locale === 'fr' ? 'Remise promo' : 'Promo discount', totalsX + 4, ty);
    doc.text(
      `-${sanitizePdfText(formatXAF(order.discountAmount))}`,
      rightEdge - 4,
      ty,
      { align: 'right' }
    );
  }

  ty += 6;
  doc.setTextColor(75, 85, 89);
  doc.text(locale === 'fr' ? 'Livraison' : 'Delivery', totalsX + 4, ty);
  doc.text(
    order.deliveryFee === 0
      ? locale === 'fr'
        ? 'GRATUIT'
        : 'FREE'
      : sanitizePdfText(formatXAF(order.deliveryFee)),
    rightEdge - 4,
    ty,
    { align: 'right' }
  );

  ty += 4;
  doc.setDrawColor(0, 0, 0);
  doc.line(totalsX + 4, ty, rightEdge - 4, ty);

  ty += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 0, 0);
  doc.text(
    order.paymentVerified
      ? locale === 'fr'
        ? 'TOTAL PAYE'
        : 'TOTAL PAID'
      : locale === 'fr'
      ? 'NET A PAYER'
      : 'TOTAL DUE',
    totalsX + 4,
    ty
  );
  doc.setTextColor(90, 90, 161);
  doc.text(sanitizePdfText(formatXAF(order.total)), rightEdge - 4, ty, {
    align: 'right',
  });

  doc.save(`Facture-Lorena-${order.id}.pdf`);
}
