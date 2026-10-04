import React from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { SectionToggle } from './SectionToggle';
import { AccentHeadingInput } from './AccentHeadingInput';
import { Plus, Trash2, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';
import { FAQItem } from '../../data/portfolioContent';

export const AdminFaqTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const faqSection = content.faqSection || {
    enabled: true,
    badgeMain: 'Common',
    badgeAccent: 'Queries',
    headingMain: 'Frequently Asked',
    headingAccent: 'Questions',
    subtext:
      'Everything you need to know about commissioning artwork, deliverables, timelines, and commercial licensing.',
  };

  const faqs = content.faq || [];

  const handleSectionChange = (field: string, value: any) => {
    onChange({
      ...content,
      faqSection: {
        ...faqSection,
        [field]: value,
      },
    });
  };

  const handleFaqChange = (index: number, field: keyof FAQItem, value: any) => {
    const updated = [...faqs];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({
      ...content,
      faq: updated,
    });
  };

  const addFaq = () => {
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      question: 'New Frequently Asked Question',
      answer: 'Provide a clear, detailed answer addressing the client query.',
      visible: true,
    };
    onChange({
      ...content,
      faq: [...faqs, newFaq],
    });
  };

  const deleteFaq = (index: number) => {
    if (faqs.length <= 1) {
      alert('You must retain at least one FAQ item.');
      return;
    }
    const updated = faqs.filter((_, i) => i !== index);
    onChange({
      ...content,
      faq: updated,
    });
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= faqs.length) return;
    const updated = [...faqs];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({
      ...content,
      faq: updated,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-white/50">
                Configure common commissioning inquiries, answers, and accordions
              </p>
            </div>
          </div>

          <SaveButton
            state={saveState}
            onSave={() => onSave('FAQ Section')}
            label="Save FAQs"
          />
        </div>

        {/* Section visibility toggle */}
        <SectionToggle
          label="FAQ Section Visibility"
          checked={faqSection.enabled !== false}
          onChange={(val) => handleSectionChange('enabled', val)}
          description="Display the accordion FAQ section on the public site"
        />

        <div className="space-y-6">
          {/* Badge */}
          <AccentHeadingInput
            label="FAQ Section Badge"
            mainValue={faqSection.badgeMain || ''}
            accentValue={faqSection.badgeAccent || ''}
            onMainChange={(val) => handleSectionChange('badgeMain', val)}
            onAccentChange={(val) => handleSectionChange('badgeAccent', val)}
            mainPlaceholder="Common"
            accentPlaceholder="Queries"
            isBadge={true}
          />

          {/* Heading */}
          <AccentHeadingInput
            label="FAQ Section Heading"
            mainValue={faqSection.headingMain || ''}
            accentValue={faqSection.headingAccent || ''}
            onMainChange={(val) => handleSectionChange('headingMain', val)}
            onAccentChange={(val) => handleSectionChange('headingAccent', val)}
            mainPlaceholder="Frequently Asked"
            accentPlaceholder="Questions"
            isBadge={false}
          />

          {/* Subtext */}
          <div>
            <label className="text-[11px] text-white/60 block mb-1">FAQ Section Subtext</label>
            <textarea
              rows={2}
              value={faqSection.subtext || ''}
              onChange={(e) => handleSectionChange('subtext', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>
        </div>
      </div>

      {/* Individual FAQ Items */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            FAQ Items ({faqs.length})
          </h3>
          <button
            type="button"
            onClick={addFaq}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Question
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((item: FAQItem, index: number) => (
            <div
              key={item.id || index}
              className={`p-4 rounded-xl border transition-all ${
                item.visible !== false ? 'bg-black/60 border-white/10' : 'bg-black/30 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-md">
                  Q{index + 1}: {item.question}
                </span>

                <div className="flex items-center gap-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] text-white/60 cursor-pointer mr-2">
                    <input
                      type="checkbox"
                      checked={item.visible !== false}
                      onChange={(e) => handleFaqChange(index, 'visible', e.target.checked)}
                      className="rounded accent-[#8EFF01]"
                    />
                    <span>{item.visible !== false ? 'Visible' : 'Hidden'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => moveFaq(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFaq(index, 'down')}
                    disabled={index === faqs.length - 1}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFaq(index)}
                    className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer ml-1"
                    title="Delete question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Question</label>
                  <input
                    type="text"
                    value={item.question || ''}
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                    placeholder="e.g. What is your typical turnaround time?"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Answer</label>
                  <textarea
                    rows={3}
                    value={item.answer || ''}
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                    placeholder="e.g. Turnaround depends on project scope..."
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
