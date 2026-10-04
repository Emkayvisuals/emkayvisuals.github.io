import React from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { getResolvedSocialLinks, getPlatformMeta } from '../lib/socialLinks';
import { ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';

export const Footer: React.FC = () => {
  const { footer, socials, navigation, brand } = PORTFOLIO_CONTENT;

  if (footer?.enabled === false) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleNav = (navigation || []).filter((item) => item.visible !== false);
  const resolvedLinks = getResolvedSocialLinks(socials).filter(
    (item) => item.visible !== false && item.isValid
  );

  return (
    <footer className="relative border-t border-white/10 bg-[#050505] pt-10 pb-7 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle top glow line */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, #8116E0, #8EFF01, transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col justify-between gap-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Brand Logo & Tagline */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              {brand?.logoUrl || footer?.logoUrl ? (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8EFF01]/10 border border-[#8EFF01]/40 overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(142, 255, 1, 0.45)] p-0.5">
                  <img
                    src={brand?.logoUrl || footer?.logoUrl}
                    alt={brand?.logoAlt || footer?.logoAlt || 'Emkay Visuals Logo'}
                    width="28"
                    height="28"
                    loading="lazy"
                    className="w-full h-full object-contain object-center block"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8EFF01] text-[#050505] font-extrabold flex items-center justify-center text-[11px] sm:text-xs shadow-[0_0_18px_rgba(142, 255, 1, 0.45)] shrink-0">
                  {footer?.logoAbbr || 'EV'}
                </div>
              )}
              <span className="font-extrabold text-base sm:text-lg tracking-wide text-[#FEFFFC]">
                {brand?.name ? (
                  <>
                    {brand.name.split(' ')[0]}{' '}
                    <span className="text-[#8EFF01]">//</span>{' '}
                    {brand.name.split(' ').slice(1).join(' ')}
                  </>
                ) : (
                  <>Emkay <span className="text-[#8EFF01]">//</span> Visuals</>
                )}
              </span>
            </div>
            <p className="font-cormorant italic font-medium sm:font-semibold text-[1.05em] text-white/70 font-normal leading-relaxed">
              {footer?.tagline}
            </p>
          </div>

          {/* Nav Quick Links */}
          {visibleNav.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {visibleNav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[11px] font-medium text-white/60 hover:text-[#8EFF01] transition-colors py-1 min-h-[32px] flex items-center"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          {/* Dynamic Social Links - Icon Only with Staggered Viewport Fade-In */}
          <div className="social-links-container flex flex-wrap items-center gap-2">
            {resolvedLinks.map((item, idx) => {
              const meta = getPlatformMeta(item.platform);
              const IconComp = meta.icon;
              const isExternal = !item.isMailto;
              const accentColor = meta.accentColor || '#8EFF01';

              return (
                <motion.a
                  key={item.id || idx}
                  href={item.url}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  aria-label={item.label || item.platform}
                  title={`${item.label} (${item.displayHandle})`}
                  id={`footer-social-${item.platform.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx}`}
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.05,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  style={
                    {
                      '--hover-accent': accentColor,
                    } as React.CSSProperties
                  }
                  className={`group relative w-9 h-9 sm:w-9.5 sm:h-9.5 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 ${meta.hoverBorder} hover:bg-white/[0.09] hover:scale-110 active:scale-95 transition-all duration-300 ease-out text-white/75 hover:shadow-[0_0_22px_rgba(142, 255, 1, 0.35)] shrink-0 min-h-[38px] min-w-[38px] cursor-pointer`}
                >
                  <IconComp className="w-4 h-4 text-white/75 group-hover:text-[var(--hover-accent)] group-hover:scale-110 transition-all duration-300 ease-out" />
                </motion.a>
              );
            })}

            {/* Back to top */}
            <motion.button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to Top"
              initial={{ opacity: 0, y: 12, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{
                duration: 0.45,
                delay: resolvedLinks.length * 0.05,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="w-9 h-9 sm:w-9.5 sm:h-9.5 flex items-center justify-center rounded-full bg-[#8EFF01] text-[#050505] hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(142, 255, 1, 0.45)] hover:shadow-[0_0_30px_rgba(142, 255, 1, 0.65)] cursor-pointer ml-1 shrink-0 min-h-[38px] min-w-[38px]"
            >
              <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </motion.button>
          </div>
        </div>

        {/* Bottom Copyright & Rights */}
        <div className="pt-4.5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-white/40 font-normal">
          <div>{footer?.copyright}</div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8EFF01]"></span>
            <span>{footer?.rightsNote}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
