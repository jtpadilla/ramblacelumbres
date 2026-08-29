import { getCollection, type CollectionEntry } from 'astro:content';
import { SECCIONES, urlArticulo, type Lang, type SeccionKey } from './config';

export type Guia = CollectionEntry<'articulos'>;

/** Orden de lectura dentro de una seccion: por grupo (segun SECCIONES) y luego por `order`. */
export function ordenar(guias: Guia[]): Guia[] {
  return [...guias].sort((a, b) => {
    if (a.data.section !== b.data.section) return a.data.section.localeCompare(b.data.section);
    const grupos = Object.keys(SECCIONES[a.data.section].grupos);
    const ga = a.data.group ? grupos.indexOf(a.data.group) : grupos.length;
    const gb = b.data.group ? grupos.indexOf(b.data.group) : grupos.length;
    return ga - gb || a.data.order - b.data.order;
  });
}

export async function guiasDe(lang: Lang, seccion?: SeccionKey): Promise<Guia[]> {
  const todas = await getCollection('articulos', (e) => e.data.lang === lang && (!seccion || e.data.section === seccion));
  return ordenar(todas);
}

export async function guiaPorClave(lang: Lang, key: string): Promise<Guia | undefined> {
  const [g] = await getCollection('articulos', (e) => e.data.lang === lang && e.data.key === key);
  return g;
}

export const urlDe = (g: Guia) => urlArticulo(g.data.lang, g.data.section, g.data.ruta);

/** Numero de fotografias que aparecen en el cuerpo de una guia. */
export const fotosDe = (g: Guia) => (g.body?.match(/^!\[/gm) ?? []).length;
