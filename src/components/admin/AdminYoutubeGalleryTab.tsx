import React, { useState } from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { ImageUploadControl } from './ImageUploadControl';
import {
  Video,
  ExternalLink,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  Image as ImageIcon,
  Type,
  Youtube,
  Info,
} from 'lucide-react';
import {
  ManipulationGalleryConfig,
  ManipulationGalleryItem,
} from '../../data/portfolioContent';

export const AdminYoutubeGalleryTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const config: ManipulationGalleryConfig = content.manipulationGallery || {
    enabled: true,
    headerImage: '/Images/manipulation/Flying tortise.webp',
    headerImageAlt: 'Photo Manipulation Artwork Header',
    introParagraph:
      'Welcome to my photo manipulation laboratory and digital compositing archive. On my YouTube channel, I take you behind the screen to explore the detailed creation process behind surreal composites, sci-fi atmospheres, lighting breakdowns, and digital art techniques. Each piece is crafted layer by layer with cinematic depth, custom lighting passes, and meticulous compositing. Explore the video breakdowns on YouTube, or browse the complete gallery of finished artworks below.',
    youtubeSectionTitle: 'Visit my YouTube channel',
    youtubeChannelUrl: 'https://youtube.com/@emkayvisuals',
    youtubeThumbnailImage: '/Images/thumbnail/airdrop1.webp',
    youtubeThumbnailAlt: 'Emkay Visuals YouTube Channel - Photo Manipulation Breakdowns',
    gallerySectionTitle: 'My Gallery',
    items: [],
  };

  const items = config.items || [];
  const [searchTerm, setSearchTerm] = useState('');

  const updateConfig = (updates: Partial<ManipulationGalleryConfig>) => {
    onChange({
      ...content,
      manipulationGallery: {
        ...config,
        ...updates,
      },
    });
  };

  const handleFieldChange = (field: keyof ManipulationGalleryConfig, value: any) => {
    updateConfig({ [field]: value });
  };

  const handleItemChange = (index: number, field: keyof ManipulationGalleryItem, value: any) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    updateConfig({ items: updated });
  };

  const addItem = () => {
    const newItem: ManipulationGalleryItem = {
      id: `manip-${Date.now()}`,
      title: 'New Photo Manipulation Artwork',
      image: '',
      imageAlt: '',
      aspectRatio: 'portrait',
      visible: true,
    };
    updateConfig({ items: [newItem, ...items] });
  };

  const deleteItem = (index: number) => {
    const itemToDelete = items[index];
    const confirmed = window.confirm(
      `Are you sure you want to remove "${itemToDelete.title || 'this artwork'}" from the gallery?`
    );
    if (!confirmed) return;

    const updated = items.filter((_, i) => i !== index);
    updateConfig({ items: updated });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    updateConfig({ items: updated });
  };

  const filteredItems = items.filter((item) =>
    (item.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tab Header Card */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-500">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">YouTube / Manipulation Gallery</h2>
              <p className="text-xs text-white/50">
                Manage the hidden gallery page hosted at <code className="text-[#8EFF01]">/gallery</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Live Preview link as requested */}
            <a
              href="/gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-[#8EFF01] border border-white/10 transition-colors shadow-sm"
              title="Open /gallery in a new tab"
            >
              <span>Preview /gallery</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <SaveButton
              state={saveState}
              onSave={() => onSave('YouTube Gallery')}
              label="Save Gallery Changes"
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#8116E0]/10 border border-[#8116E0]/25 text-xs text-white/70 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#8EFF01] shrink-0 mt-0.5" />
          <p>
            This page is hidden from the homepage and search feeds. Visitors reach it exclusively via the
            Portfolio Menu (hamburger drawer) link or direct URL access. Any changes saved here update both
            the live gallery and cloud Firestore in real time.
          </p>
        </div>
      </div>

      {/* 1. Header Image Section */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <ImageIcon className="w-4 h-4 text-[#8EFF01]" />
          <h3 className="text-sm font-bold text-white">1. Full-Width Header Image</h3>
        </div>
        <p className="text-xs text-white/60">
          One plain image spanning the top of the /gallery page with no card, border, or text overlay.
          Upload a file (auto-converted to WebP) or paste a direct image URL / GitHub raw path.
        </p>

        <ImageUploadControl
          label="Header Image"
          description="High-resolution panoramic or landscape manipulation art recommended (1920px+ wide)."
          preset="project"
          aspectRatio="video"
          imageUrl={config.headerImage || ''}
          imageAlt={config.headerImageAlt || ''}
          showAltField={true}
          altPlaceholder="Alt text describing header artwork for accessibility..."
          onImageChange={(url, alt) => {
            updateConfig({
              headerImage: url,
              headerImageAlt: alt || config.headerImageAlt || '',
            });
          }}
          onRemove={() => updateConfig({ headerImage: '', headerImageAlt: '' })}
        />
      </div>

      {/* 2. Intro Text Section */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <Type className="w-4 h-4 text-[#8EFF01]" />
          <h3 className="text-sm font-bold text-white">2. Intro Paragraph</h3>
        </div>
        <p className="text-xs text-white/60">
          The paragraph rendered beneath the header image introducing visitors to your YouTube channel and photo manipulation work.
        </p>

        <div>
          <label className="text-xs text-white/70 block mb-1.5 font-medium">Intro Text Copy</label>
          <textarea
            rows={4}
            value={config.introParagraph || ''}
            onChange={(e) => handleFieldChange('introParagraph', e.target.value)}
            placeholder="Introduce your YouTube channel, tutorials, and photo manipulation philosophy..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-xs text-white outline-none focus:border-[#8EFF01] leading-relaxed"
          />
        </div>
      </div>

      {/* 3. YouTube Channel Card Section */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <Youtube className="w-4 h-4 text-red-500" />
          <h3 className="text-sm font-bold text-white">3. "Visit My YouTube Channel" Section &amp; Card</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/70 block mb-1.5 font-medium">
              Section Heading Text
            </label>
            <input
              type="text"
              value={config.youtubeSectionTitle || ''}
              onChange={(e) => handleFieldChange('youtubeSectionTitle', e.target.value)}
              placeholder="e.g. Visit my YouTube channel"
              className="w-full px-3.5 py-2 rounded-xl bg-black/80 border border-white/15 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>

          <div>
            <label className="text-xs text-white/70 block mb-1.5 font-medium">
              YouTube Channel URL
            </label>
            <input
              type="url"
              value={config.youtubeChannelUrl || ''}
              onChange={(e) => handleFieldChange('youtubeChannelUrl', e.target.value)}
              placeholder="https://youtube.com/@emkayvisuals"
              className="w-full px-3.5 py-2 rounded-xl bg-black/80 border border-white/15 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>
        </div>

        <div>
          <ImageUploadControl
            label="YouTube Channel Thumbnail / Card Image"
            description="Displayed inside the clickable link card on /gallery with the YouTube play icon overlay. Upload (auto-WebP) or paste image URL."
            preset="project"
            aspectRatio="video"
            imageUrl={config.youtubeThumbnailImage || ''}
            imageAlt={config.youtubeThumbnailAlt || ''}
            showAltField={true}
            altPlaceholder="Alt text for YouTube thumbnail card..."
            onImageChange={(url, alt) => {
              updateConfig({
                youtubeThumbnailImage: url,
                youtubeThumbnailAlt: alt || config.youtubeThumbnailAlt || '',
              });
            }}
            onRemove={() => updateConfig({ youtubeThumbnailImage: '', youtubeThumbnailAlt: '' })}
          />
        </div>
      </div>

      {/* 4. Gallery Items Manager */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8EFF01]" />
              <h3 className="text-sm font-bold text-white">4. Gallery Section &amp; Artworks Manager</h3>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Add, edit, reorder, or toggle individual artwork pieces. Orientation (portrait/landscape) is auto-detected.
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8EFF01] hover:bg-[#7DE000] text-black font-bold text-xs tracking-wide transition-all shadow-md cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Artwork</span>
          </button>
        </div>

        {/* Gallery Section Heading Input */}
        <div>
          <label className="text-xs text-white/70 block mb-1.5 font-medium">
            Gallery Section Heading
          </label>
          <input
            type="text"
            value={config.gallerySectionTitle || ''}
            onChange={(e) => handleFieldChange('gallerySectionTitle', e.target.value)}
            placeholder="e.g. My Gallery"
            className="w-full max-w-md px-3.5 py-2 rounded-xl bg-black/80 border border-white/15 text-xs text-white outline-none focus:border-[#8EFF01]"
          />
        </div>

        {/* Search & stats bar */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search artworks by title..."
            className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white outline-none focus:border-[#8EFF01] w-full max-w-xs"
          />
          <span className="text-xs text-white/50 font-mono shrink-0">
            Total: <strong>{items.length}</strong> | Visible:{' '}
            <strong className="text-[#8EFF01]">
              {items.filter((it) => it.visible !== false).length}
            </strong>
          </span>
        </div>

        {/* Artworks List */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-white/10 text-white/50 text-xs">
              {searchTerm ? 'No artworks matching search filter.' : 'No gallery artworks added yet.'}
            </div>
          ) : (
            filteredItems.map((item, filteredIdx) => {
              const rawIndex = items.findIndex((it) => it.id === item.id);
              const isVisible = item.visible !== false;

              return (
                <div
                  key={item.id || rawIndex}
                  className={`p-4 rounded-xl border transition-all ${
                    isVisible
                      ? 'bg-black/60 border-white/15 hover:border-white/25'
                      : 'bg-black/40 border-dashed border-white/10 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-white/40">#{rawIndex + 1}</span>
                      <span className="font-semibold text-xs text-white truncate max-w-[240px] sm:max-w-md">
                        {item.title || 'Untitled Artwork'}
                      </span>
                      {!isVisible && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                          Hidden
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Reorder Buttons */}
                      <button
                        type="button"
                        onClick={() => moveItem(rawIndex, 'up')}
                        disabled={rawIndex === 0}
                        title="Move artwork up"
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(rawIndex, 'down')}
                        disabled={rawIndex === items.length - 1}
                        title="Move artwork down"
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Show on site toggle */}
                      <button
                        type="button"
                        onClick={() => handleItemChange(rawIndex, 'visible', !isVisible)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isVisible
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                        }`}
                        title={isVisible ? 'Hide from gallery' : 'Show in gallery'}
                      >
                        {isVisible ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => deleteItem(rawIndex)}
                        title="Delete artwork"
                        className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Title Input */}
                    <div>
                      <label className="text-[11px] text-white/60 block mb-1 font-medium">
                        Artwork Title *
                      </label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => handleItemChange(rawIndex, 'title', e.target.value)}
                        placeholder="e.g. The Celestial Voyager // Flying Tortoise"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/80 border border-white/15 text-xs text-white outline-none focus:border-[#8EFF01]"
                      />
                    </div>

                    {/* Image Upload / URL Control with Alt text */}
                    <div>
                      <ImageUploadControl
                        label="Artwork Image (Upload auto-WebP, or paste direct URL / GitHub path)"
                        description="Aspect ratio is automatically detected on the site (portrait: 1 col, landscape: spans 2 cols)."
                        preset="project"
                        aspectRatio="auto"
                        imageUrl={item.image || ''}
                        imageAlt={item.imageAlt || ''}
                        showAltField={true}
                        altPlaceholder="Alt text describing the manipulation artwork for accessibility..."
                        onImageChange={(url, alt) => {
                          const updated = [...items];
                          updated[rawIndex] = {
                            ...updated[rawIndex],
                            image: url,
                            imageAlt: alt || updated[rawIndex].imageAlt || '',
                          };
                          updateConfig({ items: updated });
                        }}
                        onRemove={() => {
                          const updated = [...items];
                          updated[rawIndex] = {
                            ...updated[rawIndex],
                            image: '',
                            imageAlt: '',
                          };
                          updateConfig({ items: updated });
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
