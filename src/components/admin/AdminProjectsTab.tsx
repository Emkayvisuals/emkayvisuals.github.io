import React, { useState } from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { SectionToggle } from './SectionToggle';
import { AccentHeadingInput } from './AccentHeadingInput';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layout,
  ExternalLink,
  Eye,
  Check,
  Edit2,
  Video,
  Sparkles,
  Image as ImageIcon,
  Film,
  Layers,
  X,
  ChevronDown,
} from 'lucide-react';
import { ProjectItem, ProjectGalleryImage } from '../../data/portfolioContent';
import { ImageUploadControl } from './ImageUploadControl';
import { isMotionCategory, getYoutubeThumbnail } from '../../lib/videoUtils';

export const AdminProjectsTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null);

  const projectsSection = content.projectsSection || {
    enabled: true,
    badgeMain: 'Selected',
    badgeAccent: 'Archive',
    headingMain: 'Featured Design',
    headingAccent: 'Portfolio',
    subtext:
      'Filter through 5+ years of commissioned artworks, sports graphics, theatrical movie key art, and visual identities. Click any piece to inspect in full detail.',
    filterLabel: 'Filter:',
    clientLabel: 'Client:',
    viewProjectText: 'View Project',
    viewMoreButtonText: 'View More Projects',
    manipulationGalleryButtonText: 'View My Photo Manipulation Gallery',
    videoEmbedBadge: 'Motion Reel',
    toolsLabel: 'Software & Tools Used',
    inquireProjectButtonText: 'Inquire Similar Project',
    lightboxHint: 'Use arrow keys ← → to browse works',
  };

  const categories = content.categories || [
    'All',
    'Posters',
    'Flyers',
    'Visual Branding',
    'Movie Posters',
    'Music Covers',
    'Thumbnails',
    'Photo Manipulation',
    'Sports Design',
    'Motion Graphics',
    'Vector/Cartoon Illustration',
    'Product Design',
  ];

  const projects = content.projects || [];

  const handleSectionChange = (field: string, value: any) => {
    onChange({
      ...content,
      projectsSection: {
        ...projectsSection,
        [field]: value,
      },
    });
  };

  const handleProjectChange = (index: number, field: keyof ProjectItem, value: any) => {
    const updated = [...projects];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({
      ...content,
      projects: updated,
    });
  };

  const handleAddCategory = () => {
    const name = window.prompt('Enter new category name:');
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      alert('Category already exists.');
      return;
    }
    onChange({
      ...content,
      categories: [...categories, trimmed],
    });
  };

  const handleRenameCategory = (oldCat: string) => {
    if (oldCat === 'All') {
      alert('Cannot rename the default "All" category.');
      return;
    }
    const newName = window.prompt(`Rename category "${oldCat}" to:`, oldCat);
    if (!newName || !newName.trim() || newName.trim() === oldCat) return;
    const trimmed = newName.trim();

    // Update categories list
    const updatedCategories = categories.map((c: string) => (c === oldCat ? trimmed : c));

    // Update any projects referencing this category
    const updatedProjects = projects.map((p: ProjectItem) => {
      if (p.category === oldCat) {
        return { ...p, category: trimmed };
      }
      return p;
    });

    onChange({
      ...content,
      categories: updatedCategories,
      projects: updatedProjects,
    });

    if (selectedCategoryFilter === oldCat) {
      setSelectedCategoryFilter(trimmed);
    }
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (catToDelete === 'All') {
      alert('Cannot delete the default "All" category.');
      return;
    }
    const count = projects.filter((p) => p.category === catToDelete).length;
    const confirmMsg =
      count > 0
        ? `Delete category "${catToDelete}"? (${count} projects currently use it).`
        : `Delete category "${catToDelete}"?`;

    if (window.confirm(confirmMsg)) {
      onChange({
        ...content,
        categories: categories.filter((c: string) => c !== catToDelete),
      });
      if (selectedCategoryFilter === catToDelete) {
        setSelectedCategoryFilter('All');
      }
    }
  };

  const addProject = () => {
    const id = `proj-${Date.now()}`;
    const defaultCat = categories.find((c: string) => c !== 'All') || 'Posters';
    const newProj: ProjectItem = {
      id,
      title: 'New Portfolio Artwork',
      category: defaultCat,
      client: '',
      year: new Date().getFullYear().toString(),
      description: 'Describe the art direction, visual techniques, and aesthetic themes.',
      tools: ['Photoshop', 'Illustrator'],
      aspectRatio: 'portrait',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      visible: true,
      featured: false,
    };
    onChange({
      ...content,
      projects: [newProj, ...projects],
    });
  };

  const deleteProject = (index: number) => {
    if (window.confirm('Delete this project permanently?')) {
      const updated = projects.filter((_, i) => i !== index);
      onChange({
        ...content,
        projects: updated,
      });
    }
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= projects.length) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onChange({
      ...content,
      projects: updated,
    });
  };

  // Add extra gallery image to a project
  const handleAddExtraImage = (projectIndex: number, url: string, alt?: string) => {
    const proj = projects[projectIndex];
    const currentExtras = proj.extraImages || [];
    const updatedExtras = [...currentExtras, { url, alt: alt || `${proj.title} detail view` }];
    handleProjectChange(projectIndex, 'extraImages', updatedExtras);
  };

  const handleRemoveExtraImage = (projectIndex: number, imageIndex: number) => {
    if (window.confirm('Remove this gallery image?')) {
      const proj = projects[projectIndex];
      const currentExtras = proj.extraImages || [];
      const updatedExtras = currentExtras.filter((_, i) => i !== imageIndex);
      handleProjectChange(projectIndex, 'extraImages', updatedExtras);
    }
  };

  const moveExtraImage = (projectIndex: number, imageIndex: number, direction: 'up' | 'down') => {
    const proj = projects[projectIndex];
    const currentExtras = [...(proj.extraImages || [])];
    const target = direction === 'up' ? imageIndex - 1 : imageIndex + 1;
    if (target < 0 || target >= currentExtras.length) return;
    const temp = currentExtras[imageIndex];
    currentExtras[imageIndex] = currentExtras[target];
    currentExtras[target] = temp;
    handleProjectChange(projectIndex, 'extraImages', currentExtras);
  };

  const filteredProjects = projects.filter((p: ProjectItem) => {
    const matchesCat =
      selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    const matchesSearch =
      !searchFilter ||
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (p.client || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Section Header Controls */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8EFF01]/15 border border-[#8EFF01]/30 flex items-center justify-center text-[#8EFF01]">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Featured Design Portfolio</h2>
              <p className="text-xs text-white/50">
                Manage projects, video links, custom categories, WebP artwork, and &quot;View More&quot; settings
              </p>
            </div>
          </div>

          <SaveButton
            state={saveState}
            onSave={() => onSave('Work Gallery')}
            label="Save Projects"
          />
        </div>

        {/* Section visibility toggle */}
        <SectionToggle
          label="Projects Section Visibility"
          checked={projectsSection.enabled !== false}
          onChange={(val) => handleSectionChange('enabled', val)}
          description="Control whether the portfolio work gallery is visible to visitors"
        />

        <div className="space-y-6">
          {/* Badge */}
          <AccentHeadingInput
            label="Projects Section Badge"
            mainValue={projectsSection.badgeMain || ''}
            accentValue={projectsSection.badgeAccent || ''}
            onMainChange={(val) => handleSectionChange('badgeMain', val)}
            onAccentChange={(val) => handleSectionChange('badgeAccent', val)}
            mainPlaceholder="Selected"
            accentPlaceholder="Archive"
            isBadge={true}
          />

          {/* Heading */}
          <AccentHeadingInput
            label="Projects Section Heading"
            mainValue={projectsSection.headingMain || ''}
            accentValue={projectsSection.headingAccent || ''}
            onMainChange={(val) => handleSectionChange('headingMain', val)}
            onAccentChange={(val) => handleSectionChange('headingAccent', val)}
            mainPlaceholder="Featured Design"
            accentPlaceholder="Portfolio"
            isBadge={false}
          />

          {/* Subtext */}
          <div>
            <label className="text-[11px] text-white/60 block mb-1">Projects Section Subtext</label>
            <textarea
              rows={2}
              value={projectsSection.subtext || ''}
              onChange={(e) => handleSectionChange('subtext', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
          </div>

          {/* Microcopy, Button Labels & "View More" Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-white/60 block mb-1">Filter Label</label>
              <input
                type="text"
                value={projectsSection.filterLabel || 'Filter:'}
                onChange={(e) => handleSectionChange('filterLabel', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/60 block mb-1">View Project Link Text</label>
              <input
                type="text"
                value={projectsSection.viewProjectText || 'View Project'}
                onChange={(e) => handleSectionChange('viewProjectText', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#8EFF01] font-bold block mb-1">
                View More Button Text (Homepage)
              </label>
              <input
                type="text"
                value={projectsSection.viewMoreButtonText || 'View More Projects'}
                onChange={(e) => handleSectionChange('viewMoreButtonText', e.target.value)}
                placeholder="View More Projects"
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-[#8EFF01]/40 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
            <div>
              <label className="text-[11px] text-white/70 font-semibold block mb-1">
                Manipulation Gallery Button (Homepage)
              </label>
              <input
                type="text"
                value={projectsSection.manipulationGalleryButtonText || 'View My Photo Manipulation Gallery'}
                onChange={(e) => handleSectionChange('manipulationGalleryButtonText', e.target.value)}
                placeholder="View My Photo Manipulation Gallery"
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar & Category Management (Add, Rename, Delete) */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Editable Categories ({categories.length})
            </h3>
            <p className="text-xs text-white/50">
              Add, rename, or delete categories. Filter buttons on the site automatically follow this list (and hide any category with 0 visible works).
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-3.5 py-1.5 rounded-lg bg-[#8EFF01] hover:bg-[#7DE000] text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" /> Add Category
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat: string) => {
            const count =
              cat === 'All'
                ? projects.filter((p) => p.visible !== false).length
                : projects.filter(
                    (p) => p.visible !== false && p.category?.toLowerCase() === cat.toLowerCase()
                  ).length;

            return (
              <div
                key={cat}
                className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 transition-all ${
                  selectedCategoryFilter === cat
                    ? 'bg-[#8EFF01] text-black font-bold border-[#8EFF01]'
                    : 'bg-black/60 border-white/10 text-white/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className="cursor-pointer flex items-center gap-1.5"
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategoryFilter === cat
                        ? 'bg-black/20 text-black'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {count}
                  </span>
                </button>

                {cat !== 'All' && (
                  <div className="flex items-center gap-1 border-l border-white/20 pl-1.5 ml-1">
                    <button
                      type="button"
                      onClick={() => handleRenameCategory(cat)}
                      className="text-white/60 hover:text-white cursor-pointer"
                      title={`Rename category "${cat}"`}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                      title={`Delete category "${cat}"`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Projects List & Editor */}
      <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Projects Archive ({projects.length})
            </h3>
            <span className="text-xs text-white/50">
              Showing {filteredProjects.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search title, client, category..."
              className="px-3 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
            />
            <button
              type="button"
              onClick={addProject}
              className="px-3.5 py-1.5 rounded-lg bg-[#8EFF01] hover:bg-[#7DE000] text-black text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredProjects.map((project: ProjectItem) => {
            const rawIndex = projects.findIndex((p: ProjectItem) => p.id === project.id);
            if (rawIndex === -1) return null;

            const isMotion = isMotionCategory(project.category);
            const extraImages = project.extraImages || [];

            return (
              <div
                key={project.id || rawIndex}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  project.visible !== false
                    ? 'bg-black/60 border-white/10'
                    : 'bg-black/30 border-white/5 opacity-60'
                }`}
              >
                {/* Project Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black/80 border border-white/10 overflow-hidden shrink-0 relative">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : isMotion && project.videoUrl ? (
                        <div className="w-full h-full bg-[#111] flex items-center justify-center text-[#8EFF01]">
                          <Video className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                          No Pic
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                          {project.title}
                        </span>
                        {project.featured && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#8116E0]/30 text-[#8EFF01] border border-[#8116E0]/50">
                            Featured
                          </span>
                        )}
                        {isMotion && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#8EFF01]/20 text-[#8EFF01] border border-[#8EFF01]/40 flex items-center gap-1">
                            <Film className="w-2.5 h-2.5" /> Motion
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/50">
                        {project.category} // {project.year || '2025'}
                      </p>
                    </div>
                  </div>

                  {/* Quick Controls */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <label className="flex items-center gap-1.5 text-[11px] text-white/60 cursor-pointer mr-2">
                      <input
                        type="checkbox"
                        checked={project.visible !== false}
                        onChange={(e) =>
                          handleProjectChange(rawIndex, 'visible', e.target.checked)
                        }
                        className="rounded accent-[#8EFF01]"
                      />
                      <span>{project.visible !== false ? 'Visible' : 'Hidden'}</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-[11px] text-white/60 cursor-pointer mr-2">
                      <input
                        type="checkbox"
                        checked={!!project.featured}
                        onChange={(e) =>
                          handleProjectChange(rawIndex, 'featured', e.target.checked)
                        }
                        className="rounded accent-[#8EFF01]"
                      />
                      <span>Featured</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => moveProject(rawIndex, 'up')}
                      disabled={rawIndex === 0}
                      className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move up in order"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveProject(rawIndex, 'down')}
                      disabled={rawIndex === projects.length - 1}
                      className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move down in order"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProject(rawIndex)}
                      className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer ml-1"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-white/50 block mb-1">Project Title</label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => handleProjectChange(rawIndex, 'title', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-white/50 block mb-1">Category</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenCategoryIndex(openCategoryIndex === rawIndex ? null : rawIndex)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01] flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{project.category || 'Select category'}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-white/60 ml-1 shrink-0" />
                      </button>

                      {openCategoryIndex === rawIndex && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-[#0f0f0f] border border-white/15 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.9)] max-h-60 overflow-y-auto p-1.5 flex flex-col gap-1 backdrop-blur-xl">
                          {categories
                            .filter((c: string) => c !== 'All')
                            .map((c: string) => {
                              const isSelected = project.category === c;
                              return (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => {
                                    handleProjectChange(rawIndex, 'category', c);
                                    setOpenCategoryIndex(null);
                                  }}
                                  className={`w-full px-3 py-2 rounded-lg text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#8EFF01]/15 text-[#8EFF01] border border-[#8EFF01]/40 font-medium'
                                      : 'text-white/80 hover:bg-white/[0.06] hover:text-white border border-transparent'
                                  }`}
                                >
                                  <span className="truncate">{c}</span>
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-[#8EFF01] shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[10px] text-white/50 block mb-1">Year</label>
                    <input
                      type="text"
                      value={project.year || ''}
                      onChange={(e) => handleProjectChange(rawIndex, 'year', e.target.value)}
                      placeholder="2025"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-white/50 block mb-1">Aspect Ratio</label>
                    <select
                      value={project.aspectRatio || (isMotion ? 'landscape' : 'portrait')}
                      onChange={(e) =>
                        handleProjectChange(rawIndex, 'aspectRatio', e.target.value as any)
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                    >
                      <option value="portrait">Portrait (3:4 / 4:5)</option>
                      <option value="landscape">Landscape (16:9)</option>
                      <option value="square">Square (1:1)</option>
                    </select>
                  </div>
                </div>

                {/* Short Description */}
                <div className="mb-3">
                  <label className="text-[10px] text-white/50 block mb-1">
                    Short Description (Optional – hidden on site if empty)
                  </label>
                  <textarea
                    rows={2}
                    value={project.description || ''}
                    onChange={(e) => handleProjectChange(rawIndex, 'description', e.target.value)}
                    placeholder="Short summary of the project, concept, and aesthetic themes..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>

                {/* Video Link Field (ONLY SHOWN FOR MOTION GRAPHICS) */}
                {isMotion && (
                  <div className="mb-4 p-3.5 rounded-xl bg-[#8116E0]/10 border border-[#8116E0]/30 space-y-2">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-[#8EFF01]" />
                      <label className="text-xs font-bold text-white">
                        Motion Graphics Video Link (YouTube, Vimeo, or MP4)
                      </label>
                    </div>
                    <input
                      type="text"
                      value={project.videoUrl || ''}
                      onChange={(e) => handleProjectChange(rawIndex, 'videoUrl', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or .mp4 URL"
                      className="w-full px-3 py-2 rounded-lg bg-black/90 border border-white/20 text-xs text-white outline-none focus:border-[#8EFF01]"
                    />
                    <p className="text-[11px] text-white/60">
                      💡 <strong>Smart Feature:</strong> Motion projects show a play icon on the card and open in an embedded video lightbox. If no custom thumbnail image is uploaded below, YouTube video thumbnails are fetched automatically.
                    </p>
                  </div>
                )}

                {/* Cover Image Upload & Alt-Text Control */}
                <div className="mb-4">
                  <ImageUploadControl
                    label={isMotion ? 'Optional Video Thumbnail / Cover Image' : 'Project Cover Artwork'}
                    description={
                      isMotion
                        ? 'Optional custom thumbnail (max 1600px, WebP). Leave blank to auto-fetch YouTube thumbnail.'
                        : 'Converted to high-fidelity WebP (max 1600px wide, quality ~0.8) with automatic size compression and instant preview.'
                    }
                    preset="project"
                    aspectRatio={
                      project.aspectRatio === 'landscape' || isMotion
                        ? 'video'
                        : (project.aspectRatio || 'portrait')
                    }
                    imageUrl={project.image || ''}
                    imageAlt={project.imageAlt || `${project.title} - ${project.category} artwork by Emkay Visuals`}
                    showAltField={true}
                    onImageChange={(url, alt) => {
                      const updated = [...projects];
                      updated[rawIndex] = {
                        ...updated[rawIndex],
                        image: url,
                        imageAlt: alt || '',
                      };
                      onChange({ ...content, projects: updated });
                    }}
                    onRemove={() => {
                      const updated = [...projects];
                      updated[rawIndex] = {
                        ...updated[rawIndex],
                        image: '',
                        imageAlt: '',
                      };
                      onChange({ ...content, projects: updated });
                    }}
                  />
                </div>

                {/* Extra Gallery Images (Multiple uploads for deep showcase) */}
                <div className="mb-4 p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#8EFF01]" />
                        Extra Gallery Images ({extraImages.length})
                      </label>
                      <p className="text-[10px] text-white/50">
                        Optional additional showcase images visible in the interactive project lightbox
                      </p>
                    </div>
                  </div>

                  {extraImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
                      {extraImages.map((extraImg, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="group relative rounded-xl overflow-hidden border border-white/15 bg-black/80 flex flex-col shadow-sm hover:border-white/30 transition-all"
                        >
                          <div className="relative aspect-video w-full bg-black overflow-hidden">
                            <img
                              src={extraImg.url}
                              alt={extraImg.alt || `Extra ${imgIdx + 1}`}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {/* Order tag */}
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 border border-white/10 text-[9px] font-mono text-white/80">
                              #{imgIdx + 1}
                            </span>
                            {/* Small X / Remove button on image thumbnail */}
                            <button
                              type="button"
                              onClick={() => handleRemoveExtraImage(rawIndex, imgIdx)}
                              className="absolute top-1.5 right-1.5 px-1.5 py-1 rounded-md bg-black/80 hover:bg-red-500/90 text-white/80 hover:text-white border border-white/20 hover:border-red-500 transition-colors cursor-pointer shadow-sm flex items-center gap-1 text-[10px]"
                              title="Remove gallery image"
                            >
                              <X className="w-3 h-3" />
                              <span className="font-medium">Remove</span>
                            </button>
                          </div>

                          {/* Reordering Controls (up/down arrows matching project reordering style) and action bar */}
                          <div className="p-1.5 bg-black/90 border-t border-white/10 flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveExtraImage(rawIndex, imgIdx, 'up')}
                                disabled={imgIdx === 0}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                                title="Move up in order"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveExtraImage(rawIndex, imgIdx, 'down')}
                                disabled={imgIdx === extraImages.length - 1}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
                                title="Move down in order"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveExtraImage(rawIndex, imgIdx)}
                              className="text-[10px] text-red-400 hover:text-red-300 font-medium cursor-pointer flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-red-500/10 transition-colors"
                              title="Remove gallery image"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <ImageUploadControl
                    label="Add Extra Gallery Image"
                    description="Upload an additional angle or close-up render (auto-converted to WebP)."
                    preset="project"
                    aspectRatio="video"
                    imageUrl=""
                    showAltField={true}
                    onImageChange={(url, alt) => handleAddExtraImage(rawIndex, url, alt)}
                  />
                </div>

                {/* Tools Used */}
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">
                    Tools &amp; Software (Comma separated – hidden on site if empty)
                  </label>
                  <input
                    type="text"
                    value={(project.tools || []).join(', ')}
                    onChange={(e) =>
                      handleProjectChange(
                        rawIndex,
                        'tools',
                        e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean)
                      )
                    }
                    placeholder="e.g. Photoshop, Illustrator, Cinema 4D, After Effects"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/80 border border-white/10 text-xs text-white outline-none focus:border-[#8EFF01]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
