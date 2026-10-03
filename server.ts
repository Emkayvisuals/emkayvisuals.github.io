import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const CACHE_FILE = path.resolve(process.cwd(), '.seo-cache.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Default fallback SEO metadata matching portfolio content
let currentSeo = {
  metaTitle: 'Emkay Visuals – Graphic Designer & Motion Graphics Artist',
  metaDescription:
    'High-end, futuristic portfolio for Emkay Visuals – Graphic Designer & Motion Graphics Artist with 5+ years of experience in Posters, Visual Branding, Movie Art, Thumbnails & Motion Graphics.',
  ogImage: 'https://emkayvisuals.github.io/emkay.webp',
};

// Attempt to load previously saved SEO metadata from local cache file
try {
  if (fs.existsSync(CACHE_FILE)) {
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      currentSeo = { ...currentSeo, ...parsed };
    }
  }
} catch {
  // Use default
}

// Background attempt to load latest content from Firestore REST API
async function syncFromFirestore() {
  try {
    const url =
      'https://firestore.googleapis.com/v1/projects/hidden-messenger-rcbh2/databases/ai-studio-emkayvisuals-2f5ceff9-8fbc-4aed-b4bd-12e98affc571/documents/portfolio/content';
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const seoFields = data.fields?.seo?.mapValue?.fields;
      if (seoFields) {
        if (seoFields.metaTitle?.stringValue) {
          currentSeo.metaTitle = seoFields.metaTitle.stringValue;
        }
        if (seoFields.metaDescription?.stringValue) {
          currentSeo.metaDescription = seoFields.metaDescription.stringValue;
        }
        if (seoFields.ogImage?.stringValue) {
          currentSeo.ogImage = seoFields.ogImage.stringValue;
        }
        fs.writeFileSync(CACHE_FILE, JSON.stringify(currentSeo, null, 2));
      }
    }
  } catch {
    // Graceful offline fallback
  }
}
syncFromFirestore();

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Injects Open Graph, Twitter card, title, and description tags directly into
 * the HTML string that the server sends to crawlers (WhatsApp, Instagram, etc.) and browsers.
 */
