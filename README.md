# Ecosistema de la Rambla Celumbres

Sitio web de [www.ramblacelumbres.org](https://www.ramblacelumbres.org/): 33 entradas y 314
fotografías sobre la flora, la fauna y el paisaje de la **rambla de Celumbres**, en las
montañas dels Ports, publicadas entre 2014 y 2016.

- **Textos:** Francisca Julián Querol
- **Fotografías:** Tadeo Julián Querol
- **Programación y contacto:** Juan Tadeo Padilla Julián

Francisca y Tadeo son hermanos, nacidos en Cinctorres. El sitio es una iniciativa
desinteresada —sin publicidad, sin recogida de datos y sin ánimo de lucro— para divulgar y
conservar el patrimonio natural de Cinctorres y de la comarca dels Ports.

Proyecto hermano: [santjoans.es](https://santjoans.es/) —
[jtpadilla/santjoans](https://github.com/jtpadilla/santjoans)— visor del pavimento cerámico
zoo-mórfico del Palau Santjoans de Cinctorres.

## De WordPress a sitio estático

El blog vivía en un WordPress. En 2026 se migró a un sitio estático generado con
[Astro](https://astro.build/): mismo contenido y mismas fotografías, pero sin base de
datos, sin PHP y sin nada que parchear. `tools/export-wp.py` hizo la extracción y sigue en
el repositorio como documentación de la migración; en `wordpress-export/` está además la
exportación oficial de WordPress con la que se verificó que no faltara nada.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run preview   # sirve dist/
```

Requiere Node LTS.

## Despliegue

Automático en GitHub Pages con cada `push` a `main`
(`.github/workflows/deploy.yml`). El dominio propio se configura en `public/CNAME`.

## Correcciones

Para cualquier corrección o actualización del contenido, abrir una incidencia en este
repositorio o escribir a Juan Tadeo Padilla Julián.

---

Los textos y las fotografías son propiedad de sus autores. El código del sitio se publica
para que el proyecto pueda mantenerse y reproducirse.
# ramblacelumbres
