#!/usr/bin/env python3
"""
Mapa de la rambla: genera src/assets/mapa/rambla.svg a partir de datos abiertos.

Fuentes
  - OpenStreetMap (ODbL): perimetro del Paratge Natural Municipal, cauce de la
    rambla de Sellumbres/Celumbres, la Roca Roja y la Roca Parda, caminos y
    pistas con nombre, fuentes, pueblos y terminos municipales.
  - Instituto Geografico Nacional (CC BY 4.0), servicios INSPIRE de
    elevaciones: curvas de nivel en SVG vectorial (WMS) y modelo digital del
    terreno de 25 m en rejilla ASCII (WCS), del que se calcula el sombreado.

Todo lo descargado se guarda en tools/_mapa/ y el script trabaja desde ahi;
solo vuelve a pedirlo con --descargar. No hace falta red para compilar el
sitio: el SVG generado esta en el repositorio.

Uso
  python3 tools/mapa.py              # regenera el SVG con la cache
  python3 tools/mapa.py --descargar  # vuelve a bajar OSM e IGN y regenera

Solo depende de la biblioteca estandar y de Pillow (para el sombreado).

El SVG usa las variables CSS del sitio (--papel, --tinta, --verde, --ocre...)
porque se inserta en linea en la pagina; los enlaces a las guias van como
href="#guia:<key>" y la vista los traduce a la URL del idioma.
"""

import base64
import io
import json
import math
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CACHE = RAIZ / 'tools' / '_mapa'
SALIDA = RAIZ / 'src' / 'assets' / 'mapa' / 'rambla.svg'

# ------------------------------------------------------------ marco del mapa
# UTM huso 30 N (EPSG:25830), 1 px = 10 m. 9 km de ancho por 12 km de alto:
# de Portell y la cabecera de la rambla, al suroeste, a Cinctorres, al norte.
X0, Y0 = 730_800, 4_485_600
ANCHO_M, ALTO_M = 9_000, 12_000
ESCALA = 10  # metros por pixel
W, H = ANCHO_M // ESCALA, ALTO_M // ESCALA
X1, Y1 = X0 + ANCHO_M, Y0 + ALTO_M
# la misma caja en geograficas, con margen, para la consulta a OSM
LATLON = (40.49, -0.31, 40.62, -0.15)

OVERPASS = 'https://overpass-api.de/api/interpreter'
WMS_MDT = 'https://servicios.idee.es/wms-inspire/mdt'
WCS_MDT = 'https://servicios.idee.es/wcs-inspire/mdt'
MDT_CELDA = 25  # metros; el MDT05 existe, pero para un sombreado difuso sobra con 25 m

# puntos de interes que se rotulan, con la guia a la que enlazan
PUNTOS = {
    'Roca Roja': {'guia': 'el-paraje'},
    'Roca Parda': {'guia': 'rapaces'},
    "l'Arribassada": {'guia': 'orquideas'},
    'Font del Bassi': {'guia': 'polillas', 'rotulo': 'Font dels Bassis'},
}
PUEBLOS = ['Cinctorres', 'Castellfort', 'Portell de Morella']
CAMINOS_ROTULADOS = ['Camí de la Roca Parda', 'Miradors riu Celumbres']
# el nombre del cauce va recto, no siguiendo la linea (el trazado de OSM serpentea demasiado):
# punto UTM del centro del rotulo y rumbo del tramo, en grados, medido desde el este
ROTULO_CAUCE = (735_650, 4_492_900)
ROTULO_CAUCE_RUMBO = 26


