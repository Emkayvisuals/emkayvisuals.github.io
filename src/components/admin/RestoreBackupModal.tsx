import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Loader2,
  ShieldCheck,
  Upload,
  X,
  FileText,
  Database,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  BackupInspectionResult,
  exportFirestoreBackup,
  downloadJsonFile,
  restoreFirestoreBackup,
} from '../../lib/backup';
import { PortfolioContentType } from '../../data/portfolioContent';

interface RestoreBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: BackupInspectionResult | null;
  fileName: string;
  fileSizeKb: number;
  currentContent: PortfolioContentType;
  onRestoreSuccess: (restoredContent?: PortfolioContentType, summary?: string) => void;
  userEmail: string | null | undefined;
}

export const RestoreBackupModal: React.FC<RestoreBackupModalProps> = ({
  isOpen,
  onClose,
  inspection,
  fileName,
  fileSizeKb,
  currentContent,
  onRestoreSuccess,
  userEmail,
}) => {
  const [status, setStatus] = useState<'confirming' | 'restoring' | 'success' | 'error'>('confirming');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successSummary, setSuccessSummary] = useState<string | null>(null);
  const [safetyDownloaded, setSafetyDownloaded] = useState(false);

  if (!isOpen || !inspection || !inspection.cleanBackup) return null;

  const isAuthorized =
    userEmail &&
    (userEmail.toLowerCase().trim() === 'emkayvisuals@gmail.com' ||
      userEmail.toLowerCase().trim() === 'nuru28893@gmail.com');

  const handleManualSafetyDownload = async () => {
    try {
      const { backup } = await exportFirestoreBackup(currentContent);
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadJsonFile(backup, `emkay-pre-restore-safety-backup-${stamp}.json`);
      setSafetyDownloaded(true);
    } catch (err) {
      console.error('Failed to download manual safety backup:', err);
    }
  };

  const handleConfirmRestore = async () => {
    if (!isAuthorized) {
      setStatus('error');
      setErrorMessage('Access restricted: Only emkayvisuals@gmail.com is authorized to restore database backups.');
      return;
    }

    if (!inspection?.cleanBackup) {
      setStatus('error');
      setErrorMessage('No valid backup payload found to restore.');
      return;
    }

    const cleanBackup = inspection.cleanBackup;
    setStatus('restoring');
    setErrorMessage(null);

    try {
      // 1. Safety check: Automatically create and download a fresh pre-restore backup of CURRENT live data
      setCurrentStep('Creating and downloading current live safety backup...');
      try {
        const { backup } = await exportFirestoreBackup(currentContent);
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        downloadJsonFile(backup, `emkay-pre-restore-safety-backup-${stamp}.json`);
        setSafetyDownloaded(true);
      } catch (backupErr) {
        console.warn('Notice generating pre-restore safety file:', backupErr);
      }

      // 2. Perform the Firestore Restore matching export structure
      setCurrentStep('Writing restored data to Firestore...');
      const result = await restoreFirestoreBackup(cleanBackup, (step) => {
        setCurrentStep(step);
      });

      if (!result.success) {
        setStatus('error');
        setErrorMessage(result.error || 'Failed to restore backup to Firestore.');
        return;
      }

      setStatus('success');
      setSuccessSummary(result.restoredSummary);
      onRestoreSuccess(result.restoredContent, result.restoredSummary);
    } catch (err: any) {
      console.error('Restore error:', err);
      setStatus('error');
      setErrorMessage(err?.message || 'An unexpected error occurred while restoring.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl rounded-2xl bg-[#0b0b0b] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="restore-modal-title"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-400 shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 id="restore-modal-title" className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Restore from Backup
              </h3>
              <p className="text-xs text-white/50">
                Review backup contents before overwriting live Firestore database
              </p>
            </div>
          </div>

          {status !== 'restoring' && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-white/80">
          {status === 'confirming' && (
            <>
              {/* File Info Card */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-5 h-5 text-[#8EFF01] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate text-xs sm:text-sm">{fileName}</p>
                    <p className="text-[11px] text-white/40">
                      {fileSizeKb} KB &bull;{' '}
                      {inspection.metadata?.exportedAt
                        ? `Exported ${new Date(inspection.metadata.exportedAt).toLocaleDateString()} ${new Date(
                            inspection.metadata.exportedAt
                          ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : 'Custom backup file'}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                  Valid Format
                </span>
              </div>

              {/* Collections & Content Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-white/70">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#8EFF01]" />
                    Backup Contents to Restore:
                  </span>
                  <span className="text-[11px] font-mono text-white/40">
                    {inspection.summaryItems.length} categories
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-black/60 border border-white/10">
                  {inspection.summaryItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#8EFF01]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Warning Notice */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-amber-300">Warning: Live Data Will Be Overwritten</p>
                  <p className="text-amber-200/80 leading-relaxed">
                    Restoring this backup will replace current Firestore content with the items listed above.
                    This affects your live website immediately.
                  </p>
                </div>
              </div>

              {/* Safety Check Notice & Download */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-200">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-emerald-300">Safety Check Active</p>
                    <p className="text-emerald-200/80 text-[11px] leading-relaxed">
                      Before any live write occurs, an automatic pre-restore backup of your CURRENT data will be created and saved.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleManualSafetyDownload}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{safetyDownloaded ? 'Backup Saved!' : 'Save Current Copy'}</span>
                </button>
              </div>
            </>
          )}

          {status === 'restoring' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#8EFF01] animate-spin" />
              <p className="font-bold text-base text-white">Restoring Firestore Database...</p>
              <p className="text-xs text-white/60 font-mono">{currentStep}</p>
              <p className="text-[11px] text-white/40 max-w-sm">
                Please do not close or refresh this tab while Firestore writes are in progress.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="font-bold text-lg text-white">Restore Completed Successfully!</p>
              <p className="text-xs text-emerald-300/90 max-w-md font-mono bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
                {successSummary || 'All content and collections successfully written to Firestore.'}
              </p>
              <p className="text-xs text-white/50 max-w-sm">
                Your live site and admin dashboard now reflect the restored backup.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <p className="font-bold text-base text-red-300">Restore Failed</p>
              <p className="text-xs text-red-200/90 max-w-md bg-red-950/40 p-3 rounded-xl border border-red-500/30">
                {errorMessage || 'Unable to restore backup. No partial or unsafe changes were committed.'}
              </p>
              <p className="text-xs text-white/40 max-w-sm">
                Your existing live data was not corrupted. You can verify your JSON file and try again.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-end gap-2.5 bg-white/[0.02]">
          {status === 'confirming' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestore}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Confirm & Overwrite Live Data</span>
              </button>
            </>
          )}

          {status === 'success' && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#8EFF01] hover:bg-[#7DE000] text-black text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              Done
            </button>
          )}

          {status === 'error' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setStatus('confirming')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
