import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  MapPin,
  ShieldCheck,
  Smartphone,
  Truck,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { FREE_DELIVERY_THRESHOLD, LOGISTICS_REGIONS } from '../data/catalog';
import { TRANSLATIONS } from '../i18n/translations';
import { CartItem, Locale, OrderRecord, PaymentMethod } from '../types/store';
import { formatXAF } from '../utils/format';
import { ProductImage } from './ProductImage';

interface CheckoutScreenProps {
  locale: Locale;
  items: CartItem[];
  onBackToCatalog: () => void;
  onCompleteOrder: (order: OrderRecord) => void;
}

export function CheckoutScreen({
  locale,
  items,
  onBackToCatalog,
  onCompleteOrder,
}: CheckoutScreenProps) {
  const t = TRANSLATIONS[locale];
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+237 6');
  const [regionName, setRegionName] = useState(LOGISTICS_REGIONS[0].name);
  const [cityName, setCityName] = useState(LOGISTICS_REGIONS[0].cities[0].name);
  const [quarterName, setQuarterName] = useState(
    LOGISTICS_REGIONS[0].cities[0].quarters[0].name
  );
  const [landmark, setLandmark] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  const [sameAsContact, setSameAsContact] = useState(true);
  const [momoNumber, setMomoNumber] = useState('+237 6');
  const [formError, setFormError] = useState<string | null>(null);

  const [awaitingUssd, setAwaitingUssd] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const selectedRegion = useMemo(
    () =>
      LOGISTICS_REGIONS.find((r) => r.name === regionName) ?? LOGISTICS_REGIONS[0],
    [regionName]
  );

  const selectedCity = useMemo(
    () =>
      selectedRegion.cities.find((c) => c.name === cityName) ??
      selectedRegion.cities[0],
    [selectedRegion, cityName]
  );

  const selectedQuarter = useMemo(
    () =>
      selectedCity.quarters.find((q) => q.name === quarterName) ??
      selectedCity.quarters[0],
    [selectedCity, quarterName]
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const qualifiesForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee =
    items.length === 0 ? 0 : qualifiesForFreeDelivery ? 0 : selectedQuarter.fee;
  const total = subtotal + deliveryFee;

  const handleRegionChange = (newRegionName: string) => {
    setRegionName(newRegionName);
    const reg =
      LOGISTICS_REGIONS.find((r) => r.name === newRegionName) ??
      LOGISTICS_REGIONS[0];
    const firstCity = reg.cities[0];
    setCityName(firstCity.name);
    setQuarterName(firstCity.quarters[0].name);
  };

  const handleCityChange = (newCityName: string) => {
    setCityName(newCityName);
    const city =
      selectedRegion.cities.find((c) => c.name === newCityName) ??
      selectedRegion.cities[0];
    setQuarterName(city.quarters[0].name);
  };

  const buildOrderRecord = (verified: boolean): OrderRecord => {
    const orderNum = Math.floor(1000 + Math.random() * 8999);
    const activePaymentPhone = sameAsContact ? phone.trim() : momoNumber.trim();
    const refPrefix =
      paymentMethod === 'mtn_momo'
        ? 'MOMO'
        : paymentMethod === 'orange_money'
        ? 'OM'
        : 'COD';

    return {
      id: `LR-${orderNum}`,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        region: selectedRegion.name,
        city: selectedCity.name,
        quarter: selectedQuarter.name,
        landmark:
          landmark.trim() ||
          (locale === 'fr' ? 'Livraison quartier standard' : 'Standard quarter handoff'),
      },
      paymentMethod,
      paymentPhone: paymentMethod === 'cod' ? undefined : activePaymentPhone,
      paymentReference: `${refPrefix}-237-${Math.floor(100000 + Math.random() * 899999)}`,
      paymentVerified: verified,
      items: [...items],
      subtotal,
      deliveryFee,
      total,
      deliveryEta:
        locale === 'fr' ? selectedQuarter.etaFr : selectedQuarter.etaEn,
      warrantySerial: `LR-WRN-26-${orderNum}X`,
      stageIndex: 0,
    };
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (fullName.trim().length < 2) {
      setFormError(
        locale === 'fr'
          ? 'Veuillez saisir votre nom complet pour la livraison.'
          : 'Please enter your full name.'
      );
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 9) {
      setFormError(
        locale === 'fr'
          ? 'Veuillez saisir un numéro camerounais valide (+237).'
          : 'Please enter a valid 9-digit mobile phone number.'
      );
      return;
    }

    if (paymentMethod !== 'cod') {
      const walletDigits = (sameAsContact ? phone : momoNumber).replace(
        /\D/g,
        ''
      );
      if (walletDigits.length < 9) {
        setFormError(
          locale === 'fr'
            ? 'Veuillez saisir un numéro Mobile Money valide.'
            : 'Please enter a valid Mobile Money wallet number.'
        );
        return;
      }
      setAwaitingUssd(true);
      return;
    }

    onCompleteOrder(buildOrderRecord(false));
  };

  const handleConfirmMobileMoneyPush = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      const order = buildOrderRecord(true);
      setIsAuthorizing(false);
      setAwaitingUssd(false);
      onCompleteOrder(order);
    }, 650);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[760px] mx-auto px-4 py-16">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 md:p-10 text-center">
          <h1 className="font-display text-2xl font-bold text-[#000000]">
            {t.emptyBagTitle}
          </h1>
          <p className="mt-2 text-sm text-[#6C757D] max-w-md mx-auto">
            {t.emptyBagDesc}
          </p>
          <button
            type="button"
            onClick={onBackToCatalog}
            className="mt-6 min-h-[48px] px-6 py-3 bg-[#5A5AA1] hover:bg-[#474789] text-white text-sm font-semibold rounded-lg cursor-pointer"
          >
            {t.backToHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 pb-20">
      <div className="mb-6">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5AA1] hover:underline mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.backToHome}</span>
        </button>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
          {locale === 'fr'
            ? 'Finaliser la commande — Lorena Market'
            : 'Checkout — Lorena Market'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        <div className="lg:col-span-7 space-y-6">
          {/* Address Section */}
          <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#5A5AA1]" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-[#000000]">
                  {locale === 'fr'
                    ? '1. Adresse de livraison (Cameroun)'
                    : '1. Delivery Address (Cameroon)'}
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#F4BE38] text-[#000000] text-[11px] font-bold">
                +237
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-bold uppercase tracking-wide text-[#000000] mb-1.5"
                >
                  {locale === 'fr' ? 'Nom complet' : 'Full Name'}
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean-Paul Kamga"
                  className="min-h-[44px] w-full px-3.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#000000] focus:outline-none focus:border-[#5A5AA1]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-bold uppercase tracking-wide text-[#000000] mb-1.5"
                >
                  {locale === 'fr' ? 'Téléphone mobile' : 'Mobile Phone'}
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                  className="min-h-[44px] w-full px-3.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#000000] tabular-nums focus:outline-none focus:border-[#5A5AA1]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="checkout-region"
                  className="block text-xs font-bold uppercase tracking-wide text-[#000000] mb-1.5"
                >
                  {locale === 'fr' ? 'Région' : 'Region'}
                </label>
                <select
                  id="checkout-region"
                  value={selectedRegion.name}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="min-h-[44px] w-full px-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#000000] cursor-pointer"
                >
                  {LOGISTICS_REGIONS.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="checkout-city"
                  className="block text-xs font-bold uppercase tracking-wide text-[#000000] mb-1.5"
                >
                  {locale === 'fr' ? 'Ville' : 'City'}
                </label>
                <select
                  id="checkout-city"
                  value={selectedCity.name}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="min-h-[44px] w-full px-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#000000] cursor-pointer"
                >
                  {selectedRegion.cities.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="checkout-quarter"
                  className="block text-xs font-bold uppercase tracking-wide text-[#000000] mb-1.5"
                >
                  {locale === 'fr' ? 'Quartier' : 'Quarter'}
                </label>
                <select
                  id="checkout-quarter"
                  value={selectedQuarter.name}
                  onChange={(e) => setQuarterName(e.target.value)}
                  className="min-h-[44px] w-full px-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#000000] cursor-pointer"
                >
                  {selectedCity.quarters.map((q) => (
                    <option key={q.name} value={q.name}>
                      {q.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="checkout-landmark"
                className="block text-xs font-bold uppercase tracking-wide text-[#000000] mb-1.5"
              >
                {locale === 'fr'
                  ? 'Repère / Indications livreur'
                  : 'Landmark / Courier Instructions'}
              </label>
              <input
                id="checkout-landmark"
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={
                  locale === 'fr'
                    ? 'Ex : Derrière la station Total, portail noir'
                    : 'e.g. Behind Total Energies station, black gate'
                }
                className="min-h-[44px] w-full px-3.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#000000] focus:outline-none focus:border-[#5A5AA1]"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-[#000000]">
                <Truck className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                <span>
                  {selectedCity.name} — {selectedQuarter.name} :{' '}
                  <strong>
                    {locale === 'fr'
                      ? selectedQuarter.etaFr
                      : selectedQuarter.etaEn}
                  </strong>
                </span>
              </div>
              <span className="text-sm font-bold tabular-nums text-[#5A5AA1] shrink-0">
                {qualifiesForFreeDelivery
                  ? locale === 'fr'
                    ? 'GRATUIT'
                    : 'FREE'
                  : formatXAF(selectedQuarter.fee)}
              </span>
            </div>
          </section>

          {/* Payment Method Section */}
          <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#5A5AA1]" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-[#000000]">
                  {locale === 'fr' ? '2. Mode de paiement' : '2. Payment Method'}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#5A5AA1]">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{locale === 'fr' ? 'Sécurisé' : 'Secure'}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('mtn_momo')}
                className={`min-h-[76px] p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'mtn_momo'
                    ? 'border-[#5A5AA1] bg-[#5A5AA1]/5 ring-1 ring-[#5A5AA1]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#A084E8]'
                }`}
              >
                <span className="px-2 py-0.5 rounded bg-[#F4BE38] text-[#000000] font-display text-xs font-bold w-fit">
                  MTN MoMo
                </span>
                <span className="mt-2 text-xs text-[#6C757D]">
                  Push USSD *126#
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('orange_money')}
                className={`min-h-[76px] p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'orange_money'
                    ? 'border-[#5A5AA1] bg-[#5A5AA1]/5 ring-1 ring-[#5A5AA1]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#A084E8]'
                }`}
              >
                <span className="px-2 py-0.5 rounded bg-[#FF6600] text-white font-display text-xs font-bold w-fit">
                  Orange Money
                </span>
                <span className="mt-2 text-xs text-[#6C757D]">
                  Push USSD #150#
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`min-h-[76px] p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-[#5A5AA1] bg-[#5A5AA1]/5 ring-1 ring-[#5A5AA1]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#A084E8]'
                }`}
              >
                <span className="px-2 py-0.5 rounded bg-[#000000] text-white font-display text-xs font-bold w-fit">
                  {t.codLabel}
                </span>
                <span className="mt-2 text-xs text-[#6C757D]">
                  {locale === 'fr' ? 'Espèces à la remise' : 'Pay at handoff'}
                </span>
              </button>
            </div>

            {paymentMethod !== 'cod' && (
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-3">
                <label className="flex items-center gap-2.5 text-sm text-[#000000] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsContact}
                    onChange={(e) => setSameAsContact(e.target.checked)}
                    className="w-4 h-4 accent-[#5A5AA1]"
                  />
                  <span>
                    {locale === 'fr'
                      ? `Utiliser le numéro de contact (${phone || '+237 6...'})`
                      : `Use contact number (${phone || '+237 6...'})`}
                  </span>
                </label>

                {!sameAsContact && (
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                    aria-label="Numéro Mobile Money"
                    className="min-h-[44px] w-full px-3.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#000000] tabular-nums"
                  />
                )}
              </div>
            )}

            {formError && (
              <div className="p-3 rounded-lg bg-[#ffdad6] text-[#93000a] text-sm font-medium">
                {formError}
              </div>
            )}

            {awaitingUssd ? (
              <div className="p-5 rounded-xl border-2 border-[#5A5AA1] bg-[#F8F9FA] space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-[#F4BE38] text-[#000000] text-[11px] font-bold uppercase">
                      {locale === 'fr'
                        ? 'Validation sur téléphone requise'
                        : 'Phone Authorization Required'}
                    </span>
                    <h3 className="font-display text-base font-bold text-[#000000] mt-2">
                      {paymentMethod === 'mtn_momo' ? 'MTN MoMo' : 'Orange Money'} —{' '}
                      {sameAsContact ? phone : momoNumber}
                    </h3>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#000000] text-[#F4BE38]">
                    {paymentMethod === 'mtn_momo' ? '*126#' : '#150#'}
                  </span>
                </div>

                <p className="text-sm text-[#4B5563]">
                  {locale === 'fr'
                    ? `Validez le débit de ${formatXAF(total)} pour Lorena Market SARL sur votre téléphone puis confirmez ci-dessous.`
                    : `Approve the ${formatXAF(total)} prompt for Lorena Market SARL on your phone, then confirm below.`}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={isAuthorizing}
                    onClick={handleConfirmMobileMoneyPush}
                    className="min-h-[48px] px-5 py-3 bg-[#5A5AA1] hover:bg-[#474789] text-white text-sm font-bold rounded-lg inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {isAuthorizing
                        ? locale === 'fr'
                          ? 'Vérification...'
                          : 'Verifying...'
                        : locale === 'fr'
                        ? 'Confirmer le paiement'
                        : 'Confirm Payment'}
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={isAuthorizing}
                    onClick={() => setAwaitingUssd(false)}
                    className="min-h-[48px] px-4 py-3 border border-[#E5E7EB] bg-white text-[#000000] text-sm font-semibold rounded-lg cursor-pointer"
                  >
                    {locale === 'fr' ? 'Annuler' : 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full min-h-[52px] px-6 py-3.5 bg-[#5A5AA1] hover:bg-[#474789] text-white font-display font-bold text-base rounded-xl transition-colors cursor-pointer"
              >
                {paymentMethod === 'cod'
                  ? `${locale === 'fr' ? 'Commander (Paiement livraison)' : 'Place COD Order'} · ${formatXAF(total)}`
                  : `${locale === 'fr' ? 'Payer' : 'Pay'} ${formatXAF(total)} · ${
                      paymentMethod === 'mtn_momo' ? 'MTN MoMo' : 'Orange Money'
                    }`}
              </button>
            )}
          </section>
        </div>

        {/* Sticky Order Summary */}
        <aside className="lg:col-span-5 lg:sticky lg:top-28 bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-5">
          <h2 className="font-display text-lg font-bold text-[#000000] pb-3 border-b border-[#E5E7EB]">
            {locale === 'fr' ? 'Récapitulatif' : 'Order Summary'} (
            {items.reduce((s, i) => s + i.quantity, 0)})
          </h2>

          <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
            {items.map((item) => (
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
                <span className="text-sm font-bold text-[#000000] tabular-nums shrink-0">
                  {formatXAF(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E5E7EB] space-y-2.5 text-sm">
            <div className="flex justify-between text-[#4B5563]">
              <span>{t.subtotal}</span>
              <span className="tabular-nums font-medium">{formatXAF(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#4B5563]">
              <span>
                {locale === 'fr' ? 'Livraison' : 'Delivery'} ({selectedCity.name} ·{' '}
                {selectedQuarter.name})
              </span>
              <span className="tabular-nums font-bold text-[#5A5AA1]">
                {qualifiesForFreeDelivery
                  ? locale === 'fr'
                    ? 'GRATUIT'
                    : 'FREE'
                  : formatXAF(deliveryFee)}
              </span>
            </div>
            <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-baseline">
              <span className="font-display text-base font-bold text-[#000000]">
                {locale === 'fr' ? 'Total à payer' : 'Total Due'}
              </span>
              <span className="font-display text-xl font-extrabold text-[#000000] tabular-nums">
                {formatXAF(total)}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#000000] text-white flex items-start gap-2.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#F4BE38] shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              {locale === 'fr'
                ? 'Garantie certifiée Lorena Market & retours gratuits sous 7 jours.'
                : 'Covered by Lorena Market Certified Warranty & 7-day returns.'}
            </span>
          </div>
        </aside>
      </form>
    </div>
  );
}
