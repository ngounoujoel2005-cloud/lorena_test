import { CheckCircle2, MapPin, PackageCheck, Search, ShieldCheck, Truck } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import { Locale, OrderRecord } from '../types/store';
import { formatOrderDate, formatXAF } from '../utils/format';
import { ProductImage } from './ProductImage';

interface TrackingScreenProps {
  locale: Locale;
  orders: OrderRecord[];
  activeOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
  onBackToCatalog: () => void;
}

export function TrackingScreen({
  locale,
  orders,
  activeOrderId,
  onSelectOrder,
  onBackToCatalog,
}: TrackingScreenProps) {
  const t = TRANSLATIONS[locale];
  const [lookupInput, setLookupInput] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);

  const selectedOrder =
    orders.find((o) => o.id === activeOrderId) ?? orders[0] ?? null;

  const steps =
    locale === 'fr'
      ? [
          { title: 'Commande confirmée', desc: 'Enregistrée et stock réservé.' },
          { title: 'Contrôle qualité & garantie', desc: 'Scellé vérifié avant départ.' },
          { title: 'En cours de livraison', desc: 'Prise en charge par le livreur.' },
          { title: 'Livrée', desc: 'Colis remis au destinataire.' },
        ]
      : [
          { title: 'Order Confirmed', desc: 'Logged and stock reserved.' },
          { title: 'Quality & Warranty Seal', desc: 'Verified prior to dispatch.' },
          { title: 'Out for Delivery', desc: 'Rider en route to your quarter.' },
          { title: 'Delivered', desc: 'Signed handoff completed.' },
        ];

  const handleLookup = (e: FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    const cleaned = lookupInput.trim().toUpperCase();
    if (!cleaned) return;
    const match = orders.find(
      (o) =>
        o.id.toUpperCase() === cleaned ||
        o.warrantySerial.toUpperCase() === cleaned
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

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 pb-16 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
            {locale === 'fr'
              ? 'Suivi de commande & Reçu'
              : 'Order Tracking & Receipt'}
          </h1>
          <p className="mt-1 text-sm text-[#6C757D]">
            {locale === 'fr'
              ? 'Suivez votre colis en temps réel et consultez votre certificat de garantie.'
              : 'Track delivery progress and inspect your warranty serial.'}
          </p>
        </div>

        <form onSubmit={handleLookup} className="flex items-center gap-2">
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#6C757D] absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value)}
              placeholder="Ex: LR-8492"
              aria-label="Numéro de commande"
              className="min-h-[44px] w-52 pl-9 pr-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#000000] focus:outline-none focus:border-[#5A5AA1]"
            />
          </div>
          <button
            type="submit"
            className="min-h-[44px] px-4 bg-[#5A5AA1] hover:bg-[#474789] text-white text-sm font-semibold rounded-lg cursor-pointer"
          >
            {locale === 'fr' ? 'Suivre' : 'Track'}
          </button>
        </form>
      </div>

      {lookupError && (
        <div className="p-3.5 rounded-xl bg-[#ffdad6] text-[#93000a] text-sm font-medium">
          {lookupError}
        </div>
      )}

      {selectedOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#F4BE38] text-[#000000] text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {selectedOrder.paymentVerified
                        ? locale === 'fr'
                          ? 'Paiement Mobile Money vérifié'
                          : 'Mobile Money Verified'
                        : locale === 'fr'
                        ? 'Paiement à la livraison'
                        : 'Cash on Delivery'}
                    </span>
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-bold text-[#000000] font-mono">
                    #{selectedOrder.id}
                  </h2>
                  <p className="text-xs text-[#6C757D]">
                    {formatOrderDate(selectedOrder.createdAt)}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="block text-xs text-[#6C757D]">
                    {locale === 'fr' ? 'Référence' : 'Reference'}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#000000]">
                    {selectedOrder.paymentReference}
                  </span>
                  <span className="block text-xs font-semibold text-[#5A5AA1] mt-1">
                    {selectedOrder.deliveryEta}
                  </span>
                </div>
              </div>

              <ol className="space-y-4">
                {steps.map((step, index) => {
                  const completed = index <= selectedOrder.stageIndex;
                  return (
                    <li key={step.title} className="flex items-start gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          completed
                            ? 'bg-[#5A5AA1] text-white'
                            : 'bg-[#F8F9FA] text-[#6C757D] border border-[#E5E7EB]'
                        }`}
                      >
                        {completed ? '✓' : index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#000000]">
                          {step.title}
                        </p>
                        <p className="text-xs text-[#6C757D] mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#5A5AA1]">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Destination' : 'Destination'}</span>
                </div>
                <p className="font-display text-base font-bold text-[#000000]">
                  {selectedOrder.customer.fullName}
                </p>
                <p className="text-sm text-[#4B5563]">
                  {selectedOrder.customer.quarter}, {selectedOrder.customer.city} (
                  {selectedOrder.customer.region})
                </p>
                <p className="text-xs text-[#6C757D]">
                  {selectedOrder.customer.landmark}
                </p>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#5A5AA1]">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {locale === 'fr' ? 'Certificat Garantie' : 'Warranty Serial'}
                  </span>
                </div>
                <p className="font-mono text-base font-bold text-[#000000]">
                  {selectedOrder.warrantySerial}
                </p>
                <p className="text-xs text-[#6C757D]">
                  {locale === 'fr'
                    ? 'Valable dans nos comptoirs Douala & Yaoundé.'
                    : 'Valid at Douala & Yaoundé service counters.'}
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-[#5A5AA1]" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-[#000000]">
                  {locale === 'fr' ? 'Détail des articles' : 'Receipt Items'}
                </h3>
              </div>
              <Truck className="w-4 h-4 text-[#6C757D]" aria-hidden="true" />
            </div>

            <div className="space-y-3.5">
              {selectedOrder.items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-lg bg-white border border-[#E5E7EB] p-1 shrink-0">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#000000] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#6C757D]">
                      {item.variantLabel} · Qté {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-[#000000]">
                    {formatXAF(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] space-y-2 text-sm">
              <div className="flex justify-between text-[#4B5563]">
                <span>{t.subtotal}</span>
                <span className="tabular-nums">{formatXAF(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>{locale === 'fr' ? 'Livraison' : 'Delivery'}</span>
                <span className="tabular-nums">
                  {selectedOrder.deliveryFee === 0
                    ? 'GRATUIT'
                    : formatXAF(selectedOrder.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#E5E7EB] font-display text-base font-bold text-[#000000]">
                <span>Total</span>
                <span className="tabular-nums">{formatXAF(selectedOrder.total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onBackToCatalog}
              className="w-full min-h-[44px] px-4 py-2.5 bg-[#5A5AA1] hover:bg-[#474789] text-white text-sm font-bold rounded-lg cursor-pointer"
            >
              {t.backToHome}
            </button>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
