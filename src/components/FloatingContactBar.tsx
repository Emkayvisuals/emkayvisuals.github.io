import React, { useState } from 'react';
import { PORTFOLIO_CONTENT, usePortfolio } from '../data/portfolioContent';
import { getResolvedSocialLinks, getPlatformMeta } from '../lib/socialLinks';
import { MessageSquare, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingContactBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { content, isReady } = usePortfolio();
  const { socials, contact, floatingContact } = content;

  // Don't render until Firestore is ready so no default links flash
  if (!isReady) {
    return null;
  }

  // If entire contact section is disabled, or if explicitly toggled off
  if (contact?.enabled === false || floatingContact?.enabled === false) {
    return null;
  }

  const quickConnectTitle = floatingContact?.title || 'Quick Connect';
  const resolvedLinks = getResolvedSocialLinks(socials).filter(
    (item) => item.visible !== false && item.isValid
  );

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Contact Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-72 max-h-[70vh] max-h-[70svh] overflow-y-auto rounded-2xl glass-panel border border-white/15 bg-[#080808]/95 backdrop-blur-xl p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col gap-2"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1 shrink-0">
              <span className="text-[11px] font-bold text-[#8EFF01] tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                {quickConnectTitle}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white/50 hover:text-white cursor-pointer"
                aria-label="Close Quick Connect"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {resolvedLinks.map((item, idx) => {
                const meta = getPlatformMeta(item.platform);
                const IconComp = meta.icon;
                const isExternal = !item.isMailto;

                return (
                  <a
                    key={item.id || idx}
                    href={item.url}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.06] transition-colors group min-h-[44px]"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${meta.cardBg}`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#FEFFFC] group-hover:text-[#8EFF01] transition-colors truncate">
                        {item.label || item.platform}
                      </span>
                      <span className="text-[10px] text-white/50 truncate">
                        {item.description || item.displayHandle}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        id="floating-contact-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Quick Contact"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="h-12 w-12 sm:h-13 sm:w-13 rounded-full bg-[#8EFF01] text-[#050505] shadow-[0_0_50px_rgba(142, 255, 1, 0.85)] hover:shadow-[0_0_70px_rgba(142, 255, 1, 1.0)] flex items-center justify-center cursor-pointer transition-shadow"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-[#050505]" />
        ) : (
          <div className="relative flex items-center justify-center">
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8116E0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8116E0]"></span>
            </span>
            <MessageSquare className="w-5 h-5 text-[#050505]" />
          </div>
        )}
      </motion.button>
    </div>
  );
};
