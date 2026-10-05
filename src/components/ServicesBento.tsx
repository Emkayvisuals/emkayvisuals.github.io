import React from 'react';
import { PORTFOLIO_CONTENT, ServiceItem, usePortfolio } from '../data/portfolioContent';
import {
  Film,
  Clapperboard,
  Image as ImageIcon,
  Palette,
  Disc3,
  Wand2,
  Layers,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesBentoProps {
  onSelectService?: (serviceTitle: string) => void;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({ onSelectService }) => {
  const { content, isReady } = usePortfolio();
  const { services, servicesSection } = content;

  if (servicesSection?.enabled === false) {
    return null;
  }

  const badgeMain = servicesSection?.badgeMain || 'Disciplines &';
  const badgeAccent = servicesSection?.badgeAccent || 'Offerings';
  const headingMain = servicesSection?.headingMain || 'Specialized Creative';
  const headingAccent = servicesSection?.headingAccent || 'Services';
  const subtext =
    servicesSection?.subtext ||
    'From full theatrical key art packages to high-octane 4K motion graphics, I construct daring visual narratives that resonate with high-discerning audiences.';
  const cardButtonText = servicesSection?.cardButtonText || 'Request Quote';
  const refPrefix = servicesSection?.refPrefix || 'Ref //';

  const visibleServices = (services || []).filter((s) => s.visible !== false);

  // Icon mapping helper
  const getIcon = (name: string) => {
    switch (name) {
      case 'Film':
        return <Film className="w-5 h-5 text-[#8EFF01] group-hover:rotate-12 transition-transform duration-300" />;
      case 'Clapperboard':
        return <Clapperboard className="w-5 h-5 text-[#FEFFFC] group-hover:-rotate-12 transition-transform duration-300" />;
      case 'Image':
        return <ImageIcon className="w-5 h-5 text-[#8EFF01] group-hover:rotate-6 transition-transform duration-300" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-[#8116E0] group-hover:rotate-12 transition-transform duration-300" />;
      case 'Disc3':
        return <Disc3 className="w-5 h-5 text-[#8EFF01] group-hover:rotate-45 transition-transform duration-500" />;
      case 'Wand2':
        return <Wand2 className="w-5 h-5 text-[#FEFFFC] group-hover:rotate-12 transition-transform duration-300" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-[#8116E0] group-hover:scale-110 transition-transform duration-300" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#8EFF01] group-hover:rotate-45 transition-transform duration-300" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#8EFF01]" />;
    }
  };

  const handleInquire = (serviceTitle: string) => {
    if (onSelectService) {
      onSelectService(serviceTitle);
    }
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Section Glows */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.115]"
        style={{ background: '#8116E0' }}
      />
      <div
        className="pointer-events-none absolute bottom-10 right-1/4 w-[350px] h-[350px] rounded-full blur-[150px] opacity-[0.092]"
        style={{ background: '#8EFF01' }}
      />

      {/* Header with Smooth Scroll Fade/Slide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5"
      >
        <div>
          {!isReady ? (
            <div className="h-6 w-36 rounded-full bg-white/10 relative overflow-hidden mb-2.5">
              <div className="animate-shimmer" />
            </div>
          ) : (
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
          )}
          {!isReady ? (
            <div className="h-9 w-64 rounded-xl bg-white/10 relative overflow-hidden">
              <div className="animate-shimmer" />
            </div>
          ) : (
            <h2 className="font-montserrat font-medium italic text-xl sm:text-3xl lg:text-4xl text-[#8EFF01] tracking-tight leading-[1.15]">
              {headingMain}{' '}
              <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
                {headingAccent}
              </span>
            </h2>
          )}
        </div>
        {!isReady ? (
          <div className="h-4 w-72 rounded bg-white/5 relative overflow-hidden">
            <div className="animate-shimmer" />
          </div>
        ) : (
          <p className="max-w-md text-xs sm:text-sm text-white/70 font-normal leading-relaxed">
            {subtext}
          </p>
        )}
      </motion.div>

      {/* Bento Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-5">
        {!isReady ? (
          <>
            <div className="col-span-1 sm:col-span-2 lg:col-span-8 rounded-2xl sm:rounded-3xl glass-panel border border-white/[0.08] p-6 bg-[#050505]/90 min-h-[220px] relative overflow-hidden">
              <div className="animate-shimmer" />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-4 rounded-2xl sm:rounded-3xl glass-panel border border-white/[0.08] p-6 bg-[#050505]/90 min-h-[220px] relative overflow-hidden">
              <div className="animate-shimmer" />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-4 rounded-2xl sm:rounded-3xl glass-panel border border-white/[0.08] p-6 bg-[#050505]/90 min-h-[220px] relative overflow-hidden">
              <div className="animate-shimmer" />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-4 rounded-2xl sm:rounded-3xl glass-panel border border-white/[0.08] p-6 bg-[#050505]/90 min-h-[220px] relative overflow-hidden">
              <div className="animate-shimmer" />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-4 rounded-2xl sm:rounded-3xl glass-panel border border-white/[0.08] p-6 bg-[#050505]/90 min-h-[220px] relative overflow-hidden">
              <div className="animate-shimmer" />
            </div>
          </>
        ) : (
          visibleServices.map((service: ServiceItem, idx: number) => {
            const colSpanClass = service.colSpan?.includes('lg:col-span-8')
              ? 'sm:col-span-2 lg:col-span-8'
              : 'sm:col-span-1 lg:col-span-4';

          return (
            <motion.div
              key={service.id}
              id={`service-bento-${service.id}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: Math.min(idx * 0.06, 0.35),
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -4,
                scale: 1.01,
                transition: { duration: 0.2, ease: 'easeOut' },
              }}
              className={`group relative rounded-2xl sm:rounded-3xl glass-panel border border-white/[0.08] hover:border-[#8EFF01]/40 p-4 sm:p-5.5 flex flex-col justify-between overflow-hidden cursor-default bg-[#050505]/90 col-span-1 ${colSpanClass}`}
            >
              {/* Subtle top yellow glow line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#8EFF01]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Background ambient artwork on card hover */}
              {service.previewImage && (
                <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 overflow-hidden pointer-events-none">
                  <img
                    src={service.previewImage}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent" />
                </div>
              )}

              {/* Card Top: Tag + Icon */}
              <div className="relative z-10 flex items-center justify-between mb-3.5 sm:mb-4">
                <span className="text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[#FEFFFC]/80 tracking-wide group-hover:border-[#8EFF01]/30 transition-colors">
                  {service.tag}
                </span>

                <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:bg-[#8EFF01]/15 group-hover:border-[#8EFF01]/40 transition-all duration-300">
                  {getIcon(service.iconName)}
                </div>
              </div>

              {/* Card Middle: Title + Descriptions */}
              <div className="relative z-10 my-1">
                <h3 className="font-montserrat font-medium italic text-lg sm:text-xl text-[#8EFF01] tracking-tight mb-1.5">
                  {service.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-white/70 font-normal leading-relaxed mb-3">
                  {service.shortDesc}
                </p>

                {/* Deliverables tags */}
                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 my-2">
                    {service.deliverables.map((deliv, dIdx) => (
                      <span
                        key={dIdx}
                        className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-lg bg-black/50 border border-white/[0.06] text-white/80 group-hover:border-white/15 transition-colors"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#8EFF01] shrink-0" />
                        <span>{deliv}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Bottom: Inquire Action */}
              <div className="relative z-10 pt-2.5 mt-1.5 border-t border-white/[0.06] flex items-center justify-between min-h-[38px]">
                <span className="text-[11px] text-white/40 font-medium">
                  {refPrefix} <span className="font-baskervville italic text-[#FEFFFC]/70">0{idx + 1}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleInquire(service.title)}
                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#8EFF01] hover:text-[#FEFFFC] transition-colors py-1.5 px-1 cursor-pointer group/btn min-h-[38px]"
                >
                  <span>{cardButtonText}</span>
                  <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })
      )}
      </div>
    </section>
  );
};
