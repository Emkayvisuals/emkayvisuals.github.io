import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { StatsRow } from './components/StatsRow';
import { ServicesBento } from './components/ServicesBento';
import { WorkGallery } from './components/WorkGallery';
import { PortfolioPage } from './components/PortfolioPage';
import { GalleryPage } from './components/GalleryPage';
import { AboutSection } from './components/AboutSection';
import { ProcessSection } from './components/ProcessSection';
import { Testimonials } from './components/Testimonials';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingContactBar } from './components/FloatingContactBar';
import { AdminDashboard } from './components/AdminDashboard';
import {
  PORTFOLIO_CONTENT,
  loadPortfolioFromFirestore,
  initRealtimePortfolio,
  subscribeToPortfolio,
} from './data/portfolioContent';
import { trackVisit } from './lib/analytics';

export default function App() {
  const [tick, setTick] = useState(0);
  const [prefilledService, setPrefilledService] = useState<string | undefined>(undefined);
  const [prefilledProject, setPrefilledProject] = useState<string | undefined>(undefined);
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  // Sync route changes on popstate (Back / Forward browser buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (url: string) => {
    window.history.pushState({}, '', url);
    setCurrentPath(window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    trackVisit();
    initRealtimePortfolio();
    loadPortfolioFromFirestore();
    const unsubscribe = subscribeToPortfolio(() => {
      setTick(t => t + 1);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (PORTFOLIO_CONTENT.seo) {
      const { metaTitle, metaDescription, ogImage } = PORTFOLIO_CONTENT.seo;
      if (metaTitle) {
        document.title = metaTitle;
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', metaTitle);
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle) twTitle.setAttribute('content', metaTitle);
      }
      if (metaDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', metaDescription);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', metaDescription);
        const twDesc = document.querySelector('meta[name="twitter:description"]');
        if (twDesc) twDesc.setAttribute('content', metaDescription);
      }
      if (ogImage) {
        const ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg) ogImg.setAttribute('content', ogImage);
        const ogSecureImg = document.querySelector('meta[property="og:image:secure_url"]');
        if (ogSecureImg) ogSecureImg.setAttribute('content', ogImage);
        const twImg = document.querySelector('meta[name="twitter:image"]');
        if (twImg) twImg.setAttribute('content', ogImage);
      }

      const currentUrl = `https://emkayvisuals.github.io${window.location.pathname}`;
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) canonicalLink.setAttribute('href', currentUrl);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', currentUrl);
      const twUrl = document.querySelector('meta[name="twitter:url"]');
      if (twUrl) twUrl.setAttribute('content', currentUrl);

      // Favicon & Apple Touch Icon
      const activeFavicon =
        PORTFOLIO_CONTENT.seo?.faviconUrl ||
        PORTFOLIO_CONTENT.brand?.faviconUrl ||
        PORTFOLIO_CONTENT.brand?.logoUrl ||
        '/emkay.webp';

      if (activeFavicon) {
        let iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!iconLink) {
          iconLink = document.createElement('link');
          iconLink.rel = 'icon';
          document.head.appendChild(iconLink);
        }
        iconLink.href = activeFavicon;

        let appleIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
        if (!appleIcon) {
          appleIcon = document.createElement('link');
          appleIcon.rel = 'apple-touch-icon';
          document.head.appendChild(appleIcon);
        }
        appleIcon.href = activeFavicon;
      }
    }
  }, [tick, currentPath]);

  // Route Dispatching
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    return <AdminDashboard />;
  }

  const handleSelectService = (serviceTitle: string) => {
    setPrefilledService(serviceTitle);
  };

  const handleSelectProjectForContact = (projectTitle: string) => {
    setPrefilledProject(projectTitle);
  };

  // Dedicated /portfolio archive route
  if (currentPath === '/portfolio' || currentPath.startsWith('/portfolio/')) {
    return (
      <PortfolioPage
        onNavigateHome={() => navigateTo('/')}
        onSelectProjectForContact={handleSelectProjectForContact}
      />
    );
  }

  // Dedicated /gallery YouTube / Manipulation Gallery route
  if (
    currentPath === '/gallery' ||
    currentPath === '/gallery/' ||
    currentPath.startsWith('/gallery') ||
    currentPath === '/manipulation-gallery' ||
    currentPath.startsWith('/manipulation-gallery')
  ) {
    return (
      <GalleryPage
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  // Primary Homepage View
  return (
    <div className="relative min-h-screen min-h-svh bg-[#050505] text-[#FEFFFC] selection:bg-[#D0FF00] selection:text-[#050505] overflow-x-hidden w-full">
      {/* Curtain Preloader on first load */}
      <Preloader onLoadingComplete={() => {}} />

      {/* Floating Pill Navigation Bar */}
      <Navbar />

      {/* Hero Section with Glowing Gradients and Floating Tags */}
      <Hero />

      {/* Infinite Scrolling Ribbon / Marquee of Services */}
      <Marquee />

      {/* Key Stats Row: 5+ Years Experience, Projects Completed, Happy Clients */}
      <StatsRow />

      {/* Bento-Style Services Grid */}
      <ServicesBento onSelectService={handleSelectService} />

      {/* Work Gallery: Filter Buttons, 4-Project Limit on Home, View More Button & Lightbox */}
      <WorkGallery
        onSelectProjectForContact={handleSelectProjectForContact}
        onNavigateToPortfolio={(category) => {
          const targetUrl =
            category && category !== 'All'
              ? `/portfolio?category=${encodeURIComponent(category)}`
              : '/portfolio';
          navigateTo(targetUrl);
        }}
      />

      {/* About Me Section with Photo Placeholder & Software Stack */}
      <AboutSection />

      {/* Simple 4-Step Creative Process */}
      <ProcessSection />

      {/* Client Testimonials & Endorsements */}
      <Testimonials />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* Contact Section: Interactive Form + WhatsApp, Instagram, Email Buttons */}
      <ContactSection
        prefilledService={prefilledService}
        prefilledProject={prefilledProject}
      />

      {/* Footer */}
      <Footer />

      {/* Floating Quick Contact Bar with WhatsApp, Instagram & Email */}
      <FloatingContactBar />
    </div>
  );
}
