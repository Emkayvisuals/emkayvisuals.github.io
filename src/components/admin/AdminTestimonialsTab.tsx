import React from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { SectionToggle } from './SectionToggle';
import { AccentHeadingInput } from './AccentHeadingInput';
import { Plus, Trash2, ArrowUp, ArrowDown, Star } from 'lucide-react';
import { TestimonialItem } from '../../data/portfolioContent';
import { ImageUploadControl } from './ImageUploadControl';

export const AdminTestimonialsTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const testimonialsSection = content.testimonialsSection || {
    enabled: true,
    badgeMain: 'Endorsements &',
    badgeAccent: 'Reputation',
    headingMain: 'Trusted by Visionary',
    headingAccent: 'Directors & Founders',
    satisfactionText: '5.0 Average Client Satisfaction',
  };

  const testimonials = content.testimonials || [];

  const handleSectionChange = (field: string, value: any) => {
    onChange({
      ...content,
      testimonialsSection: {
        ...testimonialsSection,
        [field]: value,
      },
    });
  };

  const handleTestimonialChange = (
    index: number,
    field: keyof TestimonialItem,
    value: any
  ) => {
    const updated = [...testimonials];
    updated[index] = {
      ...updated[index],
      [field]: field === 'rating' ? Number(value) || 5 : value,
    };
    onChange({
      ...content,
      testimonials: updated,
    });
  };

  const addTestimonial = () => {
    const id = `t-${Date.now()}`;
    const newTestimonial: TestimonialItem = {
      id,
      name: 'Client Name',
      role: 'Creative Director',
      company: 'Studio / Label',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      comment: 'Describe the client experience, project outcome, and testimonial endorsement.',
      projectType: 'Movie Poster Key Art',
      rating: 5,
      visible: true,
    };
    onChange({
      ...content,
      testimonials: [...testimonials, newTestimonial],
    });
  };

  const deleteTestimonial = (index: number) => {
    if (testimonials.length <= 1) {
      alert('You must retain at least one testimonial.');
      return;
    }
    const updated = testimonials.filter((_, i) => i !== index);
    onChange({
      ...content,
      testimonials: updated,
    });
  };

  const moveTestimonial = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= testimonials.length) return;
    const updated = [...testimonials];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({
      ...content,
      testimonials: updated,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Client Testimonials &amp; Reviews</h2>
              <p className="text-xs text-white/50">
                Manage client quotes, ratings, company names, and endorsement cards
              </p>
            </div>
          </div>

          <SaveButton
            state={saveState}
            onSave={() => onSave('Testimonials')}
            label="Save Testimonials"
          />
        </div>

        {/* Section visibility toggle */}
        <SectionToggle
          label="Testimonials Section Visibility"
          checked={testimonialsSection.enabled !== false}
          onChange={(val) => handleSectionChange('enabled', val)}
          description="Display testimonials and client satisfaction endorsements on the site"
        />

        <div className="space-y-6">
          {/* Badge */}
          <AccentHeadingInput
            label="Testimonials Section Badge"
            mainValue={testimonialsSection.badgeMain || ''}
            accentValue={testimonialsSection.badgeAccent || ''}
            onMainChange={(val) => handleSectionChange('badgeMain', val)}
            onAccentChange={(val) => handleSectionChange('badgeAccent', val)}
            mainPlaceholder="Endorsements &"
            accentPlaceholder="Reputation"
            isBadge={true}
          />

          {/* Heading */}
          <AccentHeadingInput
            label="Testimonials Section Heading"
            mainValue={testimonialsSection.headingMain || ''}
            accentValue={testimonialsSection.headingAccent || ''}
            onMainChange={(val) => handleSectionChange('headingMain', val)}
            onAccentChange={(val) => handleSectionChange('headingAccent', val)}
            mainPlaceholder="Trusted by Visionary"
            accentPlaceholder="Directors & Founders"
            isBadge={false}
          />

          {/* Satisfaction Text */}
          <div>
            <label className="text-[11px] text-white/60 block mb-1">
              Client Satisfaction Banner Line
            </label>
            <input
              type="text"
              value={testimonialsSection.satisfactionText || ''}
              onChange={(e) => handleSectionChange('satisfactionText', e.target.value)}
              placeholder="5.0 Average Client Satisfaction"
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>
        </div>
      </div>

      {/* Individual Testimonials */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Client Reviews ({testimonials.length})
          </h3>
          <button
            type="button"
            onClick={addTestimonial}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Testimonial
          </button>
        </div>

        <div className="space-y-4">
          {testimonials.map((item: TestimonialItem, index: number) => (
            <div
              key={item.id || index}
              className={`p-4 rounded-xl border transition-all ${
                item.visible !== false
                  ? 'bg-black/60 border-white/10'
                  : 'bg-black/30 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-black/80 border border-white/10 shrink-0">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-white/30">
                        AV
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <span className="text-[10px] text-white/50 block">
                      {item.role}, {item.company}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] text-white/60 cursor-pointer mr-2">
                    <input
                      type="checkbox"
                      checked={item.visible !== false}
                      onChange={(e) =>
                        handleTestimonialChange(index, 'visible', e.target.checked)
                      }
                      className="rounded accent-[#8EFF01]"
                    />
                    <span>{item.visible !== false ? 'Visible' : 'Hidden'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => moveTestimonial(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTestimonial(index, 'down')}
                    disabled={index === testimonials.length - 1}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTestimonial(index)}
                    className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer ml-1"
                    title="Delete review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Client Name</label>
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                    placeholder="Julian Vance"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Role / Title</label>
                  <input
                    type="text"
                    value={item.role || ''}
                    onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)}
                    placeholder="Creative Director"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Company / Studio</label>
                  <input
                    type="text"
                    value={item.company || ''}
                    onChange={(e) => handleTestimonialChange(index, 'company', e.target.value)}
                    placeholder="Aetheria Pictures"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Project Type Tag</label>
                  <input
                    type="text"
                    value={item.projectType || ''}
                    onChange={(e) =>
                      handleTestimonialChange(index, 'projectType', e.target.value)
                    }
                    placeholder="Movie Poster Key Art"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>
              </div>

              {/* Avatar Upload & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                <div className="sm:col-span-3">
                  <ImageUploadControl
                    label="Client / Reviewer Portrait Avatar"
                    description="Auto-resized to 800px WebP (<700KB) with instant preview."
                    preset="profile"
                    aspectRatio="square"
                    compact={true}
                    imageUrl={item.avatar || ''}
                    imageAlt={item.avatarAlt || `${item.name} – ${item.role} at ${item.company}`}
                    showAltField={true}
                    onImageChange={(url, alt) => {
                      const updated = [...testimonials];
                      updated[index] = {
                        ...updated[index],
                        avatar: url,
                        avatarAlt: alt,
                      };
                      onChange({ ...content, testimonials: updated });
                    }}
                    onRemove={() => {
                      const updated = [...testimonials];
                      updated[index] = {
                        ...updated[index],
                        avatar: '',
                        avatarAlt: '',
                      };
                      onChange({ ...content, testimonials: updated });
                    }}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Star Rating (1 - 5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={item.rating || 5}
                    onChange={(e) => handleTestimonialChange(index, 'rating', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-white/50 block mb-1">Client Quote / Review</label>
                <textarea
                  rows={3}
                  value={item.comment || ''}
                  onChange={(e) => handleTestimonialChange(index, 'comment', e.target.value)}
                  placeholder="The client's quote and feedback..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
