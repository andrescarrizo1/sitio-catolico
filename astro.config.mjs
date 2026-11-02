import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

const siteUrl = process.env.PUBLIC_SITE_URL || 'https://razonyasombro.com';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  integrations: [
    mdx(),
    preact({ compat: true }),
    sitemap({
      filter: (page) => {
        try {
          const urlObj = new URL(page);
          if (urlObj.pathname.includes('/404')) return false;
          if (urlObj.pathname === '/jesus/' || urlObj.pathname === '/jesus') return false;
          return true;
        } catch {
          return !page.includes('/404') && !page.endsWith('/jesus/') && !page.endsWith('/jesus');
        }
      },
    })
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
