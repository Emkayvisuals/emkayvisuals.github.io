/**
 * ============================================================================
 * EMKAY VISUALS - MASTER CONTENT CONFIGURATION FILE
 * ============================================================================
 */
import { doc, getDoc, setDoc, deleteDoc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useState, useEffect } from "react";

export const WEB3FORMS_ACCESS_KEY = "f8ddaf24-13a1-40b4-8a3e-ae9f7dd15423";

export interface ProjectGalleryImage {
  url: string;
  alt?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  image: string;
  imageAlt?: string;
  description: string;
  client?: string;
  year: string;
  tools?: string[];
  featured?: boolean;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  videoUrl?: string;
  videoEmbedType?: 'youtube' | 'vimeo' | 'mp4';
  extraImages?: ProjectGalleryImage[];
  visible?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  tag: string;
  deliverables: string[];
  colSpan?: string;
  previewImage?: string;
  previewImageAlt?: string;
  visible?: boolean;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  description: string;
  duration: string;
  highlightBadge: string;
  visible?: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  avatarAlt?: string;
  comment: string;
  projectType: string;
  rating: number;
  visible?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  visible?: boolean;
}

export interface HighlightItem {
  number: string;
  title: string;
  text: string;
  visible?: boolean;
}

export interface SoftwareToolItem {
  name: string;
  level: string;
  type: string;
  visible?: boolean;
}

export interface FloatingTagItem {
  label: string;
  color: 'yellow' | 'violet' | 'white';
  visible?: boolean;
}

export interface NavLinkItem {
  label: string;
  href: string;
  visible?: boolean;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  visible?: boolean;
}

export interface InstagramProfile {
  handle: string;
  label: string;
  url: string;
}

export type SocialPlatform =
  | 'WhatsApp'
  | 'Instagram'
  | 'YouTube'
  | 'X/Twitter'
  | 'LinkedIn'
  | 'Behance'
  | 'Dribbble'
  | 'TikTok'
  | 'Facebook'
  | 'Telegram'
  | 'Pinterest'
  | 'Email'
  | 'Website'
  | 'Custom';

export interface SocialLinkItem {
  id: string;
  platform: SocialPlatform;
  label: string;
  value: string;
  description?: string;
  visible?: boolean;
}

export interface SocialLinks {
  email: string;
  emailMailto: string;
  whatsapp: string;
  whatsappDisplay: string;
  whatsappUrl: string;
  instagramDesigns: InstagramProfile;
  instagramFx: InstagramProfile;
  behance?: string;
  dribbble?: string;
  youtube?: string;
  vimeo?: string;
  links: SocialLinkItem[];
}

export interface ManipulationGalleryItem {
  id: string;
  title: string;
  image: string;
  imageAlt?: string;
  aspectRatio?: 'portrait' | 'landscape';
  visible?: boolean;
}

export interface ManipulationGalleryConfig {
  enabled: boolean;
  headerImage: string;
  headerImageAlt?: string;
  introParagraph: string;
  youtubeSectionTitle: string;
  youtubeChannelUrl: string;
  youtubeThumbnailImage: string;
  youtubeThumbnailAlt?: string;
  gallerySectionTitle: string;
  items: ManipulationGalleryItem[];
}

