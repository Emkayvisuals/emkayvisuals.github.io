import React from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { SectionToggle } from './SectionToggle';
import { Plus, Trash2, ArrowUp, ArrowDown, BarChart2 } from 'lucide-react';
import { StatItem } from '../../data/portfolioContent';

export const AdminStatsTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const statsSection = content.statsSection || {
    enabled: true,
    satisfactionText: '5.0 Average Client Satisfaction',
  };

  const stats = content.stats || [];

  const handleSectionChange = (field: string, value: any) => {
    onChange({
      ...content,
      statsSection: {
        ...statsSection,
        [field]: value,
      },
    });
  };

  const handleStatChange = (index: number, field: keyof StatItem, value: any) => {
    const updated = [...stats];
    updated[index] = {
      ...updated[index],
      [field]: field === 'value' ? Number(value) || 0 : value,
    };
    onChange({
      ...content,
      stats: updated,
    });
  };

  const addStat = () => {
    const newStat: StatItem = {
      value: 100,
      suffix: '+',
      label: 'New Metric',
      sublabel: 'Short explanation of this metric',
      visible: true,
    };
    onChange({
      ...content,
      stats: [...stats, newStat],
    });
  };

  const deleteStat = (index: number) => {
    if (stats.length <= 1) {
      alert('You must retain at least one stat.');
      return;
    }
    const updated = stats.filter((_, i) => i !== index);
    onChange({
      ...content,
      stats: updated,
    });
  };

  const moveStat = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= stats.length) return;
    const updated = [...stats];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({
      ...content,
      stats: updated,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Stats &amp; Key Metrics</h2>
              <p className="text-xs text-white/50">
                Configure metric counters, suffixes, labels, and the satisfaction line
              </p>
            </div>
          </div>

          <SaveButton
            state={saveState}
            onSave={() => onSave('Stats Metrics')}
            label="Save Stats"
          />
        </div>

        {/* Section visibility toggle */}
        <SectionToggle
          label="Stats Section Visibility"
          checked={statsSection.enabled !== false}
          onChange={(val) => handleSectionChange('enabled', val)}
          description="Control whether the stats row is displayed below the hero marquee"
        />

        {/* Client satisfaction text (user specifically noted editable '5.0 Average Client Satisfaction') */}
        <div className="mt-4">
          <label className="text-[11px] text-white/60 block mb-1">
            Client Satisfaction Banner Line
          </label>
          <input
            type="text"
            value={statsSection.satisfactionText || ''}
            onChange={(e) => handleSectionChange('satisfactionText', e.target.value)}
            placeholder="5.0 Average Client Satisfaction"
            className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
          />
          <p className="text-[10px] text-white/40 mt-1">
            Displayed alongside satisfaction ratings throughout the portfolio.
          </p>
        </div>
      </div>

      {/* Individual Stat Metrics */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Metric Counters ({stats.length})
          </h3>
          <button
            type="button"
            onClick={addStat}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Metric
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat: StatItem, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all ${
                stat.visible !== false ? 'bg-black/60 border-white/10' : 'bg-black/30 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/10 pb-2">
                <span className="text-xs font-mono font-bold text-[#8EFF01]">
                  #{index + 1} — {stat.value}
                  {stat.suffix}
                </span>

                <div className="flex items-center gap-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] text-white/60 cursor-pointer mr-2">
                    <input
                      type="checkbox"
                      checked={stat.visible !== false}
                      onChange={(e) => handleStatChange(index, 'visible', e.target.checked)}
                      className="rounded accent-[#8EFF01]"
                    />
                    <span>{stat.visible !== false ? 'Visible' : 'Hidden'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => moveStat(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStat(index, 'down')}
                    disabled={index === stats.length - 1}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteStat(index)}
                    className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer ml-1"
                    title="Delete stat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="col-span-2">
                  <label className="text-[10px] text-white/50 block mb-1">Numeric Value</label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white font-mono outline-none focus:border-[#8EFF01]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Suffix (e.g. + / %)</label>
                  <input
                    type="text"
                    value={stat.suffix || ''}
                    onChange={(e) => handleStatChange(index, 'suffix', e.target.value)}
                    placeholder="+"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white font-mono text-center outline-none focus:border-[#8EFF01]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Metric Title Label</label>
                  <input
                    type="text"
                    value={stat.label || ''}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                    placeholder="e.g. Projects Completed"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Sublabel / Description</label>
                  <input
                    type="text"
                    value={stat.sublabel || ''}
                    onChange={(e) => handleStatChange(index, 'sublabel', e.target.value)}
                    placeholder="e.g. Album art, key art, brand systems & animations"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
