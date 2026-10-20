import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { PortfolioContentType, DEFAULT_PORTFOLIO_CONTENT } from '../data/portfolioContent';

export interface BackupMetadata {
  appName: string;
  source: string;
  exportedAt: string;
  schemaVersion: number;
  environment: string;
  itemCounts: {
    portfolio: number;
    briefs: number;
    projectBriefs: number;
    analytics: number;
    media: number;
  };
}

export interface FirestoreBackupFile {
  _meta?: BackupMetadata;
  portfolio?: {
    content: PortfolioContentType;
  };
  briefs?: Array<{ id: string; [key: string]: any }>;
  projectBriefs?: Array<{ id: string; [key: string]: any }>;
  analytics?: Record<string, any>;
  media?: Array<{ id: string; [key: string]: any }>;
}

export interface BackupInspectionResult {
  valid: boolean;
  error?: string;
  metadata?: Partial<BackupMetadata>;
  contentSummary: {
    projectsCount: number;
    testimonialsCount: number;
    processStepsCount: number;
    faqCount: number;
    galleryCount: number;
    projectBriefsCount: number;
    briefsCount: number;
    analyticsCount: number;
    mediaCount: number;
  };
  summaryItems: string[];
  cleanBackup: FirestoreBackupFile | null;
}

/**
 * Recursively cleans Firestore Timestamps or special types to serializable primitives.
 */
function serializeData(val: any): any {
  if (val === null || val === undefined) return val;
  if (typeof val === 'object') {
    // Firestore Timestamp check
    if (typeof val.toDate === 'function') {
      return val.toDate().toISOString();
    }
    if (typeof val.seconds === 'number' && typeof val.nanoseconds === 'number') {
      return new Date(val.seconds * 1000 + val.nanoseconds / 1000000).toISOString();
    }
    if (Array.isArray(val)) {
      return val.map(serializeData);
    }
    const cleanObj: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      cleanObj[k] = serializeData(v);
    }
    return cleanObj;
  }
  return val;
}

/**
 * Queries all Firestore content (portfolio content, briefs, project briefs, analytics, and media)
 * and generates a complete, structured JSON backup object.
 */
