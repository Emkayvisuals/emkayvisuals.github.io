import React, { useEffect, useState } from 'react';
import { ProjectItem, PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { X, ChevronLeft, ChevronRight, Sparkles, Play, Layers, Share2, Check } from 'lucide-react';
import {
  isMotionCategory,
  getEmbedVideoUrl,
  getVideoType,
  getEffectiveProjectImage,
} from '../lib/videoUtils';

interface ProjectLightboxProps {
  project: ProjectItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onInquire: (title: string) => void;
}

export const ProjectLightbox: React.FC<ProjectLightboxProps> = ({
  project,
  onClose,
  onNext,
  onPrev,
  onInquire,
}) => {
  const { projectsSection } = PORTFOLIO_CONTENT;
  const videoEmbedBadge = projectsSection?.videoEmbedBadge || 'Motion Reel';
  const toolsLabel = projectsSection?.toolsLabel || 'Software & Tools Used';
  const inquireButtonText = projectsSection?.inquireProjectButtonText || 'Inquire Similar Project';
  const lightboxHint = projectsSection?.lightboxHint || 'Use arrow keys ← → to browse works';

  // Active media inside the lightbox: 'video' | number (0-based index into allImages)
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | 'video'>('video');
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isBouncing, setIsBouncing] = useState<'left' | 'right' | null>(null);
  const [transitioningTo, setTransitioningTo] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const isMotion = project ? isMotionCategory(project.category) || !!project.videoUrl : false;
  const hasVideo = !!(project && project.videoUrl && project.videoUrl.trim());
  const mainCoverImage = project ? getEffectiveProjectImage(project) : '';

  const allImages = React.useMemo(() => {
    if (!project) return [];
    const list: Array<{ url: string; alt?: string }> = [
      { url: mainCoverImage, alt: project.imageAlt || project.title },
    ];
    if (project.extraImages && project.extraImages.length > 0) {
      project.extraImages.forEach((img) => {
        if (img && img.url) {
          list.push({ url: img.url, alt: img.alt || project.title });
        }
      });
    }
    return list;
  }, [project, mainCoverImage]);

  const copyToClipboard = async (url: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!project) return;

    // Canonical shareable URL pointing directly to this project
    const path = window.location.pathname.startsWith('/portfolio') ? '/portfolio' : '/';
    const shareUrl = `${window.location.origin}${path}?project=${encodeURIComponent(project.id)}`;

    const shareData = {
      title: `${project.title} | Emkay Visuals`,
      text: project.description
        ? `${project.title} — ${project.description.slice(0, 120)}`
        : `Check out "${project.title}" by Emkay Visuals`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (hasVideo) {
      setActiveMediaIndex('video');
    } else {
      setActiveMediaIndex(0); // 0 = main cover image (view 1)
    }
    setTouchDelta(0);
    setIsBouncing(null);
    setTransitioningTo(null);
    setCopied(false);
  }, [project?.id, hasVideo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, onNext, onPrev]);

  if (!project) return null;

  const currentImageIndex = typeof activeMediaIndex === 'number' ? activeMediaIndex : 0;
  const currentImage = allImages[currentImageIndex] || allImages[0];
  const videoEmbedUrl = hasVideo ? getEmbedVideoUrl(project.videoUrl) : null;
  const videoType = hasVideo ? getVideoType(project.videoUrl) : null;

  const isDragging = touchStart !== null && transitioningTo === null;

  // Determine incoming image and swipe progress for smooth real-time crossfade tracking
  let incomingIndex: number | null = null;
  let incomingDirection: 'next' | 'prev' | null = null;
  let swipeProgress = 0;

  if (transitioningTo !== null) {
    incomingIndex = transitioningTo;
    incomingDirection = incomingIndex > currentImageIndex ? 'next' : 'prev';
    swipeProgress = 1;
  } else if (touchDelta < 0 && currentImageIndex < allImages.length - 1) {
    incomingIndex = currentImageIndex + 1;
    incomingDirection = 'next';
    swipeProgress = Math.min(1, Math.max(0, -touchDelta / 120));
  } else if (touchDelta > 0 && currentImageIndex > 0) {
    incomingIndex = currentImageIndex - 1;
    incomingDirection = 'prev';
    swipeProgress = Math.min(1, Math.max(0, touchDelta / 120));
  }

  const incomingImage = incomingIndex !== null ? allImages[incomingIndex] : null;

  // Touch handlers for mobile swipe between images of the same project
  const handleTouchStart = (e: React.TouchEvent) => {
    if (allImages.length <= 1 || activeMediaIndex === 'video' || transitioningTo !== null) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchDelta(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || allImages.length <= 1 || activeMediaIndex === 'video' || transitioningTo !== null) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      const isAtStart = currentImageIndex === 0 && deltaX > 0;
      const isAtEnd = currentImageIndex === allImages.length - 1 && deltaX < 0;

      if (isAtStart || isAtEnd) {
        setTouchDelta(deltaX * 0.25); // Boundary resistance
      } else {
        setTouchDelta(deltaX);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || allImages.length <= 1 || activeMediaIndex === 'video' || transitioningTo !== null) {
      setTouchStart(null);
      setTouchDelta(0);
      return;
    }

    const threshold = 40;
    if (touchDelta < -threshold) {
      // Swiped left -> advance to next image in this project with soft crossfade
      if (currentImageIndex < allImages.length - 1) {
        const targetIdx = currentImageIndex + 1;
        setTransitioningTo(targetIdx);
        setTouchStart(null);
        setTimeout(() => {
          setActiveMediaIndex(targetIdx);
          setTransitioningTo(null);
          setTouchDelta(0);
        }, 240);
        return;
      } else {
        // At end: gentle bounce feedback without switching project
        setIsBouncing('right');
        setTimeout(() => setIsBouncing(null), 300);
      }
    } else if (touchDelta > threshold) {
      // Swiped right -> go to previous image in this project with soft crossfade
      if (currentImageIndex > 0) {
        const targetIdx = currentImageIndex - 1;
        setTransitioningTo(targetIdx);
        setTouchStart(null);
        setTimeout(() => {
          setActiveMediaIndex(targetIdx);
          setTransitioningTo(null);
          setTouchDelta(0);
        }, 240);
        return;
      } else {
        // At start: gentle bounce feedback without switching project
        setIsBouncing('left');
        setTimeout(() => setIsBouncing(null), 300);
      }
    }

    // Cancelled swipe below threshold -> smoothly springs back with transform/opacity transition
    setTouchStart(null);
    setTouchDelta(0);
  };

  const handlePrevInProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setTransitioningTo(null);
      setTouchDelta(0);
      setActiveMediaIndex(currentImageIndex - 1);
    }
  };

  const handleNextInProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < allImages.length - 1) {
      setTransitioningTo(null);
      setTouchDelta(0);
      setActiveMediaIndex(currentImageIndex + 1);
    }
  };

  return (
    <div
      id="project-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/92 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      {/* Container - Scrollable on mobile so all details & Inquire button are always reachable */}
      <div
        className="relative w-full max-w-5xl max-h-[94vh] max-h-[94svh] sm:max-h-[92vh] sm:max-h-[92svh] glass-panel bg-[#050505] border border-white/15 rounded-2xl sm:rounded-3xl overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row shadow-[0_25px_60px_rgba(0,0,0,0.9)] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Controls: Share & Close Buttons - 44px min tap targets */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          {/* Share Button (Web Share API with copy fallback) */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share this project"
            title={copied ? 'Link copied!' : 'Share project link'}
            className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full border transition-all focus:outline-none cursor-pointer shadow-lg backdrop-blur-md ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.35)] scale-105'
                : 'bg-black/80 text-white/85 hover:text-[#8EFF01] hover:bg-black border-white/10 active:scale-95'
            }`}
          >
            {copied ? (
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Lightbox"
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/80 text-white/85 hover:text-[#8EFF01] hover:bg-black border border-white/10 transition-colors focus:outline-none cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transient "Link copied!" feedback toast */}
        {copied && (
          <div className="absolute top-15 sm:top-16 right-3 z-40 px-3.5 py-1.5 rounded-full bg-black/95 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-2xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150 backdrop-blur-md pointer-events-none">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Link copied to clipboard!</span>
          </div>
        )}

        {/* Visual / Media Side - Reserved height to eliminate shrinking and layout shift */}
        <div className="relative flex-shrink-0 lg:flex-1 bg-black flex flex-col items-center justify-center min-h-[300px] sm:min-h-[420px] lg:min-h-[520px] overflow-hidden group border-b lg:border-b-0 border-white/10">
          <div className="w-full flex-1 min-h-[300px] sm:min-h-[420px] lg:min-h-[520px] flex items-center justify-center p-2 sm:p-3 max-h-[50vh] max-h-[50svh] sm:max-h-[58vh] sm:max-h-[58svh] lg:max-h-[70vh] lg:max-h-[70svh] relative">
            {activeMediaIndex === 'video' && hasVideo && videoEmbedUrl ? (
              <div className="w-full h-full aspect-video flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-2xl">
                {videoType === 'mp4' ? (
                  <video
                    src={project.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain max-h-[48vh] max-h-[48svh] sm:max-h-[55vh] sm:max-h-[55svh] lg:max-h-[70vh] lg:max-h-[70svh]"
                  />
                ) : (
                  <iframe
                    src={videoEmbedUrl}
                    title={project.title}
                    className="w-full h-full min-h-[220px] sm:min-h-[360px] lg:min-h-[400px] border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              <div
                className="relative w-full h-full min-h-[280px] sm:min-h-[380px] lg:min-h-[460px] flex items-center justify-center p-1 sm:p-2 overflow-hidden select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Shimmer Sweep Loading Placeholder */}
                {!loadedImages[currentImage?.url] && (
                  <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 z-10 pointer-events-none">
                    <div className="relative w-full h-full max-h-[46vh] max-h-[46svh] sm:max-h-[54vh] sm:max-h-[54svh] lg:max-h-[68vh] lg:max-h-[68svh] rounded-lg sm:rounded-xl overflow-hidden bg-[#0d0d0d] border border-white/10 flex items-center justify-center">
                      <div className="animate-shimmer" />
                    </div>
                  </div>
                )}

                {/* Current Active Image */}
                <img
                  key={`curr-${currentImageIndex}`}
                  src={currentImage?.url}
                  alt={currentImage?.alt || project.imageAlt || project.title}
                  width="1600"
                  height="1200"
                  loading="lazy"
                  draggable={false}
                  onLoad={() => {
                    if (currentImage?.url) {
                      setLoadedImages((prev) => ({ ...prev, [currentImage.url]: true }));
                    }
                  }}
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
                    opacity: incomingImage
                      ? Math.max(0, 1 - swipeProgress)
                      : loadedImages[currentImage?.url]
                      ? 1
                      : 0,
                    transition: isDragging
                      ? 'none'
                      : 'transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.24s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                  className="max-h-[46vh] max-h-[46svh] sm:max-h-[54vh] sm:max-h-[54svh] lg:max-h-[68vh] lg:max-h-[68svh] w-auto max-w-full object-contain rounded-lg sm:rounded-xl shadow-2xl select-none pointer-events-auto transition-opacity duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Incoming Image for Smooth Real-time Crossfade */}
                {incomingImage && (
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
                      src={incomingImage.url}
                      alt={incomingImage.alt || project.imageAlt || project.title}
                      width="1600"
                      height="1200"
                      loading="lazy"
                      draggable={false}
                      onLoad={() => {
                        if (incomingImage?.url) {
                          setLoadedImages((prev) => ({ ...prev, [incomingImage.url]: true }));
                        }
                      }}
                      className="max-h-[46vh] max-h-[46svh] sm:max-h-[54vh] sm:max-h-[54svh] lg:max-h-[68vh] lg:max-h-[68svh] w-auto max-w-full object-contain rounded-lg sm:rounded-xl shadow-2xl select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Desktop Edge Hover Controls: Left Edge (Previous image in project) */}
                {allImages.length > 1 && currentImageIndex > 0 && activeMediaIndex !== 'video' && (
                  <div
                    onClick={handlePrevInProject}
                    aria-label="Previous image in this project"
                    className="hidden md:flex absolute left-2 sm:left-4 top-4 bottom-4 w-[18%] max-w-[130px] items-center justify-start pl-2 z-10 cursor-pointer group/edge-prev select-none"
                    title="Previous image"
                  >
                    <div className="w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white/80 group-hover/edge-prev:text-[#8EFF01] group-hover/edge-prev:border-[#8EFF01]/60 group-hover/edge-prev:bg-black/90 group-hover/edge-prev:scale-110 flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover/edge-prev:opacity-100">
                      <ChevronLeft className="w-5 h-5 -ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Desktop Edge Hover Controls: Right Edge (Next image in project) */}
                {allImages.length > 1 && currentImageIndex < allImages.length - 1 && activeMediaIndex !== 'video' && (
                  <div
                    onClick={handleNextInProject}
                    aria-label="Next image in this project"
                    className="hidden md:flex absolute right-2 sm:right-4 top-4 bottom-4 w-[18%] max-w-[130px] items-center justify-end pr-2 z-10 cursor-pointer group/edge-next select-none"
                    title="Next image"
                  >
                    <div className="w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white/80 group-hover/edge-next:text-[#8EFF01] group-hover/edge-next:border-[#8EFF01]/60 group-hover/edge-next:bg-black/90 group-hover/edge-next:scale-110 flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover/edge-next:opacity-100">
                      <ChevronRight className="w-5 h-5 -mr-0.5" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Numbered Tabs Gallery Strip - Pinned directly below image, more subtle and compact */}
          {(allImages.length > 1 || hasVideo) && (
            <div className="w-full flex-shrink-0 px-3 py-2 bg-black/85 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar z-10">
              {hasVideo && (
                <button
                  type="button"
                  onClick={() => {
                    setTransitioningTo(null);
                    setTouchDelta(0);
                    setActiveMediaIndex('video');
                  }}
                  className={`h-8 px-2.5 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeMediaIndex === 'video'
                      ? 'bg-[#8EFF01] text-[#050505] shadow-[0_0_8px_rgba(142, 255, 1, 0.26)]'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  Video
                </button>
              )}

              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTransitioningTo(null);
                    setTouchDelta(0);
                    setActiveMediaIndex(idx);
                  }}
                  aria-label={`View image ${idx + 1}`}
                  className={`w-8 h-8 min-w-[32px] rounded-md text-[11px] font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    activeMediaIndex === idx
                      ? 'bg-[#8EFF01] text-[#050505] shadow-[0_0_8px_rgba(142, 255, 1, 0.26)] scale-105'
                      : 'bg-white/[0.08] text-white/60 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}

          {/* Previous / Next Project Arrow Controls (Kept as outer edge project-to-project navigators) */}
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous Project"
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/80 hover:bg-[#8EFF01] text-white hover:text-black transition-all border border-white/15 cursor-pointer shadow-lg z-20"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next Project"
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/80 hover:bg-[#8EFF01] text-white hover:text-black transition-all border border-white/15 cursor-pointer shadow-lg z-20"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Info & Meta Details Side */}
        <div className="w-full lg:w-[360px] xl:w-[400px] p-5 sm:p-7 flex flex-col justify-between flex-shrink-0 lg:flex-shrink lg:overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/10 bg-[#050505]">
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3.5">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#8116E0]/20 border border-[#8116E0]/40 text-[#FEFFFC]">
                {project.category}
              </span>
              {project.year && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/70">
                  {project.year}
                </span>
              )}
              {isMotion && hasVideo && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#8EFF01]/15 border border-[#8EFF01]/30 text-[#8EFF01]">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {videoEmbedBadge}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-montserrat font-medium italic text-xl sm:text-2xl text-[#8EFF01] tracking-tight leading-snug mb-2">
              {project.title}
            </h3>

            {/* Description - Only if present and non-empty */}
            {project.description && project.description.trim() && (
              <div className="text-xs sm:text-sm text-white/75 font-normal leading-relaxed mb-5">
                {project.description}
              </div>
            )}

            {/* Software / Tools stack - Only if present and non-empty */}
            {project.tools && project.tools.filter(Boolean).length > 0 && (
              <div className="mb-5">
                <span className="block text-xs font-semibold text-white/45 mb-2 tracking-wide">
                  {toolsLabel}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools.filter(Boolean).map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-white/80"
                    >
                      <Layers className="w-3 h-3 text-[#8EFF01]" />
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer in Lightbox - 44px min tap targets */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onInquire(project.title);
                }}
                className="flex-1 py-3.5 rounded-full bg-[#8EFF01] hover:bg-[#7DE000] text-[#050505] font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-[0_0_20px_rgba(142, 255, 1, 0.26)] flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
              >
                <Sparkles className="w-4 h-4 text-[#050505]" />
                <span>{inquireButtonText}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share this project link"
                title={copied ? 'Link copied!' : 'Share project link'}
                className={`px-3.5 sm:px-4 py-3.5 rounded-full border transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[46px] shadow-sm select-none active:scale-[0.98] ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/15'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#8EFF01]" />
                    <span className="text-xs font-semibold hidden xs:inline">Share</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-[11px] text-white/40 font-normal">
              {lightboxHint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
