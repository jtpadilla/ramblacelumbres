export const SITIO = {
  titulo: 'Ecosistema de la Rambla Celumbres',
  lema: 'Fauna, flora y paisaje de la rambla de Celumbres',
  descripcion:
    'Blog de Paquita y Tadeo sobre la biodiversidad de la rambla de Celumbres, ' +
    'en las montañas dels Ports: flora, invertebrados, vertebrados, aves, líquenes y hongos, ' +
    'fotografiados y descritos entre 2014 y 2016.',
  idioma: 'es',
} as const;

/** Nombre visible de cada categoria (en WordPress algunas tenian el punto final). */
export const CATEGORIAS: Record<string, string> = {
  flora: 'Flora',
  invertebrados: 'Invertebrados',
  vertebrados: 'Vertebrados',
  aves: 'Aves',
  microorganismos: 'Microorganismos',
  biodiversitat: 'Biodiversitat',
  animales: 'Animales',
};

export function nombreCategoria(slug: string): string {
  return CATEGORIAS[slug] ?? slug;
}

export function formatoFecha(fecha: Date): string {
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}
