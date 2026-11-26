import { BellRing, CheckCircle2, Mail, Sparkles, Trash2, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Locale, Product, WaitlistEntry } from '../types/store';
import { formatXAF } from '../utils/format';
import { ActionIconTooltip } from './ActionIconTooltip';
import { ProductImage } from './ProductImage';

interface RestockWaitlistModalProps {
  product: Product | null;
  locale: Locale;
  defaultEmail?: string;
  existingEntry?: WaitlistEntry;
  onClose: () => void;
  onJoinWaitlist: (product: Product, email: string) => void;
  onLeaveWaitlist: (productId: string) => void;
  onSimulateRestockAlert: (product: Product, email: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RestockWaitlistModal({
  product,
  locale,
  defaultEmail = '',
  existingEntry,
  onClose,
  onJoinWaitlist,
  onLeaveWaitlist,
  onSimulateRestockAlert,
}: RestockWaitlistModalProps) {
  const [email, setEmail] = useState(existingEntry?.email || defaultEmail);
  const [error, setError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    setEmail(existingEntry?.email || defaultEmail);
    setError(null);
    setJustSubmitted(false);
  }, [product?.id, existingEntry?.email, defaultEmail]);

  if (!product) return null;

  const title = locale === 'fr' ? product.nameFr : product.nameEn;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleaned)) {
      setError(
        locale === 'fr'
          ? 'Veuillez saisir une adresse e-mail valide pour recevoir l’alerte.'
          : 'Please enter a valid email address to receive the restock alert.'
      );
      return;
    }
    setError(null);
    onJoinWaitlist(product, cleaned);
    setJustSubmitted(true);
  };

  return (
    <div
      className="no-print fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={
        locale === 'fr'
          ? 'Alerte de réapprovisionnement'
          : 'Restock Waitlist Notification'
      }
    >
      <div
        className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="ice-surface relative w-full max-w-[450px] rounded-[32px] p-6 sm:p-7 space-y-5">
        <div className="absolute top-4 right-4 z-10">
          <ActionIconTooltip
            text={
              locale === 'fr'
                ? 'Fermer la fenêtre d’alerte stock'
                : 'Close restock alert modal'
            }
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={locale === 'fr' ? 'Fermer' : 'Close'}
              className="glass-pill-frost w-9 h-9 rounded-full text-[#000000] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </ActionIconTooltip>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 pr-8">
          <ActionIconTooltip
            focusable
            text={
              locale === 'fr'
                ? 'Notification automatique dès que cet article revient en stock'
                : 'Automatic notification once this product returns to stock'
            }
          >
            <span className="glass-pill-gold w-11 h-11 rounded-2xl text-[#000000] flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5" aria-hidden="true" />
            </span>
          </ActionIconTooltip>
          <div>
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#5A5AA1]">
              {locale === 'fr' ? 'Liste d’attente locale' : 'Local Restock Waitlist'}
            </span>
            <h2 className="font-display text-xl font-extrabold text-[#000000] leading-tight">
              {locale === 'fr'
                ? 'Me prévenir dès le retour'
                : 'Notify Me When Restocked'}
            </h2>
          </div>
        </div>

        {/* Product Preview */}
        <div className="ice-surface-subtle rounded-2xl p-3.5 flex items-center gap-3.5">
          <ActionIconTooltip
            focusable
            text={
              locale === 'fr'
                ? 'Article actuellement en rupture de stock'
                : 'Product currently out of stock'
            }
          >
            <div className="ice-product-trap w-16 h-16 rounded-2xl p-1.5 shrink-0 flex items-center justify-center">
              <ProductImage
                src={product.image}
                alt={title}
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </ActionIconTooltip>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase text-[#5A5AA1]">
              {product.brand} · {product.sku}
            </p>
            <p className="text-sm font-bold text-[#000000] line-clamp-2 leading-snug">
              {title}
            </p>
            <p className="mt-0.5 font-display text-sm font-extrabold text-[#000000] tabular-nums">
              {formatXAF(product.price)}
            </p>
          </div>
        </div>

        {/* Waitlist Active Confirmation or Email Form */}
        {existingEntry ? (
          <div className="space-y-4">
            <div className="ice-obsidian rounded-2xl p-4 text-white space-y-2">
              <div className="flex items-center gap-2 text-[#F4BE38] text-xs font-extrabold uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  {justSubmitted
                    ? locale === 'fr'
                      ? 'Inscription confirmée sur la liste d’attente !'
                      : 'You are on the local waitlist!'
                    : locale === 'fr'
                    ? 'Déjà inscrit sur la liste d’attente'
                    : 'Already subscribed to waitlist'}
                </span>
              </div>
              <p className="text-xs text-white/85 leading-relaxed">
                {locale === 'fr'
                  ? `Une alerte de réapprovisionnement sera envoyée à ${existingEntry.email} dès l’arrivée d’un nouveau lot.`
                  : `A restock alert will be sent to ${existingEntry.email} as soon as new stock arrives.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <ActionIconTooltip
                className="w-full"
                text={
                  locale === 'fr'
                    ? 'Tester immédiatement la réception de l’alerte de réapprovisionnement'
                    : 'Trigger a simulated restock notification alert right now'
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    onSimulateRestockAlert(product, existingEntry.email);
                    onClose();
                  }}
                  className="glass-pill-gold w-full min-h-[42px] px-4 py-2 rounded-full text-[#000000] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {locale === 'fr'
                      ? 'Simuler l’alerte de réapprovisionnement'
                      : 'Simulate Restock Alert'}
                  </span>
                </button>
              </ActionIconTooltip>

              <ActionIconTooltip
                text={
                  locale === 'fr'
                    ? 'Se désinscrire de cette liste d’attente'
                    : 'Remove yourself from this waitlist'
                }
              >
                <button
                  type="button"
                  onClick={() => onLeaveWaitlist(product.id)}
                  className="glass-pill-frost min-h-[42px] px-4 py-2 rounded-full text-[#ba1a1a] text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{locale === 'fr' ? 'Retirer' : 'Remove'}</span>
                </button>
              </ActionIconTooltip>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <p className="text-xs text-[#3F3F56] leading-relaxed">
              {locale === 'fr'
                ? 'Laissez votre e-mail ci-dessous pour rejoindre la liste d’attente prioritaire. Une notification simulée vous préviendra dès la remise en stock.'
                : 'Enter your email below to join our priority waitlist. A simulated notification will alert you when this item is restocked.'}
            </p>

            <div className="space-y-1.5">
              <label
                htmlFor="waitlist-email-input"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#3F3F56] pl-2"
              >
                {locale === 'fr' ? 'Votre adresse e-mail' : 'Your email address'}
              </label>
              <div className="glass-input-recessed rounded-full flex items-center px-4">
                <ActionIconTooltip
                  focusable
                  text={
                    locale === 'fr'
                      ? 'Adresse e-mail utilisée pour l’alerte de retour en stock'
                      : 'Email address used for the restock alert'
                  }
                >
                  <Mail className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                </ActionIconTooltip>
                <input
                  id="waitlist-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="nom@exemple.cm"
                  className="min-h-[46px] flex-1 px-3 bg-transparent text-sm text-[#000000] placeholder:text-[#3F3F56]/70 focus:outline-none min-w-0"
                />
              </div>
              {error && (
                <p className="text-xs font-semibold text-[#ba1a1a] pl-2">
                  {error}
                </p>
              )}
            </div>

            <ActionIconTooltip
              className="w-full"
              text={
                locale === 'fr'
                  ? 'Enregistrer votre e-mail sur la liste d’attente'
                  : 'Save your email to the restock waitlist'
              }
            >
              <button
                type="submit"
                className="glass-pill-cta w-full min-h-[46px] px-5 py-2.5 rounded-full text-white font-display text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <BellRing className="w-4 h-4 text-[#F4BE38]" aria-hidden="true" />
                <span>
                  {locale === 'fr'
                    ? 'M’alerter par e-mail'
                    : 'Notify Me by Email'}
                </span>
              </button>
            </ActionIconTooltip>
          </form>
        )}
      </div>
    </div>
  );
}
