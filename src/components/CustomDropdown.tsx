import React, { useState, useEffect, useRef, useId } from 'react';
import {
  Palette,
  Sparkles,
  Layers,
  Film,
  Wand2,
  Disc,
  MonitorPlay,
  Flame,
  Package,
  ChevronDown,
  Check,
  X,
  LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface DropdownOption {
  value: string;
  label?: string;
  description?: string;
  icon?: LucideIcon;
}

export interface CustomDropdownProps {
  id?: string;
  name?: string;
  label?: string;
  options: (string | DropdownOption)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  modalTitle?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Resolves small round icon and color badge for any service option.
 * Covers: poster, flyer, branding, movie, photo, music, thumbnail, motion, package, and custom titles.
 */
export function getServiceIconMeta(serviceName: string): {
  icon: LucideIcon;
  accentColor: string;
  badgeBg: string;
  type: string;
} {
  const lower = (serviceName || '').toLowerCase();

  if (lower.includes('poster') || lower.includes('print')) {
    return {
      icon: Palette,
      accentColor: '#00D2FF',
      badgeBg: 'bg-[#00D2FF]/15 text-[#00D2FF] border-[#00D2FF]/30',
      type: 'poster',
    };
  }
  if (lower.includes('flyer') || lower.includes('event') || lower.includes('club') || lower.includes('party')) {
    return {
      icon: Sparkles,
      accentColor: '#FF8A00',
      badgeBg: 'bg-[#FF8A00]/15 text-[#FF8A00] border-[#FF8A00]/30',
      type: 'flyer',
    };
  }
  if (lower.includes('brand') || lower.includes('identity') || lower.includes('logo')) {
    return {
      icon: Layers,
      accentColor: '#8116E0',
      badgeBg: 'bg-[#8116E0]/20 text-[#8EFF01] border-[#8116E0]/40',
      type: 'branding',
    };
  }
  if (
    lower.includes('movie') ||
    lower.includes('theatrical') ||
    lower.includes('key art') ||
    lower.includes('film') ||
    lower.includes('cinema')
  ) {
    return {
      icon: Film,
      accentColor: '#FF3366',
      badgeBg: 'bg-[#FF3366]/15 text-[#FF3366] border-[#FF3366]/30',
      type: 'movie',
    };
  }
  if (
    lower.includes('photo') ||
    lower.includes('manipulation') ||
    lower.includes('composite') ||
    lower.includes('retouch')
  ) {
    return {
      icon: Wand2,
      accentColor: '#00FF9D',
      badgeBg: 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/30',
      type: 'photo',
    };
  }
  if (
    lower.includes('music') ||
    lower.includes('album') ||
    lower.includes('cover') ||
    lower.includes('song') ||
    lower.includes('track') ||
    lower.includes('audio')
  ) {
    return {
      icon: Disc,
      accentColor: '#A855F7',
      badgeBg: 'bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/30',
      type: 'music',
    };
  }
  if (
    lower.includes('thumbnail') ||
    lower.includes('youtube') ||
    lower.includes('ctr') ||
    lower.includes('creator')
  ) {
    return {
      icon: MonitorPlay,
      accentColor: '#FF0033',
      badgeBg: 'bg-[#FF0033]/15 text-[#FF0033] border-[#FF0033]/30',
      type: 'thumbnail',
    };
  }
  if (
    lower.includes('motion') ||
    lower.includes('animation') ||
    lower.includes('video') ||
    lower.includes('reel')
  ) {
    return {
      icon: Flame,
      accentColor: '#8EFF01',
      badgeBg: 'bg-[#8EFF01]/15 text-[#8EFF01] border-[#8EFF01]/30',
      type: 'motion',
    };
  }
  if (
    lower.includes('package') ||
    lower.includes('campaign') ||
    lower.includes('full') ||
    lower.includes('bundle') ||
    lower.includes('suite')
  ) {
    return {
      icon: Package,
      accentColor: '#FFD700',
      badgeBg: 'bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]/30',
      type: 'package',
    };
  }

  // Generic fallback
  return {
    icon: Sparkles,
    accentColor: '#8EFF01',
    badgeBg: 'bg-[#8EFF01]/15 text-[#8EFF01] border-[#8EFF01]/30',
    type: 'default',
  };
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  id,
  name,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select a service...',
  required = false,
  error,
  modalTitle = 'Select a Service',
  className = '',
  disabled = false,
}) => {
  const generatedId = useId();
  const dropdownId = id || `custom-dropdown-${generatedId}`;
  const listboxId = `${dropdownId}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  // Normalize options to objects
  const normalizedOptions: DropdownOption[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return {
      value: opt.value,
      label: opt.label || opt.value,
      description: opt.description,
      icon: opt.icon,
    };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const selectedMeta = selectedOption
    ? getServiceIconMeta(selectedOption.value)
    : null;
  const SelectedIcon = selectedOption?.icon || selectedMeta?.icon;

  // Detect mobile viewport (under 640px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock body scroll when mobile bottom sheet is open
  useEffect(() => {
    if (isOpen && isMobile) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, isMobile]);

  // Click outside to close (desktop)
  useEffect(() => {
    if (!isOpen) return;

    const handleDocumentClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [isOpen]);

  // Keep highlightedIndex synced with current selection when opened
  useEffect(() => {
    if (isOpen) {
      const idx = normalizedOptions.findIndex((opt) => opt.value === value);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, value, normalizedOptions]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < normalizedOptions.length - 1 ? prev + 1 : 0
        );
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : normalizedOptions.length - 1
        );
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (normalizedOptions[highlightedIndex]) {
          handleSelect(normalizedOptions[highlightedIndex].value);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      }
      case 'Tab': {
        setIsOpen(false);
        break;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label
          id={`${dropdownId}-label`}
          htmlFor={dropdownId}
          className="block text-xs font-medium text-white/70 mb-2 tracking-wide font-montserrat"
        >
          {label}
        </label>
      )}

      {/* Hidden input for native form serialization & validation */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
          required={required}
          aria-hidden="true"
        />
      )}

      {/* Trigger button */}
      <button
        type="button"
        id={dropdownId}
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={label ? `${dropdownId}-label ${dropdownId}` : dropdownId}
        role="combobox"
        className={`w-full min-h-[50px] px-3.5 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl bg-[#0e0e0e] border text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer select-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${
          error
            ? 'border-red-500 ring-1 ring-red-500/40'
            : isOpen
            ? 'border-[#8EFF01] ring-1 ring-[#8EFF01] shadow-[0_0_18px_rgba(142, 255, 1, 0.16)]'
            : 'border-white/12 hover:border-white/25 focus:border-[#8EFF01] focus:ring-1 focus:ring-[#8EFF01] focus:shadow-[0_0_18px_rgba(142, 255, 1, 0.16)] focus:outline-none'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {selectedOption ? (
            <>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  selectedMeta?.badgeBg || 'bg-[#8EFF01]/15 text-[#8EFF01] border-[#8EFF01]/30'
                }`}
              >
                {SelectedIcon ? (
                  <SelectedIcon className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>
              <span className="font-montserrat font-medium text-sm sm:text-base text-[#FEFFFC] truncate">
                {selectedOption.label}
              </span>
            </>
          ) : (
            <span className="font-montserrat font-normal text-sm sm:text-base text-white/35 truncate">
              {placeholder}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-[#8EFF01]' : 'text-white/60'
          }`}
        />
      </button>

      {error && (
        <span className="text-[11px] text-red-400 mt-1 block font-montserrat">
          {error}
        </span>
      )}

      {/* ========================================================= */}
      {/* DESKTOP DROPDOWN (Directly under trigger with violet glow) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            id={listboxId}
            ref={listboxRef}
            role="listbox"
            aria-labelledby={label ? `${dropdownId}-label` : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-2 z-50 rounded-[20px] bg-[#0B0B0B]/95 backdrop-blur-xl border border-white/15 shadow-[0_15px_45px_rgba(129,22,224,0.25),0_0_25px_rgba(129,22,224,0.18)] max-h-80 overflow-y-auto p-2.5 space-y-1.5 focus:outline-none"
          >
            {normalizedOptions.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isHighlighted = idx === highlightedIndex;
              const meta = getServiceIconMeta(opt.value);
              const OptionIcon = opt.icon || meta.icon;

              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  id={`${dropdownId}-opt-${idx}`}
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.025 }}
                  className={`w-full min-h-[52px] px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 text-left transition-all duration-150 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#8EFF01]/12 border-[#8EFF01]/60 text-[#8EFF01] shadow-[0_0_12px_rgba(142, 255, 1, 0.09)]'
                      : isHighlighted
                      ? 'bg-white/[0.08] border-[#8EFF01]/40 text-white'
                      : 'bg-white/[0.02] border-transparent hover:bg-white/[0.06] hover:border-[#8EFF01]/30 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-[#8EFF01]/25 text-[#8EFF01] border-[#8EFF01]/60'
                          : meta.badgeBg
                      }`}
                    >
                      <OptionIcon className="w-4 h-4" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span
                        className={`font-montserrat text-sm truncate ${
                          isSelected ? 'font-medium text-[#8EFF01]' : 'font-normal text-white'
                        }`}
                      >
                        {opt.label}
                      </span>
                      {opt.description && (
                        <span className="text-[11px] text-white/45 truncate">
                          {opt.description}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#8EFF01]/20 border border-[#8EFF01] flex items-center justify-center text-[#8EFF01] shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM SHEET (Slides up with blurred backdrop)   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            {/* Dimmed Blurred Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              aria-hidden="true"
            />

            {/* Bottom Sheet Card */}
            <motion.div
              id={listboxId}
              ref={listboxRef}
              role="listbox"
              aria-labelledby={`${dropdownId}-sheet-title`}
              tabIndex={-1}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 w-full max-h-[70vh] max-h-[70svh] rounded-t-[28px] bg-[#0B0B0B] border-t border-x border-white/15 p-4 sm:p-6 pb-8 shadow-[0_-15px_40px_rgba(0,0,0,0.95)] flex flex-col focus:outline-none"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-white/25 rounded-full mx-auto mb-3 shrink-0" />

              {/* Sheet Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8EFF01]" />
                  <h3
                    id={`${dropdownId}-sheet-title`}
                    className="font-montserrat font-medium text-base text-[#FEFFFC] tracking-wide"
                  >
                    {modalTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer min-h-[32px] min-w-[32px]"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sheet Options Scroll List */}
              <div className="overflow-y-auto overscroll-contain flex-1 space-y-2 pr-0.5 py-1">
                {normalizedOptions.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  const meta = getServiceIconMeta(opt.value);
                  const OptionIcon = opt.icon || meta.icon;

                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      id={`${dropdownId}-mob-opt-${idx}`}
                      onClick={() => handleSelect(opt.value)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: idx * 0.025 }}
                      className={`w-full min-h-[52px] px-4 py-3 rounded-xl flex items-center justify-between gap-3 text-left transition-all duration-150 cursor-pointer border ${
                        isSelected
                          ? 'bg-[#8EFF01]/12 border-[#8EFF01]/70 text-[#8EFF01] shadow-[0_0_12px_rgba(142, 255, 1, 0.11)]'
                          : 'bg-white/[0.03] border-white/8 active:bg-white/[0.08] active:border-[#8EFF01]/40 text-white/85'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-[#8EFF01]/20 text-[#8EFF01] border-[#8EFF01]/50'
                              : meta.badgeBg
                          }`}
                        >
                          <OptionIcon className="w-4 h-4" />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span
                            className={`font-montserrat text-sm truncate ${
                              isSelected ? 'font-medium text-[#8EFF01]' : 'font-normal text-white'
                            }`}
                          >
                            {opt.label}
                          </span>
                          {opt.description && (
                            <span className="text-xs text-white/50 truncate">
                              {opt.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#8EFF01]/20 border border-[#8EFF01] flex items-center justify-center text-[#8EFF01] shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
