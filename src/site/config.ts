export type Lang = 'es' | 'ca';
export const LANGS = ['es', 'ca'] as const satisfies readonly Lang[];
export const LANG_POR_DEFECTO: Lang = 'es';

/** Texto con una version por idioma. */
export type T = Record<Lang, string>;

export const SITIO = {
  url: 'https://www.ramblacelumbres.org',
  nombre: 'Rambla Celumbres',
  titulo: { es: 'Ecosistema de la Rambla Celumbres', ca: 'Ecosistema de la Rambla Celumbres' } as T,
  lema: {
    es: 'Fauna, flora y paisaje de la rambla de Celumbres, en las montañas dels Ports',
    ca: 'Fauna, flora i paisatge de la rambla de Celumbres, a les muntanyes dels Ports',
  } as T,
  descripcion: {
    es: 'Guía fotográfica de la biodiversidad de la rambla de Celumbres (Cinctorres, Castellfort y Portell, comarca dels Ports): flora, insectos, aves, mamíferos, hongos y líquenes, con los textos de Francisca Julián Querol y las fotografías de Tadeo Julián Querol.',
    ca: 'Guia fotogràfica de la biodiversitat de la rambla de Celumbres (Cinctorres, Castellfort i Portell, comarca dels Ports): flora, insectes, aus, mamífers, fongs i líquens, amb els textos de Francisca Julián Querol i les fotografies de Tadeo Julián Querol.',
  } as T,
  locale: { es: 'es-ES', ca: 'ca-ES' } as T,
  repositorio: 'https://github.com/jtpadilla/ramblacelumbres',
  hermano: { nombre: 'santjoans.es', url: 'https://santjoans.es/', repositorio: 'https://github.com/jtpadilla/santjoans' },
};

export const AUTORES = {
  textos: 'Francisca Julián Querol',
  fotografias: 'Tadeo Julián Querol',
  contacto: 'Juan Tadeo Padilla Julián',
};

// ----------------------------------------------------------------- secciones

export type SeccionKey = 'la-rambla' | 'flora' | 'fauna' | 'hongos-y-liquenes';

export interface Seccion {
  slug: T;
  nombre: T;
  lema: T;
  /** foto de portada, dentro de src/assets/uploads */
  cover: string;
  /** subgrupos en el orden en que se muestran; las guias sin grupo van al final */
  grupos: Record<string, T>;
}

export const SECCIONES: Record<SeccionKey, Seccion> = {
  'la-rambla': {
    slug: { es: 'la-rambla', ca: 'la-rambla' },
    nombre: { es: 'La rambla', ca: 'La rambla' },
    lema: {
      es: 'El paraje, la piedra seca y las cuatro estaciones',
      ca: 'El paratge, la pedra seca i les quatre estacions',
    },
    cover: '2014/03/10.jpg',
    grupos: {
      paraje: { es: 'El lugar', ca: 'El lloc' },
      estaciones: { es: 'Las estaciones', ca: 'Les estacions' },
    },
  },
  flora: {
    slug: { es: 'flora', ca: 'flora' },
    nombre: { es: 'Flora', ca: 'Flora' },
    lema: {
      es: 'Árboles, orquídeas y un catálogo de flores silvestres',
      ca: 'Arbres, orquídies i un catàleg de flors silvestres',
    },
    cover: '2014/10/61-1.jpg',
    grupos: {
      arboles: { es: 'Árboles', ca: 'Arbres' },
      flores: { es: 'Flores', ca: 'Flors' },
    },
  },
  fauna: {
    slug: { es: 'fauna', ca: 'fauna' },
    nombre: { es: 'Fauna', ca: 'Fauna' },
    lema: {
      es: 'Buitres, cabras montesas, mariposas, arañas y otros vecinos',
      ca: 'Voltors, cabres salvatges, papallones, aranyes i altres veïns',
    },
    cover: '2014/08/10.jpg',
    grupos: {
      vertebrados: { es: 'Aves y mamíferos', ca: 'Aus i mamífers' },
      insectos: { es: 'Insectos', ca: 'Insectes' },
      'otros-invertebrados': { es: 'Arañas y miriápodos', ca: 'Aranyes i miriàpodes' },
    },
  },
  'hongos-y-liquenes': {
    slug: { es: 'hongos-y-liquenes', ca: 'fongs-i-liquens' },
    nombre: { es: 'Hongos y líquenes', ca: 'Fongs i líquens' },
    lema: {
      es: 'Setas del bosque y líquenes de las rocas',
      ca: 'Bolets del bosc i líquens de les roques',
    },
    cover: '2014/09/0-1.jpg',
    grupos: {},
  },
};

