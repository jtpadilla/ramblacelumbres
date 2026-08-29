import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const camposComunes = ({ image }: { image: () => any }) =>
  z.object({
    title: z.string(),
    date: z.coerce.date(),
    wpId: z.number(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    cover: image().optional(),
  });

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: camposComunes,
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: camposComunes,
});

export const collections = { posts, pages };
