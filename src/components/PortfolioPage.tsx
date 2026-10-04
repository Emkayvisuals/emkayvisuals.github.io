import React, { useState, useEffect } from 'react';
import { PORTFOLIO_CONTENT, ProjectItem } from '../data/portfolioContent';
import { ProjectLightbox } from './ProjectLightbox';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingContactBar } from './FloatingContactBar';
import {
  Sparkles,
  Maximize2,
  Play,
  ArrowLeft,
  ArrowRight,
  Filter,
  Layers,
  FolderKanban,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  isMotionCategory,
  getEffectiveProjectImage,
} from '../lib/videoUtils';

interface PortfolioPageProps {
  onNavigateHome: () => void;
  onSelectProjectForContact?: (title: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigateHome,
  onSelectProjectForContact,
}) => {
  const { categories, projects, projectsSection } = PORTFOLIO_CONTENT;

  // Read initial category from URL search params e.g. /portfolio?category=Posters
  const getInitialCategory = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category');
      if (catParam) {
        return decodeURIComponent(catParam);
      }
    } catch {
      // Fallback
    }
    return 'All';
  };

  const [activeCategory, setActiveCategory] = useState<string>(getInitialCategory);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, []);

  const badgeMain = projectsSection?.badgeMain || 'Selected';
  const badgeAccent = projectsSection?.badgeAccent || 'Archive';
  const headingMain = projectsSection?.headingMain || 'Featured Design';
  const headingAccent = projectsSection?.headingAccent || 'Portfolio';
  const filterLabel = projectsSection?.filterLabel || 'Filter:';
  const viewProjectText = projectsSection?.viewProjectText || 'View Project';

  const visibleProjects = (projects || []).filter((p) => p.visible !== false);

  // Compute categories that have >= 1 visible project
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

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    try {
      const newUrl =
        cat === 'All'
          ? '/portfolio'
          : `/portfolio?category=${encodeURIComponent(cat)}`;
      window.history.replaceState({ category: cat }, '', newUrl);
    } catch {
      // Ignore
    }
  };

  // Support direct project links e.g. /portfolio?project=sport001
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
          if (found.category && activeCategory !== 'All' && found.category.toLowerCase() !== activeCategory.toLowerCase()) {
            setActiveCategory(found.category);
          }
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

  // Lightbox navigation
  const handleNext = () => {
    if (!selectedProject) return;
    const currentIndex = filteredProjects.findIndex((p) => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedProject) return;
    const currentIndex = filteredProjects.findIndex((p) => p.id === selectedProject.id);
    const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSelectedProject(filteredProjects[prevIndex]);
  };

  const handleInquireFromLightbox = (projectTitle: string) => {
    if (onSelectProjectForContact) {
      onSelectProjectForContact(projectTitle);
    }
    onNavigateHome();
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className="relative min-h-screen min-h-svh bg-[#050505] text-[#FEFFFC] selection:bg-[#8EFF01] selection:text-[#050505] overflow-x-hidden w-full flex flex-col">
      <Navbar />

      <main className="flex-1 relative pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Background Glows */}
        <div
          className="pointer-events-none absolute top-20 right-10 w-[500px] h-[500px] rounded-full blur-[180px] opacity-[0.12]"
          style={{ background: '#8116E0' }}
        />
        <div
          className="pointer-events-none absolute top-96 left-10 w-[450px] h-[450px] rounded-full blur-[160px] opacity-[0.085]"
          style={{ background: '#8EFF01' }}
        />

        {/* Back to Home Navigation Bar */}
        <div className="relative z-10 mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#8EFF01] hover:text-[#7DE000] border border-white/10 transition-all font-semibold text-xs tracking-wide min-h-[44px] cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-white/50">
            <FolderKanban className="w-4 h-4 text-[#8EFF01]" />
            <span>
              Showing <strong className="text-white">{filteredProjects.length}</strong> of{' '}
              <strong className="text-white">{visibleProjects.length}</strong> Works
            </span>
          </div>
        </div>

        {/* Header Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#8EFF01] text-xs font-semibold tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {badgeMain}{' '}
              {badgeAccent && (
                <span className="font-baskervville italic text-[#FEFFFC]">{badgeAccent}</span>
              )}
            </span>
          </div>
          <h1 className="font-montserrat font-medium italic text-3xl sm:text-5xl lg:text-6xl text-[#8EFF01] tracking-tight leading-[1.12] mb-4">
            {headingMain}{' '}
            <span className="font-cormorant italic font-medium text-[1.1em] text-[#FEFFFC]">
              {headingAccent} Archive
            </span>
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed font-normal">
            Complete high-resolution archive of graphic design, sports visual key art, movie posters,
            music cover artworks, and kinetic motion reels created over 5+ years of craft.
          </p>
        </motion.div>

        {/* Dynamic Category Filter Buttons (Hiding Categories with 0 Visible Projects) */}
        {availableCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="relative z-10 mb-10 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar"
          >
            <div className="flex items-center gap-2 min-w-max">
              <div className="flex items-center gap-1.5 pl-1 pr-2 text-xs font-semibold text-white/50">
                <Filter className="w-3.5 h-3.5 text-[#8EFF01]" />
                <span>{filterLabel}</span>
              </div>

              {availableCategories.map((cat) => {
                const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                const count =
                  cat === 'All'
                    ? visibleProjects.length
                    : visibleProjects.filter(
                        (p) => p.category?.trim().toLowerCase() === cat.trim().toLowerCase()
                      ).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    id={`portfolio-page-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer whitespace-nowrap min-h-[44px] flex items-center gap-1.5 active:scale-95 ${
                      isActive
                        ? 'bg-[#8EFF01] text-[#050505] font-bold shadow-[0_0_16px_rgba(142, 255, 1, 0.26)]'
                        : 'glass-panel text-[#FEFFFC]/70 hover:text-[#FEFFFC] hover:border-white/20'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-black/20 text-black'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Portfolio Projects Grid - All items */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-3xl bg-white/[0.02]">
            <p className="text-white/50 text-sm">No visible projects found in this category.</p>
            <button
              type="button"
              onClick={() => handleCategorySelect('All')}
              className="mt-4 px-4 py-2 rounded-full bg-[#8EFF01] text-black font-bold text-xs cursor-pointer"
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => {
                const isMotion = isMotionCategory(project.category) || !!project.videoUrl;
                const effectiveImage = getEffectiveProjectImage(project);

                return (
                  <motion.div
                    layout
                    key={project.id}
                    id={`portfolio-archive-item-${project.id}`}
                    initial={{ opacity: 0, y: 25, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(idx * 0.03, 0.25),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{
                      y: -6,
                      scale: 1.015,
                      transition: { duration: 0.2, ease: 'easeOut' },
                    }}
                    onClick={() => setSelectedProject(project)}
                    className="group relative rounded-2xl sm:rounded-3xl glass-panel border border-white/[0.08] hover:border-[#8EFF01]/50 overflow-hidden cursor-pointer flex flex-col bg-[#050505]"
                  >
                    {/* Top glow bar on hover */}
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
                          loadedImages[project.id]
                            ? 'opacity-100 blur-0 scale-100'
                            : 'opacity-0 scale-105'
                        }`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />

                      {/* Gradient vignette overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

                      {/* Top Category Badge */}
                      <div className="absolute top-2 sm:top-3.5 left-2 sm:left-3.5 z-10 flex items-center gap-1.5">
                        <span className="text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[#FEFFFC]">
                          {project.category}
                        </span>
                        {isMotion && (
                          <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-[#8EFF01] text-[#050505] flex items-center gap-1 shadow-sm">
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span className="hidden sm:inline">Motion Reel</span>
                          </span>
                        )}
                      </div>

                      {/* Year tag (if present) */}
                      {project.year && (
                        <div className="absolute top-2 sm:top-3.5 right-2 sm:right-3.5 z-10">
                          <span className="text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white/70">
                            {project.year}
                          </span>
                        </div>
                      )}

                      {/* Hover Center Indicator */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#8EFF01] text-[#050505] flex items-center justify-center shadow-[0_0_25px_rgba(142, 255, 1, 0.4)] transform group-hover:scale-110 transition-transform duration-300">
                          {isMotion ? (
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                          ) : (
                            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Meta Content */}
                    <div className="p-3 sm:p-4 md:p-5 flex flex-col justify-between flex-1 bg-[#050505]">
                      <div>
                        <h3 className="font-montserrat font-medium italic text-sm sm:text-base md:text-lg text-[#8EFF01] tracking-tight line-clamp-1 mb-1">
                          {project.title}
                        </h3>
                        {project.description && project.description.trim() && (
                          <p className="text-[11px] sm:text-xs text-white/65 line-clamp-2 leading-relaxed font-normal">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-white/[0.06] flex items-center justify-between min-h-[32px] sm:min-h-[40px]">
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-white/45 truncate max-w-[65%]">
                          {project.tools && project.tools.filter(Boolean).length > 0 ? (
                            <>
                              <span className="truncate">{project.tools[0]}</span>
                              {project.tools[1] && <span className="hidden sm:inline">• {project.tools[1]}</span>}
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
          </motion.div>
        )}
      </main>

      {/* Lightbox Modal */}
      <ProjectLightbox
        project={selectedProject}
        onClose={handleCloseLightbox}
        onNext={handleNext}
        onPrev={handlePrev}
        onInquire={handleInquireFromLightbox}
      />

      <Footer />
      <FloatingContactBar />
    </div>
  );
};
