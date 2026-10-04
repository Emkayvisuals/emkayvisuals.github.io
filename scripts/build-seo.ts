import fs from 'fs';
import path from 'path';

const FIRESTORE_URL =
  'https://firestore.googleapis.com/v1/projects/hidden-messenger-rcbh2/databases/ai-studio-emkayvisuals-2f5ceff9-8fbc-4aed-b4bd-12e98affc571/documents/portfolio/content';

const CACHE_FILE = path.resolve(process.cwd(), '.seo-cache.json');
const INDEX_HTML_PATH = path.resolve(process.cwd(), 'index.html');
const BASE_SITE_URL = 'https://emkayvisuals.github.io';

interface SeoData {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  ogImageAlt?: string;
  faviconUrl?: string;
}

const DEFAULT_SEO: SeoData = {
  metaTitle: 'Emkay Visuals – Graphic Designer & Motion Graphics Artist',
  metaDescription:
    'High-end, futuristic portfolio for Emkay Visuals – Graphic Designer & Motion Graphics Artist with 5+ years of experience in Posters, Visual Branding, Movie Art, Thumbnails & Motion Graphics.',
  ogImage: 'https://emkayvisuals.github.io/emkay.webp',
  ogImageAlt: 'Emkay Visuals Portfolio',
  faviconUrl: '/Images/emblem.webp',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getFirestoreUrl(): string {
  let projectId = 'hidden-messenger-rcbh2';
  let databaseId = 'ai-studio-emkayvisuals-2f5ceff9-8fbc-4aed-b4bd-12e98affc571';
  let apiKey = '';

  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (config.projectId) projectId = config.projectId;
      if (config.firestoreDatabaseId) databaseId = config.firestoreDatabaseId;
      if (config.apiKey) apiKey = config.apiKey;
    }
  } catch {
    // ignore
  }

  const queryParam = apiKey ? `?key=${encodeURIComponent(apiKey)}` : '';
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/portfolio/content${queryParam}`;
}

async function fetchLatestSeo(): Promise<SeoData> {
  const url = getFirestoreUrl();
  console.log('[build-seo] Fetching live SEO data directly from Firestore...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const doc = await res.json();
      const fields = doc?.fields;
      const seoFields = fields?.seo?.mapValue?.fields;
      const preloaderFields = fields?.preloader?.mapValue?.fields;

      const liveSeo: SeoData = {
        metaTitle: seoFields?.metaTitle?.stringValue || DEFAULT_SEO.metaTitle,
        metaDescription: seoFields?.metaDescription?.stringValue || DEFAULT_SEO.metaDescription,
        ogImage: seoFields?.ogImage?.stringValue || DEFAULT_SEO.ogImage,
        ogImageAlt: seoFields?.ogImageAlt?.stringValue || DEFAULT_SEO.ogImageAlt,
        faviconUrl:
          seoFields?.faviconUrl?.stringValue ||
          preloaderFields?.faviconUrl?.stringValue ||
          DEFAULT_SEO.faviconUrl,
      };

      // Always overwrite the local cache with freshly fetched live data
      try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(liveSeo, null, 2), 'utf-8');
        console.log('[build-seo] Successfully updated .seo-cache.json with fresh Firestore data');
      } catch (writeErr) {
        console.warn('[build-seo] Warning: could not write .seo-cache.json:', writeErr);
      }

      return liveSeo;
    } else {
      console.warn(
        `[build-seo] Firestore REST API returned ${res.status} ${res.statusText}. Checking cache fallback...`
      );
    }
  } catch (err: any) {
    console.warn('[build-seo] Network error fetching Firestore:', err?.message || err);
  }

  // Fallback to cache file if network was unavailable
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      const cached = JSON.parse(raw);
      if (cached && typeof cached === 'object') {
        console.log('[build-seo] Loaded fallback SEO from .seo-cache.json');
        return { ...DEFAULT_SEO, ...cached };
      }
    } catch {
      // ignore
    }
  }

  console.log('[build-seo] Using built-in default SEO values');
  return { ...DEFAULT_SEO };
}

function resolveAbsoluteUrl(urlOrPath: string): string {
  if (!urlOrPath) return `${BASE_SITE_URL}/emkay.webp`;
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    return urlOrPath;
  }
  const cleanPath = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`;
  return `${BASE_SITE_URL}${cleanPath}`;
}

