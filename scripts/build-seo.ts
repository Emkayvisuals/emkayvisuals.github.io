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

async function fetchLatestSeo(): Promise<SeoData> {
  let seo: SeoData = { ...DEFAULT_SEO };

  // 1. Check local cache file as first fallback
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      const cached = JSON.parse(raw);
      if (cached && typeof cached === 'object') {
        seo = { ...seo, ...cached };
      }
    } catch {
      // ignore
    }
  }

  // 2. Fetch fresh live data from Firestore REST API at build time
  try {
    console.log('[build-seo] Fetching latest live content from Firestore...');
    const res = await fetch(FIRESTORE_URL, {
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const doc = await res.json();
      const fields = doc?.fields;
      const seoFields = fields?.seo?.mapValue?.fields;
      const preloaderFields = fields?.preloader?.mapValue?.fields;

      if (seoFields) {
        if (seoFields.metaTitle?.stringValue) {
          seo.metaTitle = seoFields.metaTitle.stringValue;
        }
        if (seoFields.metaDescription?.stringValue) {
          seo.metaDescription = seoFields.metaDescription.stringValue;
        }
        if (seoFields.ogImage?.stringValue) {
          seo.ogImage = seoFields.ogImage.stringValue;
        }
        if (seoFields.ogImageAlt?.stringValue) {
          seo.ogImageAlt = seoFields.ogImageAlt.stringValue;
        }
        if (seoFields.faviconUrl?.stringValue) {
          seo.faviconUrl = seoFields.faviconUrl.stringValue;
        }
      }

      if (preloaderFields?.faviconUrl?.stringValue && !seoFields?.faviconUrl?.stringValue) {
        seo.faviconUrl = preloaderFields.faviconUrl.stringValue;
      }

      // Save freshly fetched data to cache file
      try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(seo, null, 2), 'utf-8');
        console.log('[build-seo] Updated .seo-cache.json with fresh Firestore data');
      } catch (writeErr) {
        console.warn('[build-seo] Warning: could not write .seo-cache.json:', writeErr);
      }
    } else {
      console.warn(`[build-seo] Firestore API returned ${res.status} ${res.statusText}, using cached/fallback SEO`);
    }
  } catch (err) {
    console.warn('[build-seo] Network error fetching Firestore, using cached/fallback SEO:', err);
  }

  return seo;
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
}

main().catch((err) => {
  console.error('[build-seo] Error in SEO generation:', err);
  // Do not crash the build if SEO fetch fails
  process.exit(0);
});
