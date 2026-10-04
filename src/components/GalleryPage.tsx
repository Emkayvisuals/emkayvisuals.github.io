import React, { useState, useEffect } from 'react';
import {
  PORTFOLIO_CONTENT,
  ManipulationGalleryItem,
  ManipulationGalleryConfig,
} from '../data/portfolioContent';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingContactBar } from './FloatingContactBar';
import {
  ArrowLeft,
  ArrowRight,
  X,
  ExternalLink,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryPageProps {
  onNavigateHome: () => void;
}

// Pre-seeded aspect ratio dictionary from actual image dimensions to prevent any layout shifts
const KNOWN_DIMENSIONS: Record<string, 'portrait' | 'landscape'> = {
  'Flying tortise.webp': 'landscape',
  'NY1.webp': 'landscape',
  'NY2.webp': 'landscape',
  'doom1.webp': 'portrait',
  'doom2.webp': 'portrait',
  'forest1.webp': 'portrait',
  'forest2.webp': 'portrait',
  'forest3.webp': 'portrait',
  'judgement1.webp': 'portrait',
  'judgement2.webp': 'portrait',
  'judgement3.webp': 'portrait',
  'new year.webp': 'portrait',
  'victim0.webp': 'portrait',
  'victim1.webp': 'portrait',
  'victim2.webp': 'portrait',
};

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigateHome }) => {
  const content = PORTFOLIO_CONTENT;
  const config: ManipulationGalleryConfig = (content.manipulationGallery || {
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
  }) as ManipulationGalleryConfig;

  const [selectedItem, setSelectedItem] = useState<ManipulationGalleryItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [lightboxLoaded, setLightboxLoaded] = useState<Record<string, boolean>>({});

  // Lightbox gesture and transition states
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isBouncing, setIsBouncing] = useState<'left' | 'right' | null>(null);
  const [transitioningTo, setTransitioningTo] = useState<number | null>(null);

  // Dynamic automatic image orientation detector
  const [orientations, setOrientations] = useState<Record<string, 'portrait' | 'landscape'>>(() => {
    const initial: Record<string, 'portrait' | 'landscape'> = {};
    (config.items || []).forEach((item) => {
      // Check known files first
      for (const [filename, orient] of Object.entries(KNOWN_DIMENSIONS)) {
        if (item.image && item.image.includes(filename)) {
          initial[item.id] = orient;
          return;
        }
      }
      if (item.aspectRatio === 'landscape' || item.aspectRatio === 'portrait') {
        initial[item.id] = item.aspectRatio;
      } else {
        initial[item.id] = 'portrait';
      }
    });
    return initial;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, []);

  // Reset gesture state when selected item changes
  useEffect(() => {
    setTouchDelta(0);
    setIsBouncing(null);
    setTransitioningTo(null);
  }, [selectedItem?.id]);

  // Update orientation and loaded status automatically
  const handleImageLoad = (id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const isLandscape = img.naturalWidth > img.naturalHeight;
      const detected = isLandscape ? 'landscape' : 'portrait';
      setOrientations((prev) => {
        if (prev[id] === detected) return prev;
        return { ...prev, [id]: detected };
      });
    }
  };

  const galleryItems = (config.items || []).filter((item) => item.visible !== false);

  // YouTube Channel URL resolution
  const resolvedYoutubeUrl =
    config.youtubeChannelUrl ||
    content.socials?.youtube ||
    'https://youtube.com/@emkayvisuals';

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === 'Escape') {
        setSelectedItem(null);
      } else if (e.key === 'ArrowRight') {
        const currIdx = galleryItems.findIndex((it) => it.id === selectedItem.id);
        if (currIdx !== -1 && currIdx < galleryItems.length - 1) {
          setSelectedItem(galleryItems[currIdx + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        const currIdx = galleryItems.findIndex((it) => it.id === selectedItem.id);
        if (currIdx !== -1 && currIdx > 0) {
          setSelectedItem(galleryItems[currIdx - 1]);
        }
      }
    };

    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem, galleryItems]);

  const currentItemIndex = selectedItem
    ? galleryItems.findIndex((it) => it.id === selectedItem.id)
    : 0;

  const isDragging = touchStart !== null && transitioningTo === null;

  // Real-time swipe crossfade tracking
  let incomingIndex: number | null = null;
  let incomingDirection: 'next' | 'prev' | null = null;
  let swipeProgress = 0;

  if (transitioningTo !== null) {
    incomingIndex = transitioningTo;
    incomingDirection = incomingIndex > currentItemIndex ? 'next' : 'prev';
    swipeProgress = 1;
  } else if (touchDelta < 0 && currentItemIndex < galleryItems.length - 1) {
    incomingIndex = currentItemIndex + 1;
    incomingDirection = 'next';
    swipeProgress = Math.min(1, Math.max(0, -touchDelta / 120));
  } else if (touchDelta > 0 && currentItemIndex > 0) {
    incomingIndex = currentItemIndex - 1;
    incomingDirection = 'prev';
    swipeProgress = Math.min(1, Math.max(0, touchDelta / 120));
  }

  const incomingItem = incomingIndex !== null ? galleryItems[incomingIndex] : null;

  // Touch handlers for swipe navigation between artworks
  const handleTouchStart = (e: React.TouchEvent) => {
    if (galleryItems.length <= 1 || transitioningTo !== null) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchDelta(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || galleryItems.length <= 1 || transitioningTo !== null) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      const isAtStart = currentItemIndex === 0 && deltaX > 0;
      const isAtEnd = currentItemIndex === galleryItems.length - 1 && deltaX < 0;

      if (isAtStart || isAtEnd) {
        setTouchDelta(deltaX * 0.25); // Boundary resistance
      } else {
        setTouchDelta(deltaX);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || galleryItems.length <= 1 || transitioningTo !== null) {
      setTouchStart(null);
      setTouchDelta(0);
      return;
    }

    const threshold = 40;
    if (touchDelta < -threshold) {
      if (currentItemIndex < galleryItems.length - 1) {
        const targetIdx = currentItemIndex + 1;
        setTransitioningTo(targetIdx);
        setTouchStart(null);
        setTimeout(() => {
          setSelectedItem(galleryItems[targetIdx]);
          setTransitioningTo(null);
          setTouchDelta(0);
        }, 240);
        return;
      } else {
        setIsBouncing('right');
        setTimeout(() => setIsBouncing(null), 300);
      }
    } else if (touchDelta > threshold) {
      if (currentItemIndex > 0) {
        const targetIdx = currentItemIndex - 1;
        setTransitioningTo(targetIdx);
        setTouchStart(null);
        setTimeout(() => {
          setSelectedItem(galleryItems[targetIdx]);
          setTransitioningTo(null);
          setTouchDelta(0);
        }, 240);
        return;
      } else {
        setIsBouncing('left');
        setTimeout(() => setIsBouncing(null), 300);
      }
    }

    setTouchStart(null);
    setTouchDelta(0);
  };

  const handleNextItem = () => {
    if (!selectedItem) return;
    if (currentItemIndex < galleryItems.length - 1) {
      setSelectedItem(galleryItems[currentItemIndex + 1]);
    }
  };

  const handlePrevItem = () => {
    if (!selectedItem) return;
    if (currentItemIndex > 0) {
      setSelectedItem(galleryItems[currentItemIndex - 1]);
    }
  };

  return (
    <div className="relative min-h-screen min-h-svh bg-[#050505] text-[#FEFFFC] selection:bg-[#8EFF01] selection:text-[#050505] overflow-x-hidden w-full flex flex-col">
      {/* Top Floating Navbar */}
      <Navbar />

      {/* 2.a HEADER IMAGE: One plain image spanning the top of the page, full width, no card, no border, no title text over it */}
      <div className="w-full relative overflow-hidden bg-black">
        <img
          src={config.headerImage || '/Images/manipulation/Flying tortise.webp'}
          alt={config.headerImageAlt || 'Photo Manipulation Header Artwork'}
          className="w-full h-auto max-h-[50vh] max-h-[50svh] sm:max-h-[60vh] sm:max-h-[60svh] lg:max-h-[68vh] lg:max-h-[68svh] object-cover object-center block"
          loading="eager"
        />
      </div>

      {/* Main Content Area: Side padding matches the rest of the site (px-4 sm:px-6 lg:px-8 max-w-7xl) */}
      <main className="flex-1 relative pt-6 sm:pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Ambient background glows */}
        <div
          className="pointer-events-none absolute top-10 right-10 w-[450px] h-[450px] rounded-full blur-[170px] opacity-[0.115]"
          style={{ background: '#8116E0' }}
        />
        <div
          className="pointer-events-none absolute top-96 left-5 w-[400px] h-[400px] rounded-full blur-[150px] opacity-[0.092]"
          style={{ background: '#8EFF01' }}
        />

        {/* Navigation Bar / Breadcrumb back to Home */}
        <div className="relative z-10 mb-6 sm:mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-[#8EFF01] hover:text-[#7DE000] border border-white/10 transition-all font-semibold text-xs tracking-wide min-h-[42px] cursor-pointer group shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Portfolio</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#8EFF01]" />
            <span className="hidden xs:inline">YouTube //</span>
            <span>Manipulation Gallery</span>
          </div>
        </div>

        {/* 2.b INTRO TEXT: Introducing visitors to the YouTube channel, focused on photo manipulation content */}
        <div className="relative z-10 mb-12 sm:mb-16">
          <p className="font-montserrat text-sm sm:text-base md:text-[17px] text-white/80 font-normal leading-relaxed max-w-4xl">
            {config.introParagraph}
          </p>
        </div>

        {/* 2.c "VISIT MY YOUTUBE CHANNEL" SECTION */}
        <div className="relative z-10 mb-14 sm:mb-20 flex flex-col items-center">
          <h2 className="font-montserrat font-medium italic text-xl sm:text-2xl lg:text-3xl text-[#8EFF01] tracking-tight mb-4 flex items-center justify-center gap-2.5 text-center">
            <span>{config.youtubeSectionTitle || 'Visit my YouTube channel'}</span>
          </h2>

          <a
            href={resolvedYoutubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Emkay Visuals on YouTube (opens in new tab)"
            className="group relative block w-full max-w-xl mx-auto rounded-2xl overflow-hidden border border-white/10 hover:border-[#8EFF01]/50 transition-all duration-300 shadow-[0_6px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(142, 255, 1, 0.15)] cursor-pointer bg-[#0B0B0B]"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/50">
              <img
                src={config.youtubeThumbnailImage || '/Images/thumbnail/airdrop1.webp'}
                alt={config.youtubeThumbnailAlt || 'Visit Emkay Visuals YouTube Channel'}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-70 group-hover:opacity-45 transition-opacity" />

              {/* Small YouTube icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600">
                  <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Bottom pill & channel badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white text-[11px] sm:text-xs font-semibold">
                  <svg className="w-3.5 h-3.5 fill-[#FF0000]" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>Watch Tutorials & Breakdowns</span>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:text-[#8EFF01] group-hover:bg-white/20 transition-all">
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* 2.d & 3. "MY GALLERY" SECTION & CARD LAYOUT */}
        <div className="relative z-10">
          <div className="mb-6 sm:mb-8 flex items-baseline justify-between">
            <h2 className="font-montserrat font-medium italic text-xl sm:text-3xl lg:text-4xl text-[#8EFF01] tracking-tight">
              {config.gallerySectionTitle || 'My Gallery'}
            </h2>
            <span className="text-xs text-white/50 font-mono">
              {galleryItems.length} Artworks
            </span>
          </div>

          {/* Sharp corners, tighter gaps, dense responsive grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 [grid-auto-flow:dense] gap-1.5 sm:gap-2 md:gap-2.5">
            {galleryItems.map((item) => {
              const isLandscape = orientations[item.id] === 'landscape';
              const colSpanClass = isLandscape
                ? 'col-span-2 md:col-span-2 lg:col-span-2'
                : 'col-span-1 md:col-span-1 lg:col-span-1';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedItem(item);
                    }
                  }}
                  aria-label={`View artwork: ${item.title}`}
                  className={`${colSpanClass} group relative rounded-none overflow-hidden border border-white/10 hover:border-[#8EFF01]/50 bg-[#0B0B0B] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8EFF01]/50`}
                >
                  <div className={`relative w-full overflow-hidden ${isLandscape ? 'aspect-[16/9]' : 'aspect-[3/4]'} bg-[#121212]`}>
                    {!loadedImages[item.id] && (
                      <div className="absolute inset-0 bg-[#121212] overflow-hidden">
                        <div className="animate-shimmer" />
                      </div>
                    )}
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      onLoad={(e) => handleImageLoad(item.id, e)}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        loadedImages[item.id] ? 'opacity-100' : 'opacity-0'
                      }`}
                    />

                    {/* Subtle overlay at bottom on hover/tap with small artwork title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 sm:p-2.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-white text-[11px] sm:text-xs font-medium tracking-wide truncate">
                          {item.title}
                        </span>
                        <Maximize2 className="w-3 h-3 text-[#8EFF01] shrink-0 opacity-80" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Lightbox Modal with Swipe Navigation and Smooth Real-time Crossfade */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-xl"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="relative max-w-5xl max-h-[92vh] max-h-[92svh] w-full flex flex-col items-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close Lightbox"
                className="absolute -top-11 right-0 sm:right-2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next controls */}
              {galleryItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevItem}
                    disabled={currentItemIndex === 0}
                    aria-label="Previous Artwork"
                    className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/80 hover:bg-black border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 disabled:opacity-20 cursor-pointer z-20"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextItem}
                    disabled={currentItemIndex === galleryItems.length - 1}
                    aria-label="Next Artwork"
                    className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/80 hover:bg-black border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 disabled:opacity-20 cursor-pointer z-20"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Artwork Image Container with Reserved Size & Shimmer Sweep */}
              <div
                className="relative w-full min-h-[300px] sm:min-h-[460px] lg:min-h-[580px] max-h-[75vh] max-h-[75svh] flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border border-white/15 bg-[#0a0a0a] shadow-[0_10px_40px_rgba(0,0,0,0.9)]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Shimmer sweep placeholder while current image loads */}
                {!lightboxLoaded[selectedItem.image] && (
                  <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 z-10 pointer-events-none">
                    <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#0e0e0e] border border-white/10 flex items-center justify-center">
                      <div className="animate-shimmer" />
                    </div>
                  </div>
                )}

                {/* Current Artwork Image */}
                <img
                  key={`gallery-curr-${selectedItem.id}`}
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  draggable={false}
                  onLoad={() => setLightboxLoaded((prev) => ({ ...prev, [selectedItem.image]: true }))}
                  style={{
                    transform:
                      isBouncing === 'left'
                        ? 'translateX(18px)'
                        : isBouncing === 'right'
                        ? 'translateX(-18px)'
                        : transitioningTo !== null
                        ? incomingDirection === 'next'
                          ? 'translateX(-60px)'
                          : 'translateX(60px)'
                        : touchDelta
                        ? `translateX(${touchDelta * 0.45}px)`
                        : 'none',
                    opacity: incomingItem
                      ? Math.max(0, 1 - swipeProgress)
                      : lightboxLoaded[selectedItem.image]
                      ? 1
                      : 0,
                    transition: isDragging
                      ? 'none'
                      : 'transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.24s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                  className="max-h-[74vh] max-h-[74svh] max-w-full w-auto object-contain rounded-lg sm:rounded-xl select-none transition-opacity duration-300 pointer-events-auto"
                />

                {/* Incoming Artwork Image for Smooth Real-time Crossfade */}
                {incomingItem && (
                  <div
                    className="absolute inset-0 flex items-center justify-center p-1 sm:p-2 pointer-events-none"
                    style={{
                      opacity: swipeProgress,
                      transform:
                        transitioningTo !== null
                          ? 'translateX(0px)'
                          : incomingDirection === 'next'
                          ? `translateX(${45 * (1 - swipeProgress) + touchDelta * 0.25}px)`
                          : `translateX(${-45 * (1 - swipeProgress) + touchDelta * 0.25}px)`,
                      transition: isDragging
                        ? 'none'
                        : 'transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.24s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                  >
                    <img
                      src={incomingItem.image}
                      alt={incomingItem.title}
                      draggable={false}
                      onLoad={() => setLightboxLoaded((prev) => ({ ...prev, [incomingItem.image]: true }))}
                      className="max-h-[74vh] max-h-[74svh] max-w-full w-auto object-contain rounded-lg sm:rounded-xl select-none"
                    />
                  </div>
                )}
              </div>

              {/* Caption with Index */}
              <div className="mt-3 text-center px-4 flex items-center justify-center gap-2">
                <h3 className="text-sm sm:text-base font-medium text-[#FEFFFC] tracking-wide">
                  {selectedItem.title}
                </h3>
                <span className="text-xs text-white/40 font-mono">
                  ({currentItemIndex + 1}/{galleryItems.length})
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />

      {/* Floating Quick Contact Bar */}
      <FloatingContactBar />
    </div>
  );
};
