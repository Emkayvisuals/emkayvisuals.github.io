import React from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { SectionToggle } from './SectionToggle';
import { AccentHeadingInput } from './AccentHeadingInput';
import { Plus, Trash2, ArrowUp, ArrowDown, Layers } from 'lucide-react';
import { ServiceItem } from '../../data/portfolioContent';
import { ImageUploadControl } from './ImageUploadControl';

export const AdminServicesTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const servicesSection = content.servicesSection || {
    enabled: true,
    badgeMain: 'Disciplines &',
    badgeAccent: 'Offerings',
    headingMain: 'Specialized Creative',
    headingAccent: 'Services',
    subtext:
      'From full theatrical key art packages to high-octane 4K motion graphics, I construct daring visual narratives that resonate with high-discerning audiences.',
    cardButtonText: 'Request Quote',
    refPrefix: 'Ref //',
  };

  const services = content.services || [];

  const handleSectionChange = (field: string, value: any) => {
    onChange({
      ...content,
      servicesSection: {
        ...servicesSection,
        [field]: value,
      },
    });
  };

  const handleServiceChange = (index: number, field: keyof ServiceItem, value: any) => {
    const updated = [...services];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({
      ...content,
      services: updated,
    });
  };

  const addService = () => {
    const id = `service-${Date.now()}`;
    const newService: ServiceItem = {
      id,
      title: 'New Creative Service',
      tag: 'Specialized Discipline',
      shortDesc: 'Concise summary for the bento grid display card.',
      fullDesc: 'Comprehensive description detailing the full artistic process and outputs.',
      iconName: 'Sparkles',
      deliverables: ['Primary Deliverable 1', 'Master Export 2', 'Source Files 3'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      visible: true,
    };
    onChange({
      ...content,
      services: [...services, newService],
    });
  };

  const deleteService = (index: number) => {
    if (services.length <= 1) {
      alert('You must keep at least one service.');
      return;
    }
    const updated = services.filter((_, i) => i !== index);
    onChange({
      ...content,
      services: updated,
    });
  };

  const moveService = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= services.length) return;
    const updated = [...services];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({
      ...content,
      services: updated,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Services Bento Grid</h2>
              <p className="text-xs text-white/50">
                Configure offerings, bento card descriptions, tags, and deliverables
              </p>
            </div>
          </div>

          <SaveButton
            state={saveState}
            onSave={() => onSave('Services Bento')}
            label="Save Services"
          />
        </div>

        {/* Section visibility toggle */}
        <SectionToggle
          label="Services Section Visibility"
          checked={servicesSection.enabled !== false}
          onChange={(val) => handleSectionChange('enabled', val)}
          description="Control whether the services bento grid is displayed on the public site"
        />

        <div className="space-y-6">
          {/* Badge */}
          <AccentHeadingInput
            label="Services Section Badge"
            mainValue={servicesSection.badgeMain || ''}
            accentValue={servicesSection.badgeAccent || ''}
            onMainChange={(val) => handleSectionChange('badgeMain', val)}
            onAccentChange={(val) => handleSectionChange('badgeAccent', val)}
            mainPlaceholder="Disciplines &"
            accentPlaceholder="Offerings"
            isBadge={true}
          />

          {/* Heading */}
          <AccentHeadingInput
            label="Services Section Heading"
            mainValue={servicesSection.headingMain || ''}
            accentValue={servicesSection.headingAccent || ''}
            onMainChange={(val) => handleSectionChange('headingMain', val)}
            onAccentChange={(val) => handleSectionChange('headingAccent', val)}
            mainPlaceholder="Specialized Creative"
            accentPlaceholder="Services"
            isBadge={false}
          />

          {/* Subtext */}
          <div>
            <label className="text-[11px] text-white/60 block mb-1">Services Section Subtext</label>
            <textarea
              rows={2}
              value={servicesSection.subtext || ''}
              onChange={(e) => handleSectionChange('subtext', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>

          {/* Card Button Text & Ref Prefix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-white/60 block mb-1">Card Button Text</label>
              <input
                type="text"
                value={servicesSection.cardButtonText || 'Request Quote'}
                onChange={(e) => handleSectionChange('cardButtonText', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/60 block mb-1">Card Reference Prefix</label>
              <input
                type="text"
                value={servicesSection.refPrefix || 'Ref //'}
                onChange={(e) => handleSectionChange('refPrefix', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Individual Service Cards */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Service Cards ({services.length})
          </h3>
          <button
            type="button"
            onClick={addService}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Service Card
          </button>
        </div>

        <div className="space-y-4">
          {services.map((service: ServiceItem, index: number) => (
            <div
              key={service.id || index}
              className={`p-4 rounded-xl border transition-all ${
                service.visible !== false ? 'bg-black/60 border-white/10' : 'bg-black/30 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#8EFF01] px-2 py-0.5 rounded bg-[#8EFF01]/10 border border-[#8EFF01]/20">
                    {service.tag || 'Service'}
                  </span>
                  <span className="text-xs font-bold text-white">{service.title}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] text-white/60 cursor-pointer mr-2">
                    <input
                      type="checkbox"
                      checked={service.visible !== false}
                      onChange={(e) => handleServiceChange(index, 'visible', e.target.checked)}
                      className="rounded accent-[#8EFF01]"
                    />
                    <span>{service.visible !== false ? 'Visible' : 'Hidden'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => moveService(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveService(index, 'down')}
                    disabled={index === services.length - 1}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteService(index)}
                    className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer ml-1"
                    title="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Service Title</label>
                  <input
                    type="text"
                    value={service.title || ''}
                    onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Tag / Category Badge</label>
                  <input
                    type="text"
                    value={service.tag || ''}
                    onChange={(e) => handleServiceChange(index, 'tag', e.target.value)}
                    placeholder="e.g. Flagship Craft"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>
              </div>

              <div className="space-y-3 mb-3">
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Short Description (Card Front)</label>
                  <input
                    type="text"
                    value={service.shortDesc || ''}
                    onChange={(e) => handleServiceChange(index, 'shortDesc', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Full Description (Extended)</label>
                  <textarea
                    rows={2}
                    value={service.fullDesc || ''}
                    onChange={(e) => handleServiceChange(index, 'fullDesc', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>
              </div>

              {/* Service Preview Image & Column Span */}
              <div className="space-y-3 mb-3">
                <ImageUploadControl
                  label="Service Card Preview / Background Artwork"
                  description="Auto-resized to 1600px WebP (<700KB) with instant preview."
                  preset="project"
                  aspectRatio="video"
                  compact={true}
                  imageUrl={service.previewImage || ''}
                  imageAlt={service.previewImageAlt || `${service.title} discipline preview`}
                  showAltField={true}
                  onImageChange={(url, alt) => {
                    const updated = [...services];
                    updated[index] = {
                      ...updated[index],
                      previewImage: url,
                      previewImageAlt: alt,
                    };
                    onChange({ ...content, services: updated });
                  }}
                  onRemove={() => {
                    const updated = [...services];
                    updated[index] = {
                      ...updated[index],
                      previewImage: '',
                      previewImageAlt: '',
                    };
                    onChange({ ...content, services: updated });
                  }}
                />

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Bento Grid Column Span</label>
                  <input
                    type="text"
                    value={service.colSpan || 'col-span-12 sm:col-span-6 lg:col-span-4'}
                    onChange={(e) => handleServiceChange(index, 'colSpan', e.target.value)}
                    placeholder="col-span-12 sm:col-span-6 lg:col-span-4"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white font-mono outline-none focus:border-[#8EFF01]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-white/50 block mb-1">
                  Deliverables (Comma separated)
                </label>
                <input
                  type="text"
                  value={(service.deliverables || []).join(', ')}
                  onChange={(e) =>
                    handleServiceChange(
                      index,
                      'deliverables',
                      e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="Logo Reveals, Audio Visualizers, Social Reels"
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