export const SECCION_KEYS = Object.keys(SECCIONES) as SeccionKey[];

// ------------------------------------------------------------------- paginas

export type PaginaKey = 'autores' | 'proyecto';

export const PAGINAS: Record<PaginaKey, { slug: T; nombre: T }> = {
  autores: { slug: { es: 'los-autores', ca: 'els-autors' }, nombre: { es: 'Los autores', ca: 'Els autors' } },
  proyecto: { slug: { es: 'el-proyecto', ca: 'el-projecte' }, nombre: { es: 'El proyecto', ca: 'El projecte' } },
};

// ---------------------------------------------------------------------- urls

/** El castellano va en la raiz; el catalan, bajo /ca/. */
export const prefijo = (lang: Lang) => (lang === LANG_POR_DEFECTO ? '' : `/${lang}`);
export const urlInicio = (lang: Lang) => `${prefijo(lang)}/`;
export const urlSeccion = (lang: Lang, key: SeccionKey) => `${prefijo(lang)}/${SECCIONES[key].slug[lang]}/`;
export const urlArticulo = (lang: Lang, seccion: SeccionKey, slug: string) =>
  `${prefijo(lang)}/${SECCIONES[seccion].slug[lang]}/${slug}/`;
export const urlPagina = (lang: Lang, key: PaginaKey) => `${prefijo(lang)}/${PAGINAS[key].slug[lang]}/`;
export const urlCatalogo = (lang: Lang) =>
  urlArticulo(lang, 'flora', lang === 'es' ? 'flores-silvestres' : 'flors-silvestres');

export const otroIdioma = (lang: Lang): Lang => (lang === 'es' ? 'ca' : 'es');

// ------------------------------------------------------ enlaces del WordPress

/**
 * El blog original enlazaba con ?p=<id>, ?page_id=<id> y ?cat=<id>. Aqui se
 * traducen a la clave del contenido nuevo; la URL final se resuelve al
 * construir la portada, que es la pagina que recibe esas visitas.
 */
export const WP_ENTRADAS: Record<number, string> = {
  65: 'el-paraje', 448: 'piedra-seca', 1049: 'primavera', 1090: 'verano', 1109: 'otono', 1013: 'invierno',
  131: 'arboles', 88: 'orquideas',
  643: 'flores-silvestres', 649: 'flores-silvestres', 851: 'flores-silvestres', 868: 'flores-silvestres',
  897: 'flores-silvestres', 904: 'flores-silvestres', 914: 'flores-silvestres', 935: 'flores-silvestres',
  960: 'flores-silvestres', 966: 'flores-silvestres', 998: 'flores-silvestres',
  148: 'mariposas', 76: 'polillas', 250: 'escarabajos', 252: 'mantis', 332: 'chinches',
  361: 'abejas-avispas-hormigas', 417: 'libelulas', 543: 'saltamontes-grillos',
  32: 'aranas', 304: 'miriapodos', 521: 'rapaces', 1153: 'cabra-montes',
  572: 'hongos', 482: 'liquenes',
};
export const WP_PAGINAS: Record<number, PaginaKey> = { 23: 'autores' };
export const WP_CATEGORIAS: Record<number, SeccionKey> = {
  2: 'la-rambla', 3: 'flora', 4: 'fauna', 5: 'fauna', 16: 'fauna', 6: 'hongos-y-liquenes',
};

export function formatoFecha(fecha: Date, lang: Lang, conDia = false): string {
  return fecha.toLocaleDateString(SITIO.locale[lang], {
    ...(conDia ? { day: 'numeric' } : {}),
    month: 'long',
    year: 'numeric',
  });
}
