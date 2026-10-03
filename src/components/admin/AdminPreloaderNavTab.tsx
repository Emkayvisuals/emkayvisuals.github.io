import React from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { SectionToggle } from './SectionToggle';
import { Layout, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { NavLinkItem } from '../../data/portfolioContent';
import { ImageUploadControl } from './ImageUploadControl';

export const AdminPreloaderNavTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const preloader = content.preloader || {
    enabled: true,
    logoAbbr: 'EV',
    brandMain: 'EMKAY',
    divider: '//',
    brandAccent: 'VISUALS',
    tagline: 'PORTFOLIO 2026',
  };

  const brand = content.brand || {
    name: 'Emkay Visuals',
    roleTitle: 'Graphic Designer & Motion Graphics Artist',
    experienceYears: 5,
    tagline: 'Futuristic visual architecture, cinematic key art, and high-octane motion graphics.',
    statusBadge: 'Available for Freelance & Contracts',
    location: 'Available Worldwide / Remote',
  };

  const navbar = content.navbar || {
    enabled: true,
    logoAbbr: 'EV',
    brandName: 'Emkay',
    brandDivider: '//',
    brandAccent: 'Visuals',
    ctaText: 'Hire Me',
    ctaLink: '#contact',
    mobileMenuTitle: 'Portfolio Menu',
    mobileCtaText: 'Start a Project / Hire Me',
  };

  const navigation = content.navigation || [];

  const handlePreloaderChange = (field: string, value: any) => {
    onChange({
      ...content,
      preloader: {
        ...preloader,
        [field]: value,
      },
    });
  };

  const handleBrandChange = (field: string, value: any) => {
    onChange({
      ...content,
      brand: {
        ...brand,
        [field]: value,
      },
    });
  };

  const handleNavbarChange = (field: string, value: any) => {
    onChange({
      ...content,
      navbar: {
        ...navbar,
        [field]: value,
      },
    });
  };

  const handleNavLinkChange = (index: number, field: keyof NavLinkItem, value: any) => {
    const updated = [...navigation];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({
      ...content,
      navigation: updated,
    });
  };

  const addNavLink = () => {
    const newLink: NavLinkItem = {
      label: 'New Link',
      href: '#section',
      visible: true,
    };
    onChange({
      ...content,
      navigation: [...navigation, newLink],
    });
  };

  const deleteNavLink = (index: number) => {
    if (navigation.length <= 1) {
      alert('You must retain at least one navigation link.');
      return;
    }
    const updated = navigation.filter((_, i) => i !== index);
    onChange({
      ...content,
      navigation: updated,
    });
  };

  const moveNavLink = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= navigation.length) return;
    const updated = [...navigation];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({
      ...content,
      navigation: updated,
    });
  };

  return (
    <div className="space-y-6">
      {/* Preloader Settings */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D0FF00]/15 border border-[#D0FF00]/30 flex items-center justify-center text-[#D0FF00]">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Preloader &amp; Curtain Loader</h2>
              <p className="text-xs text-white/50">
                Configure opening splash animation, typography, and status line
              </p>
            </div>
          </div>

          <SaveButton
            state={saveState}
            onSave={() => onSave('Preloader & Navbar')}
            label="Save Header & Preloader"
          />
        </div>

        <SectionToggle
          label="Preloader Curtain Animation"
          checked={preloader.enabled !== false}
          onChange={(val) => handlePreloaderChange('enabled', val)}
          description="Displays the high-fashion monogram curtain animation on initial page load"
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
          <div>
            <label className="text-[11px] text-white/60 block mb-1">Logo Monogram Abbr</label>
            <input
              type="text"
              value={preloader.logoAbbr || 'EV'}
              onChange={(e) => handlePreloaderChange('logoAbbr', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>

          <div>
            <label className="text-[11px] text-white/60 block mb-1">Brand Main</label>
            <input
              type="text"
              value={preloader.brandMain || 'EMKAY'}
              onChange={(e) => handlePreloaderChange('brandMain', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>

          <div>
            <label className="text-[11px] text-white/60 block mb-1">Divider</label>
            <input
              type="text"
              value={preloader.divider || '//'}
              onChange={(e) => handlePreloaderChange('divider', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>

          <div>
            <label className="text-[11px] text-white/60 block mb-1">Brand Accent</label>
            <input
              type="text"
              value={preloader.brandAccent || 'VISUALS'}
              onChange={(e) => handlePreloaderChange('brandAccent', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-[11px] text-white/60 block mb-1">Loader Tagline Note</label>
          <input
            type="text"
            value={preloader.tagline || ''}
            onChange={(e) => handlePreloaderChange('tagline', e.target.value)}
            placeholder="PORTFOLIO 2026"
            className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
          />
        </div>

        {/* Preloader Monogram Graphic / Logo */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <ImageUploadControl
            label="Preloader Custom Monogram / Logo Image (Optional)"
            description="Replaces text monogram with an animated graphic logo on intro curtain. Auto-converted to WebP (512px max)."
            preset="logo"
            imageUrl={preloader.logoUrl || ''}
            imageAlt={preloader.logoAlt || 'Emkay Visuals Monogram'}
            compact={true}
            aspectRatio="square"
            onImageChange={(url, alt) => {
              onChange({
                ...content,
                preloader: { ...preloader, logoUrl: url, logoAlt: alt || '' },
              });
            }}
            onRemove={() => {
              onChange({
                ...content,
                preloader: { ...preloader, logoUrl: '', logoAlt: '' },
              });
            }}
          />
        </div>
      </div>

      {/* Brand Identity */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Artist Brand Identity &amp; Logos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUploadControl
            label="Official Brand Logo / Emblem"
            description="Used across navbar, footer, preloader screen, and browser. Upload or paste URL/path. Auto-resized to 512px WebP."
            preset="logo"
            imageUrl={brand.logoUrl || navbar.logoUrl || ''}
            imageAlt={brand.logoAlt || 'Emkay Visuals Emblem Logo'}
            compact={true}
            aspectRatio="square"
            onImageChange={(url, alt) => {
              onChange({
                ...content,
                brand: { ...brand, logoUrl: url, logoAlt: alt || '' },
                navbar: { ...navbar, logoUrl: url, logoAlt: alt || '' },
                preloader: { ...(content.preloader || {}), logoUrl: url, logoAlt: alt || '' } as any,
                footer: { ...(content.footer || {}), logoUrl: url, logoAlt: alt || '' } as any,
              });
            }}
            onRemove={() => {
              onChange({
                ...content,
                brand: { ...brand, logoUrl: '', logoAlt: '' },
                navbar: { ...navbar, logoUrl: '', logoAlt: '' },
                preloader: { ...(content.preloader || {}), logoUrl: '', logoAlt: '' } as any,
                footer: { ...(content.footer || {}), logoUrl: '', logoAlt: '' } as any,
              });
            }}
          />

          <ImageUploadControl
            label="Favicon / Tab Icon"
            description="Browser tab icon. Auto-resized to 256x256 WebP."
            preset="favicon"
            imageUrl={brand.faviconUrl || content.seo?.faviconUrl || ''}
            imageAlt="Emkay Visuals Favicon"
            compact={true}
            aspectRatio="square"
            onImageChange={(url) => {
              onChange({
                ...content,
                brand: { ...brand, faviconUrl: url },
                seo: { ...(content.seo || {}), faviconUrl: url } as any,
              });
            }}
            onRemove={() => {
              onChange({
                ...content,
                brand: { ...brand, faviconUrl: '' },
                seo: { ...(content.seo || {}), faviconUrl: '' } as any,
              });
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-white/60 block mb-1">Brand Name</label>
            <input
              type="text"
              value={brand.name || ''}
              onChange={(e) => handleBrandChange('name', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>

          <div>
            <label className="text-[11px] text-white/60 block mb-1">Role Title</label>
            <input
              type="text"
              value={brand.roleTitle || ''}
              onChange={(e) => handleBrandChange('roleTitle', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-white/60 block mb-1">Years Experience</label>
            <input
              type="number"
              value={brand.experienceYears || 5}
              onChange={(e) => handleBrandChange('experienceYears', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>

          <div>
            <label className="text-[11px] text-white/60 block mb-1">Status Availability Badge</label>
            <input
              type="text"
              value={brand.statusBadge || ''}
              onChange={(e) => handleBrandChange('statusBadge', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>

          <div>
            <label className="text-[11px] text-white/60 block mb-1">Location / Timezone</label>
            <input
              type="text"
              value={brand.location || ''}
              onChange={(e) => handleBrandChange('location', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>
        </div>
      </div>

      {/* Navbar & Navigation */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Navbar &amp; Menu Links
        </h3>

        <SectionToggle
          label="Navbar Visibility"
          checked={navbar.enabled !== false}
          onChange={(val) => handleNavbarChange('enabled', val)}
          description="Control whether the sticky floating navigation bar is visible"
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] text-white/60 block mb-1">Logo Abbr</label>
            <input
              type="text"
              value={navbar.logoAbbr || 'EV'}
              onChange={(e) => handleNavbarChange('logoAbbr', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>

          <div>
            <label className="text-[11px] text-white/60 block mb-1">Brand Main</label>
            <input
              type="text"
              value={navbar.brandName || 'Emkay'}
              onChange={(e) => handleNavbarChange('brandName', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>

          <div>
            <label className="text-[11px] text-white/60 block mb-1">Divider</label>
            <input
              type="text"
              value={navbar.brandDivider || '//'}
              onChange={(e) => handleNavbarChange('brandDivider', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>

          <div>
            <label className="text-[11px] text-white/60 block mb-1">Brand Accent</label>
            <input
              type="text"
              value={navbar.brandAccent || 'Visuals'}
              onChange={(e) => handleNavbarChange('brandAccent', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-white/60 block mb-1">Navbar CTA Button Text</label>
            <input
              type="text"
              value={navbar.ctaText || 'Hire Me'}
              onChange={(e) => handleNavbarChange('ctaText', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>

          <div>
            <label className="text-[11px] text-white/60 block mb-1">Navbar CTA Button Link</label>
            <input
              type="text"
              value={navbar.ctaLink || '#contact'}
              onChange={(e) => handleNavbarChange('ctaLink', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
            />
          </div>
        </div>

        {/* Nav Links */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation Links ({navigation.length})
            </label>
            <button
              type="button"
              onClick={addNavLink}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Add Link
            </button>
          </div>

          <div className="space-y-2">
            {navigation.map((link: NavLinkItem, idx: number) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-black/60 border border-white/10 flex items-center justify-between gap-3"
              >
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleNavLinkChange(idx, 'label', e.target.value)}
                  placeholder="Link Label"
                  className="px-2.5 py-1 rounded bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#D0FF00]"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => handleNavLinkChange(idx, 'href', e.target.value)}
                  placeholder="#section"
                  className="flex-1 px-2.5 py-1 rounded bg-black/80 border border-white/10 text-xs text-white/80 font-mono outline-none focus:border-[#D0FF00]"
                />

                <label className="flex items-center gap-1 text-[11px] text-white/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.visible !== false}
                    onChange={(e) => handleNavLinkChange(idx, 'visible', e.target.checked)}
                    className="rounded accent-[#D0FF00]"
                  />
                  <span>Show</span>
                </label>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveNavLink(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-white/50 hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveNavLink(idx, 'down')}
                    disabled={idx === navigation.length - 1}
                    className="p-1 text-white/50 hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNavLink(idx)}
                    className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
