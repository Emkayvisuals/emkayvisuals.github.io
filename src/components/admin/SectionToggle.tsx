import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface SectionToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const SectionToggle: React.FC<SectionToggleProps> = ({
  label,
  checked,
  onChange,
  description,
}) => {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 mb-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
            checked
              ? 'bg-[#8EFF01]/15 text-[#8EFF01] border border-[#8EFF01]/30'
              : 'bg-white/5 text-white/40 border border-white/10'
          }`}
        >
          {checked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </div>
        <div>
          <span className="text-xs font-bold text-white block">{label}</span>
          {description && <span className="text-[11px] text-white/50">{description}</span>}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
          checked
            ? 'bg-[#8EFF01] text-black shadow-[0_0_12px_rgba(142, 255, 1, 0.22)]'
            : 'bg-white/10 text-white/60 hover:bg-white/15'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${checked ? 'bg-black' : 'bg-white/40'}`}
        />
        <span>{checked ? 'Visible on Site' : 'Hidden from Site'}</span>
      </button>
    </div>
  );
};