# ------------------------------------------------------------------ utilidades
def utm30(lat, lon):
    """WGS84 -> UTM 30N, formulas de Snyder; error < 1 m en la zona."""
    a, f, k0, lon0 = 6378137.0, 1 / 298.257223563, 0.9996, -3.0
    e2 = f * (2 - f)
    ep2 = e2 / (1 - e2)
    phi, lam = math.radians(lat), math.radians(lon - lon0)
    n = a / math.sqrt(1 - e2 * math.sin(phi) ** 2)
    t, c, aa = math.tan(phi) ** 2, ep2 * math.cos(phi) ** 2, math.cos(phi) * lam
    m = a * ((1 - e2 / 4 - 3 * e2 ** 2 / 64 - 5 * e2 ** 3 / 256) * phi
             - (3 * e2 / 8 + 3 * e2 ** 2 / 32 + 45 * e2 ** 3 / 1024) * math.sin(2 * phi)
             + (15 * e2 ** 2 / 256 + 45 * e2 ** 3 / 1024) * math.sin(4 * phi)
             - (35 * e2 ** 3 / 3072) * math.sin(6 * phi))
    x = k0 * n * (aa + (1 - t + c) * aa ** 3 / 6 + (5 - 18 * t + t ** 2 + 72 * c - 58 * ep2) * aa ** 5 / 120) + 500000
    y = k0 * (m + n * math.tan(phi) * (aa ** 2 / 2 + (5 - t + 9 * c + 4 * c ** 2) * aa ** 4 / 24
                                       + (61 - 58 * t + t ** 2 + 600 * c - 330 * ep2) * aa ** 6 / 720))
    return x, y


def px(lat, lon):
    x, y = utm30(lat, lon)
    return (x - X0) / ESCALA, (Y1 - y) / ESCALA


def fmt(v):
    return f'{v:.1f}'.rstrip('0').rstrip('.')


def polilinea(puntos):
    return 'M' + ' L'.join(f'{fmt(x)} {fmt(y)}' for x, y in puntos)


def simplificar(pts, tol):
    """Douglas-Peucker, en pixeles."""
    if len(pts) < 3:
        return pts
    (x0, y0), (x1, y1) = pts[0], pts[-1]
    dx, dy = x1 - x0, y1 - y0
    l2 = dx * dx + dy * dy
    imax, dmax = 0, -1.0
    for i in range(1, len(pts) - 1):
        x, y = pts[i]
        if l2 == 0:
            d = math.hypot(x - x0, y - y0)
        else:
            t = max(0.0, min(1.0, ((x - x0) * dx + (y - y0) * dy) / l2))
            d = math.hypot(x - x0 - t * dx, y - y0 - t * dy)
        if d > dmax:
            imax, dmax = i, d
    if dmax <= tol:
        return [pts[0], pts[-1]]
    return simplificar(pts[:imax + 1], tol)[:-1] + simplificar(pts[imax:], tol)


MARGEN = 40


def recortar(pts):
    """Parte una polilinea en los tramos que caen dentro del marco (con margen)."""
    tramos, actual = [], []
    for q in pts:
        dentro = -MARGEN <= q[0] <= W + MARGEN and -MARGEN <= q[1] <= H + MARGEN
        if dentro:
            actual.append(q)
        elif actual:
            actual.append(q)  # un punto fuera para que la linea salga del marco
            tramos.append(actual)
            actual = []
        else:
            actual = [q]  # el ultimo punto exterior antes de entrar
    if len(actual) > 1:
        tramos.append(actual)
    return [t for t in tramos if any(-MARGEN <= q[0] <= W + MARGEN and -MARGEN <= q[1] <= H + MARGEN for q in t)]


def trazo(geom, tol=1.2):
    """Geometria lat/lon -> d de SVG, recortada y simplificada."""
    return ' '.join(polilinea(simplificar(t, tol)) for t in recortar([px(*q) for q in geom]))


def descargar(url, destino, datos=None):
    print('descargando', destino.name, '...', file=sys.stderr)
    req = urllib.request.Request(url, data=datos, headers={'User-Agent': 'ramblacelumbres.org (mapa.py)'})
    with urllib.request.urlopen(req, timeout=180) as r:
        destino.write_bytes(r.read())


