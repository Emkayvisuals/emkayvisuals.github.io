import React from 'react';
import { PORTFOLIO_CONTENT, usePortfolio } from '../data/portfolioContent';
import { Sparkles } from 'lucide-react';

export const Marquee: React.FC = () => {
  const { content, isReady } = usePortfolio();

  if (content.marqueeSection?.enabled === false) {
    return null;
  }

  const items = content.hero?.marqueeTicker || [];

  if (!isReady) {
    return (
      <div className="relative w-full overflow-hidden py-3 sm:py-3.5 border-y border-white/[0.08] bg-[#050505]">
        <div className="flex items-center gap-6 px-4 max-w-7xl mx-auto">
          {[140, 180, 160, 200, 150].map((w, idx) => (
            <div
              key={idx}
              className="h-5 rounded bg-white/5 relative overflow-hidden"
              style={{ width: `${w}px` }}
            >
              <div className="animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  // Duplicate for seamless loop
  const displayItems = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-3 sm:py-3.5 border-y border-white/[0.08] bg-[#050505]">
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#050505] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#050505] to-transparent z-10" />

      <div className="animate-marquee flex items-center gap-5 sm:gap-8 whitespace-nowrap">
        {displayItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-4 sm:gap-6 group cursor-default"
          >
            <span className="font-medium text-sm sm:text-base tracking-wide text-[#FEFFFC]/85 group-hover:text-[#8EFF01] transition-colors duration-300 font-montserrat italic">
              {item}
            </span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#8EFF01] opacity-70 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#8116E0]"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
