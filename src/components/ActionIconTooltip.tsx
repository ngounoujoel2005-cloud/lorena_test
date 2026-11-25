import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface ActionIconTooltipProps {
  text: string;
  placement?: TooltipPlacement;
  className?: string;
  tooltipClassName?: string;
  focusable?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

interface TooltipCoords {
  top: number;
  left: number;
  arrowLeft: number;
  flippedBottom: boolean;
}

function normalizeWrapperClass(raw?: string): string {
  if (!raw || !raw.trim()) {
    return 'inline-flex items-center shrink-0';
  }
  const tokens = raw.trim().split(/\s+/);
  const hasDisplay = tokens.some((t) =>
    /^(?:[a-z]+:)?(block|inline-block|inline|flex|inline-flex|grid|inline-grid|contents)$/.test(
      t
    )
  );
  const hasWFull = tokens.includes('w-full');
  const hasShrink = tokens.some((t) => t.startsWith('shrink-'));
  const hasItems = tokens.some((t) => t.startsWith('items-'));

  const result = [...tokens];
  if (!hasDisplay) {
    result.unshift(hasWFull ? 'block' : 'inline-flex');
  }
  if ((result.includes('inline-flex') || result.includes('flex')) && !hasItems) {
    result.push('items-center');
  }
  if (!hasShrink && !hasWFull && !result.includes('flex-1')) {
    result.push('shrink-0');
  }
  return result.join(' ');
}

export function ActionIconTooltip({
  text,
  placement: _placement = 'top',
  className,
  tooltipClassName = '',
  focusable = false,
  disabled = false,
  children,
}: ActionIconTooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords>({
    top: 0,
    left: 0,
    arrowLeft: 50,
    flippedBottom: false,
  });

  const wrapperClass = normalizeWrapperClass(className);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el || typeof window === 'undefined') return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const centerX = rect.left + rect.width / 2;
    const margin = Math.min(118, vw / 2 - 12);
    const clampedLeft = Math.max(margin, Math.min(vw - margin, centerX));

    // Always position ABOVE the element unless it sits right at the top viewport edge
    const flippedBottom = rect.top < 54;
    const top = flippedBottom ? rect.bottom + 10 : rect.top - 10;
    const deltaX = centerX - clampedLeft;
    const arrowPct = Math.max(14, Math.min(86, 50 + (deltaX / 210) * 100));

    setCoords({
      top,
      left: clampedLeft,
      arrowLeft: arrowPct,
      flippedBottom,
    });
  }, []);

  useLayoutEffect(() => {
    if (!visible) return;
    updatePosition();
  }, [visible, updatePosition, text]);

  useEffect(() => {
    if (!visible) return;
    const handleScroll = () => setVisible(false);
    const handleResize = () => updatePosition();
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [visible, updatePosition]);

  if (disabled || !text.trim()) {
    return <span className={wrapperClass}>{children}</span>;
  }

  const tooltipNode = (
    <span
      role="tooltip"
      aria-hidden={!visible}
      style={
        visible
          ? {
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: coords.flippedBottom
                ? 'translate(-50%, 0)'
                : 'translate(-50%, -100%)',
            }
          : undefined
      }
      className={`ice-obsidian pointer-events-none w-max max-w-[220px] rounded-2xl border border-white/45 px-3 py-1.5 text-[11px] font-semibold leading-snug text-white shadow-2xl ${
        visible
          ? 'block opacity-100 fixed z-50'
          : 'hidden opacity-0'
      } ${tooltipClassName}`}
    >
      <span className="text-[#F4BE38] mr-1" aria-hidden="true">
        ✦
      </span>
      <span>{text}</span>
      <span
        aria-hidden="true"
        style={{ left: `${coords.arrowLeft}%` }}
        className={`absolute w-2 h-2 -translate-x-1/2 rotate-45 bg-[#191834] border border-white/40 ${
          coords.flippedBottom
            ? 'bottom-full -mb-1 border-b-0 border-r-0'
            : 'top-full -mt-1 border-t-0 border-l-0'
        }`}
      />
    </span>
  );

  return (
    <span
      ref={triggerRef}
      tabIndex={focusable ? 0 : undefined}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setVisible(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setVisible(false);
        }
      }}
      className={`${wrapperClass} ${
        focusable
          ? 'focus-visible:outline-2 focus-visible:outline-[#5A5AA1] rounded-full'
          : ''
      }`}
    >
      {children}
      {typeof document !== 'undefined'
        ? createPortal(tooltipNode, document.body)
        : tooltipNode}
    </span>
  );
}