# ------------------------------------------------------------------- descarga
def descargar_todo():
    CACHE.mkdir(exist_ok=True)
    s, w, n, e = LATLON
    bb = f'({s},{w},{n},{e})'
    consulta = f"""[out:json][timeout:120];
(
  relation["boundary"="protected_area"]["name"~"Celumbres",i]{bb};
  relation["boundary"="administrative"]["admin_level"="8"]["name"~"^(Cinctorres|Castellfort|Portell de Morella)$"];
  way["waterway"]["name"~"Sellumbres|Celumbres",i]{bb};
  way["natural"="cliff"]["name"]{bb};
  way["highway"~"^(path|track)$"]["name"]{bb};
  way["highway"~"^(primary|secondary|tertiary|unclassified)$"]{bb};
  node["natural"="spring"]["name"]{bb};
  node["place"~"^(village|town)$"]{bb};
  node["name"~"Arribassada|Bassis",i]{bb};
);
out body geom;"""
    descargar(OVERPASS, CACHE / 'osm.json', urllib.parse.urlencode({'data': consulta}).encode())
    base = {'SERVICE': 'WMS', 'VERSION': '1.3.0', 'REQUEST': 'GetMap', 'STYLES': '', 'CRS': 'EPSG:25830',
            'BBOX': f'{X0},{Y0},{X1},{Y1}', 'WIDTH': W, 'HEIGHT': H}
    descargar(WMS_MDT + '?' + urllib.parse.urlencode({**base, 'LAYERS': 'EL.ContourLine', 'FORMAT': 'image/svg+xml'}),
              CACHE / 'curvas.svg')
    descargar(WCS_MDT + '?' + urllib.parse.urlencode({
        'SERVICE': 'WCS', 'VERSION': '2.0.1', 'REQUEST': 'GetCoverage', 'COVERAGEID': f'Elevacion25830_{MDT_CELDA}',
        'FORMAT': 'application/asc'}) + f'&SUBSET=x({X0},{X1})&SUBSET=y({Y0},{Y1})', CACHE / 'mdt.asc')


# ------------------------------------------------------------------------ OSM
def anillos(relacion, rol):
    """Encadena los ways de un rol (`outer` o `inner`) de una relacion en anillos cerrados."""
    tramos = []
    for m in relacion['members']:
        if m['type'] == 'way' and m.get('role', 'outer') == rol and m.get('geometry'):
            tramos.append([(p['lat'], p['lon']) for p in m['geometry']])
    salida = []
    while tramos:
        anillo = tramos.pop(0)
        cambiado = True
        while cambiado and anillo[0] != anillo[-1]:
            cambiado = False
            for i, t in enumerate(tramos):
                if t[0] == anillo[-1]:
                    anillo += t[1:]
                elif t[-1] == anillo[-1]:
                    anillo += t[-2::-1]
                elif t[-1] == anillo[0]:
                    anillo = t[:-1] + anillo
                elif t[0] == anillo[0]:
                    anillo = t[::-1][:-1] + anillo
                else:
                    continue
                tramos.pop(i)
                cambiado = True
                break
        salida.append(anillo)
    return salida


def cargar_osm():
    datos = json.loads((CACHE / 'osm.json').read_text(encoding='utf-8'))
    el = datos['elements']
    capas = {'paraje': [], 'terminos': [], 'cauce': [], 'rocas': [], 'caminos': [], 'carreteras': [],
             'fuentes': [], 'pueblos': [], 'parajes': []}
    for e in el:
        t = e.get('tags', {})
        if e['type'] == 'relation':
            if t.get('boundary') == 'protected_area':
                capas['paraje'] = anillos(e, 'outer') + anillos(e, 'inner')
            elif t.get('boundary') == 'administrative':
                for m in e['members']:
                    if m['type'] == 'way' and m.get('geometry'):
                        capas['terminos'].append([(p['lat'], p['lon']) for p in m['geometry']])
        elif e['type'] == 'way':
            g = [(p['lat'], p['lon']) for p in e.get('geometry', [])]
            if not g:
                continue
            if t.get('waterway'):
                capas['cauce'].append(g)
            elif t.get('natural') == 'cliff':
                capas['rocas'].append((t['name'], g))
            elif t.get('highway') in ('path', 'track'):
                capas['caminos'].append((t.get('name', ''), g))
            elif t.get('highway'):
                capas['carreteras'].append(g)
        elif e['type'] == 'node':
            p = (t.get('name', ''), e['lat'], e['lon'])
            if t.get('natural') == 'spring':
                capas['fuentes'].append(p)
            elif t.get('place') in ('village', 'town'):
                capas['pueblos'].append(p)
            else:
                capas['parajes'].append(p)
    return capas


