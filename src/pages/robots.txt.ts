import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const allowIndexing = import.meta.env.PROD || import.meta.env.PUBLIC_ALLOW_INDEXING === 'true';
  const siteUrl = site ? site.toString().replace(/\/$/, '') : (import.meta.env.PUBLIC_SITE_URL || 'https://razonyasombro.com');

  if (allowIndexing) {
    return new Response(
      `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap-index.xml\n`,
      {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      }
    );
  }

  return new Response(
    `User-agent: *\nDisallow: /\n`,
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    }
  );
};
