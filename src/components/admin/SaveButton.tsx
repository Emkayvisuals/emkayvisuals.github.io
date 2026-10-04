import React from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface SaveButtonProps {
  onSave: () => void;
  state: 'idle' | 'saving' | 'saved' | 'error';
  label?: string;
  disabled?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onSave,
  state,
  label = 'Save Changes',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={state === 'saving' || disabled}
      className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer min-h-[38px] sm:min-h-[42px] shadow-sm shrink-0 whitespace-nowrap ${
        state === 'saving'
          ? 'bg-[#8EFF01]/50 text-black cursor-wait'
          : state === 'saved'
          ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
          : state === 'error'
          ? 'bg-rose-600 text-white'
          : 'bg-[#8EFF01] hover:bg-[#7DE000] text-[#050505] shadow-[0_0_15px_rgba(142, 255, 1, 0.19)] hover:shadow-[0_0_20px_rgba(142, 255, 1, 0.3)]'
      }`}
    >
      {state === 'saving' && (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-black shrink-0" />
          <span>Saving...</span>
        </>
      )}

      {state === 'saved' && (
        <>
          <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          <span className="hidden xs:inline">Saved to Firestore!</span>
          <span className="xs:hidden">Saved!</span>
        </>
      )}

      {state === 'error' && (
        <>
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
          <span className="hidden xs:inline">Save Failed — Retry</span>
          <span className="xs:hidden">Retry</span>
        </>
      )}

      {state === 'idle' && (
        <>
          <Save className="w-4 h-4 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
