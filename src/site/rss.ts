import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITIO, SECCIONES, urlInicio, type Lang } from './config';
import { guiasDe, urlDe } from './guias';

export async function feed(lang: Lang, context: APIContext) {
  const guias = (await guiasDe(lang)).sort((a, b) => b.data.originalDate.valueOf() - a.data.originalDate.valueOf());
  return rss({
    title: SITIO.titulo[lang],
    description: SITIO.descripcion[lang],
    // El <link> del canal apunta a la portada de SU idioma, no a la del sitio. Las URL de
    // las guias son rutas absolutas y ya llevan la base, asi que se resuelven igual.
    site: new URL(urlInicio(lang), context.site!).href,
    customData: `<language>${SITIO.locale[lang]}</language>`,
    items: guias.map((g) => ({
      title: g.data.title,
      description: g.data.summary,
      pubDate: g.data.originalDate,
      link: urlDe(g),
      categories: [SECCIONES[g.data.section].nombre[lang]],
    })),
  });
}
