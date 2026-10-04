import React, { useState, useEffect, useRef } from 'react';
import {
  PORTFOLIO_CONTENT,
  DEFAULT_PORTFOLIO_CONTENT,
  savePortfolioToFirestore,
  resetPortfolioToDefault,
  deepMerge,
  notifyListeners,
  PortfolioContentType,
} from '../data/portfolioContent';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  Shield,
  LogOut,
  RotateCcw,
  BarChart2,
  MessageSquareText,
  Layers,
  FileText,
  Globe,
  Star,
  Users,
  Phone,
  Layout,
  Sparkles,
  Lock,
  AlertCircle,
  HelpCircle,
  PanelBottom,
  GitCommit,
  AlertTriangle,
  ArrowLeft,
  Download,
  Loader2,
  Check,
  Database,
  Video,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';
import { AdminTabId } from './admin/types';
import { SaveButton } from './admin/SaveButton';
import { exportFirestoreBackup, downloadJsonFile } from '../lib/backup';

// Tab components
import { AdminAnalyticsTab } from './admin/AdminAnalyticsTab';
import { AdminBriefsTab } from './admin/AdminBriefsTab';
import { AdminSeoTab } from './admin/AdminSeoTab';
import { AdminPreloaderNavTab } from './admin/AdminPreloaderNavTab';
import { AdminHeroTab } from './admin/AdminHeroTab';
import { AdminStatsTab } from './admin/AdminStatsTab';
import { AdminServicesTab } from './admin/AdminServicesTab';
import { AdminProjectsTab } from './admin/AdminProjectsTab';
import { AdminAboutTab } from './admin/AdminAboutTab';
import { AdminProcessTab } from './admin/AdminProcessTab';
import { AdminTestimonialsTab } from './admin/AdminTestimonialsTab';
import { AdminFaqTab } from './admin/AdminFaqTab';
import { AdminContactTab } from './admin/AdminContactTab';
import { AdminFooterTab } from './admin/AdminFooterTab';
import { AdminYoutubeGalleryTab } from './admin/AdminYoutubeGalleryTab';

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Content state & unsaved tracking
  const [initialContentJson, setInitialContentJson] = useState<string>(
    JSON.stringify(PORTFOLIO_CONTENT)
  );
  const [content, setContent] = useState<PortfolioContentType>(
    JSON.parse(JSON.stringify(PORTFOLIO_CONTENT))
  );
  const [contentLoading, setContentLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<AdminTabId>('analytics');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [savedSectionName, setSavedSectionName] = useState<string | null>(null);

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [briefsList, setBriefsList] = useState<any[]>([]);

  // Backup state
  const [backupState, setBackupState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [backupSummary, setBackupSummary] = useState<string | null>(null);

  // Mobile More Options dropdown state
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile options dropdown on click/touch outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    if (moreMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [moreMenuOpen]);

  // Check if there are unsaved edits
  const hasUnsavedChanges = JSON.stringify(content) !== initialContentJson;

  // Unsaved changes browser warning on tab close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Load live Firestore content immediately on mount to prevent stale/default overrides
  useEffect(() => {
    const loadLiveContent = async () => {
      try {
        const portfolioDocRef = doc(db, 'portfolio', 'content');
        const portfolioSnap = await getDoc(portfolioDocRef);
        if (portfolioSnap.exists()) {
          const liveData = portfolioSnap.data();
          const merged = deepMerge(DEFAULT_PORTFOLIO_CONTENT, liveData);
          setContent(merged);
          setInitialContentJson(JSON.stringify(merged));
          Object.assign(PORTFOLIO_CONTENT, merged);
          notifyListeners();
        }
      } catch (err) {
        console.warn('Notice loading live content from Firestore:', err);
      } finally {
        setContentLoading(false);
      }
    };
    loadLiveContent();
  }, []);

  // Auth listener: ONLY emkayvisuals@gmail.com
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(false);
      if (firebaseUser) {
        if (firebaseUser.email !== 'emkayvisuals@gmail.com') {
          setAccessDenied(true);
          await signOut(auth);
          setUser(null);
          window.location.href = '/';
        } else {
          setAccessDenied(false);
          setUser(firebaseUser);
          fetchAdminData();
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAdminData = async () => {
    // 1. Fetch live Portfolio Content from Firestore
    try {
      setContentLoading(true);
      const portfolioDocRef = doc(db, 'portfolio', 'content');
      const portfolioSnap = await getDoc(portfolioDocRef);
      if (portfolioSnap.exists()) {
        const liveData = portfolioSnap.data();
        const merged = deepMerge(DEFAULT_PORTFOLIO_CONTENT, liveData);
        setContent(merged);
        setInitialContentJson(JSON.stringify(merged));
        Object.assign(PORTFOLIO_CONTENT, merged);
        notifyListeners();
      } else {
        // Document does not exist in Firestore yet: use defaults
        setContent(JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_CONTENT)));
        setInitialContentJson(JSON.stringify(DEFAULT_PORTFOLIO_CONTENT));
      }
    } catch (err) {
      console.warn('Notice loading portfolio content from Firestore in fetchAdminData:', err);
    } finally {
      setContentLoading(false);
    }

    // 2. Fetch Analytics & Briefs
    try {
      const summarySnap = await getDoc(doc(db, 'analytics', 'summary'));
      if (summarySnap.exists()) {
        setAnalyticsData(summarySnap.data());
      }
      const briefsSnap1 = await getDocs(collection(db, 'briefs'));
      const briefsSnap2 = await getDocs(collection(db, 'projectBriefs'));
      const map = new Map();
      briefsSnap1.forEach((d) => {
        map.set(d.id, { id: d.id, ...d.data() });
      });
      briefsSnap2.forEach((d) => {
        if (!map.has(d.id)) {
          map.set(d.id, { id: d.id, ...d.data() });
        }
      });
      const briefs = Array.from(map.values());
      setBriefsList(
        briefs.sort(
          (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        )
      );
    } catch (err) {
      console.log('Error fetching analytics/briefs:', err);
    }
  };

  const handleUpdateBriefField = async (
    id: string,
    field: 'status' | 'notes',
    value: string
  ) => {
    try {
      await updateDoc(doc(db, 'briefs', id), { [field]: value });
    } catch (e) {
      try {
        await updateDoc(doc(db, 'projectBriefs', id), { [field]: value });
      } catch (err) {
        console.log('Error updating brief', err);
      }
    }
    setBriefsList(
      briefsList.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const handleDeleteBrief = async (id: string) => {
    if (!window.confirm('Delete this project brief permanently from Firestore?')) return;
    try {
      await deleteDoc(doc(db, 'briefs', id));
    } catch {
      try {
        await deleteDoc(doc(db, 'projectBriefs', id));
      } catch (err) {
        console.log('Error deleting brief', err);
      }
    }
    setBriefsList((prev) => prev.filter((b) => b.id !== id));
  };

  const handleGoogleLogin = async () => {
    try {
      setAccessDenied(false);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== 'emkayvisuals@gmail.com') {
        setAccessDenied(true);
        await signOut(auth);
        setUser(null);
        window.location.href = '/';
      } else {
        setUser(result.user);
        fetchAdminData();
      }
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Standardized Save Handler: Saving -> Saved/Error
  const handleSaveSection = async (sectionName: string) => {
    if (contentLoading) {
      alert('Content is still loading from Firestore. Please wait a moment before saving.');
      return;
    }
    setSaveState('saving');
    setSavedSectionName(sectionName);
    try {
      await savePortfolioToFirestore(content);
      if (content.seo) {
        try {
          await fetch('/api/seo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content.seo),
          });
        } catch {
          // ignore if server endpoint is unavailable
        }
      }
      setInitialContentJson(JSON.stringify(content));
      setSaveState('saved');
      setTimeout(() => {
        setSaveState('idle');
        setSavedSectionName(null);
      }, 3500);
    } catch (err) {
      console.error('Save error:', err);
      setSaveState('error');
      setTimeout(() => {
        setSaveState('idle');
      }, 4000);
    }
  };

  const handleReset = async () => {
    if (
      window.confirm(
        'Are you sure you want to reset all portfolio content to factory defaults? This cannot be undone.'
      )
    ) {
      try {
        await resetPortfolioToDefault();
        setContent(JSON.parse(JSON.stringify(PORTFOLIO_CONTENT)));
        setInitialContentJson(JSON.stringify(PORTFOLIO_CONTENT));
        alert('Portfolio successfully reset to defaults.');
      } catch (err) {
        alert('Failed to reset portfolio content.');
      }
    }
  };

  const handleDownloadBackup = async () => {
    setBackupState('loading');
    try {
      const { backup, fileName, summaryText } = await exportFirestoreBackup(content);
      downloadJsonFile(backup, fileName);
      setBackupSummary(summaryText);
      setBackupState('success');
      setTimeout(() => {
        setBackupState('idle');
      }, 4000);
    } catch (err) {
      console.error('Failed to export Firestore backup:', err);
      setBackupState('error');
      setTimeout(() => {
        setBackupState('idle');
      }, 4000);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen min-h-svh bg-[#050505] text-[#FEFFFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#8EFF01]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen min-h-svh bg-[#050505] text-[#FEFFFC] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8116E0] to-[#8EFF01]" />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#8EFF01]/10 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
              <p className="text-xs text-white/50">Restricted Access // Emkay Visuals</p>
            </div>
          </div>

          {accessDenied && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Access Denied</span>
                Only emkayvisuals@gmail.com is authorized to access the admin dashboard.
                Redirecting to home...
              </div>
            </div>
          )}

          <p className="text-sm text-white/70 mb-6 leading-relaxed">
            Please sign in with the authorized Google account to manage your portfolio content,
            visitor analytics, and incoming briefs.
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-semibold hover:bg-[#8EFF01] transition-colors flex items-center justify-center gap-3 shadow-lg cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-xs text-white/40 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  const tabsConfig = [
    { id: 'analytics' as const, label: 'Visitor Insights', icon: BarChart2, category: 'Overview' },
    {
      id: 'briefs' as const,
      label: 'Project Briefs',
      icon: MessageSquareText,
      category: 'Overview',
      badge: briefsList.filter((b) => !b.status || b.status === 'New').length,
    },
    { id: 'seo' as const, label: 'SEO & Meta Tags', icon: Globe, category: 'Site Sections' },
    { id: 'preloader' as const, label: 'Preloader & Navbar', icon: Layout, category: 'Site Sections' },
    { id: 'hero' as const, label: 'Hero & Marquee', icon: Sparkles, category: 'Site Sections' },
    { id: 'stats' as const, label: 'Stats Metrics', icon: BarChart2, category: 'Site Sections' },
    { id: 'services' as const, label: 'Services Bento', icon: Layers, category: 'Site Sections' },
    { id: 'projects' as const, label: 'Featured Projects', icon: FileText, category: 'Site Sections' },
    { id: 'about' as const, label: 'About & Toolkit', icon: Users, category: 'Site Sections' },
    { id: 'process' as const, label: 'Creative Process', icon: GitCommit, category: 'Site Sections' },
    { id: 'testimonials' as const, label: 'Testimonials', icon: Star, category: 'Site Sections' },
    { id: 'faq' as const, label: 'FAQ Section', icon: HelpCircle, category: 'Site Sections' },
    { id: 'contact' as const, label: 'Contact & Brief', icon: Phone, category: 'Site Sections' },
    { id: 'footer' as const, label: 'Footer & Rights', icon: PanelBottom, category: 'Site Sections' },
    { id: 'youtubeGallery' as const, label: 'YouTube Gallery', icon: Video, category: 'Site Sections' },
  ];

  return (
    <div className="min-h-screen min-h-svh bg-[#050505] text-[#FEFFFC] flex flex-col font-sans">
      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="sticky top-0 z-[60] bg-amber-500/15 border-b border-amber-500/40 text-amber-300 px-4 py-2.5 text-xs flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">
              You have unsaved changes in this session. Remember to click "Save All Changes" or save the active section before exiting.
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSaveSection('All Sections')}
            className="px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shrink-0 cursor-pointer shadow-sm transition-all"
          >
            Save All Now
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-8 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#8116E0]/20 border border-[#8116E0]/40 flex items-center justify-center text-[#8EFF01] shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-lg tracking-tight truncate">
              <span className="sm:hidden">Emkay Admin</span>
              <span className="hidden sm:inline">Emkay Visuals Admin</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-white/50 truncate hidden xs:block">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Desktop Only: Live Site link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold border border-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#8EFF01]" />
            Live Site
          </a>

          {/* Desktop Only: Download Backup */}
          <button
            type="button"
            onClick={handleDownloadBackup}
            disabled={backupState === 'loading'}
            className="hidden md:inline-flex px-3.5 py-2 rounded-xl bg-[#8EFF01]/10 hover:bg-[#8EFF01]/20 text-[#8EFF01] text-xs font-semibold border border-[#8EFF01]/30 transition-all items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Download full JSON backup of all Firestore content"
          >
            {backupState === 'loading' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : backupState === 'success' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Backup</span>
              </>
            )}
          </button>

          {/* Desktop Only: Reset */}
          <button
            type="button"
            onClick={handleReset}
            className="hidden md:inline-flex px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30 transition-colors items-center gap-1.5 cursor-pointer"
            title="Reset to default content"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>

          {/* Save All Changes: ALWAYS VISIBLE on mobile & desktop */}
          <SaveButton
            state={saveState}
            onSave={() => handleSaveSection('All Sections')}
            label={savedSectionName === 'All Sections' ? 'Saved All Changes!' : 'Save All Changes'}
          />

          {/* Mobile "More Options" Menu (Live Site, Backup, Reset) */}
          <div className="relative md:hidden" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              aria-label="More options"
              aria-expanded={moreMenuOpen}
              className={`p-2 sm:p-2.5 rounded-xl transition-all border cursor-pointer flex items-center justify-center min-h-[38px] min-w-[38px] ${
                moreMenuOpen
                  ? 'bg-[#8EFF01]/20 text-[#8EFF01] border-[#8EFF01]/50 shadow-[0_0_12px_rgba(142, 255, 1, 0.19)]'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/10'
              }`}
              title="More Actions (Live Site, Backup, Reset)"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {moreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 p-2 rounded-2xl bg-[#0f0f0f] border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.9)] z-50 flex flex-col gap-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider border-b border-white/10">
                  Quick Actions
                </div>

                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 text-xs font-semibold text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-[#8EFF01] shrink-0" />
                  <span>View Live Site</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    handleDownloadBackup();
                    setMoreMenuOpen(false);
                  }}
                  disabled={backupState === 'loading'}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {backupState === 'loading' ? (
                    <Loader2 className="w-4 h-4 text-[#8EFF01] animate-spin shrink-0" />
                  ) : backupState === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Download className="w-4 h-4 text-[#8EFF01] shrink-0" />
                  )}
                  <span>
                    {backupState === 'loading'
                      ? 'Exporting Backup...'
                      : backupState === 'success'
                      ? 'Backup Downloaded!'
                      : 'Download Backup (.json)'}
                  </span>
                </button>

                <div className="my-1 border-t border-white/10" />

                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    handleReset();
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-500/15 text-xs font-semibold text-red-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Reset All to Defaults</span>
                </button>
              </div>
            )}
          </div>

          {/* Logout: ALWAYS VISIBLE on mobile & desktop */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-colors border border-white/10 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-4">
          <div className="sticky top-20 space-y-4">
            <div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-2">
                Overview &amp; Telemetry
              </div>
              <div className="space-y-1">
                {tabsConfig
                  .filter((t) => t.category === 'Overview')
                  .map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'bg-[#8EFF01] text-black shadow-[0_0_15px_rgba(142, 255, 1, 0.19)]'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComponent className="w-4 h-4 shrink-0" />
                          <span>{tab.label}</span>
                        </div>
                        {tab.badge && tab.badge > 0 ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive ? 'bg-black text-[#8EFF01]' : 'bg-red-600 text-white'
                            }`}
                          >
                            {tab.badge} New
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-2">
                Site Sections &amp; Content
              </div>
              <div className="space-y-1">
                {tabsConfig
                  .filter((t) => t.category === 'Site Sections')
                  .map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 cursor-pointer ${
                          isActive
                            ? 'bg-[#8EFF01] text-black shadow-[0_0_15px_rgba(142, 255, 1, 0.19)]'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 shrink-0" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Database & Backup Card */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-[#8EFF01]" /> Firestore Backup
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Database Connected" />
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Export all portfolio content, project briefs, visitor analytics, and media to a portable JSON file.
              </p>
              <button
                type="button"
                onClick={handleDownloadBackup}
                disabled={backupState === 'loading'}
                className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-[#8EFF01] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {backupState === 'loading' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Exporting Firestore...</span>
                  </>
                ) : backupState === 'success' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Backup Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-[#8EFF01]" />
                    <span>Download Backup</span>
                  </>
                )}
              </button>
              {backupSummary && (
                <div className="text-[10px] text-emerald-400 font-mono text-center flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" /> Exported {backupSummary}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Workspace Area */}
        <div className="lg:col-span-3 space-y-6 pb-24">
          {activeTab === 'analytics' && <AdminAnalyticsTab analyticsData={analyticsData} />}

          {activeTab === 'briefs' && (
            <AdminBriefsTab
              briefsList={briefsList}
              onUpdateBriefField={handleUpdateBriefField}
              onDeleteBrief={handleDeleteBrief}
            />
          )}

          {contentLoading && activeTab !== 'analytics' && activeTab !== 'briefs' ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-[#0B0B0B] rounded-3xl border border-white/10 text-center px-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#8EFF01]" />
              <div>
                <p className="text-sm font-semibold text-white">Loading live content from Firestore...</p>
                <p className="text-xs text-white/50 mt-1">
                  Retrieving your saved edits so nothing gets overwritten.
                </p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'seo' && (
                <AdminSeoTab
                  content={content}
                  onChange={setContent}
                  onSave={handleSaveSection}
                  saveState={saveState}
                />
              )}

          {activeTab === 'preloader' && (
            <AdminPreloaderNavTab
              content={content}
              onChange={setContent}
              onSave={handleSaveSection}
              saveState={saveState}
            />
          )}

          {activeTab === 'hero' && (
            <AdminHeroTab
              content={content}
              onChange={setContent}
              onSave={handleSaveSection}
              saveState={saveState}
            />
          )}

          {activeTab === 'stats' && (
            <AdminStatsTab
              content={content}
              onChange={setContent}
              onSave={handleSaveSection}
              saveState={saveState}
            />
          )}

          {activeTab === 'services' && (
            <AdminServicesTab
              content={content}
              onChange={setContent}
              onSave={handleSaveSection}
              saveState={saveState}
            />
          )}

          {activeTab === 'projects' && (
            <AdminProjectsTab
              content={content}
              onChange={setContent}
              onSave={handleSaveSection}
              saveState={saveState}
            />
          )}

          {activeTab === 'about' && (
            <AdminAboutTab
              content={content}
              onChange={setContent}
              onSave={handleSaveSection}
              saveState={saveState}
            />
          )}

          {activeTab === 'process' && (
            <AdminProcessTab
              content={content}
              onChange={setContent}
              onSave={handleSaveSection}
              saveState={saveState}
            />
          )}

          {activeTab === 'testimonials' && (
            <AdminTestimonialsTab
              content={content}
              onChange={setContent}
              onSave={handleSaveSection}
              saveState={saveState}
            />
          )}

          {activeTab === 'faq' && (
            <AdminFaqTab
              content={content}
              onChange={setContent}
              onSave={handleSaveSection}
              saveState={saveState}
            />
          )}

          {activeTab === 'contact' && (
            <AdminContactTab
              content={content}
              onChange={setContent}
              onSave={handleSaveSection}
              saveState={saveState}
            />
          )}

          {activeTab === 'footer' && (
            <AdminFooterTab
              content={content}
              onChange={setContent}
              onSave={handleSaveSection}
              saveState={saveState}
            />
          )}

          {activeTab === 'youtubeGallery' && (
            <AdminYoutubeGalleryTab
              content={content}
              onChange={setContent}
              onSave={handleSaveSection}
              saveState={saveState}
            />
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
