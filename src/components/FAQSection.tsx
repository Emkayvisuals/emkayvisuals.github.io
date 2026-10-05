import React, { useState } from 'react';
import { PORTFOLIO_CONTENT, usePortfolio } from '../data/portfolioContent';
import { Sparkles, ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQSection: React.FC = () => {
  const { content, isReady } = usePortfolio();
  const { faqSection, faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqSection?.enabled === false) {
    return null;
  }

  const visibleFaqs = (faq || []).filter((item) => item.visible !== false);

  if (isReady && visibleFaqs.length === 0) {
    return null;
  }

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-14 sm:py-18 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto overflow-hidden">
      {/* Background ambient glows */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2 w-[320px] h-[320px] rounded-full blur-[140px] opacity-[0.115]"
        style={{ background: '#8116E0' }}
      />
      <div
        className="pointer-events-none absolute bottom-10 right-1/4 w-[250px] h-[250px] rounded-full blur-[130px] opacity-[0.092]"
        style={{ background: '#8EFF01' }}
      />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-2xl mx-auto mb-8 sm:mb-11"
      >
        {!isReady ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-32 rounded-full bg-white/10 relative overflow-hidden">
              <div className="animate-shimmer" />
            </div>
            <div className="h-8 w-60 rounded-xl bg-white/10 relative overflow-hidden">
              <div className="animate-shimmer" />
            </div>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#8EFF01] text-[10px] sm:text-xs font-semibold tracking-wide mb-2.5">
              <Sparkles className="w-3 h-3 text-[#8EFF01]" />
              <span>
                {faqSection.badgeMain}{' '}
                <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
                  {faqSection.badgeAccent}
                </span>
              </span>
            </div>
            <h2 className="font-montserrat font-medium italic text-xl sm:text-3xl lg:text-4xl text-[#8EFF01] tracking-tight">
              {faqSection.headingMain}{' '}
              <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
                {faqSection.headingAccent}
              </span>
            </h2>
            {faqSection.subtext && (
              <p className="mt-2.5 text-xs sm:text-[13px] text-white/70 font-normal max-w-lg mx-auto leading-relaxed">
                {faqSection.subtext}
              </p>
            )}
          </>
        )}
      </motion.div>

      {/* FAQ Accordion List */}
      <div className="relative z-10 space-y-2.5 sm:space-y-3">
        {!isReady ? (
          [1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-14 rounded-xl sm:rounded-2xl bg-[#050505]/90 border border-white/[0.08] relative overflow-hidden"
            >
              <div className="animate-shimmer" />
            </div>
          ))
        ) : (
          visibleFaqs.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-25px' }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className={`rounded-xl sm:rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#0B0B0B] border-[#8EFF01]/40 shadow-[0_4px_20px_rgba(142, 255, 1, 0.05)]'
                    : 'bg-[#050505]/90 border-white/[0.08] hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-3 sm:p-4 md:p-4.5 text-left flex items-center justify-between gap-3 cursor-pointer min-h-[42px] sm:min-h-[46px] focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#8EFF01] shrink-0">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-montserrat font-semibold text-xs sm:text-[13.5px] text-[#FEFFFC] tracking-wide">
                      {item.question}
                    </span>
                  </div>
                  <div
                    className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/10 text-white/60 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#8EFF01]/15 text-[#8EFF01] border-[#8EFF01]/40' : ''
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-3.5 pb-3.5 sm:px-4.5 sm:pb-4.5 pt-1.5 text-[11px] sm:text-xs text-white/75 font-normal leading-relaxed border-t border-white/[0.05] pl-12 sm:pl-14">
                        <p className="whitespace-pre-line">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
};
