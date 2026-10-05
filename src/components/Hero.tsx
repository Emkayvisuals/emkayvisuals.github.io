import React from 'react';
import { PORTFOLIO_CONTENT, usePortfolio } from '../data/portfolioContent';
import { ArrowDown, Sparkles, Film, Palette, Layers, Eye } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

export const Hero: React.FC = () => {
  const { content, isReady } = usePortfolio();
  const { hero, brand, about } = content;
  const { scrollY } = useScroll();
  const glowY1 = useTransform(scrollY, [0, 800], [0, 100]);
  const glowY2 = useTransform(scrollY, [0, 800], [0, -80]);
  const glowY3 = useTransform(scrollY, [0, 800], [0, 120]);

  if (hero?.enabled === false) {
    return null;
  }

  const badgeMain = hero.badgeMain || '5+ Years of';
  const badgeAccent = hero.badgeAccent || 'Obsessive Visual Craft';
  const headingMain = hero.headingMain || 'Your';
  const headingAccent = hero.headingAccent || 'Vision, Visualized';
  const subtext =
    hero.subtext ||
    'Visual designer creating distinctive posters, digital art, and high impact visual identities for brands and creative projects.';
  const primaryButtonText = hero.primaryButtonText || 'View Work';
  const primaryButtonLink = hero.primaryButtonLink || '#work';

  const visibleFloatingTags = (hero.floatingTags || []).filter((tag) => tag.visible !== false);

  // Soft chips under CTA buttons
  const softwareChips = (about?.softwareTools || [])
    .filter((tool) => tool.visible !== false)
    .slice(0, 4)
    .map((tool) => tool.name);

  return (
    <section
      id="home"
      className="relative min-h-0 sm:min-h-screen-svh lg:min-h-[90vh] lg:min-h-[90svh] flex flex-col items-center justify-center pt-24 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#050505]"
    >
      {/* Soft Blurred Background Glows with subtle parallax movement */}
      <motion.div
        style={{
          y: glowY1,
          background: 'radial-gradient(circle, #8116E0 20%, #8EFF01 90%)',
        }}
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[700px] h-[350px] sm:h-[450px] rounded-full blur-[160px] opacity-[0.138]"
      />
      <motion.div
        style={{
          y: glowY2,
          background: '#8116E0',
        }}
        className="pointer-events-none absolute top-1/3 -left-32 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full blur-[140px] opacity-[0.115]"
      />
      <motion.div
        style={{
          y: glowY3,
          background: '#8EFF01',
        }}
        className="pointer-events-none absolute bottom-10 -right-32 w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full blur-[150px] opacity-[0.092]"
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        {!isReady ? (
          <>
            {/* Top Info Strip Skeleton */}
            <div className="h-8 w-48 sm:w-60 rounded-full bg-white/10 relative overflow-hidden mb-8 sm:mb-10">
              <div className="animate-shimmer" />
            </div>

            {/* Headline Skeleton */}
            <div className="flex flex-col items-center gap-3 w-full max-w-2xl px-2 mb-6">
              <div className="h-10 sm:h-14 w-3/4 rounded-xl bg-white/10 relative overflow-hidden">
                <div className="animate-shimmer" />
              </div>
              <div className="h-10 sm:h-14 w-1/2 rounded-xl bg-white/10 relative overflow-hidden">
                <div className="animate-shimmer" />
              </div>
            </div>

            {/* Subtext Skeleton */}
            <div className="flex flex-col items-center gap-2 w-full max-w-lg mb-8">
              <div className="h-3.5 w-full rounded bg-white/10 relative overflow-hidden">
                <div className="animate-shimmer" />
              </div>
              <div className="h-3.5 w-4/5 rounded bg-white/5 relative overflow-hidden">
                <div className="animate-shimmer" />
              </div>
            </div>

            {/* Floating Tags Skeleton */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mb-9">
              {[80, 110, 95, 120].map((w, idx) => (
                <div key={idx} style={{ width: w }} className="h-7 rounded-full bg-white/5 relative overflow-hidden">
                  <div className="animate-shimmer" />
                </div>
              ))}
            </div>

            {/* Button Skeleton */}
            <div className="h-12 w-40 rounded-full bg-white/10 relative overflow-hidden mb-12 sm:mb-16">
              <div className="animate-shimmer" />
            </div>

            {/* Software Chips Skeleton */}
            <div className="flex items-center justify-center gap-3">
              {[60, 70, 65, 80].map((w, idx) => (
                <div key={idx} style={{ width: w }} className="h-5 rounded bg-white/5 relative overflow-hidden">
                  <div className="animate-shimmer" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Top Info Strip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full glass-panel border border-white/10 mb-8 sm:mb-10 max-w-full text-center"
            >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8EFF01] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8EFF01]"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-semibold text-[#FEFFFC]/90 tracking-wide">
            {badgeMain}{' '}
            {badgeAccent && (
              <span className="font-cormorant italic font-medium text-[#8EFF01]">
                {badgeAccent}
              </span>
            )}
          </span>
          {brand?.statusBadge && (
            <>
              <span className="text-[#8116E0] text-xs hidden xs:inline">●</span>
              <span className="text-[11px] sm:text-xs font-medium text-[#8EFF01] tracking-wide">
                {brand.statusBadge}
              </span>
            </>
          )}
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-montserrat font-medium not-italic text-[clamp(1.85rem,5.8vw,4.4rem)] tracking-tight leading-[1.12] max-w-4xl px-2 break-words"
          style={{ fontStyle: 'normal' }}
        >
          <span className="font-cormorant italic font-medium sm:font-semibold text-[#8EFF01] text-[1.12em]">
            {headingMain}{' '}
          </span>
          <span className="font-montserrat font-medium text-[#FEFFFC]">{headingAccent}</span>
        </motion.h1>

        {/* Short Subtext with Montserrat Regular, italic */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 sm:mt-7 lg:mt-8 max-w-xl text-xs sm:text-sm md:text-base text-[#FEFFFC]/75 leading-relaxed font-normal italic px-2"
        >
          {subtext}
        </motion.p>

        {/* Floating Tag Chips */}
        {visibleFloatingTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7 sm:mt-8 lg:mt-9 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-xl px-2"
          >
            {visibleFloatingTags.map((tag, idx) => {
              return (
                <span
                  key={tag.label}
                  id={`hero-chip-${idx}`}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide transition-all duration-300 min-h-[28px] ${
                    tag.color === 'yellow'
                      ? 'bg-[#8EFF01]/10 border border-[#8EFF01]/30 text-[#8EFF01] shadow-[0_0_18px_rgba(142, 255, 1, 0.22)]'
                      : tag.color === 'violet'
                      ? 'bg-[#8116E0]/15 border border-[#8116E0]/40 text-[#FEFFFC] shadow-[0_0_22px_rgba(129,22,224,0.3)]'
                      : 'bg-white/5 border border-white/10 text-[#FEFFFC]/80'
                  }`}
                >
                  {tag.label === 'Motion Graphics' ? (
                    <Film className="w-3 h-3 text-[#8EFF01]" />
                  ) : tag.label === 'Visual Branding' ? (
                    <Palette className="w-3 h-3 text-[#8116E0]" />
                  ) : (
                    <Layers className="w-3 h-3 text-[#8EFF01]" />
                  )}
                  <span>{tag.label}</span>
                </span>
              );
            })}
          </motion.div>
        )}

        {/* Single Centered Call To Action Button: View Work */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-10 lg:mt-12 flex items-center justify-center w-auto max-w-full px-2"
        >
          {primaryButtonText && (
            <a
              href={primaryButtonLink}
              id="hero-view-work-btn"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#8EFF01] hover:bg-[#7DE000] text-[#050505] font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_42px_rgba(142, 255, 1, 0.75)] hover:shadow-[0_0_60px_rgba(142, 255, 1, 0.95)] transition-all duration-300 hover:scale-105 active:scale-95 min-h-[42px] sm:min-h-[46px]"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#050505]" />
              <span>{primaryButtonText}</span>
              <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#050505]" />
            </a>
          )}
        </motion.div>

        {/* Sub-label for software stack */}
        {softwareChips.length > 0 && (
          <div className="mt-12 sm:mt-16 lg:mt-20 text-center text-[11px] sm:text-xs text-white/40 tracking-wider flex flex-wrap justify-center items-center gap-x-3 gap-y-1 px-4 max-w-full font-medium">
            {softwareChips.map((chip, idx) => (
              <React.Fragment key={chip}>
                {idx > 0 && <span className="text-[#8116E0]">●</span>}
                <span>{chip}</span>
              </React.Fragment>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </section>
  );
};
