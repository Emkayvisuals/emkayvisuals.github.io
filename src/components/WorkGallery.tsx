import React, { useState, useEffect } from 'react';
import {
  PORTFOLIO_CONTENT,
  ProjectItem,
  usePortfolio,
} from '../data/portfolioContent';
import { ProjectLightbox } from './ProjectLightbox';
import {
  Sparkles,
  Maximize2,
  Play,
  ArrowRight,
  Filter,
  Grid,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  isMotionCategory,
  getEffectiveProjectImage,
} from '../lib/videoUtils';

interface WorkGalleryProps {
  onSelectProjectForContact?: (title: string) => void;
  onNavigateToPortfolio?: (category?: string) => void;
  onNavigateToGallery?: () => void;
}

export const WorkGallery: React.FC<WorkGalleryProps> = ({
  onSelectProjectForContact,
  onNavigateToPortfolio,
  onNavigateToGallery,
}) => {
  const { content, isReady } = usePortfolio();
  const { categories, projects, projectsSection } = content;
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<{ [id: string]: boolean }>({});

  if (projectsSection?.enabled === false) {
    return null;
  }

  const badgeMain = projectsSection?.badgeMain || 'Selected';
  const badgeAccent = projectsSection?.badgeAccent || 'Archive';
  const headingMain = projectsSection?.headingMain || 'Featured Design';
  const headingAccent = projectsSection?.headingAccent || 'Portfolio';
  const subtext =
    projectsSection?.subtext ||
    'Filter through 5+ years of commissioned artworks, sports graphics, theatrical movie key art, and visual identities. Click any piece to inspect in full detail.';
  const filterLabel = projectsSection?.filterLabel || 'Filter:';
  const viewProjectText = projectsSection?.viewProjectText || 'View Project';
  const viewMoreButtonText = projectsSection?.viewMoreButtonText || 'View More Projects';
  const manipulationGalleryButtonText =
    projectsSection?.manipulationGalleryButtonText || 'View My Photo Manipulation Gallery';

  const visibleProjects = (projects || []).filter((p) => p.visible !== false);

  // Filter categories that have at least 1 visible project (excluding empty categories from the site's filter bar)
  const availableCategories = (categories || []).filter((cat) => {
    if (cat === 'All') return visibleProjects.length > 0;
    return visibleProjects.some(
      (p) => p.category?.trim().toLowerCase() === cat.trim().toLowerCase()
    );
  });

  // Filter projects by active category
  const filteredProjects =
    activeCategory === 'All'
      ? visibleProjects
      : visibleProjects.filter(
          (p) => p.category?.trim().toLowerCase() === activeCategory.trim().toLowerCase()
        );

  // Homepage 6 projects limit
  const displayedProjects = filteredProjects.slice(0, 6);
  const hasMoreProjects = filteredProjects.length > 6;

  // Lightbox navigation
  const handleNext = () => {
    if (!selectedProject) return;
    const currentIndex = displayedProjects.findIndex((p) => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % displayedProjects.length;
    setSelectedProject(displayedProjects[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedProject) return;
    const currentIndex = displayedProjects.findIndex((p) => p.id === selectedProject.id);
    const prevIndex = (currentIndex - 1 + displayedProjects.length) % displayedProjects.length;
    setSelectedProject(displayedProjects[prevIndex]);
  };

  const handleInquireFromLightbox = (projectTitle: string) => {
    if (onSelectProjectForContact) {
      onSelectProjectForContact(projectTitle);
    }
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewMoreClick = () => {
    if (onNavigateToPortfolio) {
      onNavigateToPortfolio(activeCategory);
    } else {
      const url =
        activeCategory === 'All'
          ? '/portfolio'
          : `/portfolio?category=${encodeURIComponent(activeCategory)}`;
      window.location.href = url;
    }
  };

  // Support direct project links e.g. /?project=sport001
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const projectIdParam = urlParams.get('project');
      if (projectIdParam) {
        const found = (projects || []).find(
          (p) =>
            p.id?.toLowerCase() === projectIdParam.toLowerCase() ||
            p.title?.toLowerCase() === decodeURIComponent(projectIdParam).toLowerCase()
        );
        if (found) {
          setSelectedProject(found);
        }
      }
    } catch {
      // Ignore
    }
  }, [projects]);

  const handleCloseLightbox = () => {
    setSelectedProject(null);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('project')) {
        urlParams.delete('project');
        const remainingQuery = urlParams.toString();
        const cleanUrl = remainingQuery
          ? `${window.location.pathname}?${remainingQuery}`
          : window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
    } catch {
      // Ignore
    }
  };

  const handleManipulationGalleryClick = () => {
    if (onNavigateToGallery) {
      onNavigateToGallery();
    } else {
      window.location.href = '/gallery';
    }
  };

  return (
    <section id="work" className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Section Glows */}
      <div
        className="pointer-events-none absolute top-40 right-10 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.115]"
        style={{ background: '#8116E0' }}
      />
      <div
        className="pointer-events-none absolute bottom-40 left-10 w-[350px] h-[350px] rounded-full blur-[150px] opacity-[0.092]"
        style={{ background: '#8EFF01' }}
      />

      {/* Header with Smooth Scroll Fade/Slide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#8EFF01] text-[11px] sm:text-xs font-semibold tracking-wide mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {badgeMain}{' '}
              {badgeAccent && (
                <span className="font-baskervville italic text-[#FEFFFC]">{badgeAccent}</span>
              )}
            </span>
          </div>
          <h2 className="font-montserrat font-medium italic text-xl sm:text-3xl lg:text-4xl text-[#8EFF01] tracking-tight leading-[1.15]">
            {headingMain}{' '}
            <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
              {headingAccent}
            </span>
          </h2>
        </div>
        <p className="max-w-md text-xs sm:text-sm text-white/70 font-normal leading-relaxed">
          {subtext}
        </p>
      </motion.div>

      {/* Filter Buttons */}
      {!isReady ? (
        <div className="relative z-10 mb-6 sm:mb-8 overflow-x-auto pb-2.5 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {[75, 90, 105, 80].map((w, idx) => (
              <div
                key={idx}
                style={{ width: w }}
                className="h-9 rounded-full bg-white/5 relative overflow-hidden"
              >
                <div className="animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
      ) : availableCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 mb-6 sm:mb-8 overflow-x-auto pb-2.5 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar"
        >
          <div className="flex items-center gap-2 min-w-max">
            <div className="flex items-center gap-1.5 pl-1 pr-2 text-[11px] sm:text-xs font-semibold text-white/50">
              <Filter className="w-3 h-3 text-[#8EFF01]" />
              <span>{filterLabel}</span>
            </div>

            {availableCategories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  id={`filter-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer whitespace-nowrap min-h-[38px] sm:min-h-[40px] flex items-center active:scale-95 ${
                    isActive
                      ? 'bg-[#8EFF01] text-[#050505] font-bold shadow-[0_0_36px_rgba(142, 255, 1, 0.75)]'
                      : 'glass-panel text-[#FEFFFC]/70 hover:text-[#FEFFFC] hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Main Portfolio Grid */}
      <motion.div
        layout
        className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
      >
        {!isReady ? (
          [...Array(6)].map((_, idx) => (
            <div
              key={`work-skeleton-${idx}`}
              className="relative rounded-2xl sm:rounded-3xl glass-panel border border-white/[0.08] overflow-hidden flex flex-col bg-[#050505]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#121212]">
                <div className="animate-shimmer" />
              </div>
              <div className="p-4 sm:p-4.5 flex flex-col justify-between flex-1 bg-[#050505] space-y-3">
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-white/10 overflow-hidden relative">
                    <div className="animate-shimmer" />
                  </div>
                  <div className="h-3 w-1/2 rounded bg-white/5 overflow-hidden relative">
                    <div className="animate-shimmer" />
                  </div>
                </div>
                <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="h-3 w-20 rounded bg-white/5" />
                  <div className="h-3 w-16 rounded bg-white/5" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, idx) => {
              const isMotion = isMotionCategory(project.category) || !!project.videoUrl;
              const effectiveImage = getEffectiveProjectImage(project);

              return (
                <motion.div
                  layout
                  key={project.id}
                  id={`portfolio-item-${project.id}`}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(idx * 0.04, 0.25),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    y: -5,
                    scale: 1.012,
                    transition: { duration: 0.2, ease: 'easeOut' },
                  }}
                  onClick={() => setSelectedProject(project)}
                  className="group relative rounded-2xl sm:rounded-3xl glass-panel border border-white/[0.08] hover:border-[#8EFF01]/50 overflow-hidden cursor-pointer flex flex-col bg-[#050505]"
                >
                  {/* Subtle top glow bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#8EFF01]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

                  {/* Media Container with Zoom */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#121212]">
                    {!loadedImages[project.id] && (
                      <div className="absolute inset-0 bg-[#121212] overflow-hidden">
                        <div className="animate-shimmer" />
                      </div>
                    )}
                    <img
                      src={effectiveImage}
                      alt={project.imageAlt || project.title}
                      width="800"
                      height="600"
                      onLoad={() => setLoadedImages((prev) => ({ ...prev, [project.id]: true }))}
                      className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-108 ${
                        loadedImages[project.id] ? 'opacity-100 blur-0 scale-100' : 'opacity-0 scale-105'
                      }`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Top Category Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                      <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[#FEFFFC]">
                        {project.category}
                      </span>
                      {isMotion && (
                        <span className="text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-[#8EFF01] text-[#050505] flex items-center gap-1 shadow-sm">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          Motion
                        </span>
                      )}
                    </div>

                    {/* Year tag (if present) */}
                    {project.year && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white/70">
                          {project.year}
                        </span>
                      </div>
                    )}

                    {/* Hover Center Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-[#8EFF01] text-[#050505] flex items-center justify-center shadow-[0_0_35px_rgba(142, 255, 1, 0.65)] transform group-hover:scale-110 transition-transform duration-300">
                        {isMotion ? (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Meta Content */}
                  <div className="p-4 sm:p-4.5 flex flex-col justify-between flex-1 bg-[#050505]">
                    <div>
                      <h3 className="font-montserrat font-medium italic text-base sm:text-lg text-[#8EFF01] tracking-tight line-clamp-1 mb-1">
                        {project.title}
                      </h3>
                      {project.description && project.description.trim() && (
                        <p className="text-[11px] sm:text-xs text-white/65 line-clamp-2 leading-relaxed font-normal">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between min-h-[36px]">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-white/45 truncate max-w-full">
                        {project.tools && project.tools.filter(Boolean).length > 0 ? (
                          <>
                            <span className="truncate">{project.tools[0]}</span>
                            {project.tools[1] && <span className="truncate">• {project.tools[1]}</span>}
                          </>
                        ) : (
                          <span className="truncate">{project.category}</span>
                        )}
                      </div>
                      <span className="text-[11px] sm:text-xs text-[#8EFF01] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold whitespace-nowrap">
                        {viewProjectText} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Centered Actions under projects (View More if >7 exist, followed directly by View My Photo Manipulation Gallery button) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="relative z-10 mt-9 sm:mt-11 flex flex-col items-center justify-center text-center gap-3.5"
      >
        {hasMoreProjects && (
          <div className="flex flex-col items-center">
            <button
              type="button"
              id="portfolio-view-more-button"
              onClick={handleViewMoreClick}
              className="group px-6 py-3 rounded-full bg-[#8EFF01] hover:bg-[#7DE000] text-[#050505] font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 shadow-[0_0_45px_rgba(142, 255, 1, 0.75)] hover:shadow-[0_0_65px_rgba(142, 255, 1, 0.95)] flex items-center gap-2.5 cursor-pointer min-h-[42px] sm:min-h-[46px] transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Grid className="w-3.5 h-3.5 text-[#050505]" />
              <span>{viewMoreButtonText}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black/15 text-[11px] font-black">
                +{filteredProjects.length - 6} More
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#050505] transition-transform group-hover:translate-x-1" />
            </button>
            <p className="mt-2 text-[11px] text-white/50 font-normal">
              Browse all {filteredProjects.length} {activeCategory === 'All' ? 'featured' : activeCategory} artworks in full archive
            </p>
          </div>
        )}

        {/* Secondary Button: View My Photo Manipulation Gallery */}
        <button
          type="button"
          id="portfolio-manipulation-gallery-button"
          onClick={handleManipulationGalleryClick}
          className="group px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/20 hover:border-[#8EFF01]/60 bg-white/5 hover:bg-[#8EFF01]/10 text-white/80 hover:text-white font-medium text-xs tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer min-h-[36px] backdrop-blur-sm transform hover:scale-[1.01] active:scale-[0.99] shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#8EFF01]/80 group-hover:text-[#8EFF01] transition-colors" />
          <span>{manipulationGalleryButtonText}</span>
          <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[#8EFF01] transition-transform group-hover:translate-x-0.5" />
        </button>
      </motion.div>

      {/* Lightbox Modal */}
      <ProjectLightbox
        project={selectedProject}
        onClose={handleCloseLightbox}
        onNext={handleNext}
        onPrev={handlePrev}
        onInquire={handleInquireFromLightbox}
      />
    </section>
  );
};
