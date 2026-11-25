import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Printer,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
} from 'lucide-react';
import { useState } from 'react';
import { Locale, OrderRecord, PaymentMethod } from '../types/store';
import { formatOrderDate, formatXAF } from '../utils/format';
import { generateInvoicePdf } from '../utils/generateInvoicePdf';
import { ActionIconTooltip } from './ActionIconTooltip';
import { InvoiceDocument } from './InvoiceDocument';

interface InvoiceViewProps {
  locale: Locale;
  orders: OrderRecord[];
  activeOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
  onUpdateOrderPayment?: (
    orderId: string,
    paymentMethod: PaymentMethod,
    paymentPhone?: string
  ) => void;
  onGoToTracking: () => void;
  onBackToCatalog: () => void;
}

const LORENA_LOGO_PATH = '/assets/aistudio/lorena-logo-noir-transparent_36764768.png';

export function InvoiceView({
  locale,
  orders,
  activeOrderId,
  onSelectOrder,
  onUpdateOrderPayment,
  onGoToTracking,
  onBackToCatalog,
}: InvoiceViewProps) {
  const selectedOrder =
    orders.find((o) => o.id === activeOrderId) ?? orders[0] ?? null;

  const [logoFailed, setLogoFailed] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [selectedPayOption, setSelectedPayOption] = useState<PaymentMethod>(
    selectedOrder?.paymentMethod ?? 'mtn_momo'
  );
  const [walletPhone, setWalletPhone] = useState(
    selectedOrder?.paymentPhone || selectedOrder?.customer.phone || '+237 6'
  );
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  if (!selectedOrder) {
    return (
      <div className="max-w-[780px] mx-auto px-4 py-16">
        <div className="ice-surface rounded-3xl p-8 text-center space-y-4">
          <div className="glass-pill-frost w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-[#5A5AA1]" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[#000000]">
            {locale === 'fr' ? 'Aucune facture disponible' : 'No Invoice Found'}
          </h1>
          <p className="text-sm text-[#3F3F56]">
            {locale === 'fr'
              ? 'Passez une commande pour générer votre facture PDF officielle Lorena Market.'
              : 'Complete a purchase to generate your official Lorena Market PDF invoice.'}
          </p>
          <button
            type="button"
            onClick={onBackToCatalog}
            className="glass-pill-cta min-h-[44px] px-6 py-2.5 text-white text-sm font-bold rounded-full cursor-pointer"
          >
            {locale === 'fr' ? 'Retour à la boutique' : 'Back to Storefront'}
          </button>
        </div>
      </div>
    );
  }

  const handleSelectOrder = (order: OrderRecord) => {
    onSelectOrder(order.id);
    setSelectedPayOption(order.paymentMethod);
    setWalletPhone(order.paymentPhone || order.customer.phone);
    setPaymentMessage(null);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateInvoicePdf(selectedOrder, locale);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleApplyPaymentOption = (method: PaymentMethod) => {
    setSelectedPayOption(method);
    if (!onUpdateOrderPayment) return;
    const cleanDigits = walletPhone.replace(/\D/g, '');
    if (method !== 'cod' && cleanDigits.length < 9) {
      setPaymentMessage(
        locale === 'fr'
          ? 'Entrez un numéro Mobile Money camerounais valide (+237).'
          : 'Enter a valid Cameroon Mobile Money number (+237).'
      );
      return;
    }
    onUpdateOrderPayment(selectedOrder.id, method, walletPhone.trim());
    setPaymentMessage(
      method === 'mtn_momo'
        ? locale === 'fr'
          ? 'Facture mise à jour avec paiement MTN Mobile Money (*126#).'
          : 'Invoice updated with MTN Mobile Money (*126#) payment.'
        : method === 'orange_money'
        ? locale === 'fr'
          ? 'Facture mise à jour avec paiement Orange Money (#150#).'
          : 'Invoice updated with Orange Money (#150#) payment.'
        : locale === 'fr'
        ? 'Mode mis à jour : paiement à la livraison.'
        : 'Updated to Cash on Delivery.'
    );
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 pb-16 space-y-8">
      {/* 3-Step Checkout Progress Bar (Step 3 Active) */}
      <div className="no-print max-w-xl mx-auto ice-surface rounded-3xl px-6 py-4 flex items-center justify-between gap-2">
        <div className="flex flex-col items-center gap-1.5">
          <ActionIconTooltip
            text={locale === 'fr' ? 'Étape 1 : Panier validé' : 'Step 1: Cart confirmed'}
            placement="bottom"
            focusable
          >
            <span className="glass-pill-cta w-10 h-10 rounded-full text-white flex items-center justify-center">
              <Check className="w-4 h-4" aria-hidden="true" />
            </span>
          </ActionIconTooltip>
          <span className="text-xs font-bold text-[#5A5AA1]">
            {locale === 'fr' ? 'Panier' : 'Cart'}
          </span>
        </div>
        <div className="flex-1 h-1 rounded-full bg-[#5A5AA1]/60 mb-5" />
        <div className="flex flex-col items-center gap-1.5">
          <ActionIconTooltip
            text={locale === 'fr' ? 'Étape 2 : Commande confirmée' : 'Step 2: Order confirmed'}
            placement="bottom"
            focusable
          >
            <span className="glass-pill-cta w-10 h-10 rounded-full text-white flex items-center justify-center">
              <Check className="w-4 h-4" aria-hidden="true" />
            </span>
          </ActionIconTooltip>
          <span className="text-xs font-bold text-[#5A5AA1]">
            {locale === 'fr' ? 'Commande' : 'Checkout'}
          </span>
        </div>
        <div className="flex-1 h-1 rounded-full bg-[#5A5AA1]/60 mb-5" />
        <div className="flex flex-col items-center gap-1.5">
          <ActionIconTooltip
            text={
              locale === 'fr'
                ? 'Étape 3 : Facture PDF officielle générée'
                : 'Step 3: Official PDF invoice ready'
            }
            placement="bottom"
            focusable
          >
            <span className="glass-pill-black w-10 h-10 rounded-full text-[#F4BE38] flex items-center justify-center">
              <FileText className="w-4 h-4" aria-hidden="true" />
            </span>
          </ActionIconTooltip>
          <span className="text-xs font-extrabold text-[#000000]">
            {locale === 'fr' ? 'Facture PDF' : 'PDF Invoice'}
          </span>
        </div>
      </div>

      {/* Top Page Header & Brand Logo */}
      <div className="no-print ice-surface rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            {!logoFailed ? (
              <div className="ice-surface-subtle px-3 py-1.5 rounded-2xl">
                <img
                  src={LORENA_LOGO_PATH}
                  alt="Lorena Market"
                  onError={() => setLogoFailed(true)}
                  className="h-7 w-auto object-contain"
                />
              </div>
            ) : (
              <span className="glass-pill-black inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-extrabold">
                <ShoppingBag className="w-3.5 h-3.5 text-[#F4BE38]" aria-hidden="true" />
                <span>Lorena Market</span>
              </span>
            )}
            <ActionIconTooltip
              text={
                locale === 'fr'
                  ? 'Document officiel prêt au téléchargement ou à l’impression'
                  : 'Official document ready to download or print'
              }
              placement="right"
              focusable
            >
              <span className="glass-pill-gold px-3 py-1 rounded-full text-[#000000] text-xs font-extrabold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {locale === 'fr'
                    ? `Facture FAC-${selectedOrder.id} prête`
                    : `Invoice FAC-${selectedOrder.id} Ready`}
                </span>
              </span>
            </ActionIconTooltip>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#000000]">
            {locale === 'fr'
              ? 'Facturation officielle après achat'
              : 'Post-Purchase Official PDF Invoice'}
          </h1>
          <p className="text-sm text-[#3F3F56] font-medium">
            {locale === 'fr'
              ? `Commande #${selectedOrder.id} du ${formatOrderDate(
                  selectedOrder.createdAt
                )} · Total : ${formatXAF(selectedOrder.total)}`
              : `Order #${selectedOrder.id} from ${formatOrderDate(
                  selectedOrder.createdAt
                )} · Total: ${formatXAF(selectedOrder.total)}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ActionIconTooltip
            text={
              locale === 'fr'
                ? 'Suivre l’avancement de la livraison de cette commande'
                : 'Track delivery progress for this order'
            }
            placement="bottom"
          >
            <button
              type="button"
              onClick={onGoToTracking}
              className="glass-pill-frost min-h-[44px] px-4 py-2 rounded-full text-[#000000] text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Truck className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
              <span>
                {locale === 'fr' ? 'Suivre la livraison' : 'Track Delivery'}
              </span>
            </button>
          </ActionIconTooltip>

          <ActionIconTooltip
            text={
              locale === 'fr'
                ? 'Télécharger le fichier PDF officiel avec en-tête Lorena'
                : 'Download official PDF with Lorena letterhead'
            }
            placement="bottom"
          >
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="glass-pill-cta min-h-[44px] px-5 py-2 rounded-full text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>
                {isGeneratingPdf
                  ? locale === 'fr'
                    ? 'Création du PDF...'
                    : 'Generating PDF...'
                  : locale === 'fr'
                  ? 'Télécharger la facture PDF'
                  : 'Download PDF Invoice'}
              </span>
            </button>
          </ActionIconTooltip>

          <ActionIconTooltip
            text={
              locale === 'fr'
                ? 'Imprimer directement cette facture'
                : 'Print this invoice directly'
            }
            placement="left"
          >
            <button
              type="button"
              onClick={() => window.print()}
              className="glass-pill-black min-h-[44px] px-4 py-2 rounded-full text-[#F4BE38] text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>{locale === 'fr' ? 'Imprimer' : 'Print'}</span>
            </button>
          </ActionIconTooltip>
        </div>
      </div>

      {/* Order Selector (if multiple orders exist) */}
      {orders.length > 1 && (
        <div className="no-print flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#000000] shrink-0">
            {locale === 'fr' ? 'Sélectionner une commande :' : 'Select Order:'}
          </span>
          {orders.map((order) => {
            const isSelected = order.id === selectedOrder.id;
            return (
              <button
                key={order.id}
                type="button"
                onClick={() => handleSelectOrder(order)}
                className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'glass-pill-black text-[#F4BE38]'
                    : 'glass-pill-frost text-[#000000]'
                }`}
              >
                #{order.id} · {formatXAF(order.total)}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Split: Left Summary & MTN/Orange Payment Options | Right Styled Letterhead Invoice Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <aside className="no-print xl:col-span-4 space-y-5">
          {/* Amount & Order Details Summary Card */}
          <div className="ice-surface rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/75">
              <h2 className="font-display text-base font-bold text-[#000000]">
                {locale === 'fr' ? 'Résumé de facturation' : 'Billing Summary'}
              </h2>
              <span className="glass-pill-frost px-2.5 py-0.5 rounded-full font-mono text-xs font-bold text-[#5A5AA1]">
                FAC-{selectedOrder.id}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#3F3F56]">
                <span>{locale === 'fr' ? 'Articles' : 'Items'}</span>
                <span className="font-bold text-[#000000] tabular-nums">
                  {selectedOrder.items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between text-[#3F3F56]">
                <span>{locale === 'fr' ? 'Sous-total' : 'Subtotal'}</span>
                <span className="tabular-nums font-medium text-[#000000]">
                  {formatXAF(selectedOrder.subtotal)}
                </span>
              </div>
              {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-[#5A5AA1] font-bold">
                  <span>{locale === 'fr' ? 'Remise promo' : 'Promo discount'}</span>
                  <span className="tabular-nums">
                    -{formatXAF(selectedOrder.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#3F3F56]">
                <span>{locale === 'fr' ? 'Livraison' : 'Delivery'}</span>
                <span className="tabular-nums font-bold text-[#000000]">
                  {selectedOrder.deliveryFee === 0
                    ? locale === 'fr'
                      ? 'GRATUIT'
                      : 'FREE'
                    : formatXAF(selectedOrder.deliveryFee)}
                </span>
              </div>
              <div className="pt-3 border-t border-white/75 flex justify-between items-baseline">
                <span className="font-display font-bold text-[#000000]">
                  {locale === 'fr' ? 'Montant total' : 'Total Amount'}
                </span>
                <span className="font-display text-xl font-extrabold text-[#5A5AA1] tabular-nums">
                  {formatXAF(selectedOrder.total)}
                </span>
              </div>
            </div>
          </div>

          {/* MTN Mobile Money & Orange Money Payment Options Card */}
          <div className="ice-surface rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/75">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Choisissez ou mettez à jour le réseau Mobile Money sur la facture'
                    : 'Choose or update the Mobile Money option on the invoice'
                }
                placement="right"
                focusable
              >
                <Smartphone className="w-5 h-5 text-[#5A5AA1]" aria-hidden="true" />
              </ActionIconTooltip>
              <h2 className="font-display text-base font-bold text-[#000000]">
                {locale === 'fr'
                  ? 'Options de paiement MTN & Orange Money'
                  : 'MTN & Orange Money Payment Options'}
              </h2>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleApplyPaymentOption('mtn_momo')}
                className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  selectedOrder.paymentMethod === 'mtn_momo' ||
                  selectedPayOption === 'mtn_momo'
                    ? 'ice-yellow ring-2 ring-[#5A5AA1]'
                    : 'ice-surface-subtle hover:border-[#A084E8]'
                }`}
              >
                <div>
                  <span className="glass-pill-gold inline-block px-2.5 py-0.5 rounded-full text-[#000000] font-display text-xs font-extrabold">
                    MTN Mobile Money
                  </span>
                  <p className="text-xs text-[#3F3F56] font-medium mt-1">
                    {locale === 'fr'
                      ? 'Code USSD *126# · Validation instantanée'
                      : 'USSD *126# · Instant verification'}
                  </p>
                </div>
                {selectedOrder.paymentMethod === 'mtn_momo' && (
                  <CheckCircle2 className="w-5 h-5 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleApplyPaymentOption('orange_money')}
                className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  selectedOrder.paymentMethod === 'orange_money' ||
                  selectedPayOption === 'orange_money'
                    ? 'ice-surface ring-2 ring-[#FF6600]'
                    : 'ice-surface-subtle hover:border-[#A084E8]'
                }`}
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FF6600] text-white font-display text-xs font-extrabold shadow-xs">
                    Orange Money
                  </span>
                  <p className="text-xs text-[#3F3F56] font-medium mt-1">
                    {locale === 'fr'
                      ? 'Code USSD #150# · Reçu électronique'
                      : 'USSD #150# · Electronic receipt'}
                  </p>
                </div>
                {selectedOrder.paymentMethod === 'orange_money' && (
                  <CheckCircle2 className="w-5 h-5 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                )}
              </button>
            </div>

            <div>
              <label
                htmlFor="invoice-wallet-phone"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#3F3F56] mb-1.5"
              >
                {locale === 'fr'
                  ? 'Numéro Mobile Money sur la facture'
                  : 'Mobile Money Wallet on Invoice'}
              </label>
              <input
                id="invoice-wallet-phone"
                type="tel"
                value={walletPhone}
                onChange={(e) => {
                  setWalletPhone(e.target.value);
                  setPaymentMessage(null);
                }}
                placeholder="+237 6XX XXX XXX"
                className="glass-input-recessed min-h-[42px] w-full px-4 rounded-full text-sm text-[#000000] tabular-nums focus:outline-none"
              />
            </div>

            {paymentMessage && (
              <div className="ice-surface-subtle p-3 rounded-2xl border border-[#5A5AA1]/40 text-xs font-semibold text-[#000000]">
                {paymentMessage}
              </div>
            )}

            <div className="ice-obsidian p-3.5 rounded-2xl text-white flex items-start gap-2.5 text-xs">
              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Référence et numéro de série garantie certifiés'
                    : 'Verified transaction reference and warranty serial'
                }
                placement="right"
                focusable
              >
                <ShieldCheck className="w-4 h-4 text-[#F4BE38] shrink-0 mt-0.5" aria-hidden="true" />
              </ActionIconTooltip>
              <span>
                {locale === 'fr'
                  ? `Référence active : ${selectedOrder.paymentReference} · Garantie ${selectedOrder.warrantySerial}`
                  : `Active ref: ${selectedOrder.paymentReference} · Warranty ${selectedOrder.warrantySerial}`}
              </span>
            </div>
          </div>

          <ActionIconTooltip
            text={
              locale === 'fr'
                ? 'Revenir parcourir les articles de la boutique'
                : 'Return to browse the storefront'
            }
            placement="top"
            className="w-full"
          >
            <button
              type="button"
              onClick={onBackToCatalog}
              className="glass-pill-frost w-full min-h-[44px] px-4 py-2.5 rounded-full text-[#000000] text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>
                {locale === 'fr' ? 'Continuer mes achats' : 'Continue Shopping'}
              </span>
            </button>
          </ActionIconTooltip>
        </aside>

        {/* Official Stylized Letterhead PDF Preview */}
        <div className="xl:col-span-8">
          <InvoiceDocument order={selectedOrder} locale={locale} hideToolbar />
        </div>
      </div>
    </div>
  );
}
