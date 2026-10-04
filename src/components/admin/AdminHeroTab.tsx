import React from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { SectionToggle } from './SectionToggle';
import { AccentHeadingInput } from './AccentHeadingInput';
import { Sparkles, Plus, Trash2 } from 'lucide-react';
import { FloatingTagItem } from '../../data/portfolioContent';
import { ImageUploadControl } from './ImageUploadControl';

export const AdminHeroTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const hero = content.hero || {
    enabled: true,
    badgeMain: '5+ Years of',
    badgeAccent: 'Obsessive Visual Craft',
    headingMain: 'Your',
    headingAccent: 'Vision, Visualized',
    subtext:
      'Visual designer creating distinctive posters, digital art, and high impact visual identities for brands and creative projects.',
    primaryButtonText: 'View Work',
    primaryButtonLink: '#work',
    floatingTags: [
      { label: 'Posters', color: 'yellow', visible: true },
      { label: 'Visual Branding', color: 'violet', visible: true },
      { label: 'Motion Graphics', color: 'yellow', visible: true },
      { label: 'Movie Key Art', color: 'white', visible: true },
      { label: 'Photo Manipulation', color: 'violet', visible: true },
    ] as FloatingTagItem[],
    marqueeTicker: [
      'Posters',
      'Visual Branding',
      'Motion Graphics',
      'Flyers',
      'Movie Posters',
      'Photo Manipulation',
      'Music Covers',
      'Thumbnail Design',
      'After Effects Expert',
      'Vector Systems',
    ],
  };

  const handleHeroChange = (field: string, value: any) => {
    onChange({
      ...content,
      hero: {
        ...hero,
        [field]: value,
      },
    });
  };

  const handleFloatingTagChange = (
    index: number,
    field: keyof FloatingTagItem,
    value: any
  ) => {
    const updated = [...(hero.floatingTags || [])];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    handleHeroChange('floatingTags', updated);
  };

  const addFloatingTag = () => {
    const newTag: FloatingTagItem = {
      label: 'New Discipline',
      color: 'yellow',
      visible: true,
    };
    handleHeroChange('floatingTags', [...(hero.floatingTags || []), newTag]);
  };

  const deleteFloatingTag = (index: number) => {
    const updated = (hero.floatingTags || []).filter((_, i) => i !== index);
    handleHeroChange('floatingTags', updated);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Hero &amp; Marquee Ticker</h2>
              <p className="text-xs text-white/50">
                Configure primary headline, italic serif accent words, subtext, and call-to-actions
              </p>
            </div>
          </div>

          <SaveButton
            state={saveState}
            onSave={() => onSave('Hero Section')}
            label="Save Hero"
          />
        </div>

        {/* Section visibility toggle */}
        <SectionToggle
          label="Hero Section Visibility"
          checked={hero.enabled !== false}
          onChange={(val) => handleHeroChange('enabled', val)}
          description="Control whether the hero introduction section is displayed"
        />

        <div className="space-y-6">
          {/* Badge with Main + Accent */}
          <AccentHeadingInput
            label="Hero Badge Pill"
            mainValue={hero.badgeMain || ''}
            accentValue={hero.badgeAccent || ''}
            onMainChange={(val) => handleHeroChange('badgeMain', val)}
            onAccentChange={(val) => handleHeroChange('badgeAccent', val)}
            mainPlaceholder="5+ Years of"
            accentPlaceholder="Obsessive Visual Craft"
            isBadge={true}
          />

          {/* Heading with Main + Accent */}
          <AccentHeadingInput
            label="Hero Main Headline"
            mainValue={hero.headingMain || ''}
            accentValue={hero.headingAccent || ''}
            onMainChange={(val) => handleHeroChange('headingMain', val)}
            onAccentChange={(val) => handleHeroChange('headingAccent', val)}
            mainPlaceholder="Your"
            accentPlaceholder="Vision, Visualized"
            isBadge={false}
          />

          {/* Subtext */}
          <div>
            <label className="text-[11px] text-white/60 block mb-1">Hero Subtext Paragraph</label>
            <textarea
              rows={3}
              value={hero.subtext || ''}
              onChange={(e) => handleHeroChange('subtext', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>

          {/* Hero Featured Artwork / Background Image */}
          <div className="pt-2">
            <ImageUploadControl
              label="Hero Featured Artwork / Visual Graphic"
              description="High impact visual asset shown in the hero section. Auto-resized to max 1600px WebP."
              preset="project"
              imageUrl={hero.imageUrl || ''}
              imageAlt={hero.imageAlt || 'Emkay Visuals – Graphic Design & Motion Art'}
              showAltField={true}
              onImageChange={(url, alt) => {
                const updated = { ...hero, imageUrl: url, imageAlt: alt || '' };
                onChange({ ...content, hero: updated });
              }}
              onRemove={() => {
                const updated = { ...hero, imageUrl: '', imageAlt: '' };
                onChange({ ...content, hero: updated });
              }}
            />
          </div>

          {/* Call-to-action Button */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Call to Action Button (View Work)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-white/50 block mb-1">Button Text</label>
                <input
                  type="text"
                  value={hero.primaryButtonText || 'View Work'}
                  onChange={(e) => handleHeroChange('primaryButtonText', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/50 block mb-1">Button Link URL / Anchor</label>
                <input
                  type="text"
                  value={hero.primaryButtonLink || '#work'}
                  onChange={(e) => handleHeroChange('primaryButtonLink', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                />
              </div>
            </div>
          </div>

          {/* Marquee Ticker */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Marquee Ticker Items (Comma separated)
            </h3>
            <p className="text-[10px] text-white/40">
              Flows infinitely across the hero divider line.
            </p>
            <input
              type="text"
              value={(hero.marqueeTicker || []).join(', ')}
              onChange={(e) =>
                handleHeroChange(
                  'marqueeTicker',
                  e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>

          {/* Floating Pill Tags */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Floating Discipline Tags ({(hero.floatingTags || []).length})
              </h3>
              <button
                type="button"
                onClick={addFloatingTag}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Tag
              </button>
            </div>

            <div className="space-y-2">
              {(hero.floatingTags || []).map((tag: FloatingTagItem, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-black/70 border border-white/10 flex items-center justify-between gap-3"
                >
                  <input
                    type="text"
                    value={tag.label}
                    onChange={(e) => handleFloatingTagChange(idx, 'label', e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded bg-black border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />

                  <select
                    value={tag.color}
                    onChange={(e) => handleFloatingTagChange(idx, 'color', e.target.value as any)}
                    className="px-2 py-1 rounded bg-black border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  >
                    <option value="yellow">Banana Yellow</option>
                    <option value="violet">Ultra Violet</option>
                    <option value="white">Blanche White</option>
                  </select>

                  <label className="flex items-center gap-1 text-[11px] text-white/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tag.visible !== false}
                      onChange={(e) => handleFloatingTagChange(idx, 'visible', e.target.checked)}
                      className="rounded accent-[#8EFF01]"
                    />
                    <span>Show</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => deleteFloatingTag(idx)}
                    className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
