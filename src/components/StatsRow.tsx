import React, { useEffect, useState, useRef } from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { Award, Briefcase, Users, Zap } from 'lucide-react';
import { motion, useInView } from 'motion/react';

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  index: number;
}

const StatCounter: React.FC<StatCardProps> = ({ value, suffix, label, sublabel, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCount(value);
      return;
    }

    if (!isInView) return;

    const delay = index * 150; // 0.15s stagger
    const duration = 2000; // 2 seconds duration
    let startTime: number | null = null;
    let animationFrameId: number;

    const timeout = setTimeout(() => {
      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        // Smooth cubic ease-out function
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOutProgress * value);

        setCount(currentCount);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateCount);
        } else {
          setCount(value); // exact landing on target
        }
      };

      animationFrameId = requestAnimationFrame(updateCount);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, value, index]);

  const icons = [
    <Award className="w-5 h-5 text-[#8EFF01] group-hover:rotate-12 transition-transform duration-300" key="award" />,
    <Briefcase className="w-5 h-5 text-[#FEFFFC] group-hover:-rotate-12 transition-transform duration-300" key="briefcase" />,
    <Users className="w-5 h-5 text-[#8EFF01] group-hover:rotate-12 transition-transform duration-300" key="users" />,
    <Zap className="w-5 h-5 text-[#FEFFFC] group-hover:scale-110 transition-transform duration-300" key="zap" />,
  ];

  return (
    <motion.div
      ref={ref}
      id={`stat-card-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -4,
        scale: 1.015,
        transition: { duration: 0.2 },
      }}
      className="group relative rounded-2xl glass-panel p-4 sm:p-6 border border-white/[0.08] hover:border-[#8EFF01]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-default bg-[#050505]/80"
    >
      {/* Corner Tech Notch Indicator */}
      <div className="absolute top-0 right-0 w-7 h-7 border-t border-r border-white/10 group-hover:border-[#8EFF01]/50 transition-colors" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-white/40 group-hover:text-[#8EFF01] tracking-wide transition-colors">
          // <span className="font-cormorant italic font-medium text-[1.12em] text-[#FEFFFC]/70">0{index + 1}</span>
        </span>
        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] group-hover:bg-[#8EFF01]/15 group-hover:border-[#8EFF01]/40 transition-all duration-300">
          {icons[index % icons.length]}
        </div>
      </div>

      <div>
        <div className="font-montserrat font-medium italic text-3xl sm:text-4xl text-[#FEFFFC] tracking-tight group-hover:text-[#8EFF01] transition-colors duration-300 tabular-nums">
          {count}{suffix}
        </div>
        <div className="font-montserrat font-medium text-xs sm:text-base text-[#FEFFFC]/90 mt-1">
          {label}
        </div>
        <p className="text-[11px] sm:text-xs text-white/55 mt-1 leading-normal font-normal">
          {sublabel}
        </p>
      </div>
    </motion.div>
  );
};

export const StatsRow: React.FC = () => {
  const { stats, statsSection } = PORTFOLIO_CONTENT;

  if (statsSection?.enabled === false) {
    return null;
  }

  const visibleStats = (stats || []).filter((s) => s.visible !== false);
  if (visibleStats.length === 0) return null;

  return (
    <section className="relative py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* Background ambient glow - very subtle */}
      <div
        className="pointer-events-none absolute inset-x-12 top-1/2 -translate-y-1/2 h-24 blur-[120px] opacity-[0.098] rounded-full"
        style={{ background: 'linear-gradient(90deg, #8116E0, #8EFF01)' }}
      />

      {/* Grid: 2x2 on mobile, 4 on desktop */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {visibleStats.map((stat, idx) => (
          <StatCounter
            key={`${stat.label}-${idx}`}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            sublabel={stat.sublabel}
            index={idx}
          />
        ))}
      </div>
    </section>
  );
};
