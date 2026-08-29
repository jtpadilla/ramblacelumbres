export type Lang = 'es' | 'ca' | 'en' | 'zh';
export const LANGS = ['es', 'ca', 'en', 'zh'] as const satisfies readonly Lang[];

/** Codigo BCP 47 para `lang` y `hreflang`: el chino se etiqueta por escritura (simplificada), no por pais. */
export const CODIGO_IDIOMA: Record<Lang, string> = { es: 'es', ca: 'ca', en: 'en', zh: 'zh-Hans' };
export const LANG_POR_DEFECTO: Lang = 'es';

/** Texto con una version por idioma. */
export type T = Record<Lang, string>;

export const SITIO = {
  url: 'https://www.ramblacelumbres.org',
  nombre: 'Rambla Celumbres',
  titulo: { es: 'Ecosistema de la Rambla Celumbres', ca: 'Ecosistema de la Rambla Celumbres', en: 'Rambla Celumbres Ecosystem', zh: '塞伦布雷斯干河生态系统' } as T,
  lema: {
    es: 'Fauna, flora y paisaje de la rambla de Celumbres, en las montañas dels Ports',
    ca: 'Fauna, flora i paisatge de la rambla de Celumbres, a les muntanyes dels Ports',
    en: 'Wildlife, flora and landscape of the Celumbres rambla, in the Els Ports mountains',
    zh: 'Els Ports 山区塞伦布雷斯干河（Rambla Celumbres）的动物、植物与风景',
  } as T,
  descripcion: {
    es: 'Guía fotográfica de la biodiversidad de la rambla de Celumbres (Cinctorres, Castellfort y Portell, comarca dels Ports): flora, insectos, aves, mamíferos, hongos y líquenes, con los textos de Francisca Julián Querol y las fotografías de Tadeo Julián Querol.',
    ca: 'Guia fotogràfica de la biodiversitat de la rambla de Celumbres (Cinctorres, Castellfort i Portell, comarca dels Ports): flora, insectes, aus, mamífers, fongs i líquens, amb els textos de Francisca Julián Querol i les fotografies de Tadeo Julián Querol.',
    en: 'A photographic guide to the biodiversity of the Celumbres rambla (Cinctorres, Castellfort and Portell, Els Ports, Castellón): flora, insects, birds, mammals, fungi and lichens, with texts by Francisca Julián Querol and photographs by Tadeo Julián Querol.',
    zh: '塞伦布雷斯干河（Rambla Celumbres，位于卡斯特利翁省 Els Ports 地区的 Cinctorres、Castellfort 和 Portell）生物多样性摄影图鉴：植物、昆虫、鸟类、哺乳动物、真菌与地衣。文字：Francisca Julián Querol；摄影：Tadeo Julián Querol。',
  } as T,
  locale: { es: 'es-ES', ca: 'ca-ES', en: 'en-GB', zh: 'zh-CN' } as T,
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
    slug: { es: 'la-rambla', ca: 'la-rambla', en: 'the-rambla', zh: 'ganhe' },
    nombre: { es: 'La rambla', ca: 'La rambla', en: 'The rambla', zh: '干河' },
    lema: {
      es: 'El paraje, la piedra seca y las cuatro estaciones',
      ca: 'El paratge, la pedra seca i les quatre estacions',
      en: 'The place, the dry-stone walls and the four seasons',
      zh: '自然保护区、干垒石墙与四季',
    },
    cover: '2014/03/10.jpg',
    grupos: {
      paraje: { es: 'El lugar', ca: 'El lloc', en: 'The place', zh: '这片土地' },
      estaciones: { es: 'Las estaciones', ca: 'Les estacions', en: 'The seasons', zh: '四季' },
    },
  },
  flora: {
    slug: { es: 'flora', ca: 'flora', en: 'flora', zh: 'zhiwu' },
    nombre: { es: 'Flora', ca: 'Flora', en: 'Flora', zh: '植物' },
    lema: {
      es: 'Árboles, orquídeas y un catálogo de flores silvestres',
      ca: 'Arbres, orquídies i un catàleg de flors silvestres',
      en: 'Trees, orchids and a catalogue of wildflowers',
      zh: '树木、兰花，以及一份野花图录',
    },
    cover: '2014/10/61-1.jpg',
    grupos: {
      arboles: { es: 'Árboles', ca: 'Arbres', en: 'Trees', zh: '树木' },
      flores: { es: 'Flores', ca: 'Flors', en: 'Flowers', zh: '花卉' },
    },
  },
  fauna: {
    slug: { es: 'fauna', ca: 'fauna', en: 'fauna', zh: 'dongwu' },
    nombre: { es: 'Fauna', ca: 'Fauna', en: 'Fauna', zh: '动物' },
    lema: {
      es: 'Buitres, cabras montesas, mariposas, arañas y otros vecinos',
      ca: 'Voltors, cabres salvatges, papallones, aranyes i altres veïns',
      en: 'Vultures, ibex, butterflies, spiders and other neighbours',
      zh: '兀鹫、羱羊、蝴蝶、蜘蛛和其他邻居',
    },
    cover: '2014/08/10.jpg',
    grupos: {
      vertebrados: { es: 'Aves y mamíferos', ca: 'Aus i mamífers', en: 'Birds and mammals', zh: '鸟类与哺乳动物' },
      insectos: { es: 'Insectos', ca: 'Insectes', en: 'Insects', zh: '昆虫' },
      'otros-invertebrados': { es: 'Arañas y miriápodos', ca: 'Aranyes i miriàpodes', en: 'Spiders and myriapods', zh: '蜘蛛与多足类' },
    },
  },
  'hongos-y-liquenes': {
    slug: { es: 'hongos-y-liquenes', ca: 'fongs-i-liquens', en: 'fungi-and-lichens', zh: 'zhenjun-he-diyi' },
    nombre: { es: 'Hongos y líquenes', ca: 'Fongs i líquens', en: 'Fungi and lichens', zh: '真菌与地衣' },
    lema: {
      es: 'Setas del bosque y líquenes de las rocas',
      ca: 'Bolets del bosc i líquens de les roques',
      en: 'Mushrooms of the woods and lichens of the rocks',
      zh: '林间的蘑菇与岩石上的地衣',
    },
    cover: '2014/09/0-1.jpg',
    grupos: {},
  },
};

