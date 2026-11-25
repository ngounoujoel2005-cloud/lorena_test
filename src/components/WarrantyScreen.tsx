import { CheckCircle2, MapPin, Phone, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import { Locale, OrderRecord } from '../types/store';
import { formatOrderDate } from '../utils/format';

interface WarrantyScreenProps {
  locale: Locale;
  orders: OrderRecord[];
  onBackToCatalog: () => void;
  onGoToTracking: () => void;
}

const SERVICE_HUBS = [
  {
    city: 'Douala — Hub Akwa',
    address: 'Boulevard de la Liberté, Immeuble Lorena',
    hours: 'Lun–Sam · 08:00 – 18:00',
    phone: '+237 693 71 25 25',
  },
  {
    city: 'Yaoundé — Comptoir Bastos',
    address: 'Rue 1775, Bastos',
    hours: 'Lun–Sam · 08:30 – 18:00',
    phone: '+237 699 00 84 15',
  },
  {
    city: 'Bafoussam — Relais Tamdja',
    address: 'Avenue du Gouverneur, Bloc B',
    hours: 'Lun–Ven · 09:00 – 17:30',
    phone: '+237 655 00 32 90',
  },
];

export function WarrantyScreen({
  locale,
  orders,
  onBackToCatalog,
  onGoToTracking,
}: WarrantyScreenProps) {
  const t = TRANSLATIONS[locale];
  const [serialQuery, setSerialQuery] = useState('LR-WRN-26-8492A');
  const [matchedOrder, setMatchedOrder] = useState<OrderRecord | null>(
    orders[0] ?? null
  );
  const [notFound, setNotFound] = useState(false);

  const handleVerify = (e: FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    const cleaned = serialQuery.trim().toUpperCase();
    const found = orders.find(
      (o) =>
        o.warrantySerial.toUpperCase() === cleaned ||
        o.id.toUpperCase() === cleaned
    );
    if (!found) {
      setMatchedOrder(null);
      setNotFound(true);
      return;
    }
    setMatchedOrder(found);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 pb-16 space-y-8">
      <div className="pb-6 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#F4BE38] text-[#000000] text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {locale === 'fr'
                ? 'Aide, Retours & Garantie Lorena'
                : 'Lorena Help, Returns & Warranty'}
            </span>
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
            {locale === 'fr'
              ? 'Centre d’aide & Vérification Garantie'
              : 'Help Center & Warranty Lookup'}
          </h1>
          <p className="mt-1 text-sm text-[#6C757D]">
            {locale === 'fr'
              ? 'Vérifiez votre numéro de garantie, suivez une commande ou contactez nos points relais.'
              : 'Verify your warranty certificate, track an order, or reach our service counters.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onGoToTracking}
            className="min-h-[42px] px-4 bg-[#000000] text-white text-xs sm:text-sm font-semibold rounded-lg cursor-pointer"
          >
            {locale === 'fr' ? 'Suivre une commande' : 'Track Order'}
          </button>
          <button
            type="button"
            onClick={onBackToCatalog}
            className="min-h-[42px] px-5 bg-[#5A5AA1] hover:bg-[#474789] text-white text-xs sm:text-sm font-semibold rounded-lg cursor-pointer"
          >
            {t.backToHome}
          </button>
        </div>
      </div>

      {/* Serial Verification */}
      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-5">
        <div className="max-w-xl">
          <h2 className="font-display text-lg font-bold text-[#000000]">
            {locale === 'fr'
              ? 'Vérifier un certificat de garantie'
              : 'Verify a Warranty Certificate'}
          </h2>
          <p className="mt-1 text-xs text-[#6C757D]">
            {locale === 'fr'
              ? 'Exemple : LR-WRN-26-8492A ou numéro de commande LR-8492'
              : 'Example: LR-WRN-26-8492A or order ID LR-8492'}
          </p>

          <form onSubmit={handleVerify} className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-[#6C757D] absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="text"
                value={serialQuery}
                onChange={(e) => setSerialQuery(e.target.value)}
                aria-label="Numéro de garantie"
                className="min-h-[44px] w-full pl-9 pr-3 bg-white border border-[#E5E7EB] rounded-lg font-mono text-sm text-[#000000] focus:outline-none focus:border-[#5A5AA1]"
              />
            </div>
            <button
              type="submit"
              className="min-h-[44px] px-5 bg-[#5A5AA1] hover:bg-[#474789] text-white text-sm font-semibold rounded-lg cursor-pointer"
            >
              {locale === 'fr' ? 'Vérifier' : 'Verify'}
            </button>
          </form>
        </div>

        {matchedOrder && (
          <div className="p-5 rounded-xl bg-[#F8F9FA] border border-[#5A5AA1]/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#5A5AA1]">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                <span>
                  {locale === 'fr'
                    ? 'Garantie active vérifiée'
                    : 'Active Warranty Verified'}
                </span>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#F4BE38] text-[#000000]">
                {matchedOrder.warrantySerial}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="block text-xs text-[#6C757D]">
                  {locale === 'fr' ? 'Titulaire' : 'Owner'}
                </span>
                <span className="font-bold text-[#000000]">
                  {matchedOrder.customer.fullName}
                </span>
              </div>
              <div>
                <span className="block text-xs text-[#6C757D]">Date</span>
                <span className="font-medium text-[#000000]">
                  {formatOrderDate(matchedOrder.createdAt)}
                </span>
              </div>
              <div>
                <span className="block text-xs text-[#6C757D]">
                  {locale === 'fr' ? 'Produits couverts' : 'Covered Items'}
                </span>
                <span className="font-medium text-[#000000]">
                  {matchedOrder.items.map((i) => i.name).join(', ')}
                </span>
              </div>
            </div>
          </div>
        )}

        {notFound && (
          <div className="p-4 rounded-xl bg-[#ffdad6] text-[#93000a] text-sm font-medium">
            {locale === 'fr'
              ? `Aucun certificat trouvé pour « ${serialQuery} ».`
              : `No warranty certificate matched "${serialQuery}".`}
          </div>
        )}
      </section>

      {/* Policy & Hubs */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-[#000000] text-white rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#F4BE38]">
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold">
              {locale === 'fr' ? 'Retours sous 7 jours' : '7-Day Returns'}
            </h2>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            {locale === 'fr'
              ? 'Produit non conforme ou défaut au déballage ? Lorena Market échange ou rembourse via MTN MoMo / Orange Money sous 7 jours.'
              : 'Product mismatch or defect on arrival? Lorena Market replaces or refunds via Mobile Money within 7 days.'}
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SERVICE_HUBS.map((hub) => (
            <div
              key={hub.city}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A5AA1]">
                  <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Point Relais</span>
                </div>
                <h3 className="font-display text-base font-bold text-[#000000]">
                  {hub.city}
                </h3>
                <p className="text-xs text-[#6C757D]">{hub.address}</p>
              </div>
              <div className="pt-3 border-t border-[#E5E7EB] space-y-1 text-xs">
                <p className="text-[#4B5563] font-medium">{hub.hours}</p>
                <p className="inline-flex items-center gap-1 font-mono text-[#000000]">
                  <Phone className="w-3.5 h-3.5 text-[#5A5AA1]" aria-hidden="true" />
                  <span>{hub.phone}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
