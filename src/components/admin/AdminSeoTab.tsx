import React from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { Globe } from 'lucide-react';
import { ImageUploadControl } from './ImageUploadControl';

export const AdminSeoTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const seo = content.seo || {
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
    ogImageAlt: 'Emkay Visuals – Graphic Design & Motion Art Portfolio Banner',
    faviconUrl: '/Images/emblem.webp',
  };

  const handleFieldChange = (field: string, value: string) => {
    onChange({
      ...content,
      seo: {
        ...seo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">SEO &amp; Open Graph Meta Tags</h2>
              <p className="text-xs text-white/50">
                Server-side rendered into the initial HTML so WhatsApp, Instagram, and crawlers read them accurately
              </p>
            </div>
          </div>

          <SaveButton
            state={saveState}
            onSave={() => onSave('SEO & Meta Tags')}
            label="Save SEO Settings"
          />
        </div>

        <div className="space-y-5">
          {/* Meta Title */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-white/80">
                Meta Title (<span className="text-[#8EFF01]">og:title</span> &amp; <span className="text-[#8EFF01]">&lt;title&gt;</span>)
              </label>
              <span className="text-[11px] text-white/40">
                {seo.metaTitle?.length || 0} / 70 recommended
              </span>
            </div>
            <input
              type="text"
              value={seo.metaTitle || ''}
              onChange={(e) => handleFieldChange('metaTitle', e.target.value)}
              placeholder="e.g. Emkay Visuals – Graphic Designer & Motion Graphics Artist"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#8EFF01] text-xs text-white placeholder-white/25 outline-none"
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-white/80">
                Meta Description (<span className="text-[#8EFF01]">og:description</span> &amp; <span className="text-[#8EFF01]">&lt;meta name="description"&gt;</span>)
              </label>
              <span className="text-[11px] text-white/40">
                {seo.metaDescription?.length || 0} / 160 recommended
              </span>
            </div>
            <textarea
              rows={3}
              value={seo.metaDescription || ''}
              onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
              placeholder="e.g. High-end, futuristic portfolio for Emkay Visuals – Graphic Designer & Motion Graphics Artist with 5+ years of experience in Posters, Visual Branding, Movie Art, Thumbnails & Motion Graphics."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#8EFF01] text-xs text-white placeholder-white/25 outline-none leading-relaxed"
            />
          </div>

          {/* Open Graph Image & Favicon Controls */}
          <div className="space-y-4">
            <ImageUploadControl
              label="Open Graph Social Banner (og:image)"
              description="Standard 1200x630px social banner for WhatsApp, Instagram, iMessage, and Twitter previews. Auto-resized to 1200x630 WebP (<700KB)."
              preset="og"
              aspectRatio="og"
              imageUrl={seo.ogImage || ''}
              imageAlt={seo.ogImageAlt || 'Emkay Visuals – Graphic Design & Motion Art'}
              showAltField={true}
              onImageChange={(url, alt) => {
                onChange({
                  ...content,
                  seo: { ...seo, ogImage: url, ogImageAlt: alt || '' },
                });
              }}
              onRemove={() => {
                onChange({
                  ...content,
                  seo: { ...seo, ogImage: '', ogImageAlt: '' },
                });
              }}
            />

            <ImageUploadControl
              label="Favicon / Tab Icon"
              description="Favicon served in browser tab header. Auto-resized to 256x256 WebP."
              preset="favicon"
              compact={true}
              aspectRatio="square"
              imageUrl={seo.faviconUrl || content.brand?.faviconUrl || ''}
              imageAlt="Emkay Visuals Favicon"
              showAltField={false}
              onImageChange={(url) => {
                onChange({
                  ...content,
                  seo: { ...seo, faviconUrl: url },
                  brand: { ...(content.brand || {}), faviconUrl: url } as any,
                });
              }}
              onRemove={() => {
                onChange({
                  ...content,
                  seo: { ...seo, faviconUrl: '' },
                  brand: { ...(content.brand || {}), faviconUrl: '' } as any,
                });
              }}
            />
          </div>

          {/* Social Share Preview Card */}
          {seo.ogImage && (
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider block mb-2">
                Live Social Share Preview (WhatsApp / Facebook / LinkedIn Card)
              </span>
              <div className="max-w-md rounded-xl overflow-hidden border border-white/15 bg-[#121212] shadow-xl">
                <div className="relative aspect-[1200/630] w-full bg-black/60 overflow-hidden">
                  <img
                    src={seo.ogImage}
                    alt={seo.ogImageAlt || 'Open Graph Preview'}
                    width="1200"
                    height="630"
                    loading="lazy"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3.5 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">
                    emkayvisuals.github.io
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {seo.metaTitle || 'Emkay Visuals'}
                  </h4>
                  <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">
                    {seo.metaDescription || 'High-end futuristic design portfolio'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
