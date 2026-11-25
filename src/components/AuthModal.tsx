import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Locale, UserSession } from '../types/store';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  locale: Locale;
  onClose: () => void;
  onAuthSuccess: (session: UserSession) => void;
}

export function AuthModal({
  isOpen,
  initialMode = 'login',
  locale,
  onClose,
  onAuthSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [fullName, setFullName] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleGoogleContinue = () => {
    onAuthSuccess({
      fullName: 'Client Google Lorena',
      phone: '+237 693 71 25 25',
      email: 'client@lorenamarket.cm',
      provider: 'google',
    });
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'forgot') {
      const target =
        method === 'phone' ? phoneDigits.replace(/\D/g, '') : email.trim();
      if (
        (method === 'phone' && target.length < 9) ||
        (method === 'email' && !target.includes('@'))
      ) {
        setError(
          locale === 'fr'
            ? 'Veuillez entrer un identifiant valide pour recevoir le code.'
            : 'Please enter a valid phone number or email address.'
        );
        return;
      }
      setResetSent(true);
      return;
    }

    if (mode === 'register' && fullName.trim().length < 2) {
      setError(
        locale === 'fr'
          ? 'Veuillez saisir votre nom complet.'
          : 'Please enter your full name.'
      );
      return;
    }

    if (method === 'phone') {
      const digits = phoneDigits.replace(/\D/g, '');
      if (digits.length < 9) {
        setError(
          locale === 'fr'
            ? 'Veuillez saisir un numéro camerounais à 9 chiffres (ex: 670123123).'
            : 'Please enter a valid 9-digit Cameroon phone number.'
        );
        return;
      }
    } else if (!email.includes('@')) {
      setError(
        locale === 'fr'
          ? 'Veuillez saisir une adresse e-mail valide.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    if (password.length < 6) {
      setError(
        locale === 'fr'
          ? 'Le mot de passe doit contenir au moins 6 caractères.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    const formattedPhone = phoneDigits.trim()
      ? `+237 ${phoneDigits.replace(/\D/g, '')}`
      : '+237 693 71 25 25';

    onAuthSuccess({
      fullName:
        fullName.trim() ||
        (method === 'email'
          ? email.split('@')[0]
          : locale === 'fr'
          ? 'Client Lorena'
          : 'Lorena Customer'),
      phone: formattedPhone,
      email: email.trim() || 'client@lorenamarket.cm',
      provider: method,
    });
    onClose();
  };

  const titleText =
    mode === 'login'
      ? locale === 'fr'
        ? 'Bon retour'
        : 'Welcome Back'
      : mode === 'register'
      ? locale === 'fr'
        ? 'Créer un compte'
        : 'Create Account'
      : locale === 'fr'
      ? 'Mot de passe oublié'
      : 'Reset Password';

  const subtitleText =
    mode === 'login'
      ? locale === 'fr'
        ? 'Connectez-vous pour continuer sur Lorena'
        : 'Sign in to continue on Lorena Market'
      : mode === 'register'
      ? locale === 'fr'
        ? 'Rejoignez Lorena Market Cameroun'
        : 'Join Lorena Market Cameroon'
      : locale === 'fr'
      ? 'Recevez votre code de réinitialisation'
      : 'Receive your verification reset code';

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={titleText}
    >
      <div
        className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Frosted Neumorphic Crystal Glass Card (formulaire_connexion_lorena style in yellow/violet/blue glass) */}
      <div className="ice-surface relative w-full max-w-[420px] rounded-[32px] overflow-hidden">
        {/* Decorative Frosted Glass Spheres */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-[#F4BE38]/40 border border-white/85 backdrop-blur-md shadow-inner pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-20 -right-10 w-24 h-24 rounded-full bg-[#38BDF8]/25 border border-white/80 backdrop-blur-md pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-14 -right-12 w-40 h-40 rounded-full bg-[#A084E8]/30 border border-white/80 backdrop-blur-md pointer-events-none"
        />

        {/* Top-Right Glass Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="glass-pill-frost absolute top-4 right-4 z-20 w-9 h-9 rounded-full text-[#000000] flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="relative z-10 px-6 sm:px-8 pt-8 pb-6 space-y-5">
          {/* Centered Elevated Squircle Logo Medallion */}
          <div className="flex flex-col items-center text-center">
            <div className="ice-product-trap w-20 h-20 rounded-[24px] flex items-center justify-center p-2.5">
              {!logoFailed ? (
                <img
                  src="/assets/aistudio/lorena-logo-noir-transparent_36764768.png"
                  alt="Lorena Market"
                  onError={() => setLogoFailed(true)}
                  className="w-full h-auto object-contain relative z-10"
                />
              ) : (
                <ShoppingBag className="w-8 h-8 text-[#5A5AA1] relative z-10" aria-hidden="true" />
              )}
            </div>

            <h2 className="mt-4 font-display text-2xl font-extrabold text-[#000000] tracking-tight">
              {titleText}
            </h2>
            <p className="mt-1 text-xs font-semibold text-[#3F3F56] tracking-wide">
              {subtitleText}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div className="glass-input-recessed rounded-full flex items-center px-4">
                <User className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={locale === 'fr' ? 'Nom complet' : 'Full name'}
                  className="min-h-[46px] flex-1 px-3 bg-transparent text-sm text-[#000000] placeholder:text-[#6C757D] focus:outline-none"
                />
              </div>
            )}

            {method === 'phone' ? (
              <div className="glass-input-recessed rounded-full flex items-center px-4">
                <Phone className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                <span className="ml-2.5 pr-2 border-r border-[#5A5AA1]/20 text-xs font-bold text-[#000000] shrink-0">
                  🇨🇲 +237
                </span>
                <input
                  type="tel"
                  value={phoneDigits}
                  onChange={(e) => setPhoneDigits(e.target.value)}
                  placeholder="670 123 123"
                  aria-label={locale === 'fr' ? 'Numéro de téléphone' : 'Phone number'}
                  className="min-h-[46px] flex-1 px-3 bg-transparent text-sm text-[#000000] placeholder:text-[#6C757D] tabular-nums focus:outline-none"
                />
              </div>
            ) : (
              <div className="glass-input-recessed rounded-full flex items-center px-4">
                <Mail className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    locale === 'fr' ? 'Adresse e-mail' : 'Username or Email'
                  }
                  aria-label={locale === 'fr' ? 'Adresse e-mail' : 'Email address'}
                  className="min-h-[46px] flex-1 px-3 bg-transparent text-sm text-[#000000] placeholder:text-[#6C757D] focus:outline-none"
                />
              </div>
            )}

            {mode !== 'forgot' && (
              <div className="glass-input-recessed rounded-full flex items-center px-4">
                <Lock className="w-4 h-4 text-[#5A5AA1] shrink-0" aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={locale === 'fr' ? 'Mot de passe' : 'Password'}
                  aria-label={locale === 'fr' ? 'Mot de passe' : 'Password'}
                  className="min-h-[46px] flex-1 px-3 bg-transparent text-sm text-[#000000] placeholder:text-[#6C757D] focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-1.5 text-[#6C757D] hover:text-[#000000] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            )}

            {/* Remember Me + Forgot Password Row */}
            {mode !== 'forgot' && (
              <div className="flex items-center justify-between px-1 text-xs">
                <button
                  type="button"
                  onClick={() => setRememberMe((r) => !r)}
                  className="inline-flex items-center gap-2 font-medium text-[#1F2442] cursor-pointer"
                >
                  <span
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                      rememberMe
                        ? 'bg-[#5A5AA1] text-white'
                        : 'bg-white border border-[#D1D5DB]'
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3" aria-hidden="true" />}
                  </span>
                  <span>
                    {locale === 'fr' ? 'Se souvenir de moi' : 'Remember Me'}
                  </span>
                </button>

                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                      setResetSent(false);
                    }}
                    className="font-semibold text-[#5A5AA1] hover:underline cursor-pointer"
                  >
                    {locale === 'fr' ? 'Mot de passe oublié ?' : 'Forgot Password?'}
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 rounded-2xl bg-[#ffdad6] text-[#93000a] text-xs font-medium text-center">
                {error}
              </div>
            )}

            {resetSent && (
              <div className="p-3 rounded-2xl bg-white/85 border border-[#5A5AA1]/30 text-[#000000] text-xs font-medium text-center">
                {locale === 'fr'
                  ? 'Un code de réinitialisation vient d’être envoyé.'
                  : 'A reset code has been sent via SMS/email.'}
              </div>
            )}

            {/* Full-width Glossy Pill Login Button with Right Arrow Circle */}
            <button
              type="submit"
              className="glass-pill-cta w-full min-h-[50px] px-4 py-2 rounded-full text-white font-display font-bold text-sm flex items-center justify-between cursor-pointer"
            >
              <span className="w-8" aria-hidden="true" />
              <span>
                {mode === 'login'
                  ? locale === 'fr'
                    ? 'Se connecter'
                    : 'Login'
                  : mode === 'register'
                  ? locale === 'fr'
                    ? 'Créer mon compte'
                    : 'Create Account'
                  : locale === 'fr'
                  ? 'Envoyer le code'
                  : 'Send Reset Code'}
              </span>
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" aria-hidden="true" />
              </span>
            </button>
          </form>

          {/* Divider + 3 Frosted Glass Provider Tiles (Google | Téléphone | E-mail) */}
          {mode !== 'forgot' && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#6C757D]">
                <div className="flex-1 h-px bg-[#5A5AA1]/20" />
                <span>
                  {locale === 'fr' ? 'Ou continuer avec' : 'Or continue with'}
                </span>
                <div className="flex-1 h-px bg-[#5A5AA1]/20" />
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleGoogleContinue}
                  title="Google"
                  aria-label="Continuer avec Google"
                  className="glass-pill-frost w-14 h-12 rounded-2xl flex items-center justify-center font-display font-extrabold text-base text-[#5A5AA1] cursor-pointer"
                >
                  G
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMethod('phone');
                    setError(null);
                  }}
                  title={locale === 'fr' ? 'Téléphone' : 'Phone'}
                  aria-label={locale === 'fr' ? 'Connexion par téléphone' : 'Phone sign in'}
                  className={`glass-pill-frost w-14 h-12 rounded-2xl flex items-center justify-center cursor-pointer ${
                    method === 'phone'
                      ? 'ring-2 ring-[#5A5AA1] text-[#5A5AA1]'
                      : 'text-[#6C757D]'
                  }`}
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMethod('email');
                    setError(null);
                  }}
                  title={locale === 'fr' ? 'E-mail' : 'Email'}
                  aria-label={locale === 'fr' ? 'Connexion par e-mail' : 'Email sign in'}
                  className={`glass-pill-frost w-14 h-12 rounded-2xl flex items-center justify-center cursor-pointer ${
                    method === 'email'
                      ? 'ring-2 ring-[#5A5AA1] text-[#5A5AA1]'
                      : 'text-[#6C757D]'
                  }`}
                >
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Switch Register / Login */}
          <div className="text-center text-xs text-[#6C757D]">
            {mode === 'login' ? (
              <>
                {locale === 'fr' ? 'Pas encore de compte ?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="font-bold text-[#5A5AA1] hover:underline cursor-pointer"
                >
                  {locale === 'fr' ? "S'inscrire" : 'Sign up'}
                </button>
              </>
            ) : (
              <>
                {locale === 'fr' ? 'Déjà inscrit ?' : 'Already registered?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setResetSent(false);
                  }}
                  className="font-bold text-[#5A5AA1] hover:underline cursor-pointer"
                >
                  {locale === 'fr' ? 'Se connecter' : 'Sign in'}
                </button>
              </>
            )}
          </div>

          <p className="text-center text-[10px] font-bold tracking-[0.2em] uppercase text-[#6C757D]/80">
            {locale === 'fr'
              ? 'ACHAT • GARANTIE • LIVRAISON'
              : 'SHOP • WARRANTY • DELIVERY'}
          </p>
        </div>
      </div>
    </div>
  );
}
