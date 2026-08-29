# CLAUDE.md — Proyecto ramblacelumbres

Punto de entrada para Claude Code en cualquier sesión y en cualquier máquina.
Leer este fichero completo antes de tocar nada.

---

## Qué es este proyecto

**Ecosistema de la Rambla Celumbres** ([www.ramblacelumbres.org](https://www.ramblacelumbres.org/)):
guía fotográfica de la biodiversidad de la rambla de Celumbres (Cinctorres, Castellfort y
Portell de Morella, comarca dels Ports). 23 guías y 315 fotografías, en castellano,
valenciano e inglés, hechas a partir de un blog de WordPress publicado entre 2014 y 2016.

### Quién está detrás

| Persona | Papel |
|---|---|
| **Francisca Julián Querol** («Paquita») | Textos y documentación de las especies |
| **Tadeo Julián Querol** | Fotografías |
| **Juan Tadeo Padilla Julián** | Programación, migración y contacto para correcciones |

Francisca y Tadeo son hermanos, nacidos en Cinctorres, y ya no pueden mantener el blog. El
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
   los textos, se tradujo todo al valenciano y al inglés y se diseñó el sitio desde cero. Lo pidió
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
    ui.ts                   textos de la interfaz en es y ca
    guias.ts                consultas a la colección: orden de lectura, hermanas, URL
    fotos.ts                acceso a las 315 fotos por ruta (import.meta.glob)
    rss.ts                  feed por idioma
  content.config.ts         colección `articulos` y su esquema
  content/articulos/
    es/<key>.md             23 guías en castellano
    ca/<key>.md             las mismas 23 en valenciano; misma `key`, distinta `ruta`
    en/<key>.md             las mismas 23 en inglés
  data/flores.ts            catálogo de 69 flores: nombre científico, familia, comunes es/ca
  assets/uploads/AAAA/MM/   fotografías originales, sin retocar
  plugins/figuras.mjs       párrafos de imágenes → <figure>/<figcaption>/.galeria
  layouts/Base.astro        html, metadatos, hreflang, fuentes, cabecera y pie
  components/               Cabecera, Pie, Tarjeta, Visor (lightbox), Catalogo (flores)
  vistas/                   Inicio, Seccion, Articulo, Autores, Proyecto
  pages/
    [...ruta].astro         TODAS las páginas, en los dos idiomas, salen de aquí
    404.astro, rss.xml.ts, ca/rss.xml.ts
  styles/global.css         diseño completo (tokens, claro/oscuro, componentes)
public/CNAME                www.ramblacelumbres.org
tools/export-wp.py          migración desde el WordPress (histórico; ver abajo)
wordpress-export/*.xml      exportación oficial del WordPress, 2026-08-29
```

### Rutas

El castellano va en la raíz, el valenciano bajo `/ca/` y el inglés bajo `/en/`:

```
/                         /ca/                      /en/
/flora/                   /ca/flora/                /en/flora/
/flora/los-arboles/       /ca/flora/els-arbres/     /en/flora/the-trees/
/hongos-y-liquenes/       /ca/fongs-i-liquens/      /en/fungi-and-lichens/
/los-autores/             /ca/els-autors/           /en/the-authors/
/el-proyecto/             /ca/el-projecte/          /en/the-project/
```

Las URL se construyen **solo** con las funciones de `src/site/config.ts` (`urlSeccion`,
`urlArticulo`, `urlPagina`...). Los slugs por idioma están en el frontmatter (campo `ruta`; no se llama `slug` porque el cargador de Astro usaría ese valor como id y las dos «primavera» chocarían) de cada guía y
en `SECCIONES`/`PAGINAS`. Cada vista construye `alternativas` (misma página en cada idioma,
localizada por `key`) y `Base.astro` emite los `hreflang` y el selector ES · CA · EN.

Para añadir un idioma: `LANGS` y todos los `T` de `config.ts`, `ui.ts`, `content.config.ts`,
`astro.config.mjs` (i18n y sitemap), `data/flores.ts` (nombres comunes), los textos de
`Autores.astro` y `Proyecto.astro`, `pages/<lang>/rss.xml.ts` y las 23 guías.

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
npm run build                                    # 91 páginas, sin errores
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
el catálogo de flores y la página de los autores, en los tres idiomas y en móvil.
