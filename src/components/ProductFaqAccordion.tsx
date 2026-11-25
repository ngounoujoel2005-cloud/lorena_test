import {
  BatteryCharging,
  ChevronDown,
  Cpu,
  HelpCircle,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { Locale, Product } from '../types/store';
import { FaqTopic, getProductFaqs } from '../utils/productFaqs';

interface ProductFaqAccordionProps {
  product: Product;
  locale: Locale;
}

const TOPIC_ICON: Record<FaqTopic, typeof BatteryCharging> = {
  battery: BatteryCharging,
  compatibility: Cpu,
  usage: Wrench,
  warranty: ShieldCheck,
};

export function ProductFaqAccordion({
  product,
  locale,
}: ProductFaqAccordionProps) {
  const faqs = getProductFaqs(product, locale);
  const [openIds, setOpenIds] = useState<string[]>(() =>
    faqs[0] ? [faqs[0].id] : []
  );

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allExpanded = faqs.length > 0 && openIds.length === faqs.length;

  const toggleAll = () => {
    if (allExpanded) {
      setOpenIds([]);
    } else {
      setOpenIds(faqs.map((f) => f.id));
    }
  };

  return (
    <section
      aria-labelledby="product-faq-heading"
      className="ice-surface rounded-3xl overflow-hidden"
    >
      <div className="ice-surface-subtle px-6 py-4 border-b border-white/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="glass-pill-black w-9 h-9 rounded-full text-[#F4BE38] flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="product-faq-heading"
              className="font-display text-lg font-bold text-[#000000]"
            >
              {locale === 'fr'
                ? 'Foire Aux Questions (FAQ) — Produit'
                : 'Frequently Asked Questions'}
            </h2>
            <p className="text-xs text-[#3F3F56]">
              {locale === 'fr'
                ? 'Autonomie, compatibilité, utilisation quotidienne et garantie certifiée.'
                : 'Battery life, compatibility, daily usage, and certified warranty.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleAll}
          className="glass-pill-frost min-h-[34px] px-3.5 py-1 rounded-full text-xs font-bold text-[#000000] cursor-pointer"
        >
          {allExpanded
            ? locale === 'fr'
              ? 'Tout replier'
              : 'Collapse all'
            : locale === 'fr'
            ? 'Tout déplier'
            : 'Expand all'}
        </button>
      </div>

      <div className="divide-y divide-white/75">
        {faqs.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          const TopicIcon = TOPIC_ICON[faq.topic];
          return (
            <div key={faq.id} className={isOpen ? 'bg-white/45' : 'bg-transparent'}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/35 transition-colors cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                  <span className="glass-pill-gold inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[#000000] text-[11px] font-extrabold w-fit shrink-0">
                    <TopicIcon className="w-3.5 h-3.5 text-[#5A5AA1]" aria-hidden="true" />
                    <span>{faq.topicLabel}</span>
                  </span>
                  <span className="font-display text-sm sm:text-base font-bold text-[#000000]">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#5A5AA1] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-0.5 sm:pl-10">
                  <p className="text-sm text-[#3F3F56] leading-relaxed border-l-2 border-[#5A5AA1] pl-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
