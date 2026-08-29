import type { APIContext } from 'astro';
import { feed } from '../site/rss';
export const GET = (context: APIContext) => feed('es', context);