function injectSeoIntoHtml(html: string, seo: SeoData): string {
  let result = html;
  const safeTitle = escapeHtml(seo.metaTitle);
  const safeDesc = escapeHtml(seo.metaDescription);
  const absoluteOgImage = resolveAbsoluteUrl(seo.ogImage);
  const safeOgImage = escapeHtml(absoluteOgImage);
  const safeOgImageAlt = escapeHtml(seo.ogImageAlt || seo.metaTitle);
  const favicon = seo.faviconUrl || '/Images/emblem.webp';

  // 1. Page <title>
  result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);

  // 2. Meta description
  result = result.replace(
    /(<meta\s+name=["']description["']\s+content=["'])[^"']*?(["'])/i,
    `$1${safeDesc}$2`
  );

  // 3. OpenGraph tags
  result = result.replace(
    /(<meta\s+property=["']og:title["']\s+content=["'])[^"']*?(["'])/i,
    `$1${safeTitle}$2`
  );
  result = result.replace(
    /(<meta\s+property=["']og:description["']\s+content=["'])[^"']*?(["'])/i,
    `$1${safeDesc}$2`
  );
  result = result.replace(
    /(<meta\s+property=["']og:image["']\s+content=["'])[^"']*?(["'])/i,
    `$1${safeOgImage}$2`
  );
  result = result.replace(
    /(<meta\s+property=["']og:image:secure_url["']\s+content=["'])[^"']*?(["'])/i,
    `$1${safeOgImage}$2`
  );
  result = result.replace(
    /(<meta\s+property=["']og:image:alt["']\s+content=["'])[^"']*?(["'])/i,
    `$1${safeOgImageAlt}$2`
  );

  // 4. Twitter / X Cards
  result = result.replace(
    /(<meta\s+name=["']twitter:title["']\s+content=["'])[^"']*?(["'])/i,
    `$1${safeTitle}$2`
  );
  result = result.replace(
    /(<meta\s+name=["']twitter:description["']\s+content=["'])[^"']*?(["'])/i,
    `$1${safeDesc}$2`
  );
  result = result.replace(
    /(<meta\s+name=["']twitter:image["']\s+content=["'])[^"']*?(["'])/i,
    `$1${safeOgImage}$2`
  );

  // 5. Favicon & Apple touch icon
  result = result.replace(
    /(<link\s+rel=["']icon["'][^>]*?href=["'])[^"']*?(["'])/i,
    `$1${favicon}$2`
  );
  result = result.replace(
    /(<link\s+rel=["']apple-touch-icon["'][^>]*?href=["'])[^"']*?(["'])/i,
    `$1${favicon}$2`
  );

  return result;
}

async function main() {
  console.log('[build-seo] Starting build-time SEO generation...');
  const seo = await fetchLatestSeo();
  console.log('[build-seo] Active SEO configuration:', {
    title: seo.metaTitle,
    description: seo.metaDescription.substring(0, 60) + '...',
    ogImage: seo.ogImage,
    favicon: seo.faviconUrl,
  });

  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error('[build-seo] index.html not found at', INDEX_HTML_PATH);
    process.exit(1);
  }

  const indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
  const updatedHtml = injectSeoIntoHtml(indexHtml, seo);
  fs.writeFileSync(INDEX_HTML_PATH, updatedHtml, 'utf-8');
  console.log('[build-seo] Successfully baked latest Firestore SEO tags into index.html!');

  const distHtmlPath = path.resolve(process.cwd(), 'dist/index.html');
  if (fs.existsSync(distHtmlPath)) {
    const distHtml = fs.readFileSync(distHtmlPath, 'utf-8');
    const updatedDistHtml = injectSeoIntoHtml(distHtml, seo);
    fs.writeFileSync(distHtmlPath, updatedDistHtml, 'utf-8');
    console.log('[build-seo] Also updated dist/index.html with latest SEO tags');
  }
}

main().catch((err) => {
  console.error('[build-seo] Error in SEO generation:', err);
  // Do not crash the build if SEO fetch fails
  process.exit(0);
});
