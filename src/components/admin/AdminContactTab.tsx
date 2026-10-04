import React, { useState } from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { SectionToggle } from './SectionToggle';
import { AccentHeadingInput } from './AccentHeadingInput';
import {
  Mail,
  DollarSign,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Share2,
  Edit2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ExternalLink,
  Info,
  Sparkles,
  Palette,
  RotateCcw,
} from 'lucide-react';
import {
  SocialPlatform,
  SocialLinkItem,
  DEFAULT_PORTFOLIO_CONTENT,
} from '../../data/portfolioContent';
import {
  formatSocialUrl,
  getPlatformMeta,
  getResolvedSocialLinks,
} from '../../lib/socialLinks';
import { getServiceIconMeta } from '../CustomDropdown';

const PLATFORMS_LIST: SocialPlatform[] = [
  'WhatsApp',
  'Instagram',
  'YouTube',
  'X/Twitter',
  'LinkedIn',
  'Behance',
  'Dribbble',
  'TikTok',
  'Facebook',
  'Telegram',
  'Pinterest',
  'Email',
  'Website',
  'Custom',
];

export const AdminContactTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const contact = content.contact || DEFAULT_PORTFOLIO_CONTENT.contact;
  const socials = content.socials || DEFAULT_PORTFOLIO_CONTENT.socials;

  // Retrieve current links or initialize from defaults
  const linksList: SocialLinkItem[] =
    Array.isArray(socials.links) && socials.links.length > 0
      ? socials.links
      : DEFAULT_PORTFOLIO_CONTENT.socials.links;

  // Add / Edit Modal or Inline Form State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<SocialLinkItem>({
    id: '',
    platform: 'WhatsApp',
    label: '',
    value: '',
    description: '',
    visible: true,
  });

  const handleContactChange = (field: string, value: any) => {
    onChange({
      ...content,
      contact: {
        ...contact,
        [field]: value,
      },
    });
  };

  const handleUpdateLinksList = (updatedLinks: SocialLinkItem[]) => {
    // Also synchronize legacy top-level properties for full backward compatibility
    const whatsappItem = updatedLinks.find((l) => l.platform === 'WhatsApp');
    const igMainItem = updatedLinks.find(
      (l) => l.platform === 'Instagram' && l.label.toLowerCase().includes('main')
    ) || updatedLinks.find((l) => l.platform === 'Instagram');
    const igFxItem = updatedLinks.find(
      (l) => l.platform === 'Instagram' && (l.label.toLowerCase().includes('fx') || l.label.toLowerCase().includes('art'))
    ) || updatedLinks.filter((l) => l.platform === 'Instagram')[1];
    const emailItem = updatedLinks.find((l) => l.platform === 'Email');
    const behanceItem = updatedLinks.find((l) => l.platform === 'Behance');
    const dribbbleItem = updatedLinks.find((l) => l.platform === 'Dribbble');

    const formattedWa = whatsappItem ? formatSocialUrl('WhatsApp', whatsappItem.value) : null;
    const formattedEmail = emailItem ? formatSocialUrl('Email', emailItem.value) : null;
    const formattedIgMain = igMainItem ? formatSocialUrl('Instagram', igMainItem.value) : null;
    const formattedIgFx = igFxItem ? formatSocialUrl('Instagram', igFxItem.value) : null;

    onChange({
      ...content,
      socials: {
        ...socials,
        links: updatedLinks,
        ...(whatsappItem && formattedWa?.isValid
          ? {
              whatsapp: whatsappItem.value,
              whatsappDisplay: formattedWa.displayHandle,
              whatsappUrl: formattedWa.url,
            }
          : {}),
        ...(emailItem && formattedEmail?.isValid
          ? {
              email: formattedEmail.displayHandle,
              emailMailto: formattedEmail.url,
            }
          : {}),
        ...(igMainItem && formattedIgMain?.isValid
          ? {
              instagramDesigns: {
                handle: formattedIgMain.displayHandle,
                label: igMainItem.description || igMainItem.label,
                url: formattedIgMain.url,
              },
            }
          : {}),
        ...(igFxItem && formattedIgFx?.isValid
          ? {
              instagramFx: {
                handle: formattedIgFx.displayHandle,
                label: igFxItem.description || igFxItem.label,
                url: formattedIgFx.url,
              },
            }
          : {}),
        ...(behanceItem ? { behance: formatSocialUrl('Behance', behanceItem.value).url } : {}),
        ...(dribbbleItem ? { dribbble: formatSocialUrl('Dribbble', dribbbleItem.value).url } : {}),
      },
    });
  };

  const handleToggleLinkVisibility = (index: number) => {
    const updated = [...linksList];
    const current = updated[index];
    updated[index] = {
      ...current,
      visible: current.visible === false ? true : false,
    };
    handleUpdateLinksList(updated);
  };

  const handleMoveLink = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= linksList.length) return;
    const updated = [...linksList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    handleUpdateLinksList(updated);
  };

  const handleDeleteLink = (index: number) => {
    const item = linksList[index];
    if (
      window.confirm(
        `Are you sure you want to delete the "${item.label || item.platform}" link?`
      )
    ) {
      const updated = linksList.filter((_, i) => i !== index);
      handleUpdateLinksList(updated);
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    }
  };

  const handleStartAddNew = () => {
    setEditingIndex(null);
    setIsAddingNew(true);
    setFormData({
      id: `link-${Date.now()}`,
      platform: 'WhatsApp',
      label: 'WhatsApp Direct',
      value: '',
      description: '',
      visible: true,
    });
  };

  const handleStartEdit = (index: number) => {
    setIsAddingNew(false);
    setEditingIndex(index);
    setFormData({ ...linksList[index] });
  };

  const handlePlatformChange = (newPlatform: SocialPlatform) => {
    const defaultLabels: Record<SocialPlatform, string> = {
      WhatsApp: 'WhatsApp Direct',
      Instagram: 'Instagram',
      YouTube: 'YouTube Channel',
      'X/Twitter': 'X / Twitter',
      LinkedIn: 'LinkedIn Profile',
      Behance: 'Behance Portfolio',
      Dribbble: 'Dribbble Shots',
      TikTok: 'TikTok Profile',
      Facebook: 'Facebook Page',
      Telegram: 'Telegram Channel',
      Pinterest: 'Pinterest Moodboards',
      Email: 'Direct Email',
      Website: 'Official Website',
      Custom: 'Custom Channel',
    };

    setFormData((prev) => ({
      ...prev,
      platform: newPlatform,
      label: prev.label || defaultLabels[newPlatform] || newPlatform,
    }));
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      alert('Please enter a display label for this link.');
      return;
    }
    if (!formData.value.trim()) {
      alert('Please enter a URL or handle.');
      return;
    }

    const verification = formatSocialUrl(formData.platform, formData.value);
    if (!verification.isValid) {
      alert(`Invalid format for ${formData.platform}: ${verification.error || 'Please check input.'}`);
      return;
    }

    const updated = [...linksList];
    if (isAddingNew) {
      updated.push({
        ...formData,
        id: formData.id || `link-${Date.now()}`,
      });
    } else if (editingIndex !== null) {
      updated[editingIndex] = { ...formData };
    }

    handleUpdateLinksList(updated);
    setIsAddingNew(false);
    setEditingIndex(null);
  };

  const handleCancelForm = () => {
    setIsAddingNew(false);
    setEditingIndex(null);
  };

  // Budget tiers handlers
  const budgetRanges = contact.budgetRanges || [];

  const handleUpdateBudgetTier = (index: number, value: string) => {
    const updated = [...budgetRanges];
    updated[index] = value;
    handleContactChange('budgetRanges', updated);
  };

  const handleMoveBudgetTier = (index: number, direction: 'up' | 'down') => {
    const tiers = [...budgetRanges];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tiers.length) return;
    const temp = tiers[index];
    tiers[index] = tiers[targetIndex];
    tiers[targetIndex] = temp;
    handleContactChange('budgetRanges', tiers);
  };

  const handleAddBudgetTier = () => {
    const newTier = window.prompt('Enter new budget tier (e.g. $10,000 - $20,000):');
    if (!newTier || !newTier.trim()) return;
    handleContactChange('budgetRanges', [...budgetRanges, newTier.trim()]);
  };

  const handleDeleteBudgetTier = (index: number) => {
    if (budgetRanges.length <= 1) {
      alert('You must retain at least one budget tier.');
      return;
    }
    const updated = budgetRanges.filter((_, i) => i !== index);
    handleContactChange('budgetRanges', updated);
  };

  // Live validation for currently edited form item
  const activeValidation = formatSocialUrl(formData.platform, formData.value);
  const activePlatformMeta = getPlatformMeta(formData.platform);
  const ActivePlatformIcon = activePlatformMeta.icon;

  return (
    <div className="space-y-6">
      {/* 1. CONTACT AND SOCIAL LINKS MANAGER */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Contact &amp; Social Links Manager
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-white/10 text-[#8EFF01]">
                  {linksList.length} Links
                </span>
              </h2>
              <p className="text-xs text-white/50">
                Manage contact channels shown across the Contact section, Footer, and Floating Quick Connect button
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="admin-add-social-link-btn"
              onClick={handleStartAddNew}
              className="px-3.5 py-2 rounded-xl bg-[#8EFF01] hover:bg-[#7DE000] text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(142, 255, 1, 0.19)]"
            >
              <Plus className="w-4 h-4" /> Add Link
            </button>
            <SaveButton
              state={saveState}
              onSave={() => onSave('Contact & Social Links')}
              label="Save Links"
            />
          </div>
        </div>

        {/* Informational Guidance */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 text-xs text-white/70">
          <Info className="w-4 h-4 text-[#8EFF01] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white mb-0.5">Automated Link &amp; Icon Resolution</p>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Enter phone numbers (e.g. <span className="text-[#8EFF01]">09161889909</span>), social handles (e.g. <span className="text-[#8EFF01]">@emkayvisuals</span>), or full URLs. The platform automatically assigns the correct icon, formats the URL (e.g. <span className="text-white/70 font-mono">https://wa.me/...</span>), enforces <span className="text-white/80">https://, mailto:, and wa.me</span> security protocols, and syncs everywhere.
            </p>
          </div>
        </div>

        {/* Add / Edit Inline Modal Panel */}
        {(isAddingNew || editingIndex !== null) && (
          <form
            onSubmit={handleSaveForm}
            className="p-4 sm:p-5 rounded-xl bg-black/80 border-2 border-[#8EFF01]/40 space-y-4 shadow-[0_0_25px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${activePlatformMeta.cardBg}`}
                >
                  <ActivePlatformIcon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {isAddingNew ? 'Add New Contact / Social Link' : `Edit "${formData.label}"`}
                </h3>
              </div>
              <span className="text-[11px] text-white/40">
                {formData.platform} Channel
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              {/* Platform Selector */}
              <div className="sm:col-span-4">
                <label className="text-[11px] font-semibold text-white/70 block mb-1">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => handlePlatformChange(e.target.value as SocialPlatform)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-white/15 text-xs text-white outline-none focus:border-[#8EFF01] font-medium cursor-pointer"
                >
                  {PLATFORMS_LIST.map((plat) => (
                    <option key={plat} value={plat}>
                      {plat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Label */}
              <div className="sm:col-span-4">
                <label className="text-[11px] font-semibold text-white/70 block mb-1">
                  Button / Display Label *
                </label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. WhatsApp Direct, Instagram (Main)"
                  className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-white/15 text-xs text-white outline-none focus:border-[#8EFF01] font-bold"
                />
              </div>

              {/* Description (Optional) */}
              <div className="sm:col-span-4">
                <label className="text-[11px] font-semibold text-white/70 block mb-1">
                  Short Description (Optional)
                </label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Graphic and motion designs"
                  className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-white/15 text-xs text-white outline-none focus:border-[#8EFF01]"
                />
              </div>

              {/* URL or Handle */}
              <div className="sm:col-span-8">
                <label className="text-[11px] font-semibold text-white/70 block mb-1">
                  URL, Handle, Phone, or Email *
                </label>
                <input
                  type="text"
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={activePlatformMeta.placeholder}
                  className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-white/15 text-xs text-[#8EFF01] font-mono outline-none focus:border-[#8EFF01]"
                />
              </div>

              {/* Visibility Toggle in Form */}
              <div className="sm:col-span-4 flex items-end">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-[#141414] border border-white/10 w-full cursor-pointer min-h-[38px]">
                  <input
                    type="checkbox"
                    checked={formData.visible !== false}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8EFF01] accent-[#8EFF01] cursor-pointer"
                  />
                  <span className="text-xs text-white/80 font-medium">Visible on public site</span>
                </label>
              </div>
            </div>

            {/* Real-time Link Resolution & Validation Preview */}
            <div className="p-3 rounded-lg bg-black/60 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                  Live Resolution Preview
                </span>
                {formData.value.trim() ? (
                  activeValidation.isValid ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Valid Link
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Invalid Input
                    </span>
                  )
                ) : null}
              </div>

              {formData.value.trim() ? (
                activeValidation.isValid ? (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/50">Target:</span>
                    <a
                      href={activeValidation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8EFF01] font-mono hover:underline truncate flex items-center gap-1"
                    >
                      {activeValidation.url}
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {activeValidation.error || 'Please enter a valid format.'}
                  </p>
                )
              ) : (
                <p className="text-xs text-white/40 italic">
                  Enter a handle or URL above to verify output target
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#8EFF01] hover:bg-[#7DE000] text-black text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                {isAddingNew ? 'Add Link' : 'Apply Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Links List */}
        <div className="space-y-2.5">
          {linksList.map((item, index) => {
            const platformMeta = getPlatformMeta(item.platform);
            const IconComp = platformMeta.icon;
            const validation = formatSocialUrl(item.platform, item.value);
            const isItemEditing = editingIndex === index;
            const isVisible = item.visible !== false;

            return (
              <div
                key={item.id || index}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isItemEditing
                    ? 'bg-black/80 border-[#8EFF01]/60 ring-1 ring-[#8EFF01]/40'
                    : isVisible
                    ? 'bg-black/50 border-white/10 hover:border-white/20'
                    : 'bg-black/30 border-white/5 opacity-60'
                }`}
              >
                {/* Left side: Icon, Details, Badges */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${platformMeta.cardBg}`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {item.label || item.platform}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${platformMeta.badgeBg}`}
                      >
                        {item.platform}
                      </span>
                      {!isVisible && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                          Hidden
                        </span>
                      )}
                      {!validation.isValid && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" /> Invalid
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-white/55">
                      <span className="font-mono text-white/80 truncate max-w-xs">
                        {item.value}
                      </span>
                      {validation.isValid && (
                        <span className="text-[#8EFF01]/80 font-mono text-[10px] hidden md:inline">
                          → {validation.url}
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-[10px] text-white/40 italic truncate">
                        "{item.description}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: Reorder & Action Controls */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleLinkVisibility(index)}
                    className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      isVisible
                        ? 'bg-white/5 hover:bg-white/10 text-white/80'
                        : 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                    }`}
                    title={isVisible ? 'Hide from public site' : 'Show on public site'}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(index)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Edit link"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveLink(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveLink(index, 'down')}
                    disabled={index === linksList.length - 1}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteLink(index)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer transition-colors"
                    title="Delete link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. CONTACT SECTION HEADINGS & BADGE */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Contact Section &amp; Brief Copy</h2>
              <p className="text-xs text-white/50">
                Configure headings, subtext paragraphs, and section visibility
              </p>
            </div>
          </div>

          <SaveButton
            state={saveState}
            onSave={() => onSave('Contact Section Text')}
            label="Save Section Copy"
          />
        </div>

        {/* Section visibility toggle */}
        <SectionToggle
          label="Contact Section Visibility"
          checked={contact.enabled !== false}
          onChange={(val) => handleContactChange('enabled', val)}
          description="Control whether the project brief form and contact channels are shown on the homepage"
        />

        <div className="space-y-4">
          {/* Badge */}
          <AccentHeadingInput
            label="Contact Section Badge"
            mainValue={contact.badgeMain || ''}
            accentValue={contact.badgeAccent || ''}
            onMainChange={(val) => handleContactChange('badgeMain', val)}
            onAccentChange={(val) => handleContactChange('badgeAccent', val)}
            mainPlaceholder="Let's"
            accentPlaceholder="Collaborate"
            isBadge={true}
          />

          {/* Heading */}
          <AccentHeadingInput
            label="Contact Section Heading"
            mainValue={contact.headingMain || ''}
            accentValue={contact.headingAccent || ''}
            onMainChange={(val) => handleContactChange('headingMain', val)}
            onAccentChange={(val) => handleContactChange('headingAccent', val)}
            mainPlaceholder="Ready to Bring Your Vision to"
            accentPlaceholder="Life?"
            isBadge={false}
          />

          {/* Subtext */}
          <div>
            <label className="text-[11px] text-white/60 block mb-1">Contact Subtext Paragraph</label>
            <textarea
              rows={2}
              value={contact.subtext || ''}
              onChange={(e) => handleContactChange('subtext', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>

          {/* Direct channels headers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-white/60 block mb-1">Direct Channels Heading</label>
              <input
                type="text"
                value={contact.directChannelsHeading || 'Direct Channels'}
                onChange={(e) => handleContactChange('directChannelsHeading', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/60 block mb-1">Response Time Guarantee Text</label>
              <input
                type="text"
                value={contact.responseTime || 'Typical response time: under 4 hours'}
                onChange={(e) => handleContactChange('responseTime', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. BUDGET TIERS EDITOR */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8EFF01]/10 border border-[#8EFF01]/20 flex items-center justify-center text-[#8EFF01]">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Budget Tiers Editor ({budgetRanges.length})
              </h3>
              <p className="text-xs text-white/50">
                Options displayed in the interactive project brief budget selection grid
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddBudgetTier}
            className="px-3 py-1.5 rounded-lg bg-[#8EFF01] hover:bg-[#7DE000] text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-3.5 h-3.5" /> Add Tier
          </button>
        </div>

        {/* Budget Section Label */}
        <div>
          <label className="text-[11px] text-white/60 block mb-1">
            Budget Grid Label in Brief Form
          </label>
          <input
            type="text"
            value={contact.budgetLabel || 'Estimated Budget Tier (USD)'}
            onChange={(e) => handleContactChange('budgetLabel', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
          />
        </div>

        {/* List of Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {budgetRanges.map((tier: string, index: number) => (
            <div
              key={index}
              className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-2"
            >
              <span className="text-[10px] text-white/40 font-mono w-5">#{index + 1}</span>

              <input
                type="text"
                value={tier}
                onChange={(e) => handleUpdateBudgetTier(index, e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-[#8EFF01] font-bold outline-none focus:border-[#8EFF01]"
              />

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveBudgetTier(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                  title="Move earlier"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveBudgetTier(index, 'down')}
                  disabled={index === budgetRanges.length - 1}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                  title="Move later"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteBudgetTier(index)}
                  className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                  title="Delete tier"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. PROJECT BRIEF FORM LABELS & SUBMISSION STATES */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Project Brief Form Labels &amp; Placeholders
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-white/50 block mb-1">Form Card Title</label>
              <input
                type="text"
                value={contact.formTitle || ''}
                onChange={(e) => handleContactChange('formTitle', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white font-bold outline-none focus:border-[#8EFF01]"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/50 block mb-1">Step Indicator Badge</label>
              <input
                type="text"
                value={contact.formStepBadge || ''}
                onChange={(e) => handleContactChange('formStepBadge', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-white/50 block mb-1">Name Field Label</label>
              <input
                type="text"
                value={contact.nameLabel || ''}
                onChange={(e) => handleContactChange('nameLabel', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/50 block mb-1">Name Placeholder</label>
              <input
                type="text"
                value={contact.namePlaceholder || ''}
                onChange={(e) => handleContactChange('namePlaceholder', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/50 block mb-1">Email Field Label</label>
              <input
                type="text"
                value={contact.emailLabel || ''}
                onChange={(e) => handleContactChange('emailLabel', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/50 block mb-1">Email Placeholder</label>
              <input
                type="text"
                value={contact.emailPlaceholder || ''}
                onChange={(e) => handleContactChange('emailPlaceholder', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
          </div>

          {/* Service options */}
          <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-semibold text-[#FEFFFC] block">
                  Service Required Dropdown Options
                </label>
                <p className="text-[11px] text-white/50">
                  Custom dropdown on the public brief form automatically displays icons and colors for each option.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleContactChange(
                      'servicesOptions',
                      DEFAULT_PORTFOLIO_CONTENT.contact.servicesOptions
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset to 9 default options"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const current = contact.servicesOptions || DEFAULT_PORTFOLIO_CONTENT.contact.servicesOptions;
                    handleContactChange('servicesOptions', [...current, 'New Service Discipline']);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#8EFF01] hover:bg-[#7DE000] text-black text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Option
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-white/50 block mb-1">Field Label</label>
              <input
                type="text"
                value={contact.serviceLabel || 'Service Required'}
                onChange={(e) => handleContactChange('serviceLabel', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>

            {/* List of service options */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {(contact.servicesOptions || DEFAULT_PORTFOLIO_CONTENT.contact.servicesOptions).map(
                (opt: string, idx: number) => {
                  const meta = getServiceIconMeta(opt);
                  const IconComp = meta.icon;
                  const currentList =
                    contact.servicesOptions || DEFAULT_PORTFOLIO_CONTENT.contact.servicesOptions;

                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-2 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${meta.badgeBg}`}
                          title={`Detected category: ${meta.type}`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...currentList];
                            updated[idx] = e.target.value;
                            handleContactChange('servicesOptions', updated);
                          }}
                          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white font-medium outline-none focus:border-[#8EFF01]"
                          placeholder="e.g. Posters & Art Prints"
                        />
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (idx === 0) return;
                            const updated = [...currentList];
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                            handleContactChange('servicesOptions', updated);
                          }}
                          disabled={idx === 0}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (idx === currentList.length - 1) return;
                            const updated = [...currentList];
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                            handleContactChange('servicesOptions', updated);
                          }}
                          disabled={idx === currentList.length - 1}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = currentList.filter((_: any, i: number) => i !== idx);
                            handleContactChange('servicesOptions', updated);
                          }}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                          title="Delete option"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-white/50 block mb-1">Timeline Label</label>
              <input
                type="text"
                value={contact.deadlineLabel || ''}
                onChange={(e) => handleContactChange('deadlineLabel', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/50 block mb-1">Timeline Placeholder</label>
              <input
                type="text"
                value={contact.deadlinePlaceholder || ''}
                onChange={(e) => handleContactChange('deadlinePlaceholder', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/50 block mb-1">Reference Link Label</label>
              <input
                type="text"
                value={contact.referenceLinkLabel || ''}
                onChange={(e) => handleContactChange('referenceLinkLabel', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/50 block mb-1">Reference Link Placeholder</label>
              <input
                type="text"
                value={contact.referenceLinkPlaceholder || ''}
                onChange={(e) => handleContactChange('referenceLinkPlaceholder', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-white/50 block mb-1">Message Field Label</label>
            <input
              type="text"
              value={contact.messageLabel || ''}
              onChange={(e) => handleContactChange('messageLabel', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01] mb-2"
            />
            <label className="text-[10px] text-white/50 block mb-1">Message Field Placeholder</label>
            <textarea
              rows={2}
              value={contact.messagePlaceholder || ''}
              onChange={(e) => handleContactChange('messagePlaceholder', e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>

          {/* Submission and Success / Confirmation states */}
          <div className="pt-3 border-t border-white/10 space-y-4">
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#8EFF01] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Brief Sent Confirmation Card
                  </h4>
                  <p className="text-[11px] text-white/50 mt-0.5">
                    Displayed with a smooth scale/fade animation and auto-scroll when a client submits a brief.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleContactChange('confirmationTitle', 'We Got The Brief!');
                    handleContactChange(
                      'confirmationMessage',
                      "Thanks for trusting me with your project. I'll review the details and get back to you within 24/48 hours."
                    );
                    handleContactChange('confirmationClosing', "Ideas received. Let's create.");
                    handleContactChange('sendAnotherButtonText', 'Send Another Brief');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset confirmation card text to defaults"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-white/50 block mb-1">
                    Confirmation Top Heading (Yellow / Montserrat Bold)
                  </label>
                  <input
                    type="text"
                    value={contact.confirmationTitle !== undefined ? contact.confirmationTitle : (contact.successTitle || 'We Got The Brief!')}
                    onChange={(e) => {
                      handleContactChange('confirmationTitle', e.target.value);
                      handleContactChange('successTitle', e.target.value);
                    }}
                    placeholder="We Got The Brief!"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-[#8EFF01] font-bold outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] text-white/50 block mb-1">
                    Confirmation Middle Paragraph (White/Grey at reduced opacity / Montserrat Regular)
                  </label>
                  <textarea
                    rows={2}
                    value={
                      contact.confirmationMessage !== undefined
                        ? contact.confirmationMessage
                        : (contact.successMessage ||
                          "Thanks for trusting me with your project. I'll review the details and get back to you within 24/48 hours.")
                    }
                    onChange={(e) => {
                      handleContactChange('confirmationMessage', e.target.value);
                      handleContactChange('successMessage', e.target.value);
                    }}
                    placeholder="Thanks for trusting me with your project. I'll review the details and get back to you within 24/48 hours."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] text-white/50 block mb-1">
                    Confirmation Bottom Line (White / Cormorant Garamond Italic)
                  </label>
                  <input
                    type="text"
                    value={contact.confirmationClosing !== undefined ? contact.confirmationClosing : "Ideas received. Let's create."}
                    onChange={(e) => handleContactChange('confirmationClosing', e.target.value)}
                    placeholder="Ideas received. Let's create."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white italic font-serif outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Submit Button Text</label>
                  <input
                    type="text"
                    value={contact.submitButtonText || ''}
                    onChange={(e) => handleContactChange('submitButtonText', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-[#8EFF01] font-bold outline-none focus:border-[#8EFF01]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Send Another Button Text</label>
                  <input
                    type="text"
                    value={contact.sendAnotherButtonText || 'Send Another Brief'}
                    onChange={(e) => handleContactChange('sendAnotherButtonText', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>
              </div>

              {/* Live Card Mini-Preview */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-2 font-mono">
                  Live Card Preview
                </span>
                <div className="p-6 rounded-[22px] bg-[#0B0B0B] border border-white/15 shadow-[0_0_30px_rgba(129,22,224,0.2)] text-center flex flex-col items-center max-w-[420px] mx-auto relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full border-2 border-[#8EFF01] flex items-center justify-center text-[#8EFF01] mb-3 shadow-[0_0_15px_rgba(142, 255, 1, 0.22)]">
                    <svg viewBox="0 0 96 96" className="w-8 h-8" fill="none">
                      <path d="M28 48 L42 62 L68 36" stroke="#8EFF01" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h4 className="font-montserrat font-bold text-lg text-[#8EFF01] mb-2">
                    {contact.confirmationTitle || contact.successTitle || 'We Got The Brief!'}
                  </h4>
                  <p className="font-montserrat font-normal text-xs text-[#FEFFFC]/75 leading-relaxed">
                    {contact.confirmationMessage ||
                      contact.successMessage ||
                      "Thanks for trusting me with your project. I'll review the details and get back to you within 24/48 hours."}
                  </p>
                  <div className="w-8 h-[2px] bg-[#8EFF01] rounded-full my-3" />
                  <p className="font-cormorant italic text-sm text-[#FEFFFC]">
                    "{((contact.confirmationClosing || "Ideas received. Let's create.") as string).replace(/^["']|["']$/g, '')}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