export async function exportFirestoreBackup(
  currentContentState?: PortfolioContentType
): Promise<{
  backup: FirestoreBackupFile;
  fileName: string;
  sizeKb: number;
  summaryText: string;
}> {
  // 1. Portfolio Content
  let portfolioData: any = null;
  try {
    const portfolioDoc = await getDoc(doc(db, 'portfolio', 'content'));
    if (portfolioDoc.exists()) {
      portfolioData = portfolioDoc.data();
    }
  } catch (err) {
    console.warn('Could not read portfolio/content from Firestore, using active state fallback:', err);
  }

  // Use Firestore content, fallback to active memory state, or default content
  const mergedPortfolio = portfolioData || currentContentState || DEFAULT_PORTFOLIO_CONTENT;

  // 2. Briefs
  const briefs: Array<{ id: string; [key: string]: any }> = [];
  try {
    const snap = await getDocs(collection(db, 'briefs'));
    snap.forEach((d) => {
      briefs.push({ id: d.id, ...serializeData(d.data()) });
    });
  } catch (err) {
    console.warn('Notice querying briefs collection for backup:', err);
  }

  // 3. Project Briefs
  const projectBriefs: Array<{ id: string; [key: string]: any }> = [];
  try {
    const snap = await getDocs(collection(db, 'projectBriefs'));
    snap.forEach((d) => {
      projectBriefs.push({ id: d.id, ...serializeData(d.data()) });
    });
  } catch (err) {
    console.warn('Notice querying projectBriefs collection for backup:', err);
  }

  // 4. Analytics
  const analytics: Record<string, any> = {};
  try {
    const snap = await getDocs(collection(db, 'analytics'));
    snap.forEach((d) => {
      analytics[d.id] = serializeData(d.data());
    });
  } catch (err) {
    console.warn('Notice querying analytics collection for backup:', err);
  }

  // 5. Media
  const media: Array<{ id: string; [key: string]: any }> = [];
  try {
    const snap = await getDocs(collection(db, 'media'));
    snap.forEach((d) => {
      media.push({ id: d.id, ...serializeData(d.data()) });
    });
  } catch (err) {
    console.warn('Notice querying media collection for backup:', err);
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `emkay-visuals-firestore-backup-${dateStr}.json`;

  const backup: FirestoreBackupFile = {
    _meta: {
      appName: 'Emkay Visuals',
      source: 'Emkay Visuals /admin Firestore Backup',
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      environment: 'production',
      itemCounts: {
        portfolio: portfolioData ? 1 : 0,
        briefs: briefs.length,
        projectBriefs: projectBriefs.length,
        analytics: Object.keys(analytics).length,
        media: media.length,
      },
    },
    portfolio: {
      content: serializeData(mergedPortfolio),
    },
    briefs,
    projectBriefs,
    analytics,
    media,
  };

  const jsonString = JSON.stringify(backup, null, 2);
  const sizeKb = Math.max(1, Math.round(new Blob([jsonString]).size / 1024));
  const totalItems =
    (portfolioData ? 1 : 0) +
    briefs.length +
    projectBriefs.length +
    Object.keys(analytics).length +
    media.length;

  const summaryText = `${totalItems} items (${sizeKb} KB)`;

  return { backup, fileName, sizeKb, summaryText };
}

/**
 * Triggers a browser download of the given JSON data.
 */
export function downloadJsonFile(data: any, fileName: string) {
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Parses and verifies an uploaded backup JSON string.
 * Validates the schema, extracts item counts, and prepares a normalized backup structure.
 */
export function inspectBackupJson(jsonString: string): BackupInspectionResult {
  const zeros = {
    projectsCount: 0,
    testimonialsCount: 0,
    processStepsCount: 0,
    faqCount: 0,
    galleryCount: 0,
    projectBriefsCount: 0,
    briefsCount: 0,
    analyticsCount: 0,
    mediaCount: 0,
  };

  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return {
      valid: false,
      error: 'The uploaded file is not valid JSON. Please ensure you upload an intact .json backup file.',
      contentSummary: zeros,
      summaryItems: [],
      cleanBackup: null,
    };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      valid: false,
      error: 'The uploaded file does not contain a valid JSON backup object.',
      contentSummary: zeros,
      summaryItems: [],
      cleanBackup: null,
    };
  }

  // Recognize backup format:
  // 1. Standard format: has parsed.portfolio?.content (and possibly _meta, projectBriefs, etc.)
  // 2. Direct portfolio object: has parsed.hero AND (parsed.projects OR parsed.services)
  let portfolioContent: PortfolioContentType | null = null;
  if (parsed.portfolio?.content && typeof parsed.portfolio.content === 'object') {
    portfolioContent = parsed.portfolio.content;
  } else if (parsed.portfolio && typeof parsed.portfolio === 'object' && parsed.portfolio.hero) {
    portfolioContent = parsed.portfolio;
  } else if (parsed.hero && (parsed.services || parsed.projects)) {
    portfolioContent = parsed;
  }

  const hasBriefs = Array.isArray(parsed.briefs) && parsed.briefs.length > 0;
  const hasProjectBriefs = Array.isArray(parsed.projectBriefs) && parsed.projectBriefs.length > 0;
  const hasAnalytics = parsed.analytics && typeof parsed.analytics === 'object' && Object.keys(parsed.analytics).length > 0;
  const hasMedia = Array.isArray(parsed.media) && parsed.media.length > 0;

  if (!portfolioContent && !hasBriefs && !hasProjectBriefs && !hasAnalytics && !hasMedia) {
    return {
      valid: false,
      error: 'Unrecognized backup format. The uploaded JSON does not contain recognized Emkay Visuals portfolio content or Firestore collections.',
      contentSummary: zeros,
      summaryItems: [],
      cleanBackup: null,
    };
  }

  // Count items
  const projectsCount = Array.isArray(portfolioContent?.projects) ? portfolioContent.projects.length : 0;
  const testimonialsCount = Array.isArray(portfolioContent?.testimonials)
    ? portfolioContent.testimonials.length
    : (portfolioContent as any)?.testimonials?.items?.length || 0;
  const processStepsCount = Array.isArray(portfolioContent?.process)
    ? portfolioContent.process.length
    : (portfolioContent as any)?.process?.steps?.length || 0;
  const faqCount = Array.isArray(portfolioContent?.faq)
    ? portfolioContent.faq.length
    : (portfolioContent as any)?.faq?.items?.length || 0;
  const galleryCount =
    portfolioContent?.manipulationGallery?.items?.length ||
    (portfolioContent as any)?.youtubeGallery?.items?.length ||
    0;
  const projectBriefsCount = Array.isArray(parsed.projectBriefs) ? parsed.projectBriefs.length : 0;
  const briefsCount = Array.isArray(parsed.briefs) ? parsed.briefs.length : 0;
  const analyticsCount = parsed.analytics && typeof parsed.analytics === 'object' ? Object.keys(parsed.analytics).length : 0;
  const mediaCount = Array.isArray(parsed.media) ? parsed.media.length : 0;

  const contentSummary = {
    projectsCount,
    testimonialsCount,
    processStepsCount,
    faqCount,
    galleryCount,
    projectBriefsCount,
    briefsCount,
    analyticsCount,
    mediaCount,
  };

  const summaryItems: string[] = [];
  if (projectsCount > 0) summaryItems.push(`${projectsCount} projects`);
  if (testimonialsCount > 0) summaryItems.push(`${testimonialsCount} testimonials`);
  if (processStepsCount > 0) summaryItems.push(`${processStepsCount} process steps`);
  if (faqCount > 0) summaryItems.push(`${faqCount} FAQ items`);
  if (galleryCount > 0) summaryItems.push(`${galleryCount} gallery items`);
  if (projectBriefsCount > 0) summaryItems.push(`${projectBriefsCount} project briefs`);
  if (briefsCount > 0) summaryItems.push(`${briefsCount} briefs`);
  if (analyticsCount > 0) summaryItems.push(`${analyticsCount} analytics records`);
  if (mediaCount > 0) summaryItems.push(`${mediaCount} media records`);

  if (summaryItems.length === 0 && portfolioContent) {
    summaryItems.push('1 portfolio configuration');
  }

  const cleanBackup: FirestoreBackupFile = {
    _meta: parsed._meta || {
      appName: 'Emkay Visuals',
      source: 'Restored Backup',
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      environment: 'production',
      itemCounts: {
        portfolio: portfolioContent ? 1 : 0,
        briefs: briefsCount,
        projectBriefs: projectBriefsCount,
        analytics: analyticsCount,
        media: mediaCount,
      },
    },
    portfolio: {
      content: portfolioContent || (DEFAULT_PORTFOLIO_CONTENT as any),
    },
    briefs: Array.isArray(parsed.briefs) ? parsed.briefs : [],
    projectBriefs: Array.isArray(parsed.projectBriefs) ? parsed.projectBriefs : [],
    analytics: parsed.analytics && typeof parsed.analytics === 'object' ? parsed.analytics : {},
    media: Array.isArray(parsed.media) ? parsed.media : [],
  };

  return {
    valid: true,
    metadata: parsed._meta,
    contentSummary,
    summaryItems,
    cleanBackup,
  };
}