export const DEFAULT_PORTFOLIO_CONTENT = {
  // ==========================================
  // 0. SEO & META TAGS
  // ==========================================
  seo: {
    metaTitle: 'Emkay Visuals – Graphic Designer & Motion Graphics Artist',
    metaDescription:
      'High-end, futuristic portfolio for Emkay Visuals – Graphic Designer & Motion Graphics Artist with 5+ years of experience in Posters, Visual Branding, Movie Art, Thumbnails & Motion Graphics.',
    ogImage: 'https://emkayvisuals.github.io/emkay.webp',
    ogImageAlt: 'Emkay Visuals – Graphic Design & Motion Art Portfolio Banner',
    faviconUrl: '/emkay.webp',
  },

  // ==========================================
  // 0.1 PRELOADER / CURTAIN LOADER
  // ==========================================
  preloader: {
    enabled: true,
    logoAbbr: 'EV',
    logoUrl: '/emkay.webp',
    logoAlt: 'Emkay Visuals Logo',
    brandMain: 'EMKAY',
    divider: '//',
    brandAccent: 'VISUALS',
    tagline: 'PORTFOLIO 2026',
  },

  // ==========================================
  // 1. BRAND & ARTIST IDENTITY
  // ==========================================
  brand: {
    name: 'Emkay Visuals',
    roleTitle: 'Graphic Designer & Motion Graphics Artist',
    experienceYears: 5,
    tagline: 'Futuristic visual architecture, cinematic key art, and high-octane motion graphics.',
    statusBadge: 'Available for Freelance & Contracts',
    location: 'Available Worldwide / Remote',
    logoUrl: '/emkay.webp',
    logoAlt: 'Emkay Visuals Logo',
    faviconUrl: '/emkay.webp',
  },

  // ==========================================
  // 2. CONTACT & SOCIAL NETWORKS
  // ==========================================
  socials: {
    email: 'emkayvisuals@gmail.com',
    emailMailto: 'mailto:emkayvisuals@gmail.com',
    whatsapp: '09161889909',
    whatsappDisplay: '09161889909',
    whatsappUrl: 'https://wa.me/2349161889909',
    instagramDesigns: {
      handle: '@emkayvisuals',
      label: 'Graphic and motion designs',
      url: 'https://instagram.com/emkayvisuals',
    },
    instagramFx: {
      handle: '@emkayvisuals_fx',
      label: 'Digital art and photo manipulations',
      url: 'https://instagram.com/emkayvisuals_fx',
    },
    behance: 'https://behance.net/emkayvisuals',
    dribbble: 'https://dribbble.com/emkayvisuals',
    youtube: 'https://youtube.com',
    vimeo: 'https://vimeo.com',
    links: [
      {
        id: 'link-whatsapp',
        platform: 'WhatsApp',
        label: 'WhatsApp Direct',
        value: '09161889909',
        description: 'Instant project chat & quotes',
        visible: true,
      },
      {
        id: 'link-ig-main',
        platform: 'Instagram',
        label: 'Instagram (Main)',
        value: '@emkayvisuals',
        description: 'Graphic and motion designs',
        visible: true,
      },
      {
        id: 'link-ig-fx',
        platform: 'Instagram',
        label: 'Instagram (FX & Art)',
        value: '@emkayvisuals_fx',
        description: 'Digital art and photo manipulations',
        visible: true,
      },
      {
        id: 'link-email',
        platform: 'Email',
        label: 'Direct Email',
        value: 'emkayvisuals@gmail.com',
        description: 'emkayvisuals@gmail.com',
        visible: true,
      },
      {
        id: 'link-behance',
        platform: 'Behance',
        label: 'Behance',
        value: 'https://behance.net/emkayvisuals',
        description: 'Full portfolio & case studies',
        visible: true,
      },
      {
        id: 'link-dribbble',
        platform: 'Dribbble',
        label: 'Dribbble',
        value: 'https://dribbble.com/emkayvisuals',
        description: 'Visual explorations & shots',
        visible: true,
      },
    ] as SocialLinkItem[],
  } as SocialLinks,

  // ==========================================
  // 3. NAVBAR & NAVIGATION
  // ==========================================
  navbar: {
    enabled: true,
    logoAbbr: 'EV',
    logoUrl: '/emkay.webp',
    logoAlt: 'Emkay Visuals Logo',
    brandName: 'Emkay',
    brandDivider: '//',
    brandAccent: 'Visuals',
    ctaText: 'Hire Me',
    ctaLink: '#contact',
    mobileMenuTitle: 'Portfolio Menu',
    mobileCtaText: 'Start a Project / Hire Me',
  },

  navigation: [
    { label: 'Home', href: '#home', visible: true },
    { label: 'Services', href: '#services', visible: true },
    { label: 'Work', href: '#work', visible: true },
    { label: 'About', href: '#about', visible: true },
    { label: 'Process', href: '#process', visible: true },
    { label: 'Contact', href: '#contact', visible: true },
  ] as NavLinkItem[],

  // ==========================================
  // 4. HERO SECTION
  // ==========================================
  hero: {
    enabled: true,
    badgeMain: '5+ Years of',
    badgeAccent: 'Obsessive Visual Craft',
    headingMain: 'Your',
    headingAccent: 'Vision, Visualized',
    subtext:
      'Visual designer creating distinctive posters, digital art, and high impact visual identities for brands and creative projects.',
    primaryButtonText: 'View Work',
    primaryButtonLink: '#work',
    secondaryButtonText: 'Hire Me',
    secondaryButtonLink: '#contact',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Emkay Visuals – Futuristic Digital Key Art & Poster Direction',
    floatingTags: [
      { label: 'Posters', color: 'yellow', visible: true },
      { label: 'Visual Branding', color: 'violet', visible: true },
      { label: 'Motion Graphics', color: 'yellow', visible: true },
      { label: 'Movie Key Art', color: 'white', visible: true },
      { label: 'Photo Manipulation', color: 'violet', visible: true },
    ] as FloatingTagItem[],
    marqueeTicker: [
      'Posters',
      'Visual Branding',
      'Motion Graphics',
      'Flyers',
      'Movie Posters',
      'Photo Manipulation',
      'Music Covers',
      'Thumbnail Design',
      'After Effects Expert',
      'Vector Systems',
    ],
  },

  // ==========================================
  // 4.1 MARQUEE SECTION
  // ==========================================
  marqueeSection: {
    enabled: true,
  },

  // ==========================================
  // 5. STATS ROW
  // ==========================================
  statsSection: {
    enabled: true,
    satisfactionText: '5.0 Average Client Satisfaction',
  },

  stats: [
    {
      value: 5,
      suffix: '+',
      label: 'Years Experience',
      sublabel: 'Delivering cutting-edge visual craft since 2021',
      visible: true,
    },
    {
      value: 350,
      suffix: '+',
      label: 'Projects Completed',
      sublabel: 'Album art, key art, brand systems & animations',
      visible: true,
    },
    {
      value: 150,
      suffix: '+',
      label: 'Happy Clients',
      sublabel: 'Musicians, film directors, creators & founders',
      visible: true,
    },
    {
      value: 97,
      suffix: '%',
      label: 'Client Satisfaction',
      sublabel: 'On-time delivery with uncompromising polish',
      visible: true,
    },
  ] as StatItem[],

  // ==========================================
  // 6. SERVICES (BENTO GRID)
  // ==========================================
  servicesSection: {
    enabled: true,
    badgeMain: 'Disciplines &',
    badgeAccent: 'Offerings',
    headingMain: 'Specialized Creative',
    headingAccent: 'Services',
    subtext:
      'From full theatrical key art packages to high-octane 4K motion graphics, I construct daring visual narratives that resonate with high-discerning audiences.',
    cardButtonText: 'Request Quote',
    refPrefix: 'Ref //',
  },

  services: [
    {
      id: 'motion-graphics',
      title: 'Motion Graphics',
      tag: 'Flagship Craft',
      shortDesc: 'Dynamic title sequences, audio-reactive visualizers, kinetic typography, and looped stage visuals.',
      fullDesc:
        'Breathing motion into still design through high-tempo animation, spatial depth, camera tracking, and sound-synced kinetic rhythm.',
      iconName: 'Film',
      deliverables: ['Logo Reveals & Intros', 'Stage Visuals & Loops', 'Audio Visualizers', 'Social Reels & Teasers'],
      colSpan: 'col-span-12 lg:col-span-8',
      previewImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      visible: true,
    },
    {
      id: 'movie-posters',
      title: 'Movie Posters',
      tag: 'Cinematic Key Art',
      shortDesc: 'Theatrical key art, indie sci-fi posters, moody character compositions, and festival promotional assets.',
      fullDesc:
        'Telling an entire cinematic story in a single arresting frame through dramatic lighting, bespoke typography, and textured atmosphere.',
      iconName: 'Clapperboard',
      deliverables: ['Theatrical One-Sheets', 'IMDb / Streaming Art', 'Festival Promo Kits', 'High-Res Print Masters'],
      colSpan: 'col-span-12 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      visible: true,
    },
    {
      id: 'posters',
      title: 'Posters & Art Prints',
      tag: 'Surreal & Editorial',
      shortDesc: 'Graphic posters blending typography, brutalist geometry, dark tech themes, and surrealist textures.',
      fullDesc:
        'Museum-grade poster layouts built with precision grid structures, custom vector marks, and tactile paper finishes.',
      iconName: 'Image',
      deliverables: ['Exhibition Posters', 'Limited Merch Prints', 'Event Key Graphics', 'Ultra-DPI Vector Files'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
      visible: true,
    },
    {
      id: 'visual-branding',
      title: 'Visual Branding',
      tag: 'Cohesive Ecosystems',
      shortDesc: 'Futuristic logos, brand guideline bibles, custom type treatments, and multi-platform design languages.',
      fullDesc:
        'Transforming brands into unforgettable cultural identities through distinctive symbols, dark-mode palettes, and modern collateral.',
      iconName: 'Palette',
      deliverables: ['Logomark & Monogram', 'Color & Type Systems', 'Brand Guidelines Bible', 'Social Media Toolkits'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
      visible: true,
    },
    {
      id: 'music-covers',
      title: 'Music Covers',
      tag: 'Audio-Visual Synthesis',
      shortDesc: 'Hypnotic cover artwork for electronic, hip-hop, metal, ambient, and avant-garde singles, EPs, and albums.',
      fullDesc:
        'Translating musical emotion and sonic frequencies into tactile visual worlds calibrated for Spotify, Apple Music, and vinyl presses.',
      iconName: 'Disc3',
      deliverables: ['Streaming Cover Art (3000x3000px)', 'Spotify Canvas Animations', 'Gatefold Vinyl Layouts', 'Promotional Tour Assets'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      visible: true,
    },
    {
      id: 'photo-manipulation',
      title: 'Photo Manipulation',
      tag: 'Surreal Compositing',
      shortDesc: 'Hyper-realistic composite art, futuristic cyborg enhancements, ethereal lighting, and sci-fi environments.',
      fullDesc:
        'Seamlessly blending multi-exposure photographs, intricate digital painting, atmospheric dust, volumetric light, and high-frequency retouching.',
      iconName: 'Wand2',
      deliverables: ['Concept Art Mattes', 'Subject Retouching & FX', 'Cyberpunk Composites', 'Multi-Layer PSD Source'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      visible: true,
    },
    {
      id: 'flyers',
      title: 'Club & Event Flyers',
      tag: 'Nightlife & Experiences',
      shortDesc: 'High-impact promotional flyers for underground raves, tech conferences, gallery openings, and DJ tours.',
      fullDesc:
        'High-density, attention-commanding compositions optimized for both printed street flyposting and mobile Instagram feeds.',
      iconName: 'Layers',
      deliverables: ['Animated Motion Flyers', 'Print Ready CMYK PDFs', 'Story / 9:16 Aspect Formats', 'Square 1:1 Social Formats'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      visible: true,
    },
    {
      id: 'thumbnail-design',
      title: 'Thumbnail Design',
      tag: 'High-CTR Visuals',
      shortDesc: 'Electrifying, click-optimized thumbnails for YouTube creators, podcasters, and masterclasses.',
      fullDesc:
        'Engineered for maximum thumbnail contrast, facial expression emphasis, and instant storytelling on crowded mobile displays.',
      iconName: 'Sparkles',
      deliverables: ['A/B Testing Variants', 'Custom Cutouts & Highlights', 'Typography Badges', 'Ultra-Crisp 1080p Exports'],
      colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
      previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      visible: true,
    },
  ] as ServiceItem[],

  // ==========================================
  // 7. PORTFOLIO WORK ITEMS & CATEGORIES
  // ==========================================
  projectsSection: {
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
    videoEmbedBadge: 'Motion Reel',
    toolsLabel: 'Software & Tools Used',
    inquireProjectButtonText: 'Inquire Similar Project',
    lightboxHint: 'Use arrow keys ← → to browse works',
  },

  categories: [
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
  ] as string[],

  projects: [
    {
      id: 'proj-motion-1',
      title: 'Neon Odyssey // 3D Kinetic Brand Reveal',
      category: 'Motion Graphics',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      description:
        'High-energy 3D kinetic brand sequence engineered with Cinema 4D, Octane Render, and After Effects. Featuring sound-reactive visualizers, camera tracking, and metallic fluid reflections.',
      client: 'Hyperion Interactive',
      year: '2025',
      tools: ['After Effects', 'Cinema 4D', 'Octane Render', 'Premiere Pro'],
      aspectRatio: 'landscape',
      featured: true,
      visible: true,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoEmbedType: 'youtube',
    },
    {
      id: 'proj-sports-1',
      title: 'Apex Championship // Game Day Key Art',
      category: 'Sports Design',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      description:
        'High-octane game day match poster engineered with electric lightning visual effects, dynamic athlete cutouts, stadium atmosphere, and bold athletic typography.',
      client: 'Apex Championship League',
      year: '2025',
      tools: ['Photoshop', 'Illustrator', 'Camera Raw'],
      aspectRatio: 'portrait',
      featured: true,
      visible: true,
    },
    {
      id: 'proj-1',
      title: 'Cyberpunk Protocol // Neural Void',
      category: 'Movie Posters',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
      description:
        'Official theatrical key art for an independent neo-noir sci-fi thriller set in 2088. Handcrafted composite art featuring volumetric lighting, particle disintegration, and distressed Japanese/English typography.',
      client: 'Aetheria Pictures',
      year: '2025',
      tools: ['Photoshop', 'Illustrator', 'Lightroom', 'Topaz Gigapixel'],
      aspectRatio: 'portrait',
      featured: true,
      visible: true,
    },
    {
      id: 'proj-3',
      title: 'Solaris Echo // Album Artwork',
      category: 'Music Covers',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      description:
        'Hypnotic vinyl and digital cover design for an ambient synthwave album. Exploring celestial geometry, iridescent liquid chrome, and minimal tracklist typography.',
      client: 'Ghostly Ambient Collective',
      year: '2024',
      tools: ['Photoshop', 'Illustrator', 'Lightroom'],
      aspectRatio: 'square',
      featured: true,
      visible: true,
    },
    {
      id: 'proj-motion-2',
      title: 'Pulse Distortion // Audio-Reactive Title Loop',
      category: 'Motion Graphics',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      description:
        'Hypnotic visual loop for festival stage LED walls, calibrated with glitch displacement, neon scanlines, and 60 FPS buttery smooth transitions.',
      client: 'Sub-Zero Festival',
      year: '2025',
      tools: ['After Effects', 'Blender', 'Photoshop'],
      aspectRatio: 'landscape',
      featured: true,
      visible: true,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoEmbedType: 'youtube',
    },
    {
      id: 'proj-sports-2',
      title: 'Courtside Dynasty // Signature Athlete Poster',
      category: 'Sports Design',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      description:
        'Cinematic pro basketball poster featuring volumetric stadium smoke, motion blur dynamics, high-contrast rim lighting, and distressed team typography.',
      client: 'Vanguard Hoops Pro',
      year: '2025',
      tools: ['Photoshop', 'Lightroom', 'Illustrator'],
      aspectRatio: 'portrait',
      featured: true,
      visible: true,
    },
    {
      id: 'proj-sports-3',
      title: 'Velocity Grand Prix // Motorsport Athlete Banner',
      category: 'Sports Design',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      description:
        'Ultra-fast racing driver promotional artwork with particle sparks, aerodynamic motion trails, sleek carbon fiber textures, and futuristic speed typography.',
      client: 'Monza Velocity Circuit',
      year: '2024',
      tools: ['Photoshop', 'Illustrator'],
      aspectRatio: 'landscape',
      featured: false,
      visible: true,
    },
    {
      id: 'proj-4',
      title: 'Nexus Matrix // Brutalist Exhibition Poster',
      category: 'Posters',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
      description:
        'International design biennial promotional poster featuring Swiss architectural grids collided with glitch distortion and high-contrast dual-tone duotone palette.',
      client: 'Zurich Design Pavilion',
      year: '2024',
      tools: ['Illustrator', 'Photoshop'],
      aspectRatio: 'portrait',
      featured: false,
      visible: true,
    },
    {
      id: 'proj-5',
      title: 'Synthetic Awakening // Bio-Mecha Manipulation',
      category: 'Photo Manipulation',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      description:
        'Multi-layer digital artwork melding human portraiture with intricate fiber-optic cyberware, neon vein illumination, and atmospheric volumetric smoke.',
      client: 'Vanguard Visuals Magazine',
      year: '2025',
      tools: ['Photoshop', 'Illustrator', 'Lightroom'],
      aspectRatio: 'portrait',
      featured: true,
      visible: true,
    },
    {
      id: 'proj-7',
      title: 'Orbital Ventures // Identity & Brand System',
      category: 'Visual Branding',
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
      description:
        'Comprehensive futuristic brand identity for an aerospace venture fund, spanning custom geometric monogram, dark-mode print stationery, and digital brand guidelines.',
      client: 'Orbital Capital',
      year: '2024',
      tools: ['Illustrator', 'Figma', 'Photoshop'],
      aspectRatio: 'square',
      featured: false,
      visible: true,
    },
    {
      id: 'proj-8',
      title: 'Subterranean Pulse // Warehouse Rave Flyer',
      category: 'Flyers',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      description:
        'Industrial techno event flyer series engineered with brutalist thermal effects, neon green safety typography, and high-impact hierarchy for social feeds.',
      client: 'Warehouse 09 Berlin',
      year: '2025',
      tools: ['Photoshop', 'Illustrator'],
      aspectRatio: 'portrait',
      featured: false,
      visible: true,
    },
    {
      id: 'proj-9',
      title: 'The $10,000,000 Quantum Heist // Thumbnail',
      category: 'Thumbnails',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      description:
        'Custom high-conversion YouTube thumbnail for a tech documentary channel (2.4M subscribers). Elevated dynamic lighting, clean subject cutouts, and 14.8% click-through rate.',
      client: 'Apex Documentaries',
      year: '2025',
      tools: ['Photoshop', 'Illustrator', 'Lightroom'],
      aspectRatio: 'landscape',
      featured: false,
      visible: true,
    },
    {
      id: 'proj-10',
      title: 'Astral Rebirth // Surreal Psychedelic Poster',
      category: 'Posters',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      description:
        'Limited edition 24x36 screenprint design combining Renaissance anatomical engravings with psychedelic sacred geometry and holographic foil stamp layers.',
      client: 'Metropolis Gallery',
      year: '2024',
      tools: ['Photoshop', 'Illustrator'],
      aspectRatio: 'portrait',
      featured: false,
      visible: true,
    },
    {
      id: 'proj-11',
      title: 'Valkyrie Horizon // Cinematic Key Art',
      category: 'Movie Posters',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      description:
        'Hero promotional artwork for an action-adventure series featuring custom cloud mattes, fighter jet propulsion trails, and distressed metallic title typography.',
      client: 'Horizon Stream Original',
      year: '2024',
      tools: ['Photoshop', 'Illustrator', 'Lightroom'],
      aspectRatio: 'portrait',
      featured: false,
      visible: true,
    },
    {
      id: 'proj-12',
      title: 'Metallic Overdrive // Single Art',
      category: 'Music Covers',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      description:
        'Liquid chrome emblem suspended in a zero-gravity dark abyss with typography etched in Blanche White and Banana Yellow neon highlights.',
      client: 'Void Pulse Audio',
      year: '2025',
      tools: ['Photoshop', 'Illustrator'],
      aspectRatio: 'square',
      featured: false,
      visible: true,
    },
  ] as ProjectItem[],

  // ==========================================
  // 8. ABOUT ME SECTION
  // ==========================================
  about: {
    enabled: true,
    badgeMain: 'Behind the',
    badgeAccent: 'Screen',
    headingMain: 'Engineering Visual Worlds with Uncompromising',
    headingAccent: 'Precision',
    bioParagraphs: [
      "I'm Emkay, a graphic designer and digital artist specializing in sports design, photo manipulation, promotional visuals, and creative poster design.",
      "My work combines strong composition, cinematic imagery, bold typography, and detailed visual effects to create designs that feel dynamic, polished, and built to stand out.",
      "From sports posters and campaign visuals to digital artwork and social media content, I focus on turning ideas into visuals that communicate clearly and leave a lasting impression.",
    ],
    photoUrl: '/Images/emkay.webp',
    photoAlt: 'Emkay - Graphic Designer & Digital Artist',
    artistIdPhotoUrl: '/Images/emkay.webp',
    artistIdPhotoAlt: 'Artist ID Hologram & Signature Emblem - Emkay',
    artistIdLabel: 'Artist ID // 2026.ev',
    experienceBadge: '5+ Yrs Pro',
    statusCoordinates: ['Worldwide / Remote', 'Status: Active', '60 FPS Ready'],
    toolkitLabel: 'Production Software & Toolkit',
    softwareTools: [
      { name: 'Adobe After Effects', level: 'Mastery', type: 'Motion Graphics & FX', visible: true },
      { name: 'Adobe Photoshop', level: 'Mastery', type: 'Compositing & Retouch', visible: true },
      { name: 'Adobe Illustrator', level: 'Mastery', type: 'Vector & Typography', visible: true },
      { name: 'Adobe Premiere Pro', level: 'Advanced', type: 'Video Editing & Pacing', visible: true },
      { name: 'Adobe Lightroom', level: 'Advanced', type: 'Color Grading & Tone', visible: true },
      { name: 'Figma', level: 'Advanced', type: 'Brand Systems & Layout', visible: true },
    ] as SoftwareToolItem[],
    highlights: [
      {
        number: '01',
        title: 'Obsessive Detail',
        text: 'Pixel-perfect alignment, custom typography modifications, and pristine color grading.',
        visible: true,
      },
      {
        number: '02',
        title: 'Cinema & Sound Synced',
        text: 'Visuals tuned to musical rhythm and storytelling arcs that evoke visceral emotion.',
        visible: true,
      },
      {
        number: '03',
        title: 'High-Turnaround Velocity',
        text: 'Fast communication with zero fluff—transparent milestones and tight deadlines honored.',
        visible: true,
      },
    ] as HighlightItem[],
  },

  // ==========================================
  // 9. 4-STEP CREATIVE PROCESS
  // ==========================================
  processSection: {
    enabled: true,
    badgeMain: 'Methodology //',
    badgeAccent: 'Zero Noise',
    headingMain: 'A Rigorous 4-Step',
    headingAccent: 'Creative Roadmap',
    subtext:
      'Every project moves through an airtight, predictable progression ensuring full creative alignment and pristine execution without unnecessary delays.',
    phasePrefix: 'Phase //',
  },

  process: [
    {
      stepNumber: '01',
      title: 'Discovery & Vision Brief',
      duration: 'Day 1 - 2',
      highlightBadge: 'Research & Strategy',
      description:
        'We dissect your project objectives, target audience, artistic references, color palettes, and technical specifications to lock in an airtight creative direction.',
      visible: true,
    },
    {
      stepNumber: '02',
      title: 'Concept & Moodboards',
      duration: 'Day 2 - 4',
      highlightBadge: 'Rapid Prototyping',
      description:
        'I develop visual moodboards, composition roughs, wireframe layouts, and kinetic motion styleframes to explore diverse creative paths before final rendering.',
      visible: true,
    },
    {
      stepNumber: '03',
      title: 'High-Fidelity Craft',
      duration: 'Day 4 - 8',
      highlightBadge: 'Deep Execution',
      description:
        'Full execution begins: complex photo manipulation, custom typography, advanced lighting passes, color grading, particle simulation, and frame-by-frame animation.',
      visible: true,
    },
    {
      stepNumber: '04',
      title: 'Revision & Polished Delivery',
      duration: 'Day 8 - 10',
      highlightBadge: 'Final Handoff',
      description:
        'We fine-tune the assets through collaborative feedback rounds, delivering master production files (DPI print masters, 4K ProRes/MP4, layered PSDs, vector SVGs).',
      visible: true,
    },
  ] as ProcessStep[],

  // ==========================================
  // 10. TESTIMONIALS
  // ==========================================
  testimonialsSection: {
    enabled: true,
    badgeMain: 'Endorsements &',
    badgeAccent: 'Reputation',
    headingMain: 'Trusted by Visionary',
    headingAccent: 'Directors & Founders',
    satisfactionText: '5.0 Average Client Satisfaction',
  },

  testimonials: [
    {
      id: 't-1',
      name: 'Julian Vance',
      role: 'Creative Director',
      company: 'Aetheria Pictures',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      comment:
        'Emkay designed the official key art for our festival feature film. The poster halted people in their tracks at every screening and drove our streaming debut. The level of detail in the photo manipulation was breathtaking.',
      projectType: 'Movie Poster Key Art',
      rating: 5,
      visible: true,
    },
    {
      id: 't-2',
      name: 'Marcus K.',
      role: 'Electronic Music Producer',
      company: 'Void Pulse Audio',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      comment:
        'Working with Emkay on my album rollout and stage visuals transformed my entire brand. The motion loops synced seamlessly with my live set. Absolute professionalism and visionary taste.',
      projectType: 'Album Art & Motion Graphics',
      rating: 5,
      visible: true,
    },
    {
      id: 't-3',
      name: 'Elena Rostova',
      role: 'Head of Brand',
      company: 'Kinesis Gear Labs',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      comment:
        'From our kinetic logo reveal to our dark-mode identity guidelines, Emkay understood the futuristic cyberpunk aesthetic effortlessly. Delivered on schedule with immaculate communication.',
      projectType: 'Visual Branding & Motion Graphics',
      rating: 5,
      visible: true,
    },
    {
      id: 't-4',
      name: 'Davey Croft',
      role: 'Content Creator (1.8M Subs)',
      company: 'Apex Documentaries',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      comment:
        'Our CTR shot up from 5.1% to nearly 14% after Emkay took over thumbnail art. The lighting mastery and typography hierarchy are completely unmatched in the creator space.',
      projectType: 'YouTube Thumbnail Design',
      rating: 5,
      visible: true,
    },
  ] as TestimonialItem[],

  // ==========================================
  // 10.1 FAQ SECTION
  // ==========================================
  faqSection: {
    enabled: true,
    badgeMain: 'Common',
    badgeAccent: 'Queries',
    headingMain: 'Frequently Asked',
    headingAccent: 'Questions',
    subtext:
      'Everything you need to know about commissioning artwork, deliverables, timelines, and commercial licensing.',
  },

  faq: [
    {
      id: 'faq-1',
      question: 'What is your typical turnaround time?',
      answer:
        'Turnaround depends on project scope. Single sports posters and album covers typically take 2 to 4 business days. Theatrical key art and full identity systems average 1 to 2 weeks. Expedited delivery is available upon request.',
      visible: true,
    },
    {
      id: 'faq-2',
      question: 'What deliverables and source files do I receive?',
      answer:
        'You receive print-ready ultra-high resolution files (300+ DPI CMYK), RGB web masters, social media formats (1:1 and 9:16), and layered source files (PSD / AI / AEP) based on agreed commercial rights.',
      visible: true,
    },
    {
      id: 'faq-3',
      question: 'How does the revision process work?',
      answer:
        'Every project includes 2 to 3 structured revision rounds following the moodboard and initial concept phase to ensure the final output aligns perfectly with your vision.',
      visible: true,
    },
    {
      id: 'faq-4',
      question: 'What are your payment terms?',
      answer:
        'A 50% deposit is required to lock in the production schedule, with the remaining 50% due upon final approval prior to master asset handoff.',
      visible: true,
    },
    {
      id: 'faq-5',
      question: 'Do you work with international clients?',
      answer:
        'Yes, I collaborate with directors, record labels, athletes, and creative founders worldwide across all time zones with remote digital handoffs.',
      visible: true,
    },
  ] as FAQItem[],

  // ==========================================
  // 11. CONTACT SECTION & BRIEF FORM
  // ==========================================
  contact: {
    enabled: true,
    badgeMain: "Let's",
    badgeAccent: "Collaborate",
    headingMain: 'Ready to Bring Your Vision to',
    headingAccent: 'Life?',
    subtext:
      'Have an upcoming music release, movie key art project, brand overhaul, or motion graphics brief? Send a project brief directly or reach out on WhatsApp or Instagram.',
    responseTime: 'Typical response time: under 4 hours',
    directChannelsHeading: 'Direct Channels',
    whatsappCardTitle: 'Chat on WhatsApp',
    emailCardTitle: 'Direct Email',
    copyEmailText: 'Click to copy email',
    copiedEmailText: 'Email copied to clipboard!',
    formTitle: 'Project Inquiry & Commission Brief',
    formStepBadge: 'Step 01 // Form',
    nameLabel: 'Your Name / Company *',
    namePlaceholder: 'e.g. Elena Rostova / Aether Records',
    emailLabel: 'Your Email Address *',
    emailPlaceholder: 'name@company.com',
    deadlineLabel: 'Target Deadline / Timeline',
    deadlinePlaceholder: 'e.g. Next 3 weeks / Flexible',
    referenceLinkLabel: 'Reference Link / Moodboard URL (Optional)',
    referenceLinkPlaceholder: 'https://...',
    serviceLabel: 'Service Required',
    servicesOptions: [
      'Posters & Art Prints',
      'Club & Event Flyers',
      'Visual Branding & Identity',
      'Movie Posters & Key Art',
      'Photo Manipulation & Composite',
      'Music / Album Covers',
      'High-CTR Thumbnail Design',
      'Motion Graphics & Video Animation',
      'Complete Full-Package Campaign',
    ],
    budgetLabel: 'Estimated Budget Tier (USD)',
    budgetRanges: [
      '$50 - $500',
      '$500 - $1,000',
      '$1,000 - $2,500',
      '$2,500 - $5,000',
      '$5,000 - $7,500',
      '$7,500 - $10,000',
    ],
    messageLabel: 'Project Vision & Deliverables *',
    messagePlaceholder:
      'Tell me about your release date, narrative references, dimensions, sound/theme inspirations, and key deliverables...',
    submitButtonText: 'Send Project Brief',
    submittingButtonText: 'Sending Project Brief...',
    confirmationTitle: 'We Got The Brief!',
    confirmationMessage:
      "Thanks for trusting me with your project. I'll review the details and get back to you within 24/48 hours.",
    confirmationClosing: "Ideas received. Let's create.",
    successTitle: 'We Got The Brief!',
    successMessage:
      "Thanks for trusting me with your project. I'll review the details and get back to you within 24/48 hours.",
    sendAnotherButtonText: 'Send Another Brief',
    whatsappFollowupButtonText: 'Follow up on WhatsApp',
    whatsappFallbackNotice: 'You can also chat directly on WhatsApp right away.',
    whatsappFallbackButtonText: 'Chat on WhatsApp',
  },

  // ==========================================
  // 12. FOOTER
  // ==========================================
  footer: {
    enabled: true,
    logoAbbr: 'EV',
    logoUrl: '/emkay.webp',
    logoAlt: 'Emkay Visuals Logo',
    brandName: 'Emkay',
    brandDivider: '//',
    brandAccent: 'Visuals',
    tagline: 'Designing tomorrow’s aesthetics today. High-impact visuals & kinetic motion graphics.',
    copyright: '© 2026 Emkay Visuals. All rights reserved.',
    rightsNote: 'Handcrafted with precision. All artworks protected under creative copyright.',
    backToTopAria: 'Scroll to Top',
  },

  // ==========================================
  // 13. FLOATING QUICK CONTACT BAR
  // ==========================================
  floatingContact: {
    enabled: true,
    title: 'Quick Connect',
    whatsappLabel: 'WhatsApp Direct',
    emailLabel: 'Email Emkay',
  },

  // ==========================================
  // 14. YOUTUBE / MANIPULATION GALLERY
  // ==========================================
  manipulationGallery: {
    enabled: true,
    headerImage: '/Images/manipulation/Flying tortise.webp',
    headerImageAlt: 'Emkay Visuals – Photo Manipulation Artwork Header',
    introParagraph:
      'Welcome to my photo manipulation laboratory and digital compositing archive. On my YouTube channel, I take you behind the screen to explore the detailed creation process behind surreal composites, sci-fi atmospheres, lighting breakdowns, and digital art techniques. Each piece is crafted layer by layer with cinematic depth, custom lighting passes, and meticulous compositing. Explore the video breakdowns on YouTube, or browse the complete gallery of finished artworks below.',
    youtubeSectionTitle: 'Visit my YouTube channel',
    youtubeChannelUrl: 'https://youtube.com/@emkayvisuals',
    youtubeThumbnailImage: '/Images/thumbnail/airdrop1.webp',
    youtubeThumbnailAlt: 'Emkay Visuals YouTube Channel - Photo Manipulation Breakdowns',
    gallerySectionTitle: 'My Gallery',
    items: [
      {
        id: 'manip-tortoise',
        title: 'The Celestial Voyager // Flying Tortoise',
        image: '/Images/manipulation/Flying tortise.webp',
        aspectRatio: 'landscape',
        visible: true,
      },
      {
        id: 'manip-ny1',
        title: 'Times Square Protocol // NY Part I',
        image: '/Images/manipulation/NY1.webp',
        aspectRatio: 'landscape',
        visible: true,
      },
      {
        id: 'manip-ny2',
        title: 'Metropolitan Rebirth // NY Part II',
        image: '/Images/manipulation/NY2.webp',
        aspectRatio: 'landscape',
        visible: true,
      },
      {
        id: 'manip-doom1',
        title: 'Doom Harbinger // Act I',
        image: '/Images/manipulation/doom1.webp',
        aspectRatio: 'portrait',
        visible: true,
      },
      {
        id: 'manip-doom2',
        title: 'Doom Harbinger // Act II',
        image: '/Images/manipulation/doom2.webp',
        aspectRatio: 'portrait',
        visible: true,
      },
      {
        id: 'manip-forest1',
        title: 'Ethereal Canopy // Whispering Pines',
        image: '/Images/manipulation/forest1.webp',
        aspectRatio: 'portrait',
        visible: true,
      },
      {
        id: 'manip-forest2',
        title: 'Midnight Hollow // Deep Woodland',
        image: '/Images/manipulation/forest2.webp',
        aspectRatio: 'portrait',
        visible: true,
      },
      {
        id: 'manip-forest3',
        title: 'Luminescent Glade // Forest Echo',
        image: '/Images/manipulation/forest3.webp',
        aspectRatio: 'portrait',
        visible: true,
      },
      {
        id: 'manip-judgement1',
        title: 'Day of Reckoning // The Tribunal',
        image: '/Images/manipulation/judgement1.webp',
        aspectRatio: 'portrait',
        visible: true,
      },
      {
        id: 'manip-judgement2',
        title: 'Scales of Fate // The Condemned',
        image: '/Images/manipulation/judgement2.webp',
        aspectRatio: 'portrait',
        visible: true,
      },
      {
        id: 'manip-judgement3',
        title: 'Ascension Verdict // Final Judgement',
        image: '/Images/manipulation/judgement3.webp',
        aspectRatio: 'portrait',
        visible: true,
      },
      {
        id: 'manip-newyear',
        title: 'Temporal Horizon // New Year Awakening',
        image: '/Images/manipulation/new year.webp',
        aspectRatio: 'portrait',
        visible: true,
      },
      {
        id: 'manip-victim0',
        title: 'The Anomaly // Victim Zero',
        image: '/Images/manipulation/victim0.webp',
        aspectRatio: 'portrait',
        visible: true,
      },
      {
        id: 'manip-victim1',
        title: 'Neural Extraction // Subject One',
        image: '/Images/manipulation/victim1.webp',
        aspectRatio: 'portrait',
        visible: true,
      },
      {
        id: 'manip-victim2',
        title: 'Cybernetic Genesis // Subject Two',
        image: '/Images/manipulation/victim2.webp',
        aspectRatio: 'portrait',
        visible: true,
      },
    ] as ManipulationGalleryItem[],
  } as ManipulationGalleryConfig,
};

export type PortfolioContentType = typeof DEFAULT_PORTFOLIO_CONTENT;

/**
 * Non-destructive merge helper:
 * - Saved Firestore content (`source`) is the authoritative source of truth and NEVER overwritten.
 * - Defaults (`target`) are ONLY used to provide fallback values for keys that are completely
 *   missing (undefined or null) in the Firestore document (e.g. newly introduced schema fields).
 * - Arrays in Firestore (projects, services, testimonials, stats, process, etc.) are kept
 *   in full as saved by the user. They are NEVER positionally merged or overwritten with defaults.
 * - Empty strings (""), false booleans, and 0 numbers in Firestore are strictly preserved.
 */
export function deepMerge(target: any, source: any): any {
  if (source === undefined || source === null) {
    return target !== undefined && target !== null ? JSON.parse(JSON.stringify(target)) : target;
  }
  if (typeof source !== 'object') {
    return source;
  }

  // Arrays: Saved Firestore arrays are authoritative!
  if (Array.isArray(source)) {
    if (!Array.isArray(target) || target.length === 0) {
      return [...source];
    }
    const templateItem = target[0];
    if (templateItem && typeof templateItem === 'object' && !Array.isArray(templateItem)) {
      return source.map((item) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const mergedItem = { ...item };
          // Only add schema keys that are completely missing (undefined) in the saved item
          for (const k of Object.keys(templateItem)) {
            if (mergedItem[k] === undefined) {
              mergedItem[k] = templateItem[k];
            }
          }
          return mergedItem;
        }
        return item;
      });
    }
    return [...source];
  }

  // Objects: start with all saved keys from source
  const result: any = { ...source };

  // For every key in the defaults target, only supply it if missing in source
  if (target && typeof target === 'object' && !Array.isArray(target)) {
    for (const key of Object.keys(target)) {
      if (source[key] === undefined || source[key] === null) {
        result[key] =
          target[key] !== undefined && target[key] !== null
            ? JSON.parse(JSON.stringify(target[key]))
            : target[key];
      } else if (
        typeof target[key] === 'object' &&
        target[key] !== null &&
        !Array.isArray(target[key]) &&
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else if (
        key === 'categories' &&
        Array.isArray(source[key]) &&
        Array.isArray(target[key])
      ) {
        const existingCats = source[key] as string[];
        const targetCats = target[key] as string[];
        const combined = [...existingCats];
        for (const cat of targetCats) {
          if (!combined.some((c) => c.toLowerCase() === cat.toLowerCase())) {
            combined.push(cat);
          }
        }
        result[key] = combined;
      } else {
        // Primitive or array: keep the saved Firestore value
        result[key] = source[key];
      }
    }
  }

  return result;
}

/**
 * Strips all `undefined` values recursively so Firestore never throws a validation error.
 */
export function cleanForFirestore(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(cleanForFirestore);
  }
  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = cleanForFirestore(value);
    }
  }
  return cleaned;
}

// Current singleton in-memory object initialized from default
export const PORTFOLIO_CONTENT: PortfolioContentType = JSON.parse(
  JSON.stringify(DEFAULT_PORTFOLIO_CONTENT)
);

let listeners: (() => void)[] = [];
let realtimeUnsubscribe: Unsubscribe | null = null;

export function subscribeToPortfolio(cb: () => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function notifyListeners() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.error('Error notifying portfolio listener:', e);
    }
  });
}

