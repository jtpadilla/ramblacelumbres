import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITIO, SECCIONES, type Lang } from './config';
import { guiasDe, urlDe } from './guias';

export async function feed(lang: Lang, context: APIContext) {
  const guias = (await guiasDe(lang)).sort((a, b) => b.data.originalDate.valueOf() - a.data.originalDate.valueOf());
  return rss({
    title: SITIO.titulo[lang],
    description: SITIO.descripcion[lang],
    // las URL de las guias ya llevan la base del sitio, asi que se resuelven sobre la raiz
    site: context.site!.href,
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
