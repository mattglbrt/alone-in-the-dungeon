// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import { unified } from '@astrojs/markdown-remark';

import { remarkReadingTime } from './src/utils/readingTime.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://aloneinthedungeon.com',
  build: {
    inlineStylesheets: 'always',
  },
  // Astro 7 changed the default to 'jsx', which strips whitespace between
  // inline elements. That joined label/value pairs in the character cards
  // ("PatronShune the Vile") — harmless visually since the spacing is CSS
  // (ml-2), but it changes the Pagefind index and how screen readers read
  // them. Keep the v6 behaviour; the byte saving was ~0.3%.
  compressHTML: true,
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
    // Astro 7 defaults to the Sätteri processor and no longer runs
    // remarkPlugins. unified() keeps the remark pipeline (and so the
    // reading-time frontmatter every post layout reads).
    processor: unified({ remarkPlugins: [remarkReadingTime] }),
  },
  integrations: [mdx(), sitemap()],
});