/**
 * Restores a validated backup structure back into Firestore.
 * Updates portfolio/content, projectBriefs, briefs, analytics, and media.
 */
export async function restoreFirestoreBackup(
  backup: FirestoreBackupFile,
  onProgress?: (step: string) => void
): Promise<{
  success: boolean;
  error?: string;
  restoredSummary: string;
  restoredContent?: PortfolioContentType;
}> {
  try {
    const counts: string[] = [];
    let restoredContent: PortfolioContentType | undefined;

    // 1. Portfolio Content
    if (backup.portfolio?.content) {
      onProgress?.('Writing portfolio content to Firestore...');
      await setDoc(doc(db, 'portfolio', 'content'), backup.portfolio.content);
      restoredContent = backup.portfolio.content;
      const prjCount = backup.portfolio.content.projects?.length || 0;
      counts.push(`Portfolio content (${prjCount} projects)`);

      if (backup.portfolio.content.seo) {
        try {
          await fetch('/api/seo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backup.portfolio.content.seo),
          });
        } catch {
          // ignore if server not mounted
        }
      }
    }

    // 2. Project Briefs
    if (Array.isArray(backup.projectBriefs) && backup.projectBriefs.length > 0) {
      onProgress?.(`Restoring ${backup.projectBriefs.length} project briefs...`);
      for (const item of backup.projectBriefs) {
        const { id, ...data } = item;
        const targetId = id || `brief_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await setDoc(doc(db, 'projectBriefs', targetId), data);
      }
      counts.push(`${backup.projectBriefs.length} project briefs`);
    }

    // 3. Briefs
    if (Array.isArray(backup.briefs) && backup.briefs.length > 0) {
      onProgress?.(`Restoring ${backup.briefs.length} briefs...`);
      for (const item of backup.briefs) {
        const { id, ...data } = item;
        const targetId = id || `brief_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await setDoc(doc(db, 'briefs', targetId), data);
      }
      counts.push(`${backup.briefs.length} briefs`);
    }

    // 4. Analytics
    if (backup.analytics && typeof backup.analytics === 'object') {
      const entries = Object.entries(backup.analytics);
      if (entries.length > 0) {
        onProgress?.(`Restoring ${entries.length} analytics records...`);
        for (const [id, data] of entries) {
          if (data && typeof data === 'object') {
            await setDoc(doc(db, 'analytics', id), data);
          }
        }
        counts.push(`${entries.length} analytics records`);
      }
    }

    // 5. Media
    if (Array.isArray(backup.media) && backup.media.length > 0) {
      onProgress?.(`Restoring ${backup.media.length} media records...`);
      for (const item of backup.media) {
        const { id, ...data } = item;
        const targetId = id || `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await setDoc(doc(db, 'media', targetId), data);
      }
      counts.push(`${backup.media.length} media records`);
    }

    const restoredSummary = counts.join(', ');
    return { success: true, restoredSummary, restoredContent };
  } catch (err: any) {
    console.error('Error during Firestore restore:', err);
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred while writing data to Firestore.',
      restoredSummary: '',
    };
  }
}
