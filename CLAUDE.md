# CLAUDE.md — Proyecto ramblacelumbres

Punto de entrada para Claude Code en cualquier sesión y en cualquier máquina.
Leer este fichero completo antes de tocar nada.

---

## Qué es este proyecto

**Ecosistema de la Rambla Celumbres** ([www.ramblacelumbres.org](https://www.ramblacelumbres.org/)):
guía fotográfica de la biodiversidad de la rambla de Celumbres (Cinctorres, Castellfort y
Portell de Morella, comarca dels Ports). 23 guías y 315 fotografías, en castellano,
valenciano, inglés y chino simplificado, hechas a partir de un blog de WordPress publicado
entre 2014 y 2016.

### Quién está detrás

| Persona | Papel |
|---|---|
| **Francisca Julián Querol** («Paquita») | Textos y documentación de las especies |
| **Tadeo Julián Querol** | Fotografías |
| **Juan Tadeo Padilla Julián** | Programación, migración y contacto para correcciones |

Francisca y Tadeo son hermanos, nacidos en Cinctorres, y ya no mantienen el blog. El
sitio es una iniciativa familiar desinteresada, sin publicidad ni ánimo de lucro, para
divulgar y conservar el patrimonio natural de Cinctorres y de la comarca dels Ports, y un
homenaje a su trabajo.

### Proyecto hermano

[santjoans.es](https://santjoans.es/) ([github.com/jtpadilla/santjoans](https://github.com/jtpadilla/santjoans)),
visor del pavimento cerámico zoo-mórfico del Palau Santjoans de Cinctorres, con los mismos
participantes y la misma intención. Este repositorio sigue su mismo modelo de despliegue:
GitHub Pages con dominio propio.

---

## Historia en dos pasos

1. **Migración fiel** (rama `main`, agosto de 2026): el WordPress se volcó tal cual a Astro,
   entrada por entrada, sin tocar una coma. Ese material sigue en el repositorio como
   referencia: `tools/_wp-markdown/` (markdown del texto original), `tools/_wp-dump/`
   (API REST) y `wordpress-export/` (exportación oficial WXR).
2. **Producto nuevo** (esta versión): el contenido se reorganizó por temas, se corrigieron
   los textos, se tradujo todo al valenciano, al inglés y al chino y se diseñó el sitio desde
   cero. Lo pidió
   Juan Tadeo Padilla Julián expresamente: los autores estructuraron el blog sin
   conocimientos informáticos ni documentales, y quería «un producto nuevo y nativo como
   creado desde cero».

---

## Cómo se ha tratado el texto de los autores

- Se corrigen erratas, acentos, puntuación, espacios dobles y nombres científicos
  (`Querqus` → `Quercus`, `Alcon` → `halcón`, `mitología friega` → `griega`, `21 de julio`
  → `21 de junio` para el solsticio...).
- Se retoca la redacción **solo lo justo** para que se lea con comodidad. La voz es la de
  Francisca: primera persona, «mi hermano Tadeo y yo, Paquita», «me gusta llamarlas
  *palometes*, como cuando era niña». Eso no se toca.
- No se añade información nueva ni se «mejora» científicamente el contenido. Si un nombre
  de especie del original no se puede identificar con seguridad, se deja el género
  (`Linaria`, `Tragopogon`), no se inventa.
- Los seis borradores que nunca se publicaron en WordPress siguen sin publicarse.
- Los originales sin corregir están en `tools/_wp-markdown/` por si hay que consultar qué
  decía exactamente el blog.

El inglés es británico. El valenciano es estándar con léxico de la comarca (*xicotet*, *hui*, *rovelló*, *roser
gavarrer*, *pregadéu*, *rabosa*). Los términos que los propios autores usaban en valenciano
dentro del castellano (*marges*, *tolls*, *xotos*, *abella*, *voltor*) se conservan.

El chino es **simplificado** (`lang="zh-Hans"`, código interno `zh`), en registro llano y
fiel, sin florituras: nadie de la familia puede revisarlo, así que se prefiere la traducción
sobria a la brillante. Convenciones: puntuación de ancho completo (，。：“”（）), un espacio
entre ideogramas y texto latino o cifras; los topónimos (Cinctorres, Roca Roja, Els Ports,
l’Arribassada) se dejan en latín, con glosa entre paréntesis la primera vez si aporta algo
(Roca Roja（“红岩”）); «Rambla Celumbres» se traduce como 塞伦布雷斯干河 con el original al
lado la primera vez; Paquita y Tadeo son 帕基塔 y 塔德奥; las especies llevan el nombre chino
solo cuando existe uno establecido (七星瓢虫, 西域兀鹫, 松乳菇...) y siempre el científico
en cursiva; los nombres comunes españoles o valencianos sin equivalente se dejan en cursiva
como préstamo (*palometes*, *rovelló*, *mantis palo*). Paquita es la mayor: «dos hermanos» es 姐弟
(hermana mayor y hermano menor) y «mi hermano», en boca de Paquita, 弟弟.

---

## Entorno de desarrollo

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/ (~30 s en frío; ~2 s con la caché de imágenes)
npm run preview    # sirve dist/
```

Node LTS (desarrollado con Node 22). Las fuentes (Fraunces y Source Sans 3) se descargan de
Fontsource **en el build** y se sirven desde el propio sitio: el sitio publicado no hace
ninguna petición a terceros. Hace falta red al compilar.

---

## Estructura

```
astro.config.mjs            sitio, i18n, fuentes, sitemap, plugin de figuras, imágenes
src/
  site/
    config.ts               idiomas, secciones y grupos, páginas, constructores de URL,
                            tabla de redirecciones del WordPress
    ui.ts                   textos de la interfaz en es, ca, en y zh
    guias.ts                consultas a la colección: orden de lectura, hermanas, URL
    fotos.ts                acceso a las 315 fotos por ruta (import.meta.glob)
    rss.ts                  feed por idioma
  content.config.ts         colección `articulos` y su esquema
  content/articulos/
    es/<key>.md             23 guías en castellano
    ca/<key>.md             las mismas 23 en valenciano; misma `key`, distinta `ruta`
    en/<key>.md             las mismas 23 en inglés
    zh/<key>.md             las mismas 23 en chino simplificado; `ruta` en pinyin
  data/flores.ts            catálogo de 69 flores: nombre científico, familia, comunes es/ca/en/zh
  assets/uploads/AAAA/MM/   fotografías originales, sin retocar
  assets/mapa/rambla.svg    mapa de la rambla, generado por tools/mapa.py (no editar a mano)
  plugins/figuras.mjs       párrafos de imágenes → <figure>/<figcaption>/.galeria
  layouts/Base.astro        html, metadatos, hreflang, fuentes, cabecera y pie
  components/               Cabecera, Pie, Tarjeta, Visor (lightbox), Catalogo (flores), Mapa
  vistas/                   Inicio, Seccion, Articulo, Autores, Proyecto
  pages/
    [...ruta].astro         TODAS las páginas, en los dos idiomas, salen de aquí
    404.astro, rss.xml.ts, ca/rss.xml.ts, en/rss.xml.ts, zh/rss.xml.ts
  styles/global.css         diseño completo (tokens, claro/oscuro, componentes, bloque :lang(zh-Hans))
public/CNAME                www.ramblacelumbres.org
tools/export-wp.py          migración desde el WordPress (histórico; ver abajo)
tools/mapa.py               genera el mapa SVG desde OpenStreetMap y el IGN; caché en tools/_mapa/
wordpress-export/*.xml      exportación oficial del WordPress, 2026-08-29
```

### Rutas

El castellano va en la raíz, el valenciano bajo `/ca/`, el inglés bajo `/en/` y el chino bajo
`/zh/` (slugs en pinyin, para que se puedan dictar y teclear):

```
/                         /ca/                      /en/                      /zh/
/flora/                   /ca/flora/                /en/flora/                /zh/zhiwu/
/flora/los-arboles/       /ca/flora/els-arbres/     /en/flora/the-trees/      /zh/zhiwu/shumu/
/hongos-y-liquenes/       /ca/fongs-i-liquens/      /en/fungi-and-lichens/    /zh/zhenjun-he-diyi/
/los-autores/             /ca/els-autors/           /en/the-authors/          /zh/zuozhe/
/el-proyecto/             /ca/el-projecte/          /en/the-project/          /zh/xiangmu/
```

El código interno del idioma (`Lang`, carpetas, prefijo de URL) es `zh`; el código BCP 47
que va en `<html lang>`, en los `hreflang` y en el sitemap es `zh-Hans`, y sale de
`CODIGO_IDIOMA` en `config.ts`. El `locale` para fechas y `og:locale` es `zh-CN`.

Las URL se construyen **solo** con las funciones de `src/site/config.ts` (`urlSeccion`,
`urlArticulo`, `urlPagina`...). Los slugs por idioma están en el frontmatter (campo `ruta`; no se llama `slug` porque el cargador de Astro usaría ese valor como id y las dos «primavera» chocarían) de cada guía y
en `SECCIONES`/`PAGINAS`. Cada vista construye `alternativas` (misma página en cada idioma,
localizada por `key`) y `Base.astro` emite los `hreflang` y el selector ES · CA · EN · 中文.

Para añadir un idioma: `LANGS`, `CODIGO_IDIOMA` y todos los `T` de `config.ts`, `ui.ts`,
`content.config.ts`, `astro.config.mjs` (i18n y sitemap), `data/flores.ts` (nombres comunes),
los textos de `Autores.astro` (también el slug de `rapaces`) y `Proyecto.astro`, `404.astro`,
`pages/<lang>/rss.xml.ts`, `urlCatalogo` en `config.ts` y las 23 guías.

### Organización del contenido

| Sección | Grupos | Guías |
|---|---|---|
| La rambla | El lugar · Las estaciones | el-paraje, piedra-seca, primavera, verano, otono, invierno |
| Flora | Árboles · Flores | arboles, orquideas, flores-silvestres (con el catálogo) |
| Fauna | Aves y mamíferos · Insectos · Arañas y miriápodos | rapaces, cabra-montes, mariposas, polillas, escarabajos, mantis, chinches, abejas-avispas-hormigas, libelulas, saltamontes-grillos, aranas, miriapodos |
| Hongos y líquenes | — | hongos, liquenes |

Las diez entradas alfabéticas de flores del blog («Flores a-b», «Flores c-d»...) se
convirtieron en `src/data/flores.ts` y se muestran como catálogo con buscador y filtro por
familia al final de la guía `flores-silvestres` (`layout: catalogo` en el frontmatter).

### El mapa

La guía `el-paraje` lleva `layout: mapa`: al final del texto se inserta en línea
`src/assets/mapa/rambla.svg` mediante `components/Mapa.astro`. El SVG lo genera
`tools/mapa.py` (biblioteca estándar + Pillow) a partir de datos abiertos, que quedan en
`tools/_mapa/` para no depender de la red:

- **OpenStreetMap** (ODbL): perímetro del Paratge Natural Municipal (relación 12598417, con
  dos anillos exteriores y dos huecos), cauce de la «Rambla de Sellumbres» (así se llama
  allí), acantilados con nombre (Roca Roja, Roca Parda, Roca del Corb), caminos y pistas con
  nombre, carreteras, fuentes, pueblos y términos municipales.
- **IGN** (CC BY 4.0): curvas de nivel en SVG vectorial del WMS INSPIRE de elevaciones y MDT
  de 25 m en rejilla ASCII del WCS, del que el script calcula el sombreado (PNG con alfa
  incrustado en base64). El WMS no indica la cota de cada curva (y devuelve algunas
  repetidas): el script las desduplica, deduce la cota con la mediana del MDT a lo largo de
  la curva redondeada a la equidistancia (`CURVAS_CADA`, 50 m a esta escala) y marca como
  maestras las de múltiplo de `MAESTRAS_CADA` (100 m). Los caminos de OSM, que suelen venir
  partidos en varios ways, se empalman por nombre (`encadenar`), de modo que un camino con
  nombre es una sola línea y su rótulo sale una vez.

Marco: UTM 30 N, `X0,Y0 = 730800, 4485600`, 9 × 12 km, 1 px = 10 m (viewBox 900 × 1200).
Los colores son variables CSS del sitio con valor de reserva, así que el mapa sigue el tema
claro/oscuro; los rótulos usan Fraunces heredada. Los enlaces van en el SVG como
`href="#guia:<key>"` y `Mapa.astro` los traduce a la URL de la guía en cada idioma. Qué
puntos se rotulan y a qué guía enlazan está en `PUNTOS` y `CAMINOS_ROTULADOS` del script.
Para regenerar: `python3 tools/mapa.py` (`--descargar` para volver a pedir los datos).
Los textos del bloque (`mapaTitulo`, `mapaTexto`, `mapaFuentes`) están en `ui.ts`.

### Convenciones del markdown de las guías

- Pie de foto como título de la imagen: `![alt](ruta "pie")`. Dentro del pie, `*Genus
  species*` se convierte en cursiva.
- Varias imágenes en líneas consecutivas (sin línea en blanco) forman una galería.
- Las rutas de imagen son relativas: `../../../assets/uploads/AAAA/MM/fichero.jpg`.
- Frontmatter: `key`, `lang`, `slug`, `title`, `subtitle?`, `section`, `group?`, `order`,
  `originalDate`, `cover`, `coverAlt`, `summary`, `layout?`. Los textos van entre comillas
  dobles (los resúmenes llevan dos puntos y comillas tipográficas).
- Para añadir una guía: crear `es/<key>.md`, `ca/<key>.md` y `en/<key>.md` con la misma
  `key` y la misma secuencia de fotos, y elegir `section`/`group` de `SECCIONES`.

---

## Detalles técnicos que conviene saber

- **Astro 7** usa **Sätteri** como procesador de markdown, no unified: los plugins van en
  `markdown.processor: satteri({ hastPlugins: [...] })` con `defineHastPlugin`, no en
  `rehypePlugins`. El plugin de figuras corre antes que el marcador de imágenes de Astro,
  por eso las fotos siguen optimizándose.
- **Imágenes**: los JPEG originales están muy comprimidos; sin bajar la calidad, el WebP
  sale más pesado. `figuras.mjs` fija `quality: 68` y tres anchos (480/900/1400) para las
  fotos del artículo; `astro.config.mjs` limita los breakpoints. `dist/` ronda los 150 MB.
- **Fotos de portada con `decoding="sync"`**: con `async` (el valor por defecto de `<Image>`),
  Chrome aplaza la decodificación de una imagen grande en una pestaña en segundo plano y las
  capturas automatizadas salen sin la foto; para la imagen LCP, `sync` es además lo
  recomendable. La foto va en flujo normal dimensionada con `aspect-ratio`, y el velo y el
  texto absolutos encima.
- **Tema claro y oscuro** solo con `prefers-color-scheme`. Tokens al principio de
  `global.css`.
- **Fuentes para el chino**: Fraunces y Source Sans 3 no tienen ideogramas y no se descarga
  ninguna fuente CJK (pesarían varios MB). El bloque `:lang(zh-Hans)` de `global.css` añade
  detrás de ellas las fuentes CJK del sistema (PingFang, Noto Sans CJK SC, Microsoft YaHei...),
  de modo que los nombres latinos siguen saliendo con las fuentes del sitio y los ideogramas
  con las del lector; desactiva la cursiva sintética (el chino no tiene cursiva) y ensancha
  los `max-width` en `ch`, que se miden con el «0» latino.
- **Enlaces del WordPress antiguo** (`?p=`, `?page_id=`, `?cat=`): un host estático ignora
  la query, así que la portada lleva un script mínimo que los traduce con la tabla de
  `config.ts` (`WP_ENTRADAS`, `WP_PAGINAS`, `WP_CATEGORIAS`). La 404 reenvía a la portada
  conservando la query.

---

## Despliegue

GitHub Pages mediante `.github/workflows/deploy.yml`: cada `push` a `main` compila y
publica. Dominio propio en `public/CNAME`.

**Estado provisional:** el workflow compila con `SITE_URL=https://jtpadilla.github.io` y
`BASE_PATH=/ramblacelumbres/` para que la URL provisional
<https://jtpadilla.github.io/ramblacelumbres/> funcione entera. Todas las URL internas
salen de `prefijo()`/`urlPublico()` en `src/site/config.ts`, que anteponen
`import.meta.env.BASE_URL`; nunca escribir rutas absolutas a mano en las vistas. Al activar
el dominio hay que **borrar esas dos variables del workflow**. Falta: mover el DNS del registrador a GitHub
Pages (`www` → `CNAME jtpadilla.github.io`) y declarar el dominio en Pages
(`gh api -X PUT repos/jtpadilla/ramblacelumbres/pages -f cname=www.ramblacelumbres.org`).
Mientras tanto, el dominio sirve el WordPress antiguo.

---

## Comprobaciones antes de dar algo por bueno

```bash
npm run build                                    # 121 páginas, sin errores
grep -o '<p[^>]*><figure' -r dist | wc -l        # 0: <figure> nunca dentro de <p>
python3 - <<'EOF'
import re,glob,os
rotos=[]
for f in glob.glob('dist/**/*.html',recursive=True):
    for h in set(re.findall(r'href="(/[^"#?]*)"',open(f,encoding='utf-8').read())):
        if h.startswith('/_') : continue
        if not (os.path.exists('dist'+h) or os.path.exists('dist'+h+'index.html')): rotos.append((f,h))
print('enlaces rotos:',len(rotos))
EOF
```
Y comprobar a ojo, en `npm run preview`, la portada, una sección, una guía con galerías,
el catálogo de flores y la página de los autores, en los cuatro idiomas y en móvil.

Para las guías en chino, además, que cada `zh/<key>.md` lleva las mismas fotos, en el mismo
orden y con las mismas galerías que `es/<key>.md`:

```bash
python3 - <<'EOF'
import re,glob,os
for f in sorted(glob.glob('src/content/articulos/es/*.md')):
    k=os.path.basename(f); es=open(f,encoding='utf-8').read(); zh=open('src/content/articulos/zh/'+k,encoding='utf-8').read()
    im=lambda s: re.findall(r'\]\((\.\./[^ )]+)',s)
    ga=lambda s: [len(b.strip().split('\n')) for b in re.findall(r'((?:^!\[.*\n?)+)',s,re.M)]
    if im(es)!=im(zh) or ga(es)!=ga(zh): print('DIFF',k)
EOF
```