# ------------------------------------------------------------------- relieve
def curvas_de_nivel():
    """Curvas del WMS del IGN: mismo marco y mismo tamano, asi que las
    coordenadas ya estan en pixeles del mapa. Devuelve [(d, maestra)]."""
    ns = {'svg': 'http://www.w3.org/2000/svg'}
    raiz = ET.parse(CACHE / 'curvas.svg').getroot()
    salida = []

    def recorre(nodo, ancho, color):
        ancho = nodo.get('stroke-width', ancho)
        color = nodo.get('stroke', color)
        if nodo.tag == '{http://www.w3.org/2000/svg}path' and nodo.get('d') and color not in ('none', 'white', 'black'):
            nums = [float(v) for v in re.findall(r'-?\d+(?:\.\d+)?', nodo.get('d'))]
            pts = list(zip(nums[0::2], nums[1::2]))
            if len(pts) > 1:
                pts = simplificar(pts, 0.9)
                if len(pts) > 3:
                    salida.append((polilinea(pts), float(ancho) >= 1))
        for h in nodo:
            if h.tag.endswith('clipPath') or h.tag.endswith('defs'):
                continue
            recorre(h, ancho, color)

    recorre(raiz, '1', 'black')
    return salida


def leer_mdt():
    """Rejilla ASCII del WCS (viene en un envoltorio multipart): filas de norte a sur."""
    texto = (CACHE / 'mdt.asc').read_text(encoding='ascii', errors='ignore')
    texto = texto[texto.find('ncols'):]
    if '\n--' in texto:  # cierre del multipart
        texto = texto[:texto.find('\n--')]
    lineas = texto.splitlines()
    cab = {}
    while lineas and lineas[0].split()[0].lower() in ('ncols', 'nrows', 'xllcorner', 'yllcorner', 'cellsize', 'nodata_value'):
        k, v = lineas.pop(0).split()[:2]
        cab[k.lower()] = float(v)
    w, h = int(cab['ncols']), int(cab['nrows'])
    z = [float(v) for l in lineas for v in l.split()]
    assert len(z) >= w * h, 'MDT incompleto'
    return w, h, z[:w * h], cab['cellsize']


