// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import figuras from './src/plugins/figuras.mjs';

export default defineConfig({
  // Dominio propio en la raiz: el mismo que public/CNAME. GitHub Pages redirige
  // www.ramblacelumbres.org aqui.
  site: 'https://ramblacelumbres.org',
  base: '/',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'ca', 'en', 'zh'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-ES', ca: 'ca-ES', en: 'en-GB', zh: 'zh-Hans' } },
    }),
  ],
  // Las fuentes se descargan en el build y se sirven desde el propio sitio:
  // ninguna peticion a terceros al visitarlo.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Fraunces',
      cssVariable: '--fuente-titulos',
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Source Sans 3',
      cssVariable: '--fuente-texto',
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
  ],
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
