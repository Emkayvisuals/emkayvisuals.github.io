import React from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { Sparkles, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const ProcessSection: React.FC = () => {
  const { process, processSection } = PORTFOLIO_CONTENT;

  if (processSection?.enabled === false) {
    return null;
  }

  const badgeMain = processSection?.badgeMain || 'Methodology //';
  const badgeAccent = processSection?.badgeAccent || 'Zero Noise';
  const headingMain = processSection?.headingMain || 'A Rigorous 4-Step';
  const headingAccent = processSection?.headingAccent || 'Creative Roadmap';
  const subtext =
    processSection?.subtext ||
    'Every project moves through an airtight, predictable progression ensuring full creative alignment and pristine execution without unnecessary delays.';
  const phasePrefix = processSection?.phasePrefix || 'Phase //';

  const visibleSteps = (process || []).filter((s) => s.visible !== false);

  return (
    <section id="process" className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[160px] opacity-[0.085]"
        style={{ background: 'radial-gradient(circle, #8116E0 0%, #8EFF01 100%)' }}
      />

      {/* Header with Scroll Fade/Slide */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-2xl mx-auto mb-8 sm:mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#8EFF01] text-[11px] sm:text-xs font-semibold tracking-wide mb-2.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {badgeMain}{' '}
            {badgeAccent && (
              <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
                {badgeAccent}
              </span>
            )}
          </span>
        </div>
        <h2 className="font-montserrat font-medium italic text-xl sm:text-3xl lg:text-4xl text-[#8EFF01] tracking-tight leading-[1.15]">
          {headingMain}{' '}
          <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
            {headingAccent}
          </span>
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm text-white/70 font-normal max-w-lg mx-auto leading-relaxed">
          {subtext}
        </p>
      </motion.div>

      {/* 4-Step Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
        {visibleSteps.map((step, idx) => (
          <motion.div
            key={step.stepNumber}
            id={`process-step-${step.stepNumber}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{
              duration: 0.45,
              delay: idx * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              y: -4,
              scale: 1.01,
              transition: { duration: 0.2, ease: 'easeOut' },
            }}
            className="group relative rounded-2xl sm:rounded-3xl glass-panel border border-white/[0.08] hover:border-[#8EFF01]/40 p-4 sm:p-5 flex flex-col justify-between cursor-default transition-colors duration-300 bg-[#050505]/80"
          >
            {/* Top Step Number & Duration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-cormorant italic font-medium text-2xl sm:text-3xl text-[#FEFFFC]/30 group-hover:text-[#8EFF01] group-hover:scale-105 transition-all duration-300 inline-block">
                  {step.stepNumber}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-white/60 group-hover:border-[#8EFF01]/30 transition-colors">
                  <Clock className="w-3 h-3 text-[#8EFF01]" />
                  <span>{step.duration}</span>
                </span>
              </div>

              <span className="inline-block text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#8116E0]/20 text-[#FEFFFC] border border-[#8116E0]/40 mb-2 tracking-wide">
                {step.highlightBadge}
              </span>

              <h3 className="font-montserrat font-medium italic text-base sm:text-lg text-[#8EFF01] mb-1.5">
                {step.title}
              </h3>

              <p className="text-xs text-white/70 font-normal leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Bottom Step Indicator */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/45 font-medium">
              <span>
                {phasePrefix}{' '}
                <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]/60">
                  0{idx + 1}
                </span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8EFF01] opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_8px_#8EFF01] transition-all"></span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