def sombreado():
    """Sombreado desde el noroeste a partir del MDT de 25 m del IGN. Devuelve
    un PNG con alfa: sombra de tinta sobre el fondo que haya (papel o noche)."""
    from PIL import Image, ImageFilter

    w, h, z, celda = leer_mdt()
    az, alt = math.radians(315), math.radians(45)
    salida = bytearray(w * h)
    amp = 1.4  # exageracion del relieve
    for y in range(h):
        y0, y1 = max(y - 1, 0), min(y + 1, h - 1)
        for x in range(w):
            x0, x1 = max(x - 1, 0), min(x + 1, w - 1)
            dx = (z[y * w + x1] - z[y * w + x0]) * amp / (2 * celda)
            dy = (z[y1 * w + x] - z[y0 * w + x]) * amp / (2 * celda)
            pend = math.atan(math.hypot(dx, dy))
            asp = math.atan2(dy, -dx)
            lum = math.sin(alt) * math.cos(pend) + math.cos(alt) * math.sin(pend) * math.cos(az - asp - math.pi / 2)
            salida[y * w + x] = int(max(0.0, min(1.0, 1 - lum)) * 255)
    sombra = Image.frombytes('L', (w, h), bytes(salida)).filter(ImageFilter.GaussianBlur(0.6))
    sombra = sombra.point(lambda v: (v // 12) * 12)  # menos niveles: el PNG comprime mucho mejor
    # alfa = sombra (lo iluminado queda transparente); tinta oscura fija
    rgba = Image.merge('RGBA', (Image.new('L', (w, h), 29), Image.new('L', (w, h), 34), Image.new('L', (w, h), 26), sombra))
    buf = io.BytesIO()
    rgba.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode('ascii')


# --------------------------------------------------------------------- dibujo
def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('"', '&quot;')


def rotulo(x, y, texto, clase, dx=0, dy=0, anchor='start'):
    return (f'<text class="{clase}" x="{fmt(x + dx)}" y="{fmt(y + dy)}" text-anchor="{anchor}">{esc(texto)}</text>')


def dibujar(capas, curvas, sombra_b64):
    p = []
    p.append(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
             f'viewBox="0 0 {W} {H}" width="{W}" height="{H}" class="mapa-rambla" role="img" '
             f'aria-labelledby="mapa-titulo" font-family="Fraunces, Georgia, serif">')
    p.append('<title id="mapa-titulo">Rambla Celumbres · Cinctorres · Castellfort · Portell de Morella</title>')
    p.append('''<style>
.mapa-rambla { --m-papel: var(--papel, #f4efe4); --m-tinta: var(--tinta, #1d221a); --m-tinta-2: var(--tinta-2, #4a5044);
  --m-tinta-3: var(--tinta-3, #7b8074); --m-verde: var(--verde, #3b5733); --m-verde-suave: var(--verde-suave, #e2e9d8);
  --m-ocre: var(--ocre, #b4762a); --m-agua: var(--mapa-agua, #5f8398); --m-linea: var(--linea, #dcd4c0); }
.fondo { fill: var(--m-papel); }
.sombra { opacity: .28; mix-blend-mode: multiply; }
.curva { fill: none; stroke: var(--m-ocre); stroke-width: .5; opacity: .38; stroke-linejoin: round; }
.curva.maestra { stroke-width: 1; opacity: .48; }
.paraje { fill: var(--m-verde); fill-opacity: .10; stroke: var(--m-verde); stroke-width: 1.6; stroke-dasharray: 7 4; stroke-linejoin: round; }
.termino { fill: none; stroke: var(--m-tinta-3); stroke-width: .9; stroke-dasharray: 2 5; stroke-linecap: round; opacity: .7; }
.carretera { fill: none; stroke: var(--m-tinta-3); stroke-width: 1.1; opacity: .55; }
.camino { fill: none; stroke: var(--m-tinta-3); stroke-width: .7; stroke-dasharray: 4 3; opacity: .55; }
.camino.rotulado { stroke: var(--m-tinta-2); opacity: .8; }
.cauce { fill: none; stroke: var(--m-agua); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
.cauce-halo { fill: none; stroke: var(--m-papel); stroke-width: 5; stroke-linecap: round; stroke-linejoin: round; opacity: .8; }
.roca { fill: none; stroke: var(--m-ocre); stroke-width: 3.2; stroke-linecap: round; }
.roca-dientes { fill: none; stroke: var(--m-ocre); stroke-width: 1.4; stroke-dasharray: 1.4 3; opacity: .9; }
.fuente { fill: var(--m-agua); stroke: var(--m-papel); stroke-width: 1.2; }
.pueblo { fill: var(--m-tinta); stroke: var(--m-papel); stroke-width: 1.5; }
.punto { fill: var(--m-ocre); stroke: var(--m-papel); stroke-width: 1.5; }
text { fill: var(--m-tinta); paint-order: stroke fill; stroke: var(--m-papel); stroke-width: 3.5; stroke-linejoin: round; }
.t-pueblo { font-size: 15px; font-weight: 600; letter-spacing: .02em; }
.t-termino { font-size: 10.5px; font-weight: 500; letter-spacing: .18em; text-transform: uppercase; fill: var(--m-tinta-3); }
.t-punto { font-size: 14px; font-style: italic; }
.t-roca { font-size: 16px; font-style: italic; font-weight: 500; fill: var(--m-ocre); }
.t-cauce { font-size: 16px; font-style: italic; fill: var(--m-agua); letter-spacing: .12em; }
.t-camino { font-size: 10px; font-style: italic; fill: var(--m-tinta-2); }
.t-fuente { font-size: 11px; font-style: italic; fill: var(--m-tinta-2); }
.t-escala, .t-norte { font-size: 11px; font-family: 'Source Sans 3', system-ui, sans-serif; letter-spacing: .04em; fill: var(--m-tinta-2); }
.escala { stroke: var(--m-tinta-2); stroke-width: 1.2; fill: none; }
.norte { fill: var(--m-tinta-2); }
a:hover .t-punto, a:hover .t-roca, a:focus .t-punto, a:focus .t-roca { text-decoration: underline; }
</style>''')
    p.append(f'<rect class="fondo" width="{W}" height="{H}"/>')
    p.append(f'<image class="sombra" width="{W}" height="{H}" preserveAspectRatio="none" '
             f'xlink:href="data:image/png;base64,{sombra_b64}"/>')

    p.append('<g class="curvas">')
    for d, maestra in curvas:
        p.append(f'<path class="curva{" maestra" if maestra else ""}" d="{d}"/>')
    p.append('</g>')

    p.append('<g class="terminos">')
    for g in capas['terminos']:
        d = trazo(g)
        if d:
            p.append(f'<path class="termino" d="{d}"/>')
    p.append('</g>')

    p.append('<g class="carreteras">')
    for g in capas['carreteras']:
        d = trazo(g)
        if d:
            p.append(f'<path class="carretera" d="{d}"/>')
    p.append('</g>')
    p.append('<g class="caminos">')
    rotulos_camino = []
    for nombre, g in capas['caminos']:
        d = trazo(g)
        if not d:
            continue
        rot = nombre in CAMINOS_ROTULADOS
        ident = f' id="camino-{re.sub(r"[^a-z]+", "-", nombre.lower())}"' if rot else ''
        p.append(f'<path class="camino{" rotulado" if rot else ""}"{ident} d="{d}"/>')
        if rot:
            rotulos_camino.append((ident[5:-1], nombre))
    p.append('</g>')

    if capas['paraje']:
        d = ' '.join(polilinea(simplificar([px(*q) for q in a], 0.8)) + ' Z' for a in capas['paraje'])
        p.append(f'<path class="paraje" fill-rule="evenodd" d="{d}"/>')

    p.append('<g class="cauces">')
    for g in capas['cauce']:
        d = trazo(g, 0.8)
        if d:
            p.append(f'<path class="cauce-halo" d="{d}"/><path class="cauce" d="{d}"/>')
    p.append('</g>')

    p.append('<g class="rocas">')
    for nombre, g in capas['rocas']:
        d = trazo(g, 0.5)
        p.append(f'<path class="roca" d="{d}"/><path class="roca-dientes" d="{d}" transform="translate(0 3.5)"/>')
    p.append('</g>')

    # rotulos de caminos sobre su propia linea
    for ident, nombre in rotulos_camino:
        p.append(f'<text class="t-camino" dy="-3"><textPath xlink:href="#{ident}" startOffset="50%" text-anchor="middle">{esc(nombre)}</textPath></text>')

    # nombre del cauce, recto e inclinado como el tramo que pasa junto a l'Arribassada
    cx, cy = (ROTULO_CAUCE[0] - X0) / ESCALA, (Y1 - ROTULO_CAUCE[1]) / ESCALA
    p.append(f'<text class="t-cauce" x="{fmt(cx)}" y="{fmt(cy)}" text-anchor="middle" '
             f'transform="rotate({-ROTULO_CAUCE_RUMBO} {fmt(cx)} {fmt(cy)})">Rambla Celumbres</text>')

    # rocas: rotulo junto al centro del acantilado
    for nombre, g in capas['rocas']:
        pts = [px(*q) for q in g]
        cx = sum(q[0] for q in pts) / len(pts)
        cy = sum(q[1] for q in pts) / len(pts)
        guia = PUNTOS.get(nombre, {}).get('guia')
        anchor, dx = ('end', -10) if nombre == 'Roca Roja' else ('start', 10)
        t = rotulo(cx, cy, nombre, 't-roca', dx=dx, dy=-8, anchor=anchor)
        p.append(f'<a href="#guia:{guia}">{t}</a>' if guia else t)

    # fuentes y parajes
    for nombre, lat, lon in capas['fuentes'] + capas['parajes']:
        x, y = px(lat, lon)
        if not (0 <= x <= W and 0 <= y <= H):
            continue
        info = PUNTOS.get(nombre)
        if nombre in [n for n, _, _ in capas['fuentes']]:
            if not info:
                continue  # solo la fuente que aparece en las guias
            p.append(f'<circle class="fuente" cx="{fmt(x)}" cy="{fmt(y)}" r="3.2"/>')
        else:
            p.append(f'<circle class="punto" cx="{fmt(x)}" cy="{fmt(y)}" r="3.6"/>')
        texto = (info or {}).get('rotulo', nombre)
        t = rotulo(x, y, texto, 't-fuente' if info and nombre.startswith('Font') else 't-punto', dx=7, dy=4)
        if info and info.get('guia'):
            t = f'<a href="#guia:{info["guia"]}">{t}</a>'
        p.append(t)

    # pueblos y nombre del termino
    for nombre, lat, lon in capas['pueblos']:
        x, y = px(lat, lon)
        if not (20 <= x <= W - 20 and 20 <= y <= H - 20):
            continue
        p.append(f'<circle class="pueblo" cx="{fmt(x)}" cy="{fmt(y)}" r="4.5"/>')
        anchor, dx = ('end', -9) if x > W * 0.6 else ('start', 9)
        p.append(rotulo(x, y, nombre, 't-pueblo', dx=dx, dy=5, anchor=anchor))

    # escala y norte
    ex, ey = 40, H - 40
    p.append(f'<path class="escala" d="M{ex} {ey - 6} V{ey} H{ex + 100} V{ey - 6} M{ex + 50} {ey} V{ey - 3}"/>')
    p.append(rotulo(ex, ey, '0', 't-escala', dy=-11, anchor='middle'))
    p.append(rotulo(ex + 100, ey, '1 km', 't-escala', dy=-11, anchor='middle'))
    nx, ny = W - 40, H - 62
    p.append(f'<path class="norte" d="M{nx} {ny - 16} L{nx + 6} {ny + 6} L{nx} {ny + 1} L{nx - 6} {ny + 6} Z"/>')
    p.append(rotulo(nx, ny, 'N', 't-norte', dy=24, anchor='middle'))

    p.append('</svg>')
    return '\n'.join(p) + '\n'


def main():
    if '--descargar' in sys.argv or not (CACHE / 'osm.json').exists():
        descargar_todo()
    capas = cargar_osm()
    print('paraje: anillos', len(capas['paraje']), '| cauce', len(capas['cauce']), 'tramos | rocas', len(capas['rocas']),
          '| caminos', len(capas['caminos']), '| carreteras', len(capas['carreteras']), '| pueblos', len(capas['pueblos']),
          '| fuentes', len(capas['fuentes']), '| otros', [n for n, _, _ in capas['parajes']], file=sys.stderr)
    curvas = curvas_de_nivel()
    print('curvas de nivel:', len(curvas), file=sys.stderr)
    sombra = sombreado()
    svg = dibujar(capas, curvas, sombra)
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    SALIDA.write_text(svg, encoding='utf-8')
    print(f'{SALIDA.relative_to(RAIZ)}: {len(svg) / 1024:.0f} KB', file=sys.stderr)


if __name__ == '__main__':
    main()
