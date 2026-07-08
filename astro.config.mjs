// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import { remarkReadingTime } from './src/utils/readingTime.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://aloneinthedungeon.com',
  build: {
    inlineStylesheets: 'always',
  },
  image: {
    // YouTube thumbnails get fetched once at build time and served as
    // right-sized local WebP — PSI flagged ~600KB of oversized i.ytimg
    // originals plus their short cache TTLs as the mobile LCP bottleneck.
    domains: ['i.ytimg.com'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  integrations: [mdx(), sitemap()],
});
