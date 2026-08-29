// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import figuras from './src/plugins/figuras.mjs';

export default defineConfig({
  site: 'https://www.ramblacelumbres.org',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    processor: satteri({ hastPlugins: [figuras] }),
  },
  image: {
    // fotografia: 300 KB de JPEG original -> variantes webp mucho mas ligeras
    responsiveStyles: true,
    layout: 'constrained',
    breakpoints: [480, 900, 1400, 1920],
  },
});
