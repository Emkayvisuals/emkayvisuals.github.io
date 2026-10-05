import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { PORTFOLIO_CONTENT, TestimonialItem, usePortfolio } from '../data/portfolioContent';
import { Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Testimonials: React.FC = () => {
  const { content, isReady } = usePortfolio();
  const { testimonials, testimonialsSection } = content;

  if (testimonialsSection?.enabled === false) {
    return null;
  }

  const badgeMain = testimonialsSection?.badgeMain || 'Endorsements &';
  const badgeAccent = testimonialsSection?.badgeAccent || 'Reputation';
  const headingMain = testimonialsSection?.headingMain || 'Trusted by Visionary';
  const headingAccent = testimonialsSection?.headingAccent || 'Directors & Founders';
  const satisfactionText =
    testimonialsSection?.satisfactionText || '5.0 Average Client Satisfaction';

  const visibleTestimonials: TestimonialItem[] = useMemo(
    () => (testimonials || []).filter((t) => t.visible !== false),
    [testimonials]
  );

  const total = visibleTestimonials.length;

  // 3-set cloned array for seamless continuous infinite looping
  const displayItems = useMemo(() => {
    if (total <= 1) return visibleTestimonials;
    return [...visibleTestimonials, ...visibleTestimonials, ...visibleTestimonials];
  }, [visibleTestimonials, total]);

  // Initial virtual index starts at the beginning of the middle set (total)
  const [virtualIndex, setVirtualIndex] = useState(total > 1 ? total : 0);
  const [isSilentJump, setIsSilentJump] = useState(false);

  // Sync virtualIndex if testimonials count changes (e.g. from admin editing)
  useEffect(() => {
    if (total > 1) {
      setVirtualIndex((prev) => {
        const normalized = ((prev % total) + total) % total;
        return total + normalized;
      });
    } else {
      setVirtualIndex(0);
    }
  }, [total]);

  // Viewport container width tracking
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [containerWidth, setContainerWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return Math.min(window.innerWidth - 32, 720);
    }
    return 720;
  });

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const updateWidth = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setContainerWidth(Math.round(rect.width));
      }
    };
    updateWidth();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect && entry.contentRect.width > 0) {
            setContainerWidth(Math.round(entry.contentRect.width));
          }
        }
      });
      ro.observe(el);
    } else {
      window.addEventListener('resize', updateWidth);
    }

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Card dimensions: 1 card visible at a time, exactly matching containerWidth with zero sliver
  const gap = 20;
  const cardWidth = containerWidth;

  // Reduced motion preference detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Section in-view detection (intersection observer)
  const [isSectionInView, setIsSectionInView] = useState(true);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-advance & manual pause timing
  const lastAdvancedAtRef = useRef(Date.now());
  const userPausedUntilRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const pointerStartXRef = useRef<number | null>(null);
  const pointerCurrentXRef = useRef<number | null>(null);
  const isSwipingRef = useRef(false);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setVirtualIndex((v) => v + 1);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setVirtualIndex((v) => v - 1);
  }, [total]);

  const pauseAutoAdvanceFor5Seconds = useCallback(() => {
    userPausedUntilRef.current = Date.now() + 5000;
    lastAdvancedAtRef.current = Date.now() + 5000;
  }, []);

  const handleNextWithPause = useCallback(() => {
    pauseAutoAdvanceFor5Seconds();
    handleNext();
  }, [pauseAutoAdvanceFor5Seconds, handleNext]);

  const handlePrevWithPause = useCallback(() => {
    pauseAutoAdvanceFor5Seconds();
    handlePrev();
  }, [pauseAutoAdvanceFor5Seconds, handlePrev]);

  const handleDotClick = useCallback(
    (targetDotIdx: number) => {
      if (total <= 1) return;
      const currentActual = ((virtualIndex % total) + total) % total;
      if (currentActual === targetDotIdx) return;

      pauseAutoAdvanceFor5Seconds();

      // Shortest circular path
      let diff = (targetDotIdx - currentActual) % total;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      setVirtualIndex((v) => v + diff);
    },
    [total, virtualIndex, pauseAutoAdvanceFor5Seconds]
  );

  // Auto-advance loop: every 4 seconds, looping continuously
  useEffect(() => {
    if (prefersReducedMotion || total <= 1) return;

    const interval = setInterval(() => {
      if (!isSectionInView || document.visibilityState === 'hidden' || isDragging) {
        return;
      }

      const now = Date.now();
      if (now < userPausedUntilRef.current) {
        return; // Paused for 5 seconds after manual interaction
      }

      if (now - lastAdvancedAtRef.current >= 4000) {
        lastAdvancedAtRef.current = now;
        handleNext();
      }
    }, 150);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, total, isSectionInView, isDragging, handleNext]);

  // Silent normalization at boundaries after animation finishes
  useEffect(() => {
    if (total <= 1) return;

    if (virtualIndex >= 2 * total || virtualIndex < total) {
      const timer = setTimeout(() => {
        setIsSilentJump(true);
        if (virtualIndex >= 2 * total) {
          setVirtualIndex((v) => v - total);
        } else if (virtualIndex < total) {
          setVirtualIndex((v) => v + total);
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsSilentJump(false);
          });
        });
      }, 510);

      return () => clearTimeout(timer);
    }
  }, [virtualIndex, total]);

  // Pointer drag gestures (mouse + touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (total <= 1) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    pointerStartXRef.current = e.clientX;
    pointerCurrentXRef.current = e.clientX;
    isSwipingRef.current = false;
    setIsDragging(true);
    pauseAutoAdvanceFor5Seconds();

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture not supported
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerStartXRef.current === null) return;
    pointerCurrentXRef.current = e.clientX;
    const deltaX = e.clientX - pointerStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      isSwipingRef.current = true;
    }
    setDragOffset(deltaX);
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent) => {
    if (pointerStartXRef.current === null) return;
    const deltaX = (pointerCurrentXRef.current ?? e.clientX) - pointerStartXRef.current;
    pointerStartXRef.current = null;
    pointerCurrentXRef.current = null;
    setIsDragging(false);
    setDragOffset(0);

    pauseAutoAdvanceFor5Seconds();

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const threshold = 40;
    if (deltaX < -threshold) {
      handleNext();
    } else if (deltaX > threshold) {
      handlePrev();
    }
  };

  // Active testimonial index for dots
  const activeActualIndex = ((virtualIndex % total) + total) % total;

  // Track position calculation: exact 1-card step translation with zero sliver
  const step = cardWidth + gap;
  const currentTranslateX = -virtualIndex * step + dragOffset;

  return (
    <section
      ref={sectionRef}
      className="relative py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden select-none"
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 w-[360px] h-[260px] rounded-full blur-[150px] opacity-[0.098]"
        style={{ background: '#8116E0' }}
      />

      {/* Header with Scroll Fade/Slide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-9 gap-4"
      >
        <div>
          {!isReady ? (
            <div className="h-6 w-36 rounded-full bg-white/10 relative overflow-hidden mb-2">
              <div className="animate-shimmer" />
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#8EFF01] text-[11px] font-semibold tracking-wide mb-2">
              <Sparkles className="w-3 h-3" />
              <span>
                {badgeMain}{' '}
                {badgeAccent && (
                  <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
                    {badgeAccent}
                  </span>
                )}
              </span>
            </div>
          )}
          {!isReady ? (
            <div className="h-8 w-64 rounded-xl bg-white/10 relative overflow-hidden">
              <div className="animate-shimmer" />
            </div>
          ) : (
            <h2 className="font-montserrat font-medium italic text-xl sm:text-2xl lg:text-3xl text-[#8EFF01] tracking-tight leading-[1.15]">
              {headingMain}{' '}
              <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
                {headingAccent}
              </span>
            </h2>
          )}
        </div>
        {satisfactionText && !isReady ? (
          <div className="h-4 w-40 rounded bg-white/5 relative overflow-hidden">
            <div className="animate-shimmer" />
          </div>
        ) : satisfactionText && (
          <div className="flex items-center gap-1.5 text-[11px] text-white/60 font-medium">
            <div className="flex text-[#8EFF01]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span>{satisfactionText}</span>
          </div>
        )}
      </motion.div>

      {/* Carousel Container */}
      <div className="relative z-10 w-full max-w-2xl sm:max-w-3xl mx-auto">
        {!isReady ? (
          <div className="w-full rounded-2xl sm:rounded-3xl glass-panel bg-[#070707] border border-white/10 p-6 sm:p-8 overflow-hidden relative">
            <div className="animate-shimmer" />
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-white/10 relative overflow-hidden" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-36 rounded bg-white/10" />
                <div className="h-3 w-24 rounded bg-white/5" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded bg-white/10" />
              <div className="h-3.5 w-5/6 rounded bg-white/10" />
              <div className="h-3.5 w-4/6 rounded bg-white/5" />
            </div>
          </div>
        ) : (
          <>
            <div
              ref={carouselRef}
              className="relative w-full overflow-hidden py-1 cursor-grab active:cursor-grabbing touch-pan-y"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUpOrCancel}
              onPointerCancel={handlePointerUpOrCancel}
            >
          {total <= 1 ? (
            // Single card fallback
            <div className="flex justify-center w-full">
              {visibleTestimonials[0] && (
                <div
                  style={{ width: `${cardWidth}px` }}
                  className="rounded-xl sm:rounded-2xl glass-panel border border-[#8EFF01]/40 p-5 sm:p-6 md:p-8 flex flex-col justify-between bg-[#050505]/95 shadow-[0_0_28px_rgba(142,255,1,0.08),0_10px_40px_rgba(0,0,0,0.85)] w-full"
                >
                  {/* Card Content */}
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                      <div className="flex text-[#8EFF01] gap-0.5">
                        {[...Array(visibleTestimonials[0].rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[#FEFFFC]/80">
                        {visibleTestimonials[0].projectType}
                      </span>
                    </div>
                    <p className="font-baskervville italic text-xs sm:text-[13px] md:text-sm text-[#FEFFFC]/90 leading-relaxed mb-3 sm:mb-4 font-normal">
                      “{visibleTestimonials[0].comment}”
                    </p>
                  </div>
                  <div className="pt-2.5 sm:pt-3 border-t border-white/[0.06] flex items-center gap-2.5">
                    <img
                      src={visibleTestimonials[0].avatar}
                      alt={visibleTestimonials[0].name}
                      width="32"
                      height="32"
                      className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-montserrat font-medium italic text-[11px] sm:text-xs text-[#8EFF01] truncate">
                        {visibleTestimonials[0].name}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-white/55 font-normal truncate">
                        {visibleTestimonials[0].role} • <span className="text-white/80 font-medium">{visibleTestimonials[0].company}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Multi-card continuous sliding track
            <div
              className="flex flex-row items-stretch select-none"
              style={{
                transform: `translateX(${currentTranslateX}px)`,
                transition: isDragging || isSilentJump
                  ? 'none'
                  : 'transform 0.48s cubic-bezier(0.16, 1, 0.3, 1)',
                gap: `${gap}px`,
                willChange: 'transform',
              }}
            >
              {displayItems.map((t, idx) => {
                const isActive = idx === virtualIndex;

                return (
                  <div
                    key={`${t.id}-clone-${idx}`}
                    style={{
                      width: `${cardWidth}px`,
                      flexShrink: 0,
                    }}
                    onClick={(e) => {
                      if (isSwipingRef.current) {
                        e.stopPropagation();
                        return;
                      }
                      if (idx > virtualIndex) {
                        handleNextWithPause();
                      } else if (idx < virtualIndex) {
                        handlePrevWithPause();
                      }
                    }}
                    className={`group relative rounded-xl sm:rounded-2xl glass-panel p-5 sm:p-6 md:p-8 flex flex-col justify-between cursor-default transition-all duration-300 bg-[#050505]/95 border ${
                      isActive
                        ? 'border-[#8EFF01]/40 opacity-100 shadow-[0_0_28px_rgba(142,255,1,0.08),0_10px_40px_rgba(0,0,0,0.85)] z-20'
                        : 'border-white/[0.08] opacity-40 shadow-none z-10'
                    }`}
                  >
                    <div>
                      {/* Header inside card: Stars & Project Badge */}
                      <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                        <div className="flex text-[#8EFF01] gap-0.5">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current group-hover:scale-110 transition-transform"
                            />
                          ))}
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[#FEFFFC]/80 group-hover:border-[#8EFF01]/30 transition-colors">
                          {t.projectType}
                        </span>
                      </div>

                      {/* Quote text */}
                      <p className="font-baskervville italic text-xs sm:text-[13px] md:text-sm text-[#FEFFFC]/90 leading-relaxed mb-3 sm:mb-4 font-normal">
                        “{t.comment}”
                      </p>
                    </div>

                    {/* Author Footer */}
                    <div className="pt-2.5 sm:pt-3 border-t border-white/[0.06] flex items-center gap-2.5">
                      <img
                        src={t.avatar}
                        alt={t.avatarAlt || `${t.name} – ${t.role} at ${t.company}`}
                        width="32"
                        height="32"
                        loading="lazy"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white/20 group-hover:border-[#8EFF01]/50 transition-colors shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h4 className="font-montserrat font-medium italic text-[11px] sm:text-xs text-[#8EFF01] truncate">
                          {t.name}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-white/55 font-normal truncate">
                          {t.role} • <span className="text-white/80 font-medium">{t.company}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dot Indicators & Navigation Controls */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={handlePrevWithPause}
              aria-label="Previous testimonial"
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 text-white/70 hover:text-[#8EFF01] flex items-center justify-center transition-all cursor-pointer mr-1 shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {visibleTestimonials.map((_, dotIdx) => {
                const isActive = dotIdx === activeActualIndex;
                return (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => handleDotClick(dotIdx)}
                    aria-label={`Go to testimonial ${dotIdx + 1} of ${total}`}
                    className="group relative p-1.5 flex items-center justify-center cursor-pointer min-h-[36px] min-w-[24px] focus:outline-none"
                  >
                    <span
                      className={`block h-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-7 sm:w-8 bg-[#8EFF01] shadow-[0_0_12px_rgba(142,255,1,0.65)]'
                          : 'w-2 bg-white/20 group-hover:bg-white/40'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNextWithPause}
              aria-label="Next testimonial"
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 text-white/70 hover:text-[#8EFF01] flex items-center justify-center transition-all cursor-pointer ml-1 shadow-sm active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
          </>
        )}
      </div>
    </section>
  );
};
