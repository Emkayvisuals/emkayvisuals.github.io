import React, { useState, useEffect } from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const { navbar, navigation, brand } = PORTFOLIO_CONTENT;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Simple active section detection
      const sections = ['home', 'services', 'work', 'about', 'process', 'faq', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  if (navbar?.enabled === false) {
    return null;
  }

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);

    if (href === '/gallery' || href.startsWith('/gallery')) {
      if (window.location.pathname !== '/gallery') {
        window.history.pushState({}, '', '/gallery');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'instant' as any });
      }
      return;
    }

    if (href === '/portfolio' || href.startsWith('/portfolio')) {
      if (window.location.pathname !== href) {
        window.history.pushState({}, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'instant' as any });
      }
      return;
    }

    const isOnOtherPage =
      window.location.pathname.startsWith('/portfolio') ||
      window.location.pathname.startsWith('/gallery');

    if (isOnOtherPage) {
      if (href === '#home' || href === '/') {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      window.history.pushState({}, '', `/${href}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      setTimeout(() => {
        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Ensure YouTube / Manipulation Gallery link is included in navigation list
  const rawNavLinks = navigation && navigation.length > 0 ? navigation : [];
  const hasGalleryNav = rawNavLinks.some(
    (item) =>
      item.href === '/gallery' ||
      item.label.toLowerCase().includes('manipulation') ||
      item.label.toLowerCase().includes('gallery')
  );
  const effectiveNavLinks = hasGalleryNav
    ? rawNavLinks
    : [
        ...rawNavLinks,
        { label: 'YouTube / Manipulation Gallery', href: '/gallery', visible: true },
      ];

  const visibleNavLinks = effectiveNavLinks.filter((item) => item.visible !== false);
  const logoAbbr = navbar?.logoAbbr || 'EV';
  const brandName = navbar?.brandName || 'Emkay';
  const brandDivider = navbar?.brandDivider || '//';
  const brandAccent = navbar?.brandAccent || 'Visuals';
  const ctaText = navbar?.ctaText || 'Hire Me';
  const ctaLink = navbar?.ctaLink || '#contact';
  const mobileMenuTitle = navbar?.mobileMenuTitle || 'Portfolio Menu';
  const mobileCtaText = navbar?.mobileCtaText || 'Start a Project / Hire Me';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 py-3 sm:py-5 pointer-events-none">
      <nav
        id="main-navigation"
        className={`pointer-events-auto w-full max-w-5xl rounded-full transition-all duration-300 px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between ${
          scrolled
            ? 'bg-[#050505]/90 backdrop-blur-xl border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.8)]'
            : 'bg-[#050505]/60 backdrop-blur-md border border-white/10'
        }`}
      >
        {/* Brand Logo - Compact on mobile */}
        <a
          href="#home"
          id="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#home');
          }}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none min-h-[44px]"
        >
          {brand?.logoUrl || navbar?.logoUrl ? (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8EFF01]/10 border border-[#8EFF01]/40 overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(142, 255, 1, 0.3)] p-0.5">
              <img
                src={brand?.logoUrl || navbar?.logoUrl}
                alt={brand?.logoAlt || navbar?.logoAlt || 'Emkay Visuals Logo'}
                width="32"
                height="32"
                loading="lazy"
                className="w-full h-full object-contain object-center block"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8EFF01] flex items-center justify-center font-bold text-[#050505] text-[11px] sm:text-xs transition-transform duration-300 group-hover:scale-105 shadow-[0_0_12px_rgba(142, 255, 1, 0.3)] shrink-0">
              {logoAbbr}
            </div>
          )}
          <div className="flex items-center gap-1 leading-none">
            <span className="font-bold text-xs sm:text-sm tracking-wide text-[#FEFFFC]">
              {brandName}
            </span>
            <span className="text-[#8EFF01] text-[11px] font-bold">{brandDivider}</span>
            <span className="text-white/70 text-[11px] sm:text-xs font-normal hidden xs:inline">
              {brandAccent}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-1.5 overflow-x-auto no-scrollbar">
          {visibleNavLinks.map((item) => {
            const isGalleryLink = item.href === '/gallery' || item.href.includes('gallery');
            const sectionId = item.href.replace('#', '').replace('/', '');
            const isActive = isGalleryLink
              ? window.location.pathname === '/gallery'
              : activeSection === sectionId && window.location.pathname === '/';

            return (
              <a
                key={item.label + item.href}
                href={item.href}
                id={`nav-link-${sectionId || 'home'}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                className={`px-2.5 lg:px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 min-h-[44px] flex items-center justify-center whitespace-nowrap ${
                  isActive
                    ? 'text-[#050505] bg-[#FEFFFC] font-semibold shadow-sm'
                    : 'text-[#FEFFFC]/75 hover:text-[#FEFFFC] hover:bg-white/[0.08]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <a
            href={ctaLink}
            id="nav-hire-me-btn"
            onClick={(e) => {
              if (ctaLink.startsWith('#')) {
                e.preventDefault();
                handleLinkClick(ctaLink);
              }
            }}
            className="group relative inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#8EFF01] text-[#050505] font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_18px_rgba(142, 255, 1, 0.26)] whitespace-nowrap min-h-[38px] sm:min-h-[42px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#050505] group-hover:rotate-12 transition-transform shrink-0" />
            <span className="whitespace-nowrap">{ctaText}</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
          </a>

          {/* Menu Trigger (Portfolio Menu) - 44px min tap target */}
          <button
            type="button"
            id="mobile-menu-toggle"
            aria-label="Toggle Portfolio Navigation Menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full text-white/85 hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#8EFF01]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Drawer Dropdown & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="pointer-events-auto fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div
            id="mobile-nav-dropdown"
            className="pointer-events-auto fixed top-18 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#0B0B0B] border border-white/15 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col gap-3 max-h-[85vh] max-h-[85svh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-semibold text-[#8EFF01] tracking-wide">
                {mobileMenuTitle}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1 pt-1">
              {visibleNavLinks.map((item) => {
                const isGalleryLink = item.href === '/gallery' || item.href.includes('gallery');
                const sectionId = item.href.replace('#', '').replace('/', '');
                const isActive = isGalleryLink
                  ? window.location.pathname === '/gallery'
                  : activeSection === sectionId && window.location.pathname === '/';

                return (
                  <a
                    key={item.label + item.href}
                    href={item.href}
                    id={`mobile-nav-${sectionId || 'home'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.href);
                    }}
                    className={`px-4 py-3 rounded-2xl text-sm font-medium tracking-wide transition-all min-h-[44px] flex items-center justify-between group ${
                      isActive
                        ? 'bg-[#8EFF01] text-[#050505] font-bold shadow-md'
                        : 'text-[#FEFFFC]/85 hover:bg-white/[0.08] hover:text-[#FEFFFC]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isGalleryLink && (
                      <ArrowUpRight
                        className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                          isActive ? 'text-[#050505]' : 'text-[#8EFF01]'
                        }`}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <a
                href={ctaLink}
                onClick={(e) => {
                  if (ctaLink.startsWith('#')) {
                    e.preventDefault();
                    handleLinkClick(ctaLink);
                  }
                }}
                className="w-full text-center py-3.5 rounded-2xl bg-[#8EFF01] text-[#050505] font-bold text-sm min-h-[44px] flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(142, 255, 1, 0.3)] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#050505]" />
                <span>{mobileCtaText}</span>
              </a>
              {brand?.statusBadge && (
                <div className="flex justify-center items-center gap-2 text-xs text-white/50 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8EFF01]"></span>
                  <span>{brand.statusBadge}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};
