import React from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { SectionToggle } from './SectionToggle';
import { AccentHeadingInput } from './AccentHeadingInput';
import { User, Plus, Trash2, ArrowUp, ArrowDown, Wrench, Sparkles } from 'lucide-react';
import { SoftwareToolItem, HighlightItem } from '../../data/portfolioContent';
import { ImageUploadControl } from './ImageUploadControl';

export const AdminAboutTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const about = content.about || {
    enabled: true,
    badgeMain: 'Behind the',
    badgeAccent: 'Screen',
    headingMain: 'Engineering Visual Worlds with Uncompromising',
    headingAccent: 'Precision',
    bioParagraphs: [
      "I'm Emkay, a graphic designer and digital artist specializing in sports design, photo manipulation, promotional visuals, and creative poster design.",
      "My work combines strong composition, cinematic imagery, bold typography, and detailed visual effects to create designs that feel dynamic, polished, and built to stand out.",
      "From sports posters and campaign visuals to digital artwork and social media content, I focus on turning ideas into visuals that communicate clearly and leave a lasting impression.",
    ],
    photoUrl: '/Images/emkay.webp',
    photoAlt: 'Emkay - Graphic Designer & Digital Artist',
    artistIdLabel: 'Artist ID // 2026.ev',
    experienceBadge: '5+ Yrs Pro',
    statusCoordinates: ['Worldwide / Remote', 'Status: Active', '60 FPS Ready'],
    toolkitLabel: 'Production Software & Toolkit',
    softwareTools: [] as SoftwareToolItem[],
    highlights: [] as HighlightItem[],
  };

  const handleAboutChange = (field: string, value: any) => {
    onChange({
      ...content,
      about: {
        ...about,
        [field]: value,
      },
    });
  };

  // Bio paragraphs handler
  const handleBioChange = (index: number, value: string) => {
    const updated = [...(about.bioParagraphs || [])];
    updated[index] = value;
    handleAboutChange('bioParagraphs', updated);
  };

  const addBioParagraph = () => {
    handleAboutChange('bioParagraphs', [
      ...(about.bioParagraphs || []),
      'New paragraph detailing your experience, craft, or creative approach.',
    ]);
  };

  const deleteBioParagraph = (index: number) => {
    if ((about.bioParagraphs || []).length <= 1) {
      alert('You must retain at least one bio paragraph.');
      return;
    }
    const updated = (about.bioParagraphs || []).filter((_, i) => i !== index);
    handleAboutChange('bioParagraphs', updated);
  };

  // Status coordinates handler
  const handleStatusCoordinatesChange = (val: string) => {
    const items = val.split(',').map((s) => s.trim()).filter(Boolean);
    handleAboutChange('statusCoordinates', items);
  };

  // Software Tools handlers
  const handleToolChange = (
    index: number,
    field: keyof SoftwareToolItem,
    value: any
  ) => {
    const updated = [...(about.softwareTools || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleAboutChange('softwareTools', updated);
  };

  const addTool = () => {
    const newTool: SoftwareToolItem = {
      name: 'Software Tool',
      level: 'Mastery',
      type: 'Discipline / Specialty',
      visible: true,
    };
    handleAboutChange('softwareTools', [...(about.softwareTools || []), newTool]);
  };

  const deleteTool = (index: number) => {
    const updated = (about.softwareTools || []).filter((_, i) => i !== index);
    handleAboutChange('softwareTools', updated);
  };

  const moveTool = (index: number, direction: 'up' | 'down') => {
    const tools = [...(about.softwareTools || [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= tools.length) return;
    const temp = tools[index];
    tools[index] = tools[target];
    tools[target] = temp;
    handleAboutChange('softwareTools', tools);
  };

  // Highlights handlers
  const handleHighlightChange = (
    index: number,
    field: keyof HighlightItem,
    value: any
  ) => {
    const updated = [...(about.highlights || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleAboutChange('highlights', updated);
  };

  const addHighlight = () => {
    const idx = (about.highlights || []).length + 1;
    const num = idx < 10 ? `0${idx}` : `${idx}`;
    const newHighlight: HighlightItem = {
      number: num,
      title: 'Pillar Title',
      text: 'Description of this craft pillar or workflow hallmark.',
      visible: true,
    };
    handleAboutChange('highlights', [...(about.highlights || []), newHighlight]);
  };

  const deleteHighlight = (index: number) => {
    const updated = (about.highlights || []).filter((_, i) => i !== index);
    handleAboutChange('highlights', updated);
  };

  return (
    <div className="space-y-6">
      {/* Section Header Controls */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">About Me &amp; Creative Toolkit</h2>
              <p className="text-xs text-white/50">
                Configure artist biography, personal photo, status tags, software skills, and pillars
              </p>
            </div>
          </div>

          <SaveButton
            state={saveState}
            onSave={() => onSave('About & Toolkit')}
            label="Save About"
          />
        </div>

        {/* Section visibility toggle */}
        <SectionToggle
          label="About Section Visibility"
          checked={about.enabled !== false}
          onChange={(val) => handleAboutChange('enabled', val)}
          description="Control whether the artist profile and creative toolkit are shown"
        />

        <div className="space-y-6">
          {/* Badge */}
          <AccentHeadingInput
            label="About Section Badge"
            mainValue={about.badgeMain || ''}
            accentValue={about.badgeAccent || ''}
            onMainChange={(val) => handleAboutChange('badgeMain', val)}
            onAccentChange={(val) => handleAboutChange('badgeAccent', val)}
            mainPlaceholder="Behind the"
            accentPlaceholder="Screen"
            isBadge={true}
          />

          {/* Heading */}
          <AccentHeadingInput
            label="About Section Heading"
            mainValue={about.headingMain || ''}
            accentValue={about.headingAccent || ''}
            onMainChange={(val) => handleAboutChange('headingMain', val)}
            onAccentChange={(val) => handleAboutChange('headingAccent', val)}
            mainPlaceholder="Engineering Visual Worlds with Uncompromising"
            accentPlaceholder="Precision"
            isBadge={false}
          />

          {/* About Main Photo & Artist ID Photo Upload Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploadControl
              label="About Section Portrait / Photo"
              description="Main visual portrait in About section. Auto-resized to 800px WebP."
              preset="profile"
              imageUrl={about.photoUrl || ''}
              imageAlt={about.photoAlt || 'Emkay - Graphic Designer & Digital Artist'}
              showAltField={true}
              aspectRatio="portrait"
              onImageChange={(url, alt) => {
                const updated = { ...about, photoUrl: url, photoAlt: alt || '' };
                onChange({ ...content, about: updated });
              }}
              onRemove={() => {
                const updated = { ...about, photoUrl: '', photoAlt: '' };
                onChange({ ...content, about: updated });
              }}
            />

            <ImageUploadControl
              label="Artist ID Photo / Signature Hologram"
              description="Holographic ID badge card visual. Auto-resized to 800px WebP."
              preset="profile"
              imageUrl={about.artistIdPhotoUrl || about.photoUrl || ''}
              imageAlt={about.artistIdPhotoAlt || 'Artist ID Hologram & Signature Emblem - Emkay'}
              showAltField={true}
              aspectRatio="portrait"
              onImageChange={(url, alt) => {
                const updated = { ...about, artistIdPhotoUrl: url, artistIdPhotoAlt: alt || '' };
                onChange({ ...content, about: updated });
              }}
              onRemove={() => {
                const updated = { ...about, artistIdPhotoUrl: '', artistIdPhotoAlt: '' };
                onChange({ ...content, about: updated });
              }}
            />
          </div>

          {/* Portrait Meta & Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-white/60 block mb-1">Artist ID Badge Line</label>
              <input
                type="text"
                value={about.artistIdLabel || ''}
                onChange={(e) => handleAboutChange('artistIdLabel', e.target.value)}
                placeholder="Artist ID // 2026.ev"
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/60 block mb-1">Experience Pill Badge</label>
              <input
                type="text"
                value={about.experienceBadge || ''}
                onChange={(e) => handleAboutChange('experienceBadge', e.target.value)}
                placeholder="5+ Yrs Pro"
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-white/60 block mb-1">
              Status Coordinates (Comma separated)
            </label>
            <input
              type="text"
              value={(about.statusCoordinates || []).join(', ')}
              onChange={(e) => handleStatusCoordinatesChange(e.target.value)}
              placeholder="Worldwide / Remote, Status: Active, 60 FPS Ready"
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>
        </div>
      </div>

      {/* Bio Paragraphs */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Bio Paragraphs ({(about.bioParagraphs || []).length})
            </h3>
            <p className="text-xs text-white/50">
              Each entry renders as a separate styled narrative paragraph
            </p>
          </div>

          <button
            type="button"
            onClick={addBioParagraph}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Paragraph
          </button>
        </div>

        <div className="space-y-3">
          {(about.bioParagraphs || []).map((paragraph: string, index: number) => (
            <div
              key={index}
              className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/60 font-mono">
                  Paragraph #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => deleteBioParagraph(index)}
                  className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>

              <textarea
                rows={3}
                value={paragraph}
                onChange={(e) => handleBioChange(index, e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Software Toolkit */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Software &amp; Production Toolkit ({(about.softwareTools || []).length})
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={addTool}
            className="px-3 py-1.5 rounded-lg bg-[#8EFF01] hover:bg-[#7DE000] text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-3.5 h-3.5" /> Add Tool
          </button>
        </div>

        <div>
          <label className="text-[11px] text-white/60 block mb-1">Toolkit Header Label</label>
          <input
            type="text"
            value={about.toolkitLabel || 'Production Software & Toolkit'}
            onChange={(e) => handleAboutChange('toolkitLabel', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
          />
        </div>

        <div className="space-y-3">
          {(about.softwareTools || []).map((tool: SoftwareToolItem, index: number) => (
            <div
              key={index}
              className={`p-3.5 rounded-xl border transition-all ${
                tool.visible !== false ? 'bg-black/60 border-white/10' : 'bg-black/30 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2 border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-white truncate">{tool.name}</span>

                <div className="flex items-center gap-1">
                  <label className="flex items-center gap-1 text-[11px] text-white/60 cursor-pointer mr-2">
                    <input
                      type="checkbox"
                      checked={tool.visible !== false}
                      onChange={(e) => handleToolChange(index, 'visible', e.target.checked)}
                      className="rounded accent-[#8EFF01]"
                    />
                    <span>{tool.visible !== false ? 'Visible' : 'Hidden'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => moveTool(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTool(index, 'down')}
                    disabled={index === (about.softwareTools || []).length - 1}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTool(index)}
                    className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Software Name</label>
                  <input
                    type="text"
                    value={tool.name}
                    onChange={(e) => handleToolChange(index, 'name', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Proficiency Level</label>
                  <input
                    type="text"
                    value={tool.level}
                    onChange={(e) => handleToolChange(index, 'level', e.target.value)}
                    placeholder="Mastery / Advanced"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-[#8EFF01] outline-none focus:border-[#8EFF01]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Type / Use Case</label>
                  <input
                    type="text"
                    value={tool.type}
                    onChange={(e) => handleToolChange(index, 'type', e.target.value)}
                    placeholder="Motion Graphics & FX"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white/80 outline-none focus:border-[#8EFF01]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Craft Highlights */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8EFF01]/10 border border-[#8EFF01]/20 flex items-center justify-center text-[#8EFF01]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Craft Pillars &amp; Highlights ({(about.highlights || []).length})
            </h3>
          </div>

          <button
            type="button"
            onClick={addHighlight}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Pillar
          </button>
        </div>

        <div className="space-y-3">
          {(about.highlights || []).map((highlight: HighlightItem, index: number) => (
            <div
              key={index}
              className={`p-3.5 rounded-xl border transition-all ${
                highlight.visible !== false ? 'bg-black/60 border-white/10' : 'bg-black/30 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-[#8EFF01] font-mono">
                  #{highlight.number} {highlight.title}
                </span>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-[11px] text-white/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={highlight.visible !== false}
                      onChange={(e) => handleHighlightChange(index, 'visible', e.target.checked)}
                      className="rounded accent-[#8EFF01]"
                    />
                    <span>{highlight.visible !== false ? 'Visible' : 'Hidden'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => deleteHighlight(index)}
                    className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Index Number</label>
                  <input
                    type="text"
                    value={highlight.number}
                    onChange={(e) => handleHighlightChange(index, 'number', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white font-mono outline-none focus:border-[#8EFF01]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-[10px] text-white/50 block mb-1">Pillar Title</label>
                  <input
                    type="text"
                    value={highlight.title}
                    onChange={(e) => handleHighlightChange(index, 'title', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-white/50 block mb-1">Pillar Description</label>
                <textarea
                  rows={2}
                  value={highlight.text}
                  onChange={(e) => handleHighlightChange(index, 'text', e.target.value)}
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
