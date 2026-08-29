import type { ImageMetadata } from 'astro';

// Todas las fotos originales, indexadas por su ruta dentro de uploads/.
const todas = import.meta.glob<ImageMetadata>('/src/assets/uploads/**/*.jpg', {
  eager: true,
  import: 'default',
});

export function foto(ruta: string): ImageMetadata {
  const meta = todas[`/src/assets/uploads/${ruta}`];
  if (!meta) throw new Error(`Foto no encontrada en src/assets/uploads: ${ruta}`);
  return meta;
}

export const TOTAL_FOTOS = Object.keys(todas).length;
