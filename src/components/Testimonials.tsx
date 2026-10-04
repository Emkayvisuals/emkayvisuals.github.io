import React from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { Star, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const Testimonials: React.FC = () => {
  const { testimonials, testimonialsSection } = PORTFOLIO_CONTENT;

  if (testimonialsSection?.enabled === false) {
    return null;
  }

  const badgeMain = testimonialsSection?.badgeMain || 'Client';
  const badgeAccent = testimonialsSection?.badgeAccent || 'Endorsements';
  const headingMain = testimonialsSection?.headingMain || 'Proven Track Record of';
  const headingAccent = testimonialsSection?.headingAccent || 'Excellence';
  const satisfactionText =
    testimonialsSection?.satisfactionText || '5.0 Average Client Satisfaction';

  const visibleTestimonials = (testimonials || []).filter((t) => t.visible !== false);

  return (
    <section className="relative py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
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
          <h2 className="font-montserrat font-medium italic text-xl sm:text-2xl lg:text-3xl text-[#8EFF01] tracking-tight leading-[1.15]">
            {headingMain}{' '}
            <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
              {headingAccent}
            </span>
          </h2>
        </div>
        {satisfactionText && (
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

      {/* Testimonials Grid - Compact, 30% reduced premium cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {visibleTestimonials.map((t, idx) => (
          <motion.div
            key={t.id}
            id={`testimonial-card-${t.id}`}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{
              duration: 0.4,
              delay: idx * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              y: -3,
              scale: 1.01,
              transition: { duration: 0.2, ease: 'easeOut' },
            }}
            className="group relative rounded-xl sm:rounded-2xl glass-panel border border-white/[0.08] hover:border-[#8EFF01]/40 p-3.5 sm:p-4 md:p-4.5 flex flex-col justify-between cursor-default transition-colors duration-300 bg-[#050505]/80"
          >
            <div>
              {/* Header inside card: Stars & Project Badge */}
              <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                <div className="flex text-[#8EFF01] gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current group-hover:scale-110 transition-transform" />
                  ))}
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[#FEFFFC]/80 group-hover:border-[#8EFF01]/30 transition-colors">
                  {t.projectType}
                </span>
              </div>

              {/* Quote text - Reduced by ~30% */}
              <p className="font-baskervville italic text-xs sm:text-[13px] text-[#FEFFFC]/90 leading-relaxed mb-3 sm:mb-3.5 font-normal">
                “{t.comment}”
              </p>
            </div>

            {/* Author Footer - Reduced by ~30% */}
            <div className="pt-2.5 sm:pt-3 border-t border-white/[0.06] flex items-center gap-2.5">
              <img
                src={t.avatar}
                alt={t.avatarAlt || `${t.name} – ${t.role} at ${t.company}`}
                width="28"
                height="28"
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
          </motion.div>
        ))}
      </div>
    </section>
  );
};
