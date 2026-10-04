import React from 'react';
import { BarChart2, Users, Eye, Globe, Smartphone, Monitor } from 'lucide-react';

interface AdminAnalyticsTabProps {
  analyticsData: any;
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({ analyticsData }) => {
  const totalVisits = analyticsData?.totalVisits || 0;
  const uniqueVisitors = analyticsData?.uniqueVisitors || 0;
  const desktopVisits = analyticsData?.devices?.desktop || 0;
  const mobileVisits = analyticsData?.devices?.mobile || 0;
  const tabletVisits = analyticsData?.devices?.tablet || 0;
  const referrerMap = analyticsData?.referrers || {};

  return (
    <div className="space-y-6">
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
