import {
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  MapPin,
  Package,
  PackageCheck,
  Search,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import { Locale, OrderRecord } from '../types/store';
import { formatOrderDate, formatXAF } from '../utils/format';
import { InvoiceDocument } from './InvoiceDocument';
import { ProductImage } from './ProductImage';

interface TrackingScreenProps {
  locale: Locale;
  orders: OrderRecord[];
  activeOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
  onUpdateOrderStage?: (orderId: string, stageIndex: 0 | 1 | 2 | 3) => void;
  onOpenInvoiceView?: () => void;
  onBackToCatalog: () => void;
}

const PROGRESS_WIDTH_CLASSES = ['w-0', 'w-1/3', 'w-2/3', 'w-full'] as const;

export function TrackingScreen({
  locale,
  orders,
  activeOrderId,
  onSelectOrder,
  onUpdateOrderStage,
  onOpenInvoiceView,
  onBackToCatalog,
}: TrackingScreenProps) {
  const t = TRANSLATIONS[locale];
  const [lookupInput, setLookupInput] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'all' | 'tracking' | 'invoice'>('all');
  const invoiceSectionRef = useRef<HTMLDivElement>(null);

  const selectedOrder =
    orders.find((o) => o.id === activeOrderId) ?? orders[0] ?? null;

  const steps =
    locale === 'fr'
      ? [
          {
            title: 'Commande passée',
            desc: 'Enregistrée & paiement initié.',
            icon: ClipboardCheck,
          },
          {
            title: 'En préparation',
            desc: 'Contrôle qualité & scellé garantie.',
            icon: PackageCheck,
          },
          {
            title: 'En cours de livraison',
            desc: 'Coursier en route vers votre quartier.',
            icon: Truck,
          },
          {
            title: 'Livrée',
            desc: 'Remise confirmée au destinataire.',
            icon: CheckCircle2,
          },
        ]
      : [
          {
            title: 'Order Placed',
            desc: 'Logged & stock reserved.',
            icon: ClipboardCheck,
          },
          {
            title: 'Processing',
            desc: 'Quality check & warranty seal.',
            icon: PackageCheck,
          },
          {
            title: 'Out for Delivery',
            desc: 'Rider en route to your quarter.',
            icon: Truck,
          },
          {
            title: 'Delivered',
            desc: 'Signed handoff completed.',
            icon: CheckCircle2,
          },
        ];

  const handleLookup = (e: FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    const cleaned = lookupInput.trim().toUpperCase().replace(/^FAC-/, '');
    if (!cleaned) return;
    const match = orders.find(
      (o) =>
        o.id.toUpperCase() === cleaned ||
        o.warrantySerial.toUpperCase() === cleaned ||
        o.paymentReference.toUpperCase() === cleaned
    );
    if (!match) {
      setLookupError(
        locale === 'fr'
          ? `Aucune commande trouvée pour « ${lookupInput.trim()} ». Essayez LR-8492.`
          : `No order found matching "${lookupInput.trim()}". Try LR-8492.`
      );
      return;
    }
    onSelectOrder(match.id);
    setLookupInput('');
  };

  const handleOpenInvoice = () => {
    if (onOpenInvoiceView) {
      onOpenInvoiceView();
      return;
    }
    setActiveView('all');
    setTimeout(() => {
      invoiceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 pb-16 space-y-8">
      {/* 3-Step Checkout Progress Bar (Step 3 Active) */}
      <div className="no-print max-w-xl mx-auto ice-surface rounded-3xl px-6 py-4 flex items-center justify-between gap-2">
        <div className="flex flex-col items-center gap-1.5">
          <span className="glass-pill-cta w-10 h-10 rounded-full text-white flex items-center justify-center">
            <Check className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="text-xs font-bold text-[#5A5AA1]">
            {locale === 'fr' ? 'Panier' : 'Cart'}
          </span>
        </div>
        <div className="flex-1 h-1 rounded-full bg-[#5A5AA1]/60 mb-5" />
        <div className="flex flex-col items-center gap-1.5">
          <span className="glass-pill-cta w-10 h-10 rounded-full text-white flex items-center justify-center">
            <Check className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="text-xs font-bold text-[#5A5AA1]">
            {locale === 'fr' ? 'Commande' : 'Checkout'}
          </span>
        </div>
        <div className="flex-1 h-1 rounded-full bg-[#5A5AA1]/60 mb-5" />
        <div className="flex flex-col items-center gap-1.5">
          <span className="glass-pill-black w-10 h-10 rounded-full text-[#F4BE38] flex items-center justify-center">
            <Package className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="text-xs font-extrabold text-[#000000]">
            {locale === 'fr' ? 'Confirmation' : 'Confirmation'}
          </span>
        </div>
      </div>

      {/* Page Title & Lookup */}
      <div className="no-print ice-surface rounded-3xl p-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#000000]">
            {locale === 'fr'
              ? 'Suivi de commande & Facturation'
              : 'Order Tracking & Billing Invoice'}
          </h1>
          <p className="mt-1 text-sm text-[#3F3F56] font-medium">
            {locale === 'fr'
              ? 'Suivez les étapes de livraison et imprimez votre facture officielle MTN MoMo / Orange Money.'
              : 'Track fulfillment progress and print your official MTN MoMo / Orange Money invoice.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <form onSubmit={handleLookup} className="flex items-center gap-2">
            <div className="glass-input-recessed rounded-full flex items-center pl-3.5 pr-3">
              <Search className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
              <input
                type="text"
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                placeholder="Ex: LR-8492"
                aria-label={locale === 'fr' ? 'Numéro de commande' : 'Order number'}
                className="min-h-[42px] w-40 sm:w-44 pl-2.5 bg-transparent text-sm text-[#000000] placeholder:text-[#3F3F56]/70 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="glass-pill-cta min-h-[42px] px-5 text-white text-sm font-bold rounded-full cursor-pointer"
            >
              {locale === 'fr' ? 'Suivre' : 'Track'}
            </button>
          </form>

          {selectedOrder && (
            <button
              type="button"
              onClick={handleOpenInvoice}
              className="glass-pill-black min-h-[42px] px-4 text-[#F4BE38] text-sm font-bold rounded-full inline-flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>{locale === 'fr' ? 'Facture PDF' : 'PDF Invoice'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Order Switcher & View Tabs */}
      {selectedOrder && (
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {orders.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#000000] shrink-0">
                {locale === 'fr' ? 'Commandes :' : 'Orders:'}
              </span>
              {orders.map((order) => {
                const isSelected = order.id === selectedOrder.id;
                const badge =
                  order.paymentMethod === 'mtn_momo'
                    ? 'MTN'
                    : order.paymentMethod === 'orange_money'
                    ? 'Orange'
                    : 'COD';
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => onSelectOrder(order.id)}
                    className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'glass-pill-black text-[#F4BE38]'
                        : 'glass-pill-frost text-[#000000]'
                    }`}
                  >
                    <span className="font-mono">#{order.id}</span>
                    <span className="opacity-75">· {badge}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="ice-surface-subtle inline-flex rounded-full p-1 shrink-0 self-start sm:self-auto">
            {(
              [
                { id: 'all', labelFr: 'Suivi & Facture', labelEn: 'Tracking & Invoice' },
                { id: 'tracking', labelFr: 'Suivi colis', labelEn: 'Tracking Only' },
                { id: 'invoice', labelFr: 'Facture', labelEn: 'Invoice Only' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveView(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                  activeView === tab.id
                    ? 'glass-pill-cta text-white'
                    : 'text-[#3F3F56] hover:text-[#000000]'
                }`}
              >
                {locale === 'fr' ? tab.labelFr : tab.labelEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {lookupError && (
        <div className="no-print p-3.5 rounded-2xl bg-[#ffdad6]/90 border border-[#ba1a1a]/30 text-[#93000a] text-sm font-medium backdrop-blur-md">
          {lookupError}
        </div>
      )}

      {selectedOrder ? (
        <div className="space-y-10">
          {activeView !== 'invoice' && (
            <div className="no-print space-y-6">
              {/* Visual 4-Stage Progress Stepper Card */}
              <div className="ice-surface rounded-3xl p-6 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-white/75">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="glass-pill-gold inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[#000000] text-xs font-extrabold">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>
                          {selectedOrder.paymentMethod === 'mtn_momo'
                            ? locale === 'fr'
                              ? 'Payé via MTN MoMo'
                              : 'Paid via MTN MoMo'
                            : selectedOrder.paymentMethod === 'orange_money'
                            ? locale === 'fr'
                              ? 'Payé via Orange Money'
                              : 'Paid via Orange Money'
                            : locale === 'fr'
                            ? 'Paiement à la livraison'
                            : 'Cash on Delivery'}
                        </span>
                      </span>
                      <span className="glass-pill-frost px-3 py-0.5 rounded-full text-[#5A5AA1] text-xs font-bold">
                        {steps[selectedOrder.stageIndex]?.title}
                      </span>
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-extrabold text-[#000000] font-mono">
                      #{selectedOrder.id}
                    </h2>
                    <p className="text-xs text-[#3F3F56] font-medium">
                      {formatOrderDate(selectedOrder.createdAt)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <span className="block text-xs text-[#3F3F56] font-medium">
                      {locale === 'fr' ? 'Référence transaction' : 'Transaction Reference'}
                    </span>
                    <span className="font-mono text-sm font-bold text-[#000000]">
                      {selectedOrder.paymentReference}
                    </span>
                    <span className="block text-xs font-bold text-[#5A5AA1] mt-1">
                      {selectedOrder.deliveryEta}
                    </span>
                  </div>
                </div>

                {/* Horizontal Visual Progress Stepper (Desktop/Tablet) + Mobile Cards */}
                <div className="space-y-5">
                  <div className="hidden sm:block relative pt-2 pb-1 px-8">
                    <div className="relative h-2.5 ice-surface-subtle rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-[#5A5AA1] via-[#7C66DC] to-[#2563EB] rounded-full transition-all duration-500 ${
                          PROGRESS_WIDTH_CLASSES[selectedOrder.stageIndex]
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-3 -mt-6 relative z-10">
                      {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isCompleted = index < selectedOrder.stageIndex;
                        const isCurrent = index === selectedOrder.stageIndex;
                        return (
                          <div
                            key={step.title}
                            className="flex flex-col items-center text-center"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateOrderStage?.(
                                  selectedOrder.id,
                                  index as 0 | 1 | 2 | 3
                                )
                              }
                              aria-label={`${step.title}`}
                              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                                onUpdateOrderStage ? 'cursor-pointer' : 'cursor-default'
                              } ${
                                isCompleted
                                  ? 'glass-pill-cta text-white'
                                  : isCurrent
                                  ? 'glass-pill-black text-[#F4BE38] ring-4 ring-[#F4BE38]/50'
                                  : 'glass-pill-frost text-[#3F3F56]'
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-5 h-5" aria-hidden="true" />
                              ) : (
                                <StepIcon className="w-5 h-5" aria-hidden="true" />
                              )}
                            </button>
                            <span
                              className={`mt-2.5 text-xs font-bold ${
                                isCurrent
                                  ? 'text-[#000000]'
                                  : isCompleted
                                  ? 'text-[#5A5AA1]'
                                  : 'text-[#3F3F56]'
                              }`}
                            >
                              {step.title}
                            </span>
                            <span className="mt-0.5 text-[11px] text-[#3F3F56] max-w-[160px]">
                              {step.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile Compact Stepper */}
                  <ol className="sm:hidden space-y-3">
                    {steps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isCompleted = index < selectedOrder.stageIndex;
                      const isCurrent = index === selectedOrder.stageIndex;
                      return (
                        <li
                          key={step.title}
                          className={`flex items-start gap-3 p-3.5 rounded-2xl ${
                            isCurrent ? 'ice-yellow' : 'ice-surface-subtle'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              isCompleted
                                ? 'glass-pill-cta text-white'
                                : isCurrent
                                ? 'glass-pill-black text-[#F4BE38]'
                                : 'glass-pill-frost text-[#3F3F56]'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4" aria-hidden="true" />
                            ) : (
                              <StepIcon className="w-4 h-4" aria-hidden="true" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-bold text-[#000000]">
                                {step.title}
                              </p>
                              {isCurrent && (
                                <span className="glass-pill-black px-2.5 py-0.5 rounded-full text-[#F4BE38] text-[10px] font-bold">
                                  {locale === 'fr' ? 'Actuel' : 'Current'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#3F3F56] mt-0.5">{step.desc}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  {/* Interactive Stage Demo Bar */}
                  {onUpdateOrderStage && (
                    <div className="pt-3 border-t border-white/75 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-[#3F3F56] font-semibold">
                        {locale === 'fr'
                          ? 'Mettre à jour le statut de suivi :'
                          : 'Simulate / update delivery stage:'}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {steps.map((step, idx) => (
                          <button
                            key={step.title}
                            type="button"
                            onClick={() =>
                              onUpdateOrderStage(selectedOrder.id, idx as 0 | 1 | 2 | 3)
                            }
                            className={`px-3 py-1 rounded-full font-bold cursor-pointer ${
                              selectedOrder.stageIndex === idx
                                ? 'glass-pill-cta text-white'
                                : 'glass-pill-frost text-[#000000]'
                            }`}
                          >
                            {idx + 1}. {step.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Destination + Warranty + Receipt Items */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  <div className="ice-surface rounded-3xl p-5 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#5A5AA1]">
                      <MapPin className="w-4 h-4" aria-hidden="true" />
                      <span>{locale === 'fr' ? 'Destination' : 'Destination'}</span>
                    </div>
                    <p className="font-display text-base font-bold text-[#000000]">
                      {selectedOrder.customer.fullName}
                    </p>
                    <p className="text-sm text-[#3F3F56] font-medium">
                      {selectedOrder.customer.quarter}, {selectedOrder.customer.city} (
                      {selectedOrder.customer.region})
                    </p>
                    <p className="text-xs text-[#3F3F56]">
                      {selectedOrder.customer.landmark}
                    </p>
                  </div>

                  <div className="ice-obsidian text-white rounded-3xl p-5 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#F4BE38]">
                      <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {locale === 'fr' ? 'Certificat Garantie' : 'Warranty Serial'}
                      </span>
                    </div>
                    <p className="font-mono text-base font-bold text-white">
                      {selectedOrder.warrantySerial}
                    </p>
                    <p className="text-xs text-white/75">
                      {locale === 'fr'
                        ? 'Valable dans nos comptoirs Douala & Yaoundé.'
                        : 'Valid at Douala & Yaoundé service counters.'}
                    </p>
                  </div>
                </div>

                <aside className="lg:col-span-6 ice-surface rounded-3xl p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/75">
                    <div className="flex items-center gap-2">
                      <PackageCheck className="w-5 h-5 text-[#5A5AA1]" aria-hidden="true" />
                      <h3 className="font-display text-lg font-bold text-[#000000]">
                        {locale === 'fr' ? 'Détail des articles' : 'Receipt Items'}
                      </h3>
                    </div>
                    <Truck className="w-4 h-4 text-[#5A5AA1]" aria-hidden="true" />
                  </div>

                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variantId}`}
                        className="ice-surface-subtle rounded-2xl p-2.5 flex items-center gap-3"
                      >
                        <div className="w-14 h-14 rounded-xl ice-product-trap p-1 shrink-0">
                          <ProductImage
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain relative z-10"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#000000] truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#3F3F56]">
                            {item.variantLabel} · Qté {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-extrabold tabular-nums text-[#000000]">
                          {formatXAF(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/75 space-y-2 text-sm">
                    <div className="flex justify-between text-[#3F3F56]">
                      <span>{t.subtotal}</span>
                      <span className="tabular-nums font-medium text-[#000000]">
                        {formatXAF(selectedOrder.subtotal)}
                      </span>
                    </div>
                    {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-[#5A5AA1] font-bold">
                        <span>{locale === 'fr' ? 'Code promo' : 'Promo discount'}</span>
                        <span className="tabular-nums">
                          -{formatXAF(selectedOrder.discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#3F3F56]">
                      <span>{locale === 'fr' ? 'Livraison' : 'Delivery'}</span>
                      <span className="tabular-nums font-semibold text-[#000000]">
                        {selectedOrder.deliveryFee === 0
                          ? 'GRATUIT'
                          : formatXAF(selectedOrder.deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-white/75 font-display text-base font-extrabold text-[#000000]">
                      <span>Total</span>
                      <span className="tabular-nums text-[#5A5AA1]">
                        {formatXAF(selectedOrder.total)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleOpenInvoice}
                      className="glass-pill-black min-h-[44px] px-4 py-2.5 text-[#F4BE38] text-sm font-bold rounded-full inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {locale === 'fr' ? 'Facture PDF' : 'PDF Invoice'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={onBackToCatalog}
                      className="glass-pill-cta min-h-[44px] px-4 py-2.5 text-white text-sm font-bold rounded-full cursor-pointer"
                    >
                      {t.backToHome}
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          )}

          {/* Post-Purchase Letterhead Billing Invoice */}
          {activeView !== 'tracking' && (
            <div ref={invoiceSectionRef}>
              <InvoiceDocument order={selectedOrder} locale={locale} />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
