import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PORTFOLIO_CONTENT, usePortfolio } from '../data/portfolioContent';

// Track whether the preloader has played during this page lifecycle / session
let hasPreloaderPlayedInSession = false;

interface PreloaderProps {
  onLoadingComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const { content } = usePortfolio();
  const { preloader, brand } = content;
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

    // Timeline: 0.7s flip animation + 1.0s static hold = 1.7s before slide-up outro begins
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete?.();
    }, 1700);

    return () => clearTimeout(timer);
  }, [onLoadingComplete, shouldSkip]);

  if (shouldSkip) {
    return null;
  }

  const logoAbbr = preloader?.logoAbbr || 'EV';
  const brandMain = preloader?.brandMain || brand?.name?.split(' ')[0] || 'EMKAY';
  const divider = preloader?.divider || '//';
  const brandAccent = preloader?.brandAccent || brand?.name?.split(' ').slice(1).join(' ') || 'VISUALS';
  const tagline = preloader?.tagline || 'Portfolio 2026';

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden pointer-events-auto [perspective:1000px]"
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Background ambient glow */}
            <div className="absolute w-64 h-64 rounded-full bg-[#8116E0]/20 blur-[90px] pointer-events-none" />

            {/* Main Preloader Content Block */}
            <div className="flex flex-col items-center gap-3 relative z-10 [perspective:1000px]">
              {/* 3D Flip Logo: Smooth rotateY from 90deg (invisible edge) to 0deg facing forward */}
              <motion.div
                initial={{ rotateY: 90, opacity: 0, scale: 0.92 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                className="flex items-center justify-center"
              >
                {brand?.logoUrl || preloader?.logoUrl ? (
                  <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#8EFF01]/10 border border-[#8EFF01]/40 overflow-hidden flex items-center justify-center p-1 sm:p-1.5 shadow-[0_0_42px_rgba(142, 255, 1, 0.65)]">
                    <img
                      src={brand?.logoUrl || preloader?.logoUrl}
                      alt={brand?.logoAlt || preloader?.logoAlt || 'Emkay Visuals Logo'}
                      className="w-full h-full object-contain object-center block select-none scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#8EFF01] flex items-center justify-center font-bold text-[#050505] text-xl sm:text-2xl shadow-[0_0_42px_rgba(142, 255, 1, 0.65)]">
                    {logoAbbr}
                  </div>
                )}
              </motion.div>

              {/* Brand Name Title */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-1.5 font-montserrat font-semibold tracking-wider text-sm sm:text-base text-[#FEFFFC]"
              >
                <span>{brandMain}</span>
                <span className="text-[#8EFF01]">{divider}</span>
                <span className="text-white/70">{brandAccent}</span>
              </motion.div>

              {/* Portfolio 2026 Tagline */}
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#8EFF01]/80 mt-0.5 uppercase"
              >
                {tagline}
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
