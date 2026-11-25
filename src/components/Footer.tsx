import { ArrowUp, Check, Mail, MessageCircle } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import { AppScreen, Locale } from '../types/store';
import { ActionIconTooltip } from './ActionIconTooltip';

interface FooterProps {
  locale: Locale;
  onNavigate: (screen: AppScreen) => void;
}

const NEWSLETTER_EMAILS_KEY = 'lorena_newsletter_emails_v1';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Footer({ locale, onNavigate }: FooterProps) {
  const t = TRANSLATIONS[locale];
  const [emailInput, setEmailInput] = useState('');
  const [emailStatus, setEmailStatus] = useState<
    'idle' | 'duplicate' | 'success' | 'error'
  >('idle');
  const [lastSubscribedEmail, setLastSubscribedEmail] = useState<string | null>(
    null
  );
  const [subscribedEmails, setSubscribedEmails] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(NEWSLETTER_EMAILS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return [];
  });

  const [phoneInput, setPhoneInput] = useState('');
  const [accepted, setAccepted] = useState(true);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleEmailSubscribe = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = emailInput.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleaned) || !accepted) {
      setEmailStatus('error');
      return;
    }

    if (subscribedEmails.includes(cleaned)) {
      setLastSubscribedEmail(cleaned);
      setEmailStatus('duplicate');
      return;
    }

    const updated = [cleaned, ...subscribedEmails];
    setSubscribedEmails(updated);
    try {
      localStorage.setItem(NEWSLETTER_EMAILS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
    setLastSubscribedEmail(cleaned);
    setEmailStatus('success');
    setEmailInput('');
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    const digits = phoneInput.replace(/\D/g, '');
    if (digits.length < 9 || !accepted) {
      setStatus('error');
      return;
    }
    try {
      localStorage.setItem('lorena_newsletter_phone', `+237${digits}`);
    } catch {
      // Ignore storage error
    }
    setStatus('success');
    setPhoneInput('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print max-w-[1360px] mx-auto px-4 pb-6 mt-12">
      <div className="ice-obsidian rounded-[32px] text-white">
        {/* Top Email Newsletter & WhatsApp / SMS Alerts Block */}
        <div className="px-6 sm:px-8 pt-10 pb-8 border-b border-white/15 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {t.newsletterTitle}
          </h2>
          <p className="mt-2 text-sm text-white/80">{t.newsletterSubtitle}</p>

          <div className="mt-6 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* Email Newsletter Form */}
            <form onSubmit={handleEmailSubscribe} noValidate className="text-left">
              <label
                htmlFor="footer-newsletter-email"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#F4BE38] mb-1.5 pl-2"
              >
                {locale === 'fr' ? 'Newsletter par e-mail' : 'Email Newsletter'}
              </label>
              <div className="glass-input-recessed flex items-center rounded-full p-1.5">
                <ActionIconTooltip
                  focusable
                  placement="top"
                  text={
                    locale === 'fr'
                      ? 'Saisissez votre e-mail pour recevoir les promos Lorena'
                      : 'Enter your email to receive Lorena promo alerts'
                  }
                >
                  <div className="flex items-center pl-3.5 pr-2 text-[#5A5AA1] shrink-0">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                  </div>
                </ActionIconTooltip>

                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setEmailStatus('idle');
                  }}
                  placeholder={
                    locale === 'fr'
                      ? 'votre.email@exemple.cm'
                      : 'your.email@example.com'
                  }
                  aria-label={
                    locale === 'fr'
                      ? 'Adresse e-mail pour la newsletter'
                      : 'Email address for newsletter'
                  }
                  className="flex-1 bg-transparent px-2.5 py-2 text-sm text-[#000000] placeholder:text-[#3F3F56]/70 focus:outline-none min-w-0"
                />

                <button
                  type="submit"
                  className="glass-pill-cta min-h-[40px] px-5 py-2 rounded-full text-white text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.subscribeBtn}
                </button>
              </div>

              {emailStatus === 'success' && lastSubscribedEmail && (
                <p
                  role="status"
                  className="mt-2 px-2 text-xs font-medium text-[#F4BE38] inline-flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    {locale === 'fr'
                      ? `Inscription confirmée pour ${lastSubscribedEmail} ! Promos envoyées prochainement.`
                      : `Subscribed ${lastSubscribedEmail}! Promotional updates are on the way.`}
                  </span>
                </p>
              )}
              {emailStatus === 'duplicate' && lastSubscribedEmail && (
                <p
                  role="status"
                  className="mt-2 px-2 text-xs font-medium text-[#A084E8] inline-flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    {locale === 'fr'
                      ? `${lastSubscribedEmail} est déjà inscrit aux offres Lorena Market.`
                      : `${lastSubscribedEmail} is already subscribed to Lorena Market updates.`}
                  </span>
                </p>
              )}
              {emailStatus === 'error' && (
                <p className="mt-2 px-2 text-xs font-medium text-[#F4BE38]">
                  {locale === 'fr'
                    ? 'Veuillez saisir une adresse e-mail valide et accepter les conditions.'
                    : 'Please enter a valid email address and accept the terms.'}
                </p>
              )}
            </form>

            {/* WhatsApp / SMS Phone Alert Form */}
            <form onSubmit={handleSubscribe} noValidate className="text-left">
              <label
                htmlFor="footer-newsletter-phone"
                className="block text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1.5 pl-2"
              >
                {locale === 'fr' ? 'Alertes WhatsApp / SMS' : 'WhatsApp / SMS Alerts'}
              </label>
              <div className="glass-input-recessed flex items-center rounded-full p-1.5">
                <div className="flex items-center gap-2 pl-4 pr-3 border-r border-[#5A5AA1]/20 shrink-0">
                  <span
                    aria-hidden="true"
                    className="w-5 h-3.5 rounded-xs overflow-hidden inline-flex"
                  >
                    <span className="w-1/3 bg-[#007A5E]" />
                    <span className="w-1/3 bg-[#CE1126]" />
                    <span className="w-1/3 bg-[#FCD116]" />
                  </span>
                  <span className="text-sm font-semibold text-[#000000] tabular-nums">
                    +237
                  </span>
                </div>

                <input
                  id="footer-newsletter-phone"
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value);
                    setStatus('idle');
                  }}
                  placeholder="670123123"
                  aria-label="Numéro WhatsApp ou SMS"
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-[#000000] placeholder:text-[#3F3F56]/70 focus:outline-none min-w-0 tabular-nums"
                />

                <button
                  type="submit"
                  className="glass-pill-gold min-h-[40px] px-5 py-2 rounded-full text-[#000000] text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.subscribeBtn}
                </button>
              </div>

              {status === 'success' && (
                <p className="mt-2 px-2 text-xs font-medium text-[#F4BE38] inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{t.newsletterSuccess}</span>
                </p>
              )}
              {status === 'error' && (
                <p className="mt-2 px-2 text-xs font-medium text-[#F4BE38]">
                  {t.newsletterError}
                </p>
              )}
            </form>
          </div>

          <label className="mt-4 inline-flex items-center justify-center gap-2 text-xs text-white/80 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked);
                setStatus('idle');
                setEmailStatus('idle');
              }}
              className="w-4 h-4 accent-[#F4BE38] rounded"
            />
            <span>{t.newsletterConsent}</span>
          </label>
        </div>

        {/* 5-Column Links Grid */}
        <div className="px-6 sm:px-8 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-sm">
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#F4BE38] mb-4">
              {t.footerCustomerService}
            </h3>
            <ul className="space-y-2.5 text-white/80 text-xs">
              <li>
                <button type="button" onClick={() => onNavigate('help')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Comment commander ?' : 'How to order?'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('tracking')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Suivi de commande' : 'Order tracking'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('help')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Politique de retour' : 'Return policy'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('checkout')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Frais de livraison' : 'Delivery fees'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('help')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? "Centre d'aide" : 'Help center'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#F4BE38] mb-4">
              {t.footerNeedHelp}
            </h3>
            <ul className="space-y-2.5 text-white/80 text-xs">
              <li>
                <button type="button" onClick={() => onNavigate('checkout')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Paiements & remboursements' : 'Payments & refunds'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('help')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Retours & garantie' : 'Returns & warranty'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('help')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Politique de confidentialité' : 'Privacy policy'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('help')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Conditions générales de vente' : 'Terms of sale'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('help')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Nous contacter' : 'Contact us'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#F4BE38] mb-4">
              {t.footerMyAccount}
            </h3>
            <ul className="space-y-2.5 text-white/80 text-xs">
              <li>
                <button type="button" onClick={() => onNavigate('account')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Se connecter' : 'Sign in'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('account')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Créer un compte' : 'Create account'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('tracking')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Mes commandes' : 'My orders'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('wishlist')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Mes favoris' : 'My wishlist'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('account')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Mon compte' : 'My account'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#F4BE38] mb-4">
              {t.footerOurShop}
            </h3>
            <ul className="space-y-2.5 text-white/80 text-xs">
              <li>
                <button type="button" onClick={() => onNavigate('home')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Boutique' : 'Storefront'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('category')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Meilleures offres' : 'Best deals'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('cart')} className="hover:text-[#F4BE38] cursor-pointer">
                  {locale === 'fr' ? 'Mon panier' : 'My cart'}
                </button>
              </li>
            </ul>
          </div>

          {/* Socials & Direct Contact */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#F4BE38]">
              {t.footerFollowUs}
            </h3>
            <div className="flex items-center gap-2">
              {[
                { code: 'f', label: 'Facebook' },
                { code: 'ig', label: 'Instagram' },
                { code: 'x', label: 'X / Twitter' },
                { code: 'yt', label: 'YouTube' },
                { code: 'tk', label: 'TikTok' },
              ].map((social) => (
                <ActionIconTooltip
                  key={social.code}
                  placement="top"
                  text={
                    locale === 'fr'
                      ? `Suivre Lorena Market sur ${social.label}`
                      : `Follow Lorena Market on ${social.label}`
                  }
                >
                  <button
                    type="button"
                    aria-label={social.label}
                    onClick={() => onNavigate('help')}
                    className="glass-pill-frost w-8 h-8 rounded-full text-[#000000] text-xs font-extrabold uppercase flex items-center justify-center cursor-pointer"
                  >
                    {social.code}
                  </button>
                </ActionIconTooltip>
              ))}
            </div>

            <div className="pt-2 border-t border-white/15 space-y-1">
              <p className="font-display text-lg font-bold text-white tabular-nums">
                693 71 25 25
              </p>
              <p className="text-xs text-white/80">bonjour@lorenamarket.cm</p>
              <p className="text-xs text-white/60">Lun — Sam · 8h — 18h</p>
            </div>

            <ActionIconTooltip
              placement="top"
              text={
                locale === 'fr'
                  ? 'Contacter le support client ou poser une question'
                  : 'Contact customer support or open help center'
              }
            >
              <button
                type="button"
                onClick={() => onNavigate('help')}
                className="glass-pill-cta min-h-[38px] px-4 py-2 rounded-full text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>{t.writeWhatsapp}</span>
              </button>
            </ActionIconTooltip>
          </div>
        </div>

        {/* Bottom Payment Methods & Copyright */}
        <div className="border-t border-white/15 bg-black/25">
          <div className="px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="glass-pill-frost px-3 py-1 rounded-full inline-flex items-center">
                <img
                  src="/assets/aistudio/lorena-logo-noir-transparent_36764768.png"
                  alt="Lorena Market"
                  className="h-5 w-auto object-contain"
                />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
                {t.paymentMethodsLabel}
              </span>
              <span className="glass-pill-gold px-3 py-1 rounded-full text-[#000000] text-xs font-extrabold">
                MTN Mobile Money
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FF6600] border border-white/50 text-white text-xs font-bold shadow">
                Orange Money
              </span>
              <span className="glass-pill-blue px-3 py-1 rounded-full text-white text-xs font-bold">
                {t.codLabel}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-white/70">{t.copyright}</span>
              <ActionIconTooltip
                placement="left"
                text={
                  locale === 'fr'
                    ? 'Remonter en haut de la page'
                    : 'Scroll back to top of page'
                }
              >
                <button
                  type="button"
                  aria-label="Haut de page"
                  onClick={scrollToTop}
                  className="glass-pill-cta w-10 h-10 rounded-full text-white flex items-center justify-center cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" aria-hidden="true" />
                </button>
              </ActionIconTooltip>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
