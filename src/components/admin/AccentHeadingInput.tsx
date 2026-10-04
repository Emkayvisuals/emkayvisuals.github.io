import React from 'react';

interface AccentHeadingInputProps {
  label: string;
  mainValue: string;
  accentValue?: string;
  onMainChange: (val: string) => void;
  onAccentChange: (val: string) => void;
  mainPlaceholder?: string;
  accentPlaceholder?: string;
  isBadge?: boolean;
}

export const AccentHeadingInput: React.FC<AccentHeadingInputProps> = ({
  label,
  mainValue,
  accentValue = '',
  onMainChange,
  onAccentChange,
  mainPlaceholder = 'e.g. Featured Creative',
  accentPlaceholder = 'e.g. Masterpieces',
  isBadge = false,
}) => {
  return (
    <div className="space-y-2 p-4 rounded-xl bg-black/40 border border-white/10">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#8EFF01] tracking-wide flex items-center gap-1.5">
          {label}
        </label>
        <span className="text-[10px] text-white/40">Main + Italic Serif Accent</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] text-white/60 block mb-1">
            Main Text {isBadge ? '(Default Font)' : '(Bold Geometric)'}
          </label>
          <input
            type="text"
            value={mainValue || ''}
            onChange={(e) => onMainChange(e.target.value)}
            placeholder={mainPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-lg bg-black/70 border border-white/10 focus:border-[#8EFF01] text-xs text-white placeholder-white/20 outline-none"
          />
        </div>

        <div>
          <label className="text-[11px] text-white/60 block mb-1">
            Accent Words (Rendered in Italic Serif)
          </label>
          <input
            type="text"
            value={accentValue || ''}
            onChange={(e) => onAccentChange(e.target.value)}
            placeholder={accentPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-lg bg-black/70 border border-[#8116E0]/40 focus:border-[#8EFF01] text-xs text-[#FEFFFC] placeholder-white/20 outline-none font-cormorant italic"
          />
        </div>
      </div>

      {/* Live optical preview */}
      <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2">
        <span className="text-[10px] uppercase text-white/30 tracking-wider">Preview:</span>
        <div
          className={
            isBadge
              ? 'inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#8EFF01] text-xs font-semibold'
              : 'font-montserrat font-medium italic text-base sm:text-lg text-[#8EFF01]'
          }
        >
          <span>{mainValue || 'Sample Text'}</span>
          {accentValue && (
            <span className="font-cormorant italic font-medium text-[1.12em] text-[#FEFFFC] ml-1">
              {accentValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
