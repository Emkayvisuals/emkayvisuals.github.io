import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';

// Track whether the preloader has played during this page lifecycle / session
let hasPreloaderPlayedInSession = false;

interface PreloaderProps {
  onLoadingComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const { preloader, brand } = PORTFOLIO_CONTENT;
  const shouldSkip = hasPreloaderPlayedInSession || preloader?.enabled === false;
  const [isLoading, setIsLoading] = useState(!shouldSkip);

  useEffect(() => {
    if (shouldSkip) {
      onLoadingComplete?.();
      return;
    }

    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      hasPreloaderPlayedInSession = true;
      setIsLoading(false);
      onLoadingComplete?.();
      return;
    }

    hasPreloaderPlayedInSession = true;

    // Total animation time: ~1.3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete?.();
    }, 1300);

    return () => clearTimeout(timer);
  }, [onLoadingComplete, shouldSkip]);

  if (shouldSkip) {
    return null;
  }

  const logoAbbr = preloader?.logoAbbr || 'EV';
  const brandMain = preloader?.brandMain || 'EMKAY';
  const divider = preloader?.divider || '//';
  const brandAccent = preloader?.brandAccent || 'VISUALS';

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden pointer-events-auto"
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Background ambient glow */}
            <div className="absolute w-64 h-64 rounded-full bg-[#8116E0]/20 blur-[90px] pointer-events-none" />

            {/* Logo Mark Fading & Scaling in */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 relative z-10"
            >
              {brand?.logoUrl || preloader?.logoUrl ? (
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#8EFF01]/10 border border-[#8EFF01]/40 overflow-hidden flex items-center justify-center p-1 sm:p-1.5 shadow-[0_0_30px_rgba(142, 255, 1, 0.38)]">
                  <img
                    src={brand?.logoUrl || preloader?.logoUrl}
                    alt={brand?.logoAlt || preloader?.logoAlt || 'Emkay Visuals Logo'}
                    className="w-full h-full object-contain object-center block select-none scale-105"
                  />
                </div>
              ) : (
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#8EFF01] flex items-center justify-center font-bold text-[#050505] text-xl sm:text-2xl shadow-[0_0_30px_rgba(142, 255, 1, 0.38)]">
                  {logoAbbr}
                </div>
              )}
              <div className="flex items-center gap-1.5 font-montserrat font-semibold tracking-wider text-sm sm:text-base text-[#FEFFFC]">
                <span>{brandMain}</span>
                <span className="text-[#8EFF01]">{divider}</span>
                <span className="text-white/70">{brandAccent}</span>
              </div>
              {preloader?.tagline && (
                <span className="text-[10px] font-mono tracking-widest text-[#8EFF01]/80 mt-1">
                  {preloader.tagline}
                </span>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
