import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITIO } from '../site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const entradas = (await getCollection('posts')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  return rss({
    title: SITIO.titulo,
    description: SITIO.descripcion,
    site: context.site!,
    customData: '<language>es-ES</language>',
    items: entradas.map((e) => ({
      title: e.data.title,
      pubDate: e.data.date,
      link: `/blog/${e.id}/`,
      categories: e.data.categories,
    })),
  });
}
