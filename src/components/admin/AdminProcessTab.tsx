import React from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { SectionToggle } from './SectionToggle';
import { AccentHeadingInput } from './AccentHeadingInput';
import { Plus, Trash2, ArrowUp, ArrowDown, GitCommit } from 'lucide-react';
import { ProcessStep } from '../../data/portfolioContent';

export const AdminProcessTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const processSection = content.processSection || {
    enabled: true,
    badgeMain: 'Methodology //',
    badgeAccent: 'Zero Noise',
    headingMain: 'A Rigorous 4-Step',
    headingAccent: 'Creative Roadmap',
    subtext:
      'Every project moves through an airtight, predictable progression ensuring full creative alignment and pristine execution without unnecessary delays.',
    phasePrefix: 'Phase //',
  };

  const steps = content.process || [];

  const handleSectionChange = (field: string, value: any) => {
    onChange({
      ...content,
      processSection: {
        ...processSection,
        [field]: value,
      },
    });
  };

  const handleStepChange = (index: number, field: keyof ProcessStep, value: any) => {
    const updated = [...steps];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({
      ...content,
      process: updated,
    });
  };

  const addStep = () => {
    const nextNum = (steps.length + 1).toString().padStart(2, '0');
    const newStep: ProcessStep = {
      stepNumber: nextNum,
      title: 'New Creative Milestone',
      duration: 'Day 1 - 3',
      highlightBadge: 'Strategic Alignment',
      description: 'Describe the deliverables, client collaboration points, and milestones for this phase.',
      visible: true,
    };
    onChange({
      ...content,
      process: [...steps, newStep],
    });
  };

  const deleteStep = (index: number) => {
    if (steps.length <= 1) {
      alert('You must retain at least one process step.');
      return;
    }
    const updated = steps.filter((_, i) => i !== index);
    onChange({
      ...content,
      process: updated,
    });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= steps.length) return;
    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({
      ...content,
      process: updated,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Creative Process &amp; Roadmap</h2>
              <p className="text-xs text-white/50">
                Manage your step-by-step design progression, durations, and phase milestones
              </p>
            </div>
          </div>

          <SaveButton
            state={saveState}
            onSave={() => onSave('Creative Process')}
            label="Save Process"
          />
        </div>

        {/* Section visibility toggle */}
        <SectionToggle
          label="Process Section Visibility"
          checked={processSection.enabled !== false}
          onChange={(val) => handleSectionChange('enabled', val)}
          description="Display the 4-step creative methodology roadmap on the public portfolio"
        />

        <div className="space-y-6">
          {/* Badge */}
          <AccentHeadingInput
            label="Process Section Badge"
            mainValue={processSection.badgeMain || ''}
            accentValue={processSection.badgeAccent || ''}
            onMainChange={(val) => handleSectionChange('badgeMain', val)}
            onAccentChange={(val) => handleSectionChange('badgeAccent', val)}
            mainPlaceholder="Methodology //"
            accentPlaceholder="Zero Noise"
            isBadge={true}
          />

          {/* Heading */}
          <AccentHeadingInput
            label="Process Section Heading"
            mainValue={processSection.headingMain || ''}
            accentValue={processSection.headingAccent || ''}
            onMainChange={(val) => handleSectionChange('headingMain', val)}
            onAccentChange={(val) => handleSectionChange('headingAccent', val)}
            mainPlaceholder="A Rigorous 4-Step"
            accentPlaceholder="Creative Roadmap"
            isBadge={false}
          />

          {/* Subtext */}
          <div>
            <label className="text-[11px] text-white/60 block mb-1">Process Section Subtext</label>
            <textarea
              rows={2}
              value={processSection.subtext || ''}
              onChange={(e) => handleSectionChange('subtext', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>

          {/* Phase Prefix */}
          <div className="max-w-xs">
            <label className="text-[11px] text-white/60 block mb-1">Phase Marker Prefix</label>
            <input
              type="text"
              value={processSection.phasePrefix || 'Phase //'}
              onChange={(e) => handleSectionChange('phasePrefix', e.target.value)}
              placeholder="Phase //"
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>
        </div>
      </div>

      {/* Individual Process Steps */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Process Steps ({steps.length})
          </h3>
          <button
            type="button"
            onClick={addStep}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Step
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((step: ProcessStep, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all ${
                step.visible !== false ? 'bg-black/60 border-white/10' : 'bg-black/30 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#8EFF01] px-2 py-0.5 rounded bg-[#8EFF01]/10 border border-[#8EFF01]/20 font-mono">
                    {step.stepNumber}
                  </span>
                  <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                    {step.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] text-white/60 cursor-pointer mr-2">
                    <input
                      type="checkbox"
                      checked={step.visible !== false}
                      onChange={(e) => handleStepChange(index, 'visible', e.target.checked)}
                      className="rounded accent-[#8EFF01]"
                    />
                    <span>{step.visible !== false ? 'Visible' : 'Hidden'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => moveStep(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep(index, 'down')}
                    disabled={index === steps.length - 1}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteStep(index)}
                    className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer ml-1"
                    title="Delete step"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Step Number</label>
                  <input
                    type="text"
                    value={step.stepNumber || ''}
                    onChange={(e) => handleStepChange(index, 'stepNumber', e.target.value)}
                    placeholder="01"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white font-mono outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Duration / Timeline</label>
                  <input
                    type="text"
                    value={step.duration || ''}
                    onChange={(e) => handleStepChange(index, 'duration', e.target.value)}
                    placeholder="Day 1 - 2"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Highlight Badge Tag</label>
                  <input
                    type="text"
                    value={step.highlightBadge || ''}
                    onChange={(e) => handleStepChange(index, 'highlightBadge', e.target.value)}
                    placeholder="Research & Strategy"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Step Title</label>
                  <input
                    type="text"
                    value={step.title || ''}
                    onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                    placeholder="Discovery & Vision Brief"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Phase Description</label>
                  <textarea
                    rows={2}
                    value={step.description || ''}
                    onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                    placeholder="Explain what happens in this phase..."
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
