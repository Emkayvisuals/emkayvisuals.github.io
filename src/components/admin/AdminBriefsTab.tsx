import React, { useState } from 'react';
import {
  MessageSquareText,
  Search,
  Filter,
  Trash2,
  Calendar,
  DollarSign,
  Briefcase,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface AdminBriefsTabProps {
  briefsList: any[];
  onUpdateBriefField: (id: string, field: 'status' | 'notes', value: string) => Promise<void>;
  onDeleteBrief: (id: string) => Promise<void>;
}

export const AdminBriefsTab: React.FC<AdminBriefsTabProps> = ({
  briefsList,
  onUpdateBriefField,
  onDeleteBrief,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [expandedBriefIds, setExpandedBriefIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedBriefIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const services = Array.from(new Set(briefsList.map((b) => b.service).filter(Boolean)));

  const filtered = briefsList.filter((b) => {
    const matchesSearch =
      (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.service || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.budget || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.message || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || (b.status || 'New') === statusFilter;
    const matchesService = serviceFilter === 'All' || b.service === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Project Brief Submissions</h2>
              <p className="text-xs text-white/50">
                {briefsList.length} total inquiries logged across Firestore
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client, email, budget, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-white/30 outline-none focus:border-[#8EFF01]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="New">Status: New</option>
              <option value="In Review">Status: In Review</option>
              <option value="Contacted">Status: Contacted</option>
              <option value="Accepted">Status: Accepted</option>
              <option value="Completed">Status: Completed</option>
              <option value="Archived">Status: Archived</option>
            </select>
          </div>

          <div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white outline-none cursor-pointer"
            >
              <option value="All">All Services</option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Briefs List */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center border border-white/5 rounded-xl bg-black/20">
            <MessageSquareText className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-xs text-white/50">No briefs matching your filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((brief) => {
              const isExpanded = !!expandedBriefIds[brief.id];
              const dateStr = brief.date
                ? new Date(brief.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recent';

              return (
                <div
                  key={brief.id}
                  className="rounded-xl border border-white/10 bg-black/40 overflow-hidden transition-all"
                >
                  <div
                    onClick={() => toggleExpand(brief.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-[#8EFF01] shrink-0">
                        {(brief.name || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{brief.name}</span>
                          <span className="text-xs text-white/50">&lt;{brief.email}&gt;</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[11px] font-semibold text-[#8EFF01] bg-[#8EFF01]/10 px-2 py-0.5 rounded-full">
                            {brief.service || 'Service Unspecified'}
                          </span>
                          {brief.budget && (
                            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {brief.budget}
                            </span>
                          )}
                          <span className="text-[11px] text-white/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {dateStr}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <select
                        value={brief.status || 'New'}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onUpdateBriefField(brief.id, 'status', e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                          brief.status === 'Accepted'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : brief.status === 'Contacted'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : brief.status === 'In Review'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-white/10 text-white/80 border-white/20'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="In Review">In Review</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Completed">Completed</option>
                        <option value="Archived">Archived</option>
                      </select>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBrief(brief.id);
                        }}
                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Brief"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="text-white/40">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Brief Details */}
                  {isExpanded && (
                    <div className="p-4 border-t border-white/10 bg-black/60 space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-white/40 block mb-0.5 font-semibold">Target Timeline</span>
                          <span className="text-white font-medium">{brief.deadline || 'Flexible / Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block mb-0.5 font-semibold">Reference Link / Moodboard</span>
                          {brief.referenceLink ? (
                            <a
                              href={brief.referenceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#8EFF01] hover:underline flex items-center gap-1 font-medium truncate"
                            >
                              {brief.referenceLink} <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-white/40 italic">None provided</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-white/40 block mb-1 font-semibold">Project Vision &amp; Deliverables</span>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-white/80 whitespace-pre-line leading-relaxed">
                          {brief.message}
                        </div>
                      </div>

                      {/* Admin Private Notes */}
                      <div>
                        <span className="text-white/40 block mb-1 font-semibold">Private Admin Notes</span>
                        <textarea
                          rows={2}
                          placeholder="Add internal notes about this client / project..."
                          value={brief.notes || ''}
                          onChange={(e) => onUpdateBriefField(brief.id, 'notes', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white placeholder-white/25 outline-none focus:border-[#8EFF01]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
