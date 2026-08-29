# Ecosistema de la Rambla Celumbres

Guía fotográfica de la biodiversidad de la **rambla de Celumbres**, en la comarca dels Ports
(Cinctorres, Castellfort y Portell de Morella): 23 guías y 315 fotografías sobre el paraje,
las estaciones, la flora, la fauna, los hongos y los líquenes, en castellano y en valenciano.

[www.ramblacelumbres.org](https://www.ramblacelumbres.org/)

- **Textos:** Francisca Julián Querol («Paquita»)
- **Fotografías:** Tadeo Julián Querol
- **Programación y contacto:** Juan Tadeo Padilla Julián

Francisca y Tadeo son hermanos, nacidos en Cinctorres. Entre 2014 y 2016 recorrieron la
rambla con una cámara y un cuaderno y publicaron su trabajo en un blog. Este sitio lo
recoge íntegramente, reorganizado por temas, con los textos corregidos y traducidos, como
homenaje a su trabajo y para que el patrimonio natural de Cinctorres y de la comarca siga a
la vista de quien quiera mirarlo. Sin publicidad, sin cookies, sin ánimo de lucro.

Proyecto hermano: [santjoans.es](https://santjoans.es/) —
[jtpadilla/santjoans](https://github.com/jtpadilla/santjoans)—, visor del pavimento cerámico
zoo-mórfico del Palau Santjoans de Cinctorres, con los mismos participantes.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run preview   # sirve dist/
```

Requiere Node LTS. Está hecho con [Astro](https://astro.build/); el resultado es un sitio
estático sin base de datos ni servidor. `CLAUDE.md` documenta la estructura y las
convenciones.

## Despliegue

Automático en GitHub Pages con cada `push` a `main` (`.github/workflows/deploy.yml`). El
dominio propio se configura en `public/CNAME`.

## Correcciones

Para cualquier corrección o sugerencia, abrir una incidencia en este repositorio o escribir
a Juan Tadeo Padilla Julián.

---

Los textos y las fotografías son propiedad de sus autores. El código del sitio se publica
para que el proyecto pueda mantenerse y reproducirse.
