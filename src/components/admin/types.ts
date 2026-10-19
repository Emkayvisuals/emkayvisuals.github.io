import { PortfolioContentType } from '../../data/portfolioContent';

export type AdminTabId =
  | 'analytics'
  | 'briefs'
  | 'seo'
  | 'preloader'
  | 'hero'
  | 'stats'
  | 'services'
  | 'projects'
  | 'about'
  | 'process'
  | 'testimonials'
  | 'faq'
  | 'contact'
  | 'servicePricing'
  | 'footer'
  | 'youtubeGallery';

export interface AdminTabProps {
  content: PortfolioContentType;
  onChange: (updated: PortfolioContentType) => void;
  onSave: (sectionName: string) => Promise<void>;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  isDirty?: boolean;
}
