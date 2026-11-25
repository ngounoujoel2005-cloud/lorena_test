import {
  CheckCircle2,
  Download,
  FileText,
  Printer,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
} from 'lucide-react';
import { useState } from 'react';
import { Locale, OrderRecord } from '../types/store';
import { formatOrderDate, formatXAF } from '../utils/format';
import { generateInvoicePdf } from '../utils/generateInvoicePdf';

interface InvoiceDocumentProps {
  order: OrderRecord;
  locale: Locale;
  hideToolbar?: boolean;
}

const LETTERHEAD_BG_PATH = '/assets/aistudio/entete_lorena_bg.png';
const LORENA_LOGO_PATH = '/assets/aistudio/lorena-logo-noir-transparent_36764768.png';

export function InvoiceDocument({
  order,
  locale,
  hideToolbar = false,
}: InvoiceDocumentProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [bgFailed, setBgFailed] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const isMtn = order.paymentMethod === 'mtn_momo';
  const isOrange = order.paymentMethod === 'orange_money';

  const paymentMethodLabel = isMtn
    ? 'MTN Mobile Money (*126#)'
    : isOrange
    ? 'Orange Money (#150#)'
    : locale === 'fr'
    ? 'Paiement à la livraison (Espèces)'
    : 'Cash on Delivery';

  const paymentStatusLabel = order.paymentVerified
    ? locale === 'fr'
      ? 'PAYÉE & VÉRIFIÉE'
      : 'PAID & VERIFIED'
    : locale === 'fr'
    ? 'À RÉGLER À LA LIVRAISON'
    : 'DUE ON DELIVERY';

  const invoiceNumber = `FAC-${order.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateInvoicePdf(order, locale);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <section
      aria-label={locale === 'fr' ? 'Facture officielle' : 'Official invoice'}
      className="space-y-4"
    >
      {/* Top Toolbar (Hidden on Print or when InvoiceView supplies unified toolbar) */}
      {!hideToolbar && (
        <div className="no-print max-w-[840px] mx-auto ice-obsidian text-white rounded-3xl p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="glass-pill-cta w-10 h-10 rounded-2xl text-[#F4BE38] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-sm sm:text-base font-bold text-white">
                  {locale === 'fr'
                    ? `Facturation officielle · ${invoiceNumber}`
                    : `Official Invoice · ${invoiceNumber}`}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    isMtn
                      ? 'glass-pill-gold text-[#000000]'
                      : isOrange
                      ? 'bg-[#FF6600] text-white'
                      : 'bg-white text-[#000000]'
                  }`}
                >
                  {isMtn ? 'MTN MoMo' : isOrange ? 'Orange Money' : 'COD'}
                </span>
              </div>
              <p className="text-xs text-white/75 mt-0.5">
                {locale === 'fr'
                  ? 'Émise avec en-tête officiel Lorena Market & référence de transaction.'
                  : 'Issued on official Lorena Market letterhead with payment reference.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="glass-pill-gold min-h-[42px] px-4 py-2 rounded-full text-[#000000] text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>
                {isGeneratingPdf
                  ? locale === 'fr'
                    ? 'Génération...'
                    : 'Generating...'
                  : locale === 'fr'
                  ? 'Télécharger PDF'
                  : 'Download PDF'}
              </span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="glass-pill-cta min-h-[42px] px-4 py-2 rounded-full text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>{locale === 'fr' ? 'Imprimer' : 'Print'}</span>
            </button>
          </div>
        </div>
      )}

      {/* A4 Official Letterhead Invoice Sheet */}
      <div className="print-invoice-sheet relative max-w-[840px] min-h-[960px] sm:min-h-[1120px] mx-auto bg-white border border-[#E5E7EB] rounded-2xl shadow-xl overflow-hidden">
        {!bgFailed ? (
          <img
            src={LETTERHEAD_BG_PATH}
            alt=""
            aria-hidden="true"
            onError={() => setBgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none select-none"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <div className="h-3 w-full bg-gradient-to-r from-[#F4BE38] via-[#5A5AA1] to-[#000000]" />
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#000000]" />
          </div>
        )}

        {/* Safe-area content clearing top lorena. header and bottom Yassa/Douala contact band */}
        <div className="relative z-10 pt-28 sm:pt-36 pb-44 sm:pb-52 px-6 sm:px-12 space-y-6">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b-2 border-[#000000]">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-[#5A5AA1] text-white text-[10px] font-extrabold uppercase tracking-wider">
                {locale === 'fr' ? 'Facture Officielle' : 'Official Tax & Sales Invoice'}
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#000000] font-mono">
                {invoiceNumber}
              </h2>
              <p className="text-xs text-[#4B5563] mt-1">
                {locale === 'fr' ? 'Commande' : 'Order'}{' '}
                <strong className="font-mono text-[#000000]">#{order.id}</strong> ·{' '}
                {formatOrderDate(order.createdAt)}
              </p>
            </div>

            <div className="sm:text-right flex flex-col sm:items-end gap-2">
              {!logoFailed ? (
                <img
                  src={LORENA_LOGO_PATH}
                  alt="Lorena Market"
                  onError={() => setLogoFailed(true)}
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#000000] text-white font-display text-sm font-extrabold">
                  <ShoppingBag className="w-4 h-4 text-[#F4BE38]" aria-hidden="true" />
                  <span>Lorena Market</span>
                </span>
              )}

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold tracking-wide ${
                  isMtn
                    ? 'bg-[#F4BE38] text-[#000000]'
                    : isOrange
                    ? 'bg-[#FF6600] text-white'
                    : 'bg-[#000000] text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{paymentStatusLabel}</span>
              </span>
            </div>
          </div>

          {/* Client & Mobile Money Payment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#E5E7EB] bg-white/90 p-4 space-y-1.5">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#5A5AA1]">
                {locale === 'fr' ? 'Facturé & livré à' : 'Billed & Shipped To'}
              </span>
              <p className="font-display text-base font-bold text-[#000000]">
                {order.customer.fullName}
              </p>
              <p className="text-xs font-mono font-semibold text-[#000000]">
                {order.customer.phone}
              </p>
              <p className="text-xs text-[#4B5563]">
                {order.customer.quarter}, {order.customer.city} ({order.customer.region})
              </p>
              <p className="text-[11px] text-[#6C757D]">
                {order.customer.landmark}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-white/90 p-4 space-y-2">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#5A5AA1]">
                {locale === 'fr'
                  ? 'Système de paiement & Transaction'
                  : 'Payment System & Transaction'}
              </span>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                <span className="font-display text-sm font-bold text-[#000000]">
                  {paymentMethodLabel}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div>
                  <span className="block text-[10px] text-[#6C757D]">
                    {locale === 'fr' ? 'Compte / Téléphone' : 'Wallet Number'}
                  </span>
                  <span className="font-mono font-semibold text-[#000000]">
                    {order.paymentPhone || order.customer.phone}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#6C757D]">
                    {locale === 'fr' ? 'Réf. Transaction' : 'Transaction ID'}
                  </span>
                  <span className="font-mono font-bold text-[#5A5AA1]">
                    {order.paymentReference}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white/90 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#000000] text-white text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">
                    {locale === 'fr' ? 'Article & Variante' : 'Product & Variant'}
                  </th>
                  <th className="py-3 px-3 font-bold text-center">
                    {locale === 'fr' ? 'Garantie' : 'Warranty'}
                  </th>
                  <th className="py-3 px-3 font-bold text-center">
                    {locale === 'fr' ? 'Qté' : 'Qty'}
                  </th>
                  <th className="py-3 px-3 font-bold text-right">
                    {locale === 'fr' ? 'P.U.' : 'Unit Price'}
                  </th>
                  <th className="py-3 px-4 font-bold text-right">
                    {locale === 'fr' ? 'Montant' : 'Amount'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs sm:text-sm">
                {order.items.map((item) => (
                  <tr key={`${item.productId}-${item.variantId}`}>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#000000]">{item.name}</p>
                      <p className="text-[11px] text-[#6C757D]">
                        {item.brand} · {item.variantLabel}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center text-xs text-[#4B5563] whitespace-nowrap">
                      {item.warrantyMonths} {locale === 'fr' ? 'mois' : 'mo'}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold tabular-nums text-[#000000]">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-[#4B5563] whitespace-nowrap">
                      {formatXAF(item.unitPrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums text-[#000000] whitespace-nowrap">
                      {formatXAF(item.unitPrice * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Warranty Seal */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
            <div className="sm:col-span-6 rounded-xl border border-[#E5E7EB] bg-white/90 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#5A5AA1]">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>
                  {locale === 'fr'
                    ? 'Certificat de garantie & authenticité'
                    : 'Warranty & Authenticity Certificate'}
                </span>
              </div>
              <p className="text-xs text-[#4B5563]">
                {locale === 'fr'
                  ? 'N° de série garantie :'
                  : 'Warranty Serial:'}{' '}
                <strong className="font-mono text-[#000000]">
                  {order.warrantySerial}
                </strong>
              </p>
              <p className="text-[11px] text-[#6C757D]">
                {locale === 'fr'
                  ? 'Présentez cette facture ou ce code dans nos points de service Douala (Yassa / Akwa) et Yaoundé pour toute prise en charge.'
                  : 'Present this invoice or serial at our Douala (Yassa / Akwa) and Yaoundé counters for service.'}
              </p>
            </div>

            <div className="sm:col-span-6 rounded-xl border border-[#000000] bg-white/95 p-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#4B5563]">
                <span>{locale === 'fr' ? 'Sous-total' : 'Subtotal'}</span>
                <span className="tabular-nums font-medium">
                  {formatXAF(order.subtotal)}
                </span>
              </div>
              {order.discountAmount && order.discountAmount > 0 && (
                <div className="flex justify-between text-[#5A5AA1] font-semibold">
                  <span>{locale === 'fr' ? 'Réduction promo' : 'Promo discount'}</span>
                  <span className="tabular-nums">
                    -{formatXAF(order.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#4B5563]">
                <span>
                  {locale === 'fr' ? 'Livraison' : 'Delivery'} ({order.deliveryEta})
                </span>
                <span className="tabular-nums font-semibold">
                  {order.deliveryFee === 0
                    ? locale === 'fr'
                      ? 'GRATUIT'
                      : 'FREE'
                    : formatXAF(order.deliveryFee)}
                </span>
              </div>
              <div className="pt-2.5 border-t-2 border-[#000000] flex justify-between items-baseline">
                <span className="font-display text-base font-extrabold text-[#000000]">
                  {order.paymentVerified
                    ? locale === 'fr'
                      ? 'TOTAL PAYÉ'
                      : 'TOTAL PAID'
                    : locale === 'fr'
                    ? 'NET À PAYER'
                    : 'TOTAL DUE'}
                </span>
                <span className="font-display text-xl font-extrabold text-[#5A5AA1] tabular-nums">
                  {formatXAF(order.total)}
                </span>
              </div>
              <p className="text-[10px] text-[#6C757D] text-right">
                {locale === 'fr'
                  ? 'Montant exprimé en Francs CFA (XAF), TVA incluse.'
                  : 'Amounts in Central African CFA Franc (XAF), VAT included.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
