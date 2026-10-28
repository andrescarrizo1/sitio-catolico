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
    sitemap()
  ],
  redirects: {
    '/santos/estudios-medicos-y-santo-oficio': '/padre-pio/estudios-medicos-y-santo-oficio/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
