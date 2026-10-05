import React from 'react';
import {
  BarChart2,
  Users,
  Eye,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  MessageSquareText,
  ArrowRight,
  Sparkles,
  DollarSign,
  Mail,
  Briefcase,
} from 'lucide-react';

interface AdminAnalyticsTabProps {
  analyticsData: any;
  briefsList?: any[];
  onNavigateToBriefs?: () => void;
}

function formatBriefTimestamp(dateStr?: string) {
  if (!dateStr) return 'Just now';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function renderStatusBadge(status?: string) {
  const s = status || 'New';
  switch (s) {
    case 'New':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#8EFF01]/15 text-[#8EFF01] border border-[#8EFF01]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8EFF01] animate-pulse" />
          New
        </span>
      );
    case 'Contacted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Contacted
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          In Progress
        </span>
      );
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Completed
        </span>
      );
    case 'Archived':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/50 border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          {s}
        </span>
      );
  }
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  analyticsData,
  briefsList = [],
  onNavigateToBriefs,
}) => {
  const totalVisits = analyticsData?.totalVisits || 0;
  const uniqueVisitors = analyticsData?.uniqueVisitors || 0;
  const desktopVisits = analyticsData?.devices?.desktop || 0;
  const mobileVisits = analyticsData?.devices?.mobile || 0;
  const tabletVisits = analyticsData?.devices?.tablet || 0;
  const referrerMap = analyticsData?.referrers || {};

  const recentBriefs = briefsList.slice(0, 5);
  const newBriefsCount = briefsList.filter((b) => !b.status || b.status === 'New').length;

  return (
    <div className="space-y-6">
      {/* 1. Recent Activity Feed (Last 5 Submissions) */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Recent Activity</h2>
                {newBriefsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#8EFF01] text-black">
                    {newBriefsCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50">
                Latest 5 project brief inquiries received from potential clients
              </p>
            </div>
          </div>

          {onNavigateToBriefs && (
            <button
              type="button"
              onClick={onNavigateToBriefs}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8EFF01] hover:text-[#8EFF01]/80 transition-colors cursor-pointer self-start sm:self-center"
            >
              <span>View all briefs ({briefsList.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentBriefs.length === 0 ? (
          <div className="p-8 rounded-xl bg-black/40 border border-dashed border-white/10 text-center">
            <Sparkles className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-xs font-semibold text-white/70">No project brief submissions logged yet</p>
            <p className="text-[11px] text-white/40 mt-1 max-w-sm mx-auto">
              When clients submit project briefs via the website contact form, they will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentBriefs.map((brief, idx) => {
              const clientName = brief.name || 'Anonymous Client';
              const initial = clientName.charAt(0).toUpperCase();

              return (
                <div
                  key={brief.id || idx}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#8116E0]/20 border border-[#8116E0]/40 flex items-center justify-center font-bold text-[#8EFF01] text-sm shrink-0">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white truncate max-w-[160px] sm:max-w-[220px]">
                          {clientName}
                        </span>
                        {brief.service && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-white/70 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                            <Briefcase className="w-2.5 h-2.5 text-[#8EFF01]" />
                            <span className="truncate max-w-[140px]">{brief.service}</span>
                          </span>
                        )}
                        {brief.budget && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-[#8EFF01]/90 bg-[#8EFF01]/10 px-2 py-0.5 rounded-md border border-[#8EFF01]/20 font-mono">
                            <DollarSign className="w-2.5 h-2.5" />
                            <span>{brief.budget}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-white/40 mt-1 flex-wrap">
                        {brief.email && (
                          <span className="flex items-center gap-1 truncate max-w-[180px]">
                            <Mail className="w-3 h-3 text-white/30 shrink-0" />
                            <span className="truncate">{brief.email}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-white/30 shrink-0" />
                          <span>{formatBriefTimestamp(brief.date)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {renderStatusBadge(brief.status)}
                    {onNavigateToBriefs && (
                      <button
                        type="button"
                        onClick={onNavigateToBriefs}
                        title="View brief details"
                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Live Visitor Analytics */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Live Visitor Analytics</h2>
            <p className="text-xs text-white/50">
              Real-time telemetry and engagement tracked in Firestore
            </p>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <span className="text-xs text-white/50 flex items-center gap-1.5 mb-1">
              <Eye className="w-3.5 h-3.5 text-[#8EFF01]" /> Total Page Views
            </span>
            <div className="text-2xl font-black text-white font-mono">{totalVisits}</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <span className="text-xs text-white/50 flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-[#8116E0]" /> Unique Visitors
            </span>
            <div className="text-2xl font-black text-white font-mono">{uniqueVisitors}</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <span className="text-xs text-white/50 flex items-center gap-1.5 mb-1">
              <Smartphone className="w-3.5 h-3.5 text-blue-400" /> Mobile Devices
            </span>
            <div className="text-2xl font-black text-white font-mono">{mobileVisits}</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <span className="text-xs text-white/50 flex items-center gap-1.5 mb-1">
              <Monitor className="w-3.5 h-3.5 text-emerald-400" /> Desktop Devices
            </span>
            <div className="text-2xl font-black text-white font-mono">{desktopVisits}</div>
          </div>
        </div>

        {/* Breakdown Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#8EFF01]" /> Top Traffic Sources
            </h3>
            {Object.keys(referrerMap).length === 0 ? (
              <p className="text-xs text-white/40 italic">No external referrers logged yet.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(referrerMap).map(([ref, count]) => (
                  <div
                    key={ref}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-white/5"
                  >
                    <span className="text-white/80 truncate max-w-[200px]">
                      {ref === 'direct' ? 'Direct / Bookmarks' : ref}
                    </span>
                    <span className="font-mono text-[#8EFF01] font-bold">{String(count)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <h3 className="text-xs font-bold text-white mb-3">Device Proportion</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Mobile</span>
                  <span>{totalVisits > 0 ? Math.round((mobileVisits / totalVisits) * 100) : 0}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${totalVisits > 0 ? (mobileVisits / totalVisits) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Desktop</span>
                  <span>{totalVisits > 0 ? Math.round((desktopVisits / totalVisits) * 100) : 0}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${totalVisits > 0 ? (desktopVisits / totalVisits) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Tablet</span>
                  <span>{totalVisits > 0 ? Math.round((tabletVisits / totalVisits) * 100) : 0}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{
                      width: `${totalVisits > 0 ? (tabletVisits / totalVisits) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