function injectSeoTags(html: string, seo: typeof currentSeo, host?: string): string {
  let result = html;
  const safeTitle = escapeHtml(seo.metaTitle || 'Emkay Visuals – Graphic Designer & Motion Graphics Artist');
  const safeDesc = escapeHtml(seo.metaDescription || '');
  
  let imageUrl = seo.ogImage || '';
  // If ogImage is a relative URL (e.g. /uploads/og-image.webp), build absolute URL for WhatsApp/Instagram crawlers
  if (imageUrl.startsWith('/') && host) {
    const protocol = host.includes('localhost') ? 'http' : 'https';
    imageUrl = `${protocol}://${host}${imageUrl}`;
  }
  const safeImage = escapeHtml(imageUrl);

  // 1. Title tag
  result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);

  // 2. Meta description
  result = result.replace(
    /(<meta\s+name=["']description["']\s+content=["'])[^"']*?(["'])/i,
    `$1${safeDesc}$2`
  );

  // 3. OpenGraph Tags
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
    `$1${safeImage}$2`
  );
  result = result.replace(
    /(<meta\s+property=["']og:image:secure_url["']\s+content=["'])[^"']*?(["'])/i,
    `$1${safeImage}$2`
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
    `$1${safeImage}$2`
  );

  const siteUrl = host ? (host.includes('localhost') ? `http://${host}` : `https://${host}`) : 'https://emkayvisuals.github.io';
  result = result.replace(
    /(<link\s+rel=["']canonical["']\s+href=["'])[^"']*?(["'])/i,
    `$1${siteUrl}$2`
  );
  result = result.replace(
    /(<meta\s+property=["']og:url["']\s+content=["'])[^"']*?(["'])/i,
    `$1${siteUrl}$2`
  );
  result = result.replace(
    /(<meta\s+name=["']twitter:url["']\s+content=["'])[^"']*?(["'])/i,
    `$1${siteUrl}$2`
  );

  const favicon = (seo as any).faviconUrl || '/emkay.webp';
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

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Static serving for user-uploaded public assets
  app.use('/uploads', express.static(UPLOADS_DIR));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Get current SEO meta tags
  app.get('/api/seo', (req, res) => {
    res.json(currentSeo);
  });

  // Update current SEO meta tags from Admin Dashboard
  app.post('/api/seo', (req, res) => {
    const { metaTitle, metaDescription, ogImage } = req.body || {};
    if (metaTitle) currentSeo.metaTitle = metaTitle;
    if (metaDescription) currentSeo.metaDescription = metaDescription;
    if (ogImage) currentSeo.ogImage = ogImage;

    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(currentSeo, null, 2));
    } catch {
      // ignore
    }

    res.json({ success: true, seo: currentSeo });
  });

  // Upload and store Open Graph image
  app.post('/api/upload-og-image', (req, res) => {
    try {
      const { imageBase64 } = req.body || {};
      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ error: 'imageBase64 required' });
      }

      // Strip data:image/webp;base64, or data:image/png;base64, prefix
      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const buffer = matches
        ? Buffer.from(matches[2], 'base64')
        : Buffer.from(imageBase64, 'base64');

      const fileName = `og-image-${Date.now()}.webp`;
      const filePath = path.join(UPLOADS_DIR, fileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${fileName}`;
      currentSeo.ogImage = publicUrl;

      try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(currentSeo, null, 2));
      } catch {
        // ignore
      }

      return res.json({ success: true, url: publicUrl, sizeBytes: buffer.length });
    } catch (err: unknown) {
      console.error('Upload OG image error:', err);
      return res.status(500).json({ error: 'Failed to save image' });
    }
  });

  // Serve converted WebP images from Firestore documents with long cache headers
  app.get('/media/:id', async (req, res) => {
    try {
      const mediaId = req.params.id;
      if (!mediaId) {
        return res.status(400).send('Media ID required');
      }

      // 1. Check local disk cache in UPLOADS_DIR
      const localFilePath = path.join(UPLOADS_DIR, `${mediaId}.webp`);
      if (fs.existsSync(localFilePath)) {
        res.setHeader('Content-Type', 'image/webp');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.sendFile(localFilePath);
      }

      // 2. Fetch from Firestore REST API
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/hidden-messenger-rcbh2/databases/ai-studio-emkayvisuals-2f5ceff9-8fbc-4aed-b4bd-12e98affc571/documents/media/${encodeURIComponent(mediaId)}`;
      const response = await fetch(firestoreUrl);
      if (!response.ok) {
        return res.status(404).send('Image not found');
      }

      const docData = await response.json();
      const base64Str = docData.fields?.base64?.stringValue;
      if (!base64Str) {
        return res.status(404).send('Invalid image content');
      }

      const cleanBase64 = base64Str.replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');

      // Cache locally on disk for ultra-fast subsequent requests
      try {
        fs.writeFileSync(localFilePath, buffer);
      } catch {
        // ignore cache write error
      }

      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Content-Length', buffer.length.toString());
      return res.send(buffer);
    } catch (err) {
      console.error('Error serving /media/:id:', err);
      return res.status(500).send('Error retrieving media');
    }
  });

  // Media upload endpoint (used as resilient server route for WebP images)
  app.post('/api/upload-media', async (req, res) => {
    try {
      const { id, base64, name } = req.body || {};
      if (!base64 || typeof base64 !== 'string') {
        return res.status(400).json({ error: 'base64 required' });
      }

      const mediaId = id || `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const cleanBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');

      // Save locally to disk
      const localFilePath = path.join(UPLOADS_DIR, `${mediaId}.webp`);
      fs.writeFileSync(localFilePath, buffer);

      // Mirror to Firestore REST API in background
      try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/hidden-messenger-rcbh2/databases/ai-studio-emkayvisuals-2f5ceff9-8fbc-4aed-b4bd-12e98affc571/documents/media?documentId=${encodeURIComponent(mediaId)}`;
        await fetch(firestoreUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              base64: { stringValue: cleanBase64 },
              contentType: { stringValue: 'image/webp' },
              name: { stringValue: name || `${mediaId}.webp` },
              sizeBytes: { integerValue: buffer.length },
              createdAt: { stringValue: new Date().toISOString() },
            },
          }),
        });
      } catch (firestoreErr) {
        console.warn('Could not mirror media to Firestore REST API:', firestoreErr);
      }

      return res.json({
        success: true,
        url: `/media/${mediaId}`,
        id: mediaId,
        sizeBytes: buffer.length,
        method: 'firestore_document',
      });
    } catch (err: unknown) {
      console.error('Upload media error:', err);
      return res.status(500).json({ error: 'Failed to upload media' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Intercept HTML requests to deliver SSR OpenGraph tags
    app.use(async (req, res, next) => {
      const url = req.originalUrl;
      const isHtmlRequest =
        req.method === 'GET' &&
        (url === '/' ||
          url.startsWith('/admin') ||
          url.startsWith('/gallery') ||
          url.startsWith('/portfolio') ||
          (!url.includes('.') && req.headers.accept?.includes('text/html')));

      if (isHtmlRequest) {
        try {
          const host = req.headers['x-forwarded-host']?.toString() || req.headers.host;
          const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
          let template = fs.readFileSync(indexHtmlPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          const finalHtml = injectSeoTags(template, currentSeo, host);
          return res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          return next(e);
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('*', (req, res) => {
      const host = req.headers['x-forwarded-host']?.toString() || req.headers.host;
      const indexHtmlPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexHtmlPath)) {
        const template = fs.readFileSync(indexHtmlPath, 'utf-8');
        const finalHtml = injectSeoTags(template, currentSeo, host);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } else {
        res.status(404).send('Page not found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
