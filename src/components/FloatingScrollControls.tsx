import { ArrowDown, ArrowUp } from 'lucide-react';
import { Locale } from '../types/store';
import { ActionIconTooltip } from './ActionIconTooltip';

interface FloatingScrollControlsProps {
  locale: Locale;
  elevated?: boolean;
  hidden?: boolean;
}

export function FloatingScrollControls({
  locale,
  elevated = false,
  hidden = false,
}: FloatingScrollControlsProps) {
  if (hidden) return null;

  const scrollToHeader = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      aria-label={
        locale === 'fr' ? 'Navigation rapide haut et bas' : 'Quick scroll navigation'
      }
      className={`no-print fixed right-4 z-40 transition-all duration-200 ${
        elevated ? 'bottom-[136px]' : 'bottom-[72px]'
      }`}
    >
      <div className="ice-surface rounded-full p-1 flex flex-col items-center gap-1 shadow-xl">
        <ActionIconTooltip
          text={
            locale === 'fr'
              ? 'Remonter facilement en en-tête de page'
              : 'Scroll easily up to the page header'
          }
          placement="top"
        >
          <button
            type="button"
            onClick={scrollToHeader}
            aria-label={
              locale === 'fr' ? "Remonter en en-tête" : 'Scroll to header'
            }
            className="glass-pill-gold w-9 h-9 rounded-full text-[#000000] flex items-center justify-center cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        </ActionIconTooltip>

        <ActionIconTooltip
          text={
            locale === 'fr'
              ? 'Descendre directement en pied de page'
              : 'Scroll easily down to the page footer'
          }
          placement="top"
        >
          <button
            type="button"
            onClick={scrollToFooter}
            aria-label={
              locale === 'fr' ? 'Descendre en pied de page' : 'Scroll to footer'
            }
            className="glass-pill-cta w-9 h-9 rounded-full text-white flex items-center justify-center cursor-pointer"
          >
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
          </button>
        </ActionIconTooltip>
      </div>
    </div>
  );
}
