import { defineHastPlugin } from 'satteri';

/**
 * El contenido migrado de WordPress escribe los pies de foto como titulo de la
 * imagen en markdown:  ![alt](ruta "pie de foto")
 *
 * Este plugin convierte los parrafos que solo contienen imagenes en <figure>
 * con su <figcaption>. Un <p> no puede contener un <figure> en HTML valido, de
 * ahi que se sustituya el parrafo entero en vez de envolver la imagen.
 *
 * Se ejecuta antes que el marcador de imagenes de Astro, asi que las imagenes
 * resultantes las sigue optimizando astro:assets con normalidad.
 */
export default defineHastPlugin({
  name: 'figuras-wp',
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
            // Los JPEG originales rondan los 300 KB y estan muy comprimidos:
            // sin bajar la calidad, el webp equivalente sale mas pesado que el
            // original. Tres anchos cubren de sobra la columna del articulo.
            widths: [480, 900, 1400],
            sizes: '(max-width: 56rem) 100vw, 54rem',
            quality: 68,
          },
        };
        const pie = typeof title === 'string' ? title.trim() : '';
        return {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['figura'] },
          children: pie
            ? [
                imagen,
                {
                  type: 'element',
                  tagName: 'figcaption',
                  properties: {},
                  children: [{ type: 'text', value: pie }],
                },
              ]
            : [imagen],
        };
      });

      // varias fotos seguidas dentro del mismo parrafo se maquetan como galeria
      ctx.replaceNode(
        node,
        figuras.length === 1
          ? figuras[0]
          : {
              type: 'element',
              tagName: 'div',
              properties: { className: ['galeria'] },
              children: figuras,
            },
      );
    },
  },
});