/**
 * Initializes real-time synchronization with Firestore using `onSnapshot`.
 * Falls back to local defaults gracefully if offline or document is absent.
 */
export function initRealtimePortfolio() {
  if (realtimeUnsubscribe) {
    return realtimeUnsubscribe;
  }
  try {
    const docRef = doc(db, 'portfolio', 'content');
    realtimeUnsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const rawData = snapshot.data();
          const merged = deepMerge(DEFAULT_PORTFOLIO_CONTENT, rawData);
          Object.assign(PORTFOLIO_CONTENT, merged);
          notifyListeners();
        } else {
          // Document does not exist yet; populate with default
          Object.assign(PORTFOLIO_CONTENT, JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_CONTENT)));
          notifyListeners();
        }
      },
      (error) => {
        console.warn('Real-time Firestore snapshot listener notice (using defaults):', error);
      }
    );
    return realtimeUnsubscribe;
  } catch (err) {
    console.warn('Could not initialize real-time Firestore listener:', err);
    return null;
  }
}

/**
 * One-time load from Firestore (compatible with existing code)
 */
export async function loadPortfolioFromFirestore(): Promise<PortfolioContentType | null> {
  try {
    const docRef = doc(db, 'portfolio', 'content');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const merged = deepMerge(DEFAULT_PORTFOLIO_CONTENT, data);
      Object.assign(PORTFOLIO_CONTENT, merged);
      notifyListeners();
      return merged;
    }
  } catch (err) {
    console.log('Using local portfolio fallback (offline or empty):', err);
  }
  return null;
}