export const SECCION_KEYS = Object.keys(SECCIONES) as SeccionKey[];

// ------------------------------------------------------------------- paginas

export type PaginaKey = 'autores' | 'proyecto';

export const PAGINAS: Record<PaginaKey, { slug: T; nombre: T }> = {
  autores: { slug: { es: 'los-autores', ca: 'els-autors', en: 'the-authors', zh: 'zuozhe' }, nombre: { es: 'Los autores', ca: 'Els autors', en: 'The authors', zh: '作者' } },
  proyecto: { slug: { es: 'el-proyecto', ca: 'el-projecte', en: 'the-project', zh: 'xiangmu' }, nombre: { es: 'El proyecto', ca: 'El projecte', en: 'The project', zh: '关于本站' } },
};

// ---------------------------------------------------------------------- urls

/** Base del sitio ('' en produccion; '/ramblacelumbres' en la URL provisional de GitHub Pages). */
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** El castellano va en la raiz; los demas idiomas, bajo /ca/, /en/ y /zh/. */
export const prefijo = (lang: Lang) => `${BASE}${lang === LANG_POR_DEFECTO ? '' : `/${lang}`}`;
export const urlRss = (lang: Lang) => `${prefijo(lang)}/rss.xml`;
export const urlPublico = (fichero: string) => `${BASE}/${fichero}`;
export const urlInicio = (lang: Lang) => `${prefijo(lang)}/`;
export const urlSeccion = (lang: Lang, key: SeccionKey) => `${prefijo(lang)}/${SECCIONES[key].slug[lang]}/`;
export const urlArticulo = (lang: Lang, seccion: SeccionKey, slug: string) =>
  `${prefijo(lang)}/${SECCIONES[seccion].slug[lang]}/${slug}/`;
export const urlPagina = (lang: Lang, key: PaginaKey) => `${prefijo(lang)}/${PAGINAS[key].slug[lang]}/`;
export const urlCatalogo = (lang: Lang) =>
  urlArticulo(lang, 'flora', { es: 'flores-silvestres', ca: 'flors-silvestres', en: 'wildflowers', zh: 'yehua' }[lang]);

/** Misma pagina en cada idioma, para el selector y los hreflang. */
export type Alternativas = Record<Lang, string>;
export const otrosIdiomas = (lang: Lang): Lang[] => LANGS.filter((l) => l !== lang);

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
