import React from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { SectionToggle } from './SectionToggle';
import { PanelBottom, Share2 } from 'lucide-react';
import { ImageUploadControl } from './ImageUploadControl';

export const AdminFooterTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const footer = content.footer || {
    enabled: true,
    logoAbbr: 'EV',
    brandName: 'Emkay',
    brandDivider: '//',
    brandAccent: 'Visuals',
    tagline:
      'Designing tomorrow’s aesthetics today. High-impact visuals & kinetic motion graphics.',
    copyright: '© 2026 Emkay Visuals. All rights reserved.',
    rightsNote:
      'Handcrafted with precision. All artworks protected under creative copyright.',
    backToTopAria: 'Scroll to Top',
  };

  const socials = content.socials || {
    email: 'emkayvisuals@gmail.com',
    emailMailto: 'mailto:emkayvisuals@gmail.com',
    whatsapp: '09161889909',
    whatsappDisplay: '09161889909',
    whatsappUrl: 'https://wa.me/2349161889909',
    instagramDesigns: {
      handle: '@emkayvisuals',
      label: 'Graphic & Motion Designs',
      url: 'https://instagram.com/emkayvisuals',
    },
    instagramFx: {
      handle: '@emkayvisuals_fx',
      label: 'Digital Art & Photo Manipulations',
      url: 'https://instagram.com/emkayvisuals_fx',
    },
    behance: 'https://behance.net/emkayvisuals',
    dribbble: 'https://dribbble.com/emkayvisuals',
    youtube: 'https://youtube.com',
    vimeo: 'https://vimeo.com',
  };

  const handleFooterChange = (field: string, value: any) => {
    onChange({
      ...content,
      footer: {
        ...footer,
        [field]: value,
      },
    });
  };

  const handleSocialsChange = (field: string, value: any) => {
    onChange({
      ...content,
      socials: {
        ...socials,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D0FF00]/15 border border-[#D0FF00]/30 flex items-center justify-center text-[#D0FF00]">
              <PanelBottom className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Footer &amp; Brand Socials</h2>
              <p className="text-xs text-white/50">
                Configure closing tagline, copyright notices, and external social media links
              </p>
            </div>
          </div>

          <SaveButton
            state={saveState}
            onSave={() => onSave('Footer & Socials')}
            label="Save Footer"
          />
        </div>

        {/* Section visibility toggle */}
        <SectionToggle
          label="Footer Visibility"
          checked={footer.enabled !== false}
          onChange={(val) => handleFooterChange('enabled', val)}
          description="Control whether the footer is displayed at the bottom of the page"
        />

        <div className="space-y-6">
          {/* Brand Wordmark in Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-white/60 block mb-1">Logo Abbr</label>
              <input
                type="text"
                value={footer.logoAbbr || 'EV'}
                onChange={(e) => handleFooterChange('logoAbbr', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/60 block mb-1">Brand Main</label>
              <input
                type="text"
                value={footer.brandName || 'Emkay'}
                onChange={(e) => handleFooterChange('brandName', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/60 block mb-1">Brand Divider</label>
              <input
                type="text"
                value={footer.brandDivider || '//'}
                onChange={(e) => handleFooterChange('brandDivider', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/60 block mb-1">Brand Accent</label>
              <input
                type="text"
                value={footer.brandAccent || 'Visuals'}
                onChange={(e) => handleFooterChange('brandAccent', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
              />
            </div>
          </div>

          {/* Footer Logo / Monogram Image */}
          <div>
            <ImageUploadControl
              label="Footer Brand Logo / Monogram Graphic (Optional)"
              description="Displays above the footer tagline and copyright. Auto-resized to 512px WebP."
              preset="logo"
              imageUrl={footer.logoUrl || content.brand?.logoUrl || ''}
              imageAlt={footer.logoAlt || content.brand?.logoAlt || 'Emkay Visuals Logo'}
              compact={true}
              aspectRatio="square"
              onImageChange={(url, alt) => {
                const updated = { ...footer, logoUrl: url, logoAlt: alt || '' };
                onChange({
                  ...content,
                  footer: updated,
                  brand: { ...(content.brand || {}), logoUrl: url, logoAlt: alt || '' } as any,
                  navbar: { ...(content.navbar || {}), logoUrl: url, logoAlt: alt || '' } as any,
                });
              }}
              onRemove={() => {
                const updated = { ...footer, logoUrl: '', logoAlt: '' };
                onChange({
                  ...content,
                  footer: updated,
                  brand: { ...(content.brand || {}), logoUrl: '', logoAlt: '' } as any,
                  navbar: { ...(content.navbar || {}), logoUrl: '', logoAlt: '' } as any,
                });
              }}
            />
          </div>

          {/* Footer Tagline */}
          <div>
            <label className="text-[11px] text-white/60 block mb-1">Footer Tagline</label>
            <textarea
              rows={2}
              value={footer.tagline || ''}
              onChange={(e) => handleFooterChange('tagline', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>

          {/* Copyright & Rights Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-white/60 block mb-1">Copyright Notice</label>
              <input
                type="text"
                value={footer.copyright || ''}
                onChange={(e) => handleFooterChange('copyright', e.target.value)}
                placeholder="© 2026 Emkay Visuals. All rights reserved."
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
              />
            </div>

            <div>
              <label className="text-[11px] text-white/60 block mb-1">Production Aesthetic Note</label>
              <input
                type="text"
                value={footer.rightsNote || ''}
                onChange={(e) => handleFooterChange('rightsNote', e.target.value)}
                placeholder="Handcrafted with precision..."
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
              />
            </div>
          </div>

          {/* Scroll to Top Aria */}
          <div className="max-w-xs">
            <label className="text-[11px] text-white/60 block mb-1">Scroll to Top Button Text</label>
            <input
              type="text"
              value={footer.backToTopAria || 'Scroll to Top'}
              onChange={(e) => handleFooterChange('backToTopAria', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>

          {/* Social Profiles */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#D0FF00]" />
              Social Media Channels &amp; Handles
            </h3>

            <div className="space-y-3">
              {/* Instagram Designs */}
              <div className="p-3 rounded-lg bg-black/60 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                <span className="text-xs font-bold text-white">Instagram (Designs)</span>
                <input
                  type="text"
                  value={socials.instagramDesigns?.handle || ''}
                  onChange={(e) =>
                    handleSocialsChange('instagramDesigns', {
                      ...socials.instagramDesigns,
                      handle: e.target.value,
                    })
                  }
                  placeholder="@emkayvisuals"
                  className="px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
                />
                <input
                  type="url"
                  value={socials.instagramDesigns?.url || ''}
                  onChange={(e) =>
                    handleSocialsChange('instagramDesigns', {
                      ...socials.instagramDesigns,
                      url: e.target.value,
                    })
                  }
                  placeholder="https://instagram.com/..."
                  className="px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white/80 outline-none focus:border-[#D0FF00] font-mono"
                />
              </div>

              {/* Instagram FX */}
              <div className="p-3 rounded-lg bg-black/60 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                <span className="text-xs font-bold text-white">Instagram (FX / Art)</span>
                <input
                  type="text"
                  value={socials.instagramFx?.handle || ''}
                  onChange={(e) =>
                    handleSocialsChange('instagramFx', {
                      ...socials.instagramFx,
                      handle: e.target.value,
                    })
                  }
                  placeholder="@emkayvisuals_fx"
                  className="px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
                />
                <input
                  type="url"
                  value={socials.instagramFx?.url || ''}
                  onChange={(e) =>
                    handleSocialsChange('instagramFx', {
                      ...socials.instagramFx,
                      url: e.target.value,
                    })
                  }
                  placeholder="https://instagram.com/..."
                  className="px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white/80 outline-none focus:border-[#D0FF00] font-mono"
                />
              </div>

              {/* Behance */}
              <div className="p-3 rounded-lg bg-black/60 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                <span className="text-xs font-bold text-white">Behance Portfolio URL</span>
                <input
                  type="url"
                  value={socials.behance || ''}
                  onChange={(e) => handleSocialsChange('behance', e.target.value)}
                  placeholder="https://behance.net/emkayvisuals"
                  className="sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white/80 outline-none focus:border-[#D0FF00] font-mono"
                />
              </div>

              {/* Dribbble */}
              <div className="p-3 rounded-lg bg-black/60 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                <span className="text-xs font-bold text-white">Dribbble Portfolio URL</span>
                <input
                  type="url"
                  value={socials.dribbble || ''}
                  onChange={(e) => handleSocialsChange('dribbble', e.target.value)}
                  placeholder="https://dribbble.com/emkayvisuals"
                  className="sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white/80 outline-none focus:border-[#D0FF00] font-mono"
                />
              </div>

              {/* WhatsApp Display & URL */}
              <div className="p-3 rounded-lg bg-black/60 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                <span className="text-xs font-bold text-white">WhatsApp Number &amp; Link</span>
                <input
                  type="text"
                  value={socials.whatsappDisplay || ''}
                  onChange={(e) => handleSocialsChange('whatsappDisplay', e.target.value)}
                  placeholder="09161889909"
                  className="px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
                />
                <input
                  type="url"
                  value={socials.whatsappUrl || ''}
                  onChange={(e) => handleSocialsChange('whatsappUrl', e.target.value)}
                  placeholder="https://wa.me/2349161889909"
                  className="px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white/80 outline-none focus:border-[#D0FF00] font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