/**
 * Saves changes to Firestore, cleans undefined fields, and notifies listeners.
 * Uses { merge: true } so existing unmanaged fields are never deleted.
 */
export async function savePortfolioToFirestore(newData: PortfolioContentType) {
  try {
    const docRef = doc(db, 'portfolio', 'content');
    const cleaned = cleanForFirestore(newData);
    await setDoc(docRef, cleaned, { merge: true });
    Object.assign(PORTFOLIO_CONTENT, newData);
    notifyListeners();
    return true;
  } catch (err) {
    console.error('Error saving portfolio content to Firestore:', err);
    throw err;
  }
}

/**
 * Resets portfolio in Firestore back to default content.
 */
export async function resetPortfolioToDefault() {
  try {
    const docRef = doc(db, 'portfolio', 'content');
    await deleteDoc(docRef);
    Object.assign(PORTFOLIO_CONTENT, JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_CONTENT)));
    notifyListeners();
    window.location.reload();
  } catch (err) {
    console.error('Error resetting portfolio:', err);
    throw err;
  }
}

/**
 * React hook to read reactive portfolio content that updates automatically.
 */
export function usePortfolioContent(): PortfolioContentType {
  const [content, setContent] = useState<PortfolioContentType>({ ...PORTFOLIO_CONTENT });

  useEffect(() => {
    const unsub = subscribeToPortfolio(() => {
      setContent({ ...PORTFOLIO_CONTENT });
    });
    return unsub;
  }, []);

  return content;
}
