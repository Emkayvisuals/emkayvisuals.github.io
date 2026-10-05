import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../data/portfolioContent';

// Track whether the preloader has completed playback during this page session (for internal navigation)
let hasPreloaderPlayedInSession = false;

// Helper to reset session state (e.g. for testing)
export function resetPreloaderSession() {
  hasPreloaderPlayedInSession = false;
}

interface PreloaderProps {
  onLoadingComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const { content } = usePortfolio();
  const { preloader, brand } = content;

  // Evaluate whether to play ONCE on mount so subsequent re-renders (e.g. from Firestore async loads or parent re-renders)
  // cannot abruptly unmount or skip steps in the active preloader mid-animation
  const initialShouldPlay = useRef(!hasPreloaderPlayedInSession && preloader?.enabled !== false);
  const [isLoading, setIsLoading] = useState(() => initialShouldPlay.current);
  const [isAnimationReady, setIsAnimationReady] = useState(false);

  useEffect(() => {
    if (!initialShouldPlay.current) {
      onLoadingComplete?.();
      return;
    }

    // Ensure double requestAnimationFrame has passed so the browser has completed its initial layout and clean paint frame
    // before the animation timeline begins. This eliminates jank / skipped frames on cached page refreshes.
    let frameId1: number;
    let frameId2: number;
    frameId1 = requestAnimationFrame(() => {
      frameId2 = requestAnimationFrame(() => {
        setIsAnimationReady(true);
      });
    });

    // Exact timeline calculation:
    // 0. Blank screen: 0.4s (0.0s - 0.4s)
    // 1. Logo zoom-out + bounce entrance: 0.8s (0.4s - 1.2s)
    // 2. Text fade-in (bouncy overshoot): 0.8s (1.2s - 2.0s)
    // 3. Pause (all still & visible): 0.5s (2.0s - 2.5s)
    // 4. Logo 3D flip (rotateY): 0.8s (2.5s - 3.3s)
    // 5. White shine wipe: 1.5s (3.3s - 4.8s)
    // 6. Pause: 0s (REMOVED - outro triggers immediately when shine wipe finishes)
    // 7. Outro (slide up & fade out): starts immediately at 4.8s (4800ms), duration 0.5s
    const timer = setTimeout(() => {
      setIsLoading(false);
      hasPreloaderPlayedInSession = true;
      onLoadingComplete?.();
    }, 4800);

    return () => {
      cancelAnimationFrame(frameId1);
      cancelAnimationFrame(frameId2);
      clearTimeout(timer);
    };
  }, [onLoadingComplete]);

  if (!initialShouldPlay.current) {
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
          initial={{ y: 0, opacity: 1 }}
          exit={{
            y: '-100%',
            opacity: 0,
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 0, 0)',
          }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden pointer-events-auto [perspective:1000px]"
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Background ambient glow */}
            <div className="absolute w-64 h-64 rounded-full bg-[#8116E0]/20 blur-[90px] pointer-events-none" />

            {/* Main Preloader Content Block */}
            <div className="flex flex-col items-center gap-3 relative z-10 [perspective:1000px]">
              {/* Step 1: Logo Entrance (Zoom out + bounce) starting after 0.4s blank screen */}
              <motion.div
                initial={{ scale: 1.4, opacity: 0 }}
                animate={
                  isAnimationReady
                    ? {
                        scale: [1.4, 0.94, 1.06, 0.98, 1],
                        opacity: [0, 1, 1, 1, 1],
                      }
                    : { scale: 1.4, opacity: 0 }
                }
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  times: [0, 0.35, 0.65, 0.85, 1],
                  ease: 'easeOut',
                }}
                style={{
                  willChange: 'transform, opacity',
                  transform: 'translate3d(0, 0, 0)',
                }}
                className="flex items-center justify-center"
              >
                {/* Step 4: 3D Flip Wrapper (plays at t = 2.5s, duration 0.8s) */}
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={isAnimationReady ? { rotateY: [0, 0, 360] } : { rotateY: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 2.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    willChange: 'transform',
                    transform: 'translate3d(0, 0, 0)',
                  }}
                  className="relative flex items-center justify-center"
                >
                  {/* Logo Container with overflow-hidden for the diagonal shine sweep */}
                  <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden flex items-center justify-center shadow-[0_0_42px_rgba(142,255,1,0.65)]">
                    {brand?.logoUrl || preloader?.logoUrl ? (
                      <div className="w-full h-full rounded-full bg-[#8EFF01]/10 border border-[#8EFF01]/40 overflow-hidden flex items-center justify-center p-1 sm:p-1.5">
                        <img
                          src={brand?.logoUrl || preloader?.logoUrl}
                          alt={brand?.logoAlt || preloader?.logoAlt || 'Emkay Visuals Logo'}
                          className="w-full h-full object-contain object-center block select-none scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#8EFF01] flex items-center justify-center font-bold text-[#050505] text-xl sm:text-2xl border border-[#8EFF01]">
                        {logoAbbr}
                      </div>
                    )}

                    {/* Step 5: White Shine Wipe - single diagonal light sweep across logo immediately after flip (duration 1.5s, delay 3.3s) */}
                    <motion.div
                      initial={{ x: '-150%', opacity: 0 }}
                      animate={
                        isAnimationReady
                          ? {
                              x: ['-150%', '150%'],
                              opacity: [0, 1, 1, 0],
                            }
                          : { x: '-150%', opacity: 0 }
                      }
                      transition={{
                        duration: 1.5,
                        delay: 3.3,
                        ease: [0.25, 1, 0.5, 1],
                      }}
                      style={{
                        background:
                          'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.9) 50%, transparent 80%)',
                        willChange: 'transform, opacity',
                        transform: 'translate3d(0, 0, 0)',
                      }}
                      className="pointer-events-none absolute inset-0 z-30 w-[200%] -left-[50%]"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Step 2: Text Fade-In (Bouncy / Elastic Overshoot) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={
                  isAnimationReady
                    ? {
                        opacity: [0, 1, 1, 1],
                        scale: [0.85, 1.06, 0.98, 1],
                        y: [10, -2, 1, 0],
                      }
                    : { opacity: 0, scale: 0.85, y: 10 }
                }
                transition={{
                  duration: 0.6,
                  delay: 1.2,
                  times: [0, 0.5, 0.8, 1],
                  ease: 'easeOut',
                }}
                style={{
                  willChange: 'transform, opacity',
                  transform: 'translate3d(0, 0, 0)',
                }}
                className="flex items-center gap-1.5 font-montserrat font-semibold tracking-wider text-sm sm:text-base text-[#FEFFFC]"
              >
                <span>{brandMain}</span>
                <span className="text-[#8EFF01]">{divider}</span>
                <span className="text-white/70">{brandAccent}</span>
              </motion.div>

              {/* Step 2 (staggered beat): Portfolio 2026 Tagline */}
              <motion.span
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={
                  isAnimationReady
                    ? {
                        opacity: [0, 1, 1, 1],
                        scale: [0.85, 1.05, 0.99, 1],
                        y: [8, -1, 0, 0],
                      }
                    : { opacity: 0, scale: 0.85, y: 8 }
                }
                transition={{
                  duration: 0.6,
                  delay: 1.4,
                  times: [0, 0.5, 0.8, 1],
                  ease: 'easeOut',
                }}
                style={{
                  willChange: 'transform, opacity',
                  transform: 'translate3d(0, 0, 0)',
                }}
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
