import { defineHastPlugin } from 'satteri';

/**
 * Convierte los parrafos que solo contienen imagenes en <figure> con pie.
 *
 * En el markdown de las guias:
 *   - el pie de foto va como titulo de la imagen:  ![alt](ruta "pie")
 *   - dentro del pie, *asi* marca un nombre cientifico, que se emite en <em>
 *   - varias imagenes seguidas en el mismo parrafo (lineas consecutivas, sin
 *     linea en blanco) forman una galeria: <div class="galeria" data-n="3">
 *
 * Un <p> no puede contener un <figure> en HTML valido, de ahi que se sustituya
 * el parrafo entero. El plugin corre antes que el marcador de imagenes de
 * Astro, asi que las fotos las sigue optimizando astro:assets.
 */

function pieConCursivas(texto) {
  const partes = texto.split(/\*([^*]+)\*/);
  return partes
    .map((parte, i) =>
      i % 2 === 1
        ? { type: 'element', tagName: 'em', properties: {}, children: [{ type: 'text', value: parte }] }
        : { type: 'text', value: parte },
    )
    .filter((n) => n.type === 'element' || n.value !== '');
}

export default defineHastPlugin({
  name: 'figuras',
  element: {
    filter: ['p'],
    visit(node, ctx) {
      const hijos = (node.children ?? []).filter(
        (c) => !(c.type === 'text' && c.value.trim() === ''),
      );
      if (hijos.length === 0) return;
      if (!hijos.every((c) => c.type === 'element' && c.tagName === 'img')) return;

      const figuras = hijos.map((img) => {
        const { title, ...resto } = img.properties ?? {};
        const imagen = {
          ...img,
          properties: {
            ...resto,
            // Los JPEG originales estan muy comprimidos: sin bajar la calidad,
            // el webp sale mas pesado que el original. Tres anchos bastan.
            widths: [480, 900, 1400],
            sizes: '(max-width: 60rem) 100vw, 58rem',
            quality: 68,
          },
        };
        const pie = typeof title === 'string' ? title.trim() : '';
        return {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['figura'] },
          children: pie
            ? [imagen, { type: 'element', tagName: 'figcaption', properties: {}, children: pieConCursivas(pie) }]
            : [imagen],
        };
      });

      ctx.replaceNode(
        node,
        figuras.length === 1
          ? figuras[0]
          : {
              type: 'element',
              tagName: 'div',
              properties: { className: ['galeria'], dataN: String(figuras.length) },
              children: figuras,
            },
      );
    },
  },
});
