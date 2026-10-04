import React from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { Sparkles, Cpu, CheckCircle2, User } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  const { about, brand } = PORTFOLIO_CONTENT;

  if (about?.enabled === false) {
    return null;
  }

  const badgeMain = about?.badgeMain || 'Behind the';
  const badgeAccent = about?.badgeAccent || 'Screen';
  const headingMain =
    about?.headingMain || 'Engineering Visual Worlds with Uncompromising';
  const headingAccent = about?.headingAccent || 'Precision';
  const bioParagraphs = about?.bioParagraphs || [];
  const artistIdLabel = about?.artistIdLabel || 'Artist ID // 2026.ev';
  const experienceBadge = about?.experienceBadge || '5+ Yrs Pro';
  const toolkitLabel = about?.toolkitLabel || 'Production Software & Toolkit';
  const statusCoordinates = about?.statusCoordinates || [
    'Worldwide / Remote',
    'Status: Active',
    '60 FPS Ready',
  ];

  const visibleHighlights = (about?.highlights || []).filter((item) => item.visible !== false);
  const visibleSoftwareTools = (about?.softwareTools || []).filter(
    (tool) => tool.visible !== false
  );

  return (
    <section id="about" className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute top-1/3 left-0 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full blur-[150px] opacity-[0.10]"
        style={{ background: '#8116E0' }}
      />
      <div
        className="pointer-events-none absolute bottom-10 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full blur-[150px] opacity-[0.06]"
        style={{ background: '#8EFF01' }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column: Photo Container with Futuristic Tech Frame */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center w-full"
        >
          <motion.div
            whileHover={{
              scale: 1.015,
              transition: { duration: 0.3, ease: 'easeOut' },
            }}
            className="relative w-full max-w-sm group"
          >
            {/* Violet ambient aura behind portrait */}
            <div
              className="absolute -inset-3 rounded-3xl blur-2xl opacity-20 group-hover:opacity-35 transition-opacity duration-500"
              style={{ background: 'linear-gradient(135deg, #8116E0, #8EFF01)' }}
            />

            {/* Futuristic Portrait Container */}
            <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/15 group-hover:border-[#8EFF01]/50 p-2 bg-[#050505] shadow-2xl transition-colors duration-300">
              {/* Tech Bracket Corners */}
              <div className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 border-[#8EFF01] z-20 group-hover:scale-110 transition-transform" />
              <div className="absolute top-3.5 right-3.5 w-4 h-4 border-t-2 border-r-2 border-[#8EFF01] z-20 group-hover:scale-110 transition-transform" />
              <div className="absolute bottom-3.5 left-3.5 w-4 h-4 border-b-2 border-l-2 border-[#8EFF01] z-20 group-hover:scale-110 transition-transform" />
              <div className="absolute bottom-3.5 right-3.5 w-4 h-4 border-b-2 border-r-2 border-[#8EFF01] z-20 group-hover:scale-110 transition-transform" />

              {/* Photo or Clean Vector Avatar */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#070707] flex items-center justify-center">
                {about.photoUrl ? (
                  <img
                    src={about.photoUrl}
                    alt={about.photoAlt || 'Emkay Visuals'}
                    width="400"
                    height="500"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/artist-avatar.svg';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0e0e0e] to-[#050505]">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#8EFF01]/10 border-2 border-[#8EFF01]/40 flex items-center justify-center mb-3.5 shadow-[0_0_24px_rgba(142, 255, 1, 0.11)] group-hover:scale-105 transition-transform">
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-[#8EFF01]" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#8EFF01] tracking-widest">{brand?.name || 'EMKAY VISUALS'}</span>
                    <span className="text-[10px] text-white/50 font-normal mt-1">{artistIdLabel}</span>
                  </div>
                )}

                {/* Cybernetic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />

                {/* Tag on bottom of image */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 p-2 sm:p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-semibold text-[#8EFF01] tracking-wide">
                      {artistIdLabel}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-[#FEFFFC]">
                      {brand.name}
                    </span>
                  </div>
                  {experienceBadge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#8116E0]/40 text-[#FEFFFC] border border-[#8116E0]/60">
                      {experienceBadge}
                    </span>
                  )}
                </div>
              </div>

              {/* Coordinates sub-bar */}
              {statusCoordinates && statusCoordinates.length > 0 && (
                <div className="px-3 py-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-white/45 font-medium">
                  {statusCoordinates.map((coord, cIdx) => (
                    <React.Fragment key={coord}>
                      {cIdx > 0 && <span>•</span>}
                      <span>{coord}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Bio & Core Philosophy */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#8EFF01] text-[11px] sm:text-xs font-semibold tracking-wide mb-3 w-fit">
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

          <h2 className="font-montserrat font-medium italic text-xl sm:text-3xl lg:text-4xl text-[#8EFF01] tracking-tight leading-[1.15] mb-4">
            {headingMain}{' '}
            <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
              {headingAccent}
            </span>
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-white/75 font-normal leading-relaxed mb-6">
            {bioParagraphs.map((paragraph, pIdx) => (
              <p key={pIdx}>{paragraph}</p>
            ))}
          </div>

          {/* Key Value Highlights */}
          {visibleHighlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {visibleHighlights.map((item) => (
                <motion.div
                  key={item.number}
                  whileHover={{ y: -3, scale: 1.015 }}
                  className="p-3 sm:p-3.5 rounded-2xl glass-panel border border-white/[0.07] hover:border-[#8EFF01]/40 transition-all cursor-default bg-[#050505]/70"
                >
                  <span className="text-[11px] font-bold text-[#8EFF01] block mb-1">
                    // <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em]">{item.number}</span>
                  </span>
                  <h4 className="font-montserrat font-medium italic text-xs sm:text-[13px] text-[#8EFF01] mb-0.5">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-white/60 font-normal leading-normal">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Software & Tech Stack - 2 columns on mobile */}
          {visibleSoftwareTools.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Cpu className="w-3.5 h-3.5 text-[#8EFF01]" />
                <span className="text-[11px] sm:text-xs font-semibold text-white/50 tracking-wide">
                  {toolkitLabel}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
                {visibleSoftwareTools.map((tool) => (
                  <motion.div
                    key={tool.name}
                    whileHover={{ y: -2, scale: 1.015 }}
                    className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#8EFF01]/40 transition-all flex flex-col justify-between cursor-default min-h-[40px] sm:min-h-[44px]"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-[#8EFF01]">
                        {tool.level}
                      </span>
                      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8116E0]" />
                    </div>
                    <span className="font-bold text-[11px] sm:text-xs md:text-sm text-[#FEFFFC] truncate">
                      {tool.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-white/45 font-normal mt-0.5 truncate">
                      {tool.type}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
