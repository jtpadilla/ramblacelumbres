import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Cada guia existe en castellano y en valenciano como dos ficheros con la
 * misma `key` (src/content/articulos/es/<key>.md y .../ca/<key>.md).
 */
const articulos = defineCollection({
  loader: glob({ base: './src/content/articulos', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      key: z.string(),
      lang: z.enum(['es', 'ca']),
      ruta: z.string(),
      title: z.string(),
      subtitle: z.string().optional(),
      section: z.enum(['la-rambla', 'flora', 'fauna', 'hongos-y-liquenes']),
      group: z.string().optional(),
      order: z.number().default(99),
      originalDate: z.coerce.date(),
      cover: image(),
      coverAlt: z.string(),
      summary: z.string(),
      layout: z.enum(['catalogo']).optional(),
    }),
});

export const collections = { articulos };
