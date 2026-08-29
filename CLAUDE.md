# CLAUDE.md — Proyecto ramblacelumbres

Punto de entrada para Claude Code en cualquier sesión y en cualquier máquina.
Leer este fichero completo antes de tocar nada.

---

## Qué es este proyecto

Sitio web de **Ecosistema de la Rambla Celumbres** ([www.ramblacelumbres.org](https://www.ramblacelumbres.org/)):
33 entradas y 315 fotografías sobre la flora, la fauna y el paisaje de la rambla de
Celumbres, en las montañas dels Ports, publicadas entre 2014 y 2016.

Originalmente era un **WordPress**. En 2026 se migró a un **sitio estático con Astro**,
sin base de datos ni PHP, para que el contenido se conserve a largo plazo sin
mantenimiento de servidor ni parches de seguridad.

### Quién está detrás

| Persona | Papel |
|---|---|
| **Francisca Julián Querol** («Paquita») | Textos y documentación de las especies |
| **Tadeo Julián Querol** | Fotografías |
| **Juan Tadeo Padilla Julián** | Programación, migración y contacto para correcciones |

Francisca y Tadeo son hermanos, nacidos en Cinctorres. El sitio es una iniciativa
desinteresada, sin publicidad ni ánimo de lucro, para divulgar y conservar el patrimonio
natural de Cinctorres y de la comarca dels Ports.

### Proyecto hermano

[santjoans.es](https://santjoans.es/) ([github.com/jtpadilla/santjoans](https://github.com/jtpadilla/santjoans)),
visor del pavimento cerámico zoo-mórfico del Palau Santjoans de Cinctorres, con los mismos
participantes y la misma intención. Este repositorio sigue su mismo modelo de despliegue:
GitHub Pages con dominio propio.

---

## Regla de oro: el contenido no se reescribe

Los textos y las fotos son obra de sus autores. Al trabajar en el sitio:

- **No corregir** la ortografía, la puntuación ni la redacción de las entradas. Los textos
  se han migrado tal cual estaban en WordPress, con sus rarezas (títulos en mayúsculas,
  párrafos enteros en negrita, dobles espacios). Es su voz.
- **No recortar ni retocar** las fotografías originales de `src/assets/uploads/`. Astro
  genera las versiones optimizadas en cada build; los originales son el archivo.
- Cualquier cambio de contenido lo decide Juan Tadeo Padilla Julián, no la máquina.

---

## Entorno de desarrollo

```bash
npm install        # dependencias
npm run dev        # servidor de desarrollo en http://localhost:4321
npm run build      # build de producción a dist/ (~30 s en frío, ~3 s con caché de imágenes)
npm run preview    # sirve dist/ en http://localhost:4321
```

Requiere Node LTS (desarrollado con Node 22). `sharp` compila las imágenes; la primera
build procesa 388 variantes WebP y tarda del orden de medio minuto, las siguientes
reutilizan la caché de `node_modules/.astro`.

---

## Estructura

```
astro.config.mjs          configuración: sitio, sitemap, plugin de figuras, imágenes
src/
  site.ts                 título, lema, descripción y nombres de las categorías
  content.config.ts       colecciones de Astro (posts y pages) y su esquema
  content/
    posts/*.md            33 entradas migradas (frontmatter + markdown)
    pages/quien-somos.md  la única página del WordPress original
  assets/uploads/AAAA/MM/ 315 fotografías originales, tal como estaban en WordPress
  data/redirects.json     URLs antiguas (?p=123, ?cat=4) → direcciones nuevas
  plugins/figuras.mjs     convierte los párrafos de solo imágenes en <figure> con pie
  layouts/Base.astro      html, metadatos, Open Graph, cabecera y pie
  components/             Cabecera, Pie, Tarjeta, Visor (lightbox nativo con <dialog>)
  pages/
    index.astro           portada
    blog/index.astro      archivo por años
    blog/[slug].astro     entrada
    categoria/[categoria].astro
    [pagina].astro        páginas de la colección pages
    el-proyecto.astro     quién, por qué y contacto
    404.astro
    rss.xml.ts
  styles/global.css       paleta y estilos (claro y oscuro según el sistema)
public/
  CNAME                   www.ramblacelumbres.org
  robots.txt, favicon.svg
tools/
  export-wp.py            migración desde WordPress (ver abajo)
  _wp-dump/*.json         volcado íntegro de la API REST del WordPress original
wordpress-export/
  *.xml                   exportación oficial de WordPress (WXR), 2026-08-29
```

---

## La migración desde WordPress

`tools/export-wp.py` reconstruye `src/content/` y `src/assets/` desde cero leyendo la API
REST pública del WordPress original. Es idempotente y no descarga dos veces la misma foto.

```bash
python3 tools/export-wp.py               # contenido + imágenes
python3 tools/export-wp.py --skip-media  # solo contenido (rápido, para iterar)
```

**Solo tiene sentido mientras el WordPress original siga en pie.** Cuando se apague, el
volcado de `tools/_wp-dump/`, la exportación de `wordpress-export/` y lo que hay en `src/`
pasan a ser la única copia: son parte del repositorio precisamente por eso.

La exportación XML (WXR) sirvió para verificar la migración y coincide con ella: las mismas
33 entradas publicadas, los mismos identificadores y los 315 adjuntos. Si el fichero está
presente, el script también lee de él las URLs de los adjuntos, porque la API REST dejaba
fuera alguno (`MG_9614.jpg`, que solo usaba un borrador).

**Los 6 borradores no se publican.** El WordPress tenía seis entradas en estado `draft`
que nunca vieron la luz; cinco son versiones previas de entradas ya publicadas y la sexta
es un «ÁRBOLES» inacabado. No aparecen en el sitio, a propósito, pero quedan guardados en
el XML por si algún día se quieren recuperar. Esa decisión es de Juan Tadeo Padilla Julián,
no de la máquina.

Lo que resuelve el script, por si hay que retocarlo:

- Pagina por la cabecera `X-WP-TotalPages`, no por el tamaño de la respuesta (WordPress
  devuelve páginas incompletas).
- Codifica las rutas con eñes y acentos antes de pedirlas (`araña.jpg`).
- Usa siempre la imagen **original**, no la variante redimensionada que enlaza el HTML.
- Convierte el HTML del editor clásico a markdown equilibrando negritas y cursivas: las
  cierra y reabre cuando una imagen parte un párrafo, descarta el énfasis vacío, saca los
  espacios de dentro de las marcas y, cuando el énfasis cae a mitad de palabra (markdown no
  lo admite), lo emite como `<strong>`/`<em>` en línea.
- Los pies de foto viajan como título de la imagen: `![alt](ruta "pie")`. El plugin
  `src/plugins/figuras.mjs` los convierte en `<figure><figcaption>` en el build.
- `SLUG_OVERRIDES` renombra cuatro slugs heredados ilegibles (`32` → `aracnidos`,
  `tercera` → `quien-somos`, ...). Los enlaces antiguos siguen funcionando por `redirects.json`.

### Enlaces antiguos

El WordPress usaba enlaces con query (`?p=123`, `?page_id=23`, `?cat=4`). Un alojamiento
estático ignora la query, así que la portada y la página 404 llevan un script mínimo que
traduce esas direcciones con `src/data/redirects.json` y redirige. Si se añade contenido
nuevo, ese fichero no hay que tocarlo.

---

## Detalles técnicos que conviene saber

- **Astro 7** usa **Sätteri** como procesador de markdown por defecto, no unified. Los
  plugins van en `markdown.processor: satteri({ hastPlugins: [...] })` con la API de
  `defineHastPlugin`, no en `rehypePlugins`. El plugin de figuras se ejecuta *antes* que el
  marcador de imágenes de Astro, por eso las fotos siguen optimizándose.
- **Peso de las imágenes**: los JPEG originales están muy comprimidos; sin bajar la calidad
  el WebP equivalente sale más pesado que el original. Por eso `figuras.mjs` fija
  `quality: 68` y tres anchos (480/900/1400) para las fotos del artículo, y
  `astro.config.mjs` limita los breakpoints. Con eso `dist/` pesa unos 89 MB en vez de 333.
- **Tema claro y oscuro**: solo con `prefers-color-scheme`, sin selector manual. La paleta
  está en variables CSS al principio de `global.css`.
- **Las etiquetas de WordPress** (`tags` en el frontmatter) se conservan en los datos pero
  no se muestran: venían desordenadas y con erratas (`Ec`, `Biodiiversidad`). Las
  categorías sí se usan como navegación.

---

## Despliegue

GitHub Pages mediante `.github/workflows/deploy.yml`: cada `push` a `main` compila y
publica. El dominio propio sale de `public/CNAME` (`www.ramblacelumbres.org`).

Para que el dominio apunte aquí hay que cambiar el DNS del registrador a GitHub Pages
(registros A a las IP de Pages y `CNAME` de `www` a `jtpadilla.github.io`), y activar
Pages con origen «GitHub Actions» en la configuración del repositorio. Mientras eso no se
haga, el dominio sigue sirviendo el WordPress antiguo.

---

## Comprobaciones antes de dar algo por bueno

```bash
npm run build                                   # debe terminar sin errores
grep -rl '\*\*' --include="*.html" dist | wc -l # 0: no debe quedar markdown sin convertir
grep -o '<p[^>]*><figure' -r dist | wc -l       # 0: <figure> nunca dentro de <p>
python3 tools/export-wp.py --skip-media         # debe decir "OK: las 255 imagenes ... descargadas"
```
