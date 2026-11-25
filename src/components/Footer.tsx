import { ArrowUp, Check, MessageCircle } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import { AppScreen, Locale } from '../types/store';

interface FooterProps {
  locale: Locale;
  onNavigate: (screen: AppScreen) => void;
}

export function Footer({ locale, onNavigate }: FooterProps) {
  const t = TRANSLATIONS[locale];
  const [phoneInput, setPhoneInput] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
    <footer className="bg-[#000000] text-white mt-12">
      {/* Top WhatsApp / SMS Newsletter Block */}
      <div className="max-w-[1360px] mx-auto px-4 pt-12 pb-10 border-b border-white/10 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
          {t.newsletterTitle}
        </h2>
        <p className="mt-2 text-sm text-white/75">{t.newsletterSubtitle}</p>

        <form onSubmit={handleSubscribe} className="mt-6 max-w-2xl mx-auto">
          <div className="flex items-center bg-white rounded-full p-1.5 shadow-lg">
            <div className="flex items-center gap-2 pl-4 pr-3 border-r border-[#E5E7EB] shrink-0">
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
              type="tel"
              value={phoneInput}
              onChange={(e) => {
                setPhoneInput(e.target.value);
                setStatus('idle');
              }}
              placeholder="670123123"
              aria-label="Numéro WhatsApp ou SMS"
              className="flex-1 px-4 py-2 text-sm text-[#000000] placeholder:text-[#9CA3AF] focus:outline-none min-w-0 tabular-nums"
            />

            <button
              type="submit"
              className="min-h-[40px] px-6 py-2 rounded-full bg-[#5A5AA1] hover:bg-[#474789] text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              {t.subscribeBtn}
            </button>
          </div>

          <label className="mt-3 inline-flex items-center justify-center gap-2 text-xs text-white/75 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked);
                setStatus('idle');
              }}
              className="w-4 h-4 accent-[#5A5AA1] rounded"
            />
            <span>{t.newsletterConsent}</span>
          </label>

          {status === 'success' && (
            <p className="mt-2 text-xs font-medium text-[#F4BE38] inline-flex items-center gap-1.5">
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>{t.newsletterSuccess}</span>
            </p>
          )}
          {status === 'error' && (
            <p className="mt-2 text-xs font-medium text-[#F4BE38]">
              {t.newsletterError}
            </p>
          )}
        </form>
      </div>

      {/* 5-Column Links Grid */}
      <div className="max-w-[1360px] mx-auto px-4 py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-sm">
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
            {t.footerCustomerService}
          </h3>
          <ul className="space-y-2.5 text-white/75 text-xs">
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
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
            {t.footerNeedHelp}
          </h3>
          <ul className="space-y-2.5 text-white/75 text-xs">
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
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
            {t.footerMyAccount}
          </h3>
          <ul className="space-y-2.5 text-white/75 text-xs">
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
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
            {t.footerOurShop}
          </h3>
          <ul className="space-y-2.5 text-white/75 text-xs">
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
              <button type="button" onClick={() => onNavigate('checkout')} className="hover:text-[#F4BE38] cursor-pointer">
                {locale === 'fr' ? 'Mon panier' : 'My cart'}
              </button>
            </li>
          </ul>
        </div>

        {/* Socials & Direct Contact */}
        <div className="col-span-2 sm:col-span-1 space-y-4">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">
            {t.footerFollowUs}
          </h3>
          <div className="flex items-center gap-2">
            {['f', 'ig', 'x', 'yt', 'tk'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onNavigate('help')}
                className="w-8 h-8 rounded-full bg-[#A084E8] hover:bg-[#5A5AA1] text-[#000000] hover:text-white text-xs font-bold uppercase flex items-center justify-center transition-colors cursor-pointer"
              >
                {code}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 space-y-1">
            <p className="font-display text-lg font-bold text-white tabular-nums">
              693 71 25 25
            </p>
            <p className="text-xs text-white/75">bonjour@lorenamarket.cm</p>
            <p className="text-xs text-white/50">Lun — Sam · 8h — 18h</p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('help')}
            className="min-h-[38px] px-4 py-2 rounded-full bg-[#5A5AA1] hover:bg-[#474789] text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>{t.writeWhatsapp}</span>
          </button>
        </div>
      </div>

      {/* Bottom Payment Methods & Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-[1360px] mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
              {t.paymentMethodsLabel}
            </span>
            <span className="px-2.5 py-1 rounded bg-[#F4BE38] text-[#000000] text-xs font-bold">
              MTN Mobile Money
            </span>
            <span className="px-2.5 py-1 rounded bg-[#FF6600] text-white text-xs font-bold">
              Orange Money
            </span>
            <span className="px-2.5 py-1 rounded border border-white/25 text-white text-xs font-medium">
              {t.codLabel}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-white/60">{t.copyright}</span>
            <button
              type="button"
              aria-label="Haut de page"
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-[#5A5AA1] hover:bg-[#A084E8] text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
