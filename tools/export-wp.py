#!/usr/bin/env python3
"""Extrae el contenido de ramblacelumbres.org (WordPress) via API REST publica
y lo convierte en markdown de referencia y en las fotos originales del sitio:

  tools/_wp-markdown/posts/<slug>.md   (texto original, sin corregir)
  tools/_wp-markdown/pages/<slug>.md
  src/assets/uploads/YYYY/MM/<fichero>.jpg

Es idempotente: no vuelve a descargar imagenes que ya existen.
Uso:  python3 tools/export-wp.py [--skip-media]
"""

import glob
import html
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

SITE = "https://www.ramblacelumbres.org"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUMP = os.path.join(ROOT, "tools", "_wp-dump")
ASSETS = os.path.join(ROOT, "src", "assets")
POSTS_DIR = os.path.join(ROOT, "tools", "_wp-markdown", "posts")
PAGES_DIR = os.path.join(ROOT, "tools", "_wp-markdown", "pages")
UA = "Mozilla/5.0 (migracion ramblacelumbres.org)"
WXR = os.path.join(ROOT, "wordpress-export", "*.xml")
WXR_NS = {"wp": "http://wordpress.org/export/1.2/"}


# --------------------------------------------------------------------------- red

def encode_url(url):
    """urllib solo admite URLs ASCII, pero WordPress sirve rutas con enes y
    acentos sin codificar (.../araña.jpg). Codificamos solo la ruta."""
    parts = urllib.parse.urlsplit(url)
    path = urllib.parse.quote(parts.path, safe="/%")
    return urllib.parse.urlunsplit(parts._replace(path=path))


def get(url, binary=False, tries=3, headers=False):
    url = encode_url(url)
    for n in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                data, hdrs = r.read(), dict(r.headers)
            body = data if binary else data.decode("utf-8")
            return (body, hdrs) if headers else body
        except Exception as e:
            if n == tries - 1:
                raise
            print("  reintento (%s): %s" % (e, url))
            time.sleep(2)


def adjuntos_del_wxr():
    """URLs de los adjuntos segun la exportacion oficial de WordPress.

    La API REST no siempre los devuelve todos (aqui se dejaba fuera un fichero
    que solo usaba un borrador), asi que si hay un fichero de exportacion en
    wordpress-export/ se usa como complemento para que no falte nada.
    """
    salida = {}
    for fichero in sorted(glob.glob(WXR)):
        raiz = ET.parse(fichero).getroot().find("channel")
        for item in raiz.findall("item"):
            if item.findtext("wp:post_type", namespaces=WXR_NS) != "attachment":
                continue
            url = item.findtext("wp:attachment_url", namespaces=WXR_NS)
            if url:
                salida[url] = fichero
    return salida


def rest(route, **params):
    """Descarga una coleccion completa de la API REST.

    Ojo: una pagina puede devolver menos elementos que per_page (WordPress
    descarta los que no puede serializar), asi que el numero de paginas se toma
    de la cabecera X-WP-TotalPages, nunca del tamano de la respuesta.
    """
    out, page, total_pages = [], 1, None
    while True:
        q = dict(params)
        q.update({"rest_route": "/wp/v2/" + route, "per_page": 100, "page": page})
        url = SITE + "/?" + urllib.parse.urlencode(q)
        body, hdrs = get(url, headers=True)
        chunk = json.loads(body)
        if not isinstance(chunk, list):
            break
        out += chunk
        if total_pages is None:
            total_pages = int(hdrs.get("X-WP-TotalPages") or hdrs.get("x-wp-totalpages") or 1)
        if page >= total_pages:
            break
        page += 1
    return out


# ----------------------------------------------------------------- html -> markdown

# WordPress genera variantes redimensionadas: fichero-1024x682.jpg -> fichero.jpg
RESIZED = re.compile(r"-\d+x\d+(?=\.[a-zA-Z]+$)")


def local_path(url):
    """URL de uploads -> ruta relativa 'uploads/2015/07/fichero.jpg' (siempre el original)."""
    path = urllib.parse.urlsplit(url).path
    m = re.search(r"/wp-content/uploads/(.+)$", path)
    if not m:
        return None
    rel = urllib.parse.unquote(m.group(1))
    return "uploads/" + RESIZED.sub("", rel)


def esc(text):
    """Escapado minimo para que la prosa no se interprete como markdown."""
    text = text.replace("\\", "\\\\")
    text = re.sub(r"([*_`\[\]])", r"\\\1", text)
    return re.sub(r"^(\s*)([#>]|\d+\.|[-+])(\s)", r"\1\\\2\3", text)


def clean_alt(alt):
    """WordPress rellena el alt con el nombre del fichero ('10---copia', 'IMG 2345').
    Eso no describe nada, asi que lo descartamos y dejamos el alt vacio."""
    alt = re.sub(r"\s+", " ", (alt or "")).strip().replace('"', "'")
    if not alt or re.fullmatch(r"[\d\W_]+", alt):
        return ""
    if re.fullmatch(r"(?:img|dsc|dscn|mg|p)?[\s_-]*\d[\d\s_-]*", alt, re.I):
        return ""
    return alt


class Converter(HTMLParser):
    """Convierte el HTML del editor clasico de WP a markdown.

    El contenido real solo usa: p, a, img, figure/figcaption, strong, b, em, i,
    br, span, h1 (vacio). Cualquier otra etiqueta se ignora conservando el texto.
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = []       # bloques markdown ya cerrados
        self.buf = []          # texto del bloque en curso
        self.images = []       # rutas locales usadas, en orden
        self.open_marks = []   # marcas de enfasis abiertas: (token, indice en buf)
        self.in_figure = False
        self.fig_img = None    # (ruta, alt) de la figura en curso
        self.in_caption = False
        self.caption = []
        self.href = None       # href del <a> que envuelve una imagen

    # -- utilidades de bloque
    def flush(self):
        """Cierra el bloque en curso.

        Si queda negrita o cursiva abierta (pasa cuando una imagen parte un
        parrafo por la mitad, o cuando WP deja una etiqueta sin cerrar), se
        cierra aqui y se vuelve a abrir en el bloque siguiente; de lo contrario
        quedarian asteriscos sueltos en el markdown.
        """
        text = "".join(self.buf) + "".join(t for t, _ in reversed(self.open_marks))
        text = re.sub(r"[ \t]+", " ", text).strip()
        text = re.sub(r" *\n *", "\n", text)
        if text.strip("* _\n"):
            self.blocks.append(text)
        self.buf = [t for t, _ in self.open_marks]
        self.open_marks = [(t, i) for i, (t, _) in enumerate(self.open_marks)]

    def close_mark(self, token):
        """Cierra una negrita/cursiva. Si no llego a envolver texto (WordPress
        genera cosas como <strong><em> </em>Serbal), se descarta la marca."""
        for n in range(len(self.open_marks) - 1, -1, -1):
            tok, pos = self.open_marks[n]
            if tok != token:
                continue
            del self.open_marks[n]
            if "".join(self.buf[pos + 1:]).strip() == "":
                del self.buf[pos]
            else:
                self.buf.append(token)
            return

    def emit_image(self, src, alt, caption=None):
        rel = local_path(src)
        if not rel:
            return
        self.images.append(rel)
        alt = clean_alt(alt)
        cap = (caption or "").strip().replace('"', "'")
        md = "![%s](../../assets/%s%s)" % (esc(alt), rel, ' "%s"' % cap if cap else "")
        self.flush()
        self.blocks.append(md)

    # -- handlers
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "figure":
            self.flush()
            self.in_figure, self.fig_img, self.caption = True, None, []
        elif tag == "figcaption":
            self.in_caption = True
        elif tag == "a":
            self.href = a.get("href", "")
        elif tag == "img":
            # preferimos el enlace al original a tamano completo si existe
            src = a.get("src", "")
            if self.href and "/wp-content/uploads/" in self.href:
                src = self.href
            if self.in_figure:
                self.fig_img = (src, a.get("alt", ""))
            else:
                self.emit_image(src, a.get("alt", ""))
        elif tag in ("strong", "b"):
            self.open_marks.append(("**", len(self.buf)))
            self.buf.append("**")
        elif tag in ("em", "i"):
            self.open_marks.append(("_", len(self.buf)))
            self.buf.append("_")
        elif tag == "br":
            self.buf.append("\n")
        elif tag in ("p", "div", "h1", "h2", "h3", "ul", "ol", "li", "blockquote"):
            self.flush()

    def handle_endtag(self, tag):
        if tag == "figure":
            if self.fig_img:
                self.emit_image(self.fig_img[0], self.fig_img[1], "".join(self.caption))
            self.in_figure, self.fig_img, self.caption = False, None, []
        elif tag == "figcaption":
            self.in_caption = False
        elif tag == "a":
            self.href = None
        elif tag in ("strong", "b"):
            self.close_mark("**")
        elif tag in ("em", "i"):
            self.close_mark("_")
        elif tag in ("p", "div", "h1", "h2", "h3", "ul", "ol", "li", "blockquote"):
            self.flush()

    def handle_data(self, data):
        if self.in_caption:
            self.caption.append(data)
        else:
            self.buf.append(esc(data))

    def result(self):
        self.flush()
        bloques = [n for n in (normaliza_enfasis(b) for b in self.blocks) if n.strip()]
        return "\n\n".join(bloques).strip() + "\n"


PALABRA = re.compile(r"[^\W_]", re.UNICODE)


def marcas_en(bloque, marca):
    """Posiciones de una marca de enfasis dentro del bloque. Como el conversor
    las emite equilibradas, van por pares: par = abre, impar = cierra."""
    salida, i = [], bloque.find(marca)
    while i != -1:
        if not (marca == "_" and i > 0 and bloque[i - 1] == "\\"):
            salida.append(i)
        i = bloque.find(marca, i + len(marca))
    return salida


def normaliza_enfasis(bloque):
    """Deja las negritas y cursivas en markdown valido.

    Hace falta porque el HTML de WordPress no respeta las reglas de markdown:
      - "** **"          -> enfasis vacio, se elimina
      - "** Tadeo...**"  -> con espacio tras la marca no es negrita: se saca fuera
      - "Escaramujo**, r**osal" -> a mitad de palabra markdown no lo admite,
                                   asi que se emite como <strong> en linea
    """
    for _ in range(20):                     # arreglar la cursiva puede volver a
        previo = bloque                     # descolocar la negrita que la envuelve
        for marca, etiqueta in (("**", "strong"), ("_", "em")):
            bloque = _normaliza_marca(bloque, marca, etiqueta)
        if bloque == previo:
            break
    return bloque


def _normaliza_marca(bloque, marca, etiqueta):
    while True:
        pos = marcas_en(bloque, marca)
        cambiado = False
        for n in range(0, len(pos) - 1, 2):
            abre, cierra = pos[n], pos[n + 1]
            dentro = bloque[abre + len(marca):cierra]
            cola = bloque[cierra + len(marca):]
            nucleo = dentro.strip()

            if not nucleo:                      # enfasis vacio
                nuevo = dentro
            else:
                delante = dentro[: len(dentro) - len(dentro.lstrip())]
                detras = dentro[len(dentro.rstrip()):]
                if delante or detras:           # espacios pegados a la marca
                    nuevo = delante + marca + nucleo + marca + detras
                else:
                    antes = bloque[abre - 1] if abre > 0 else " "
                    despues = cola[:1] or " "
                    if PALABRA.match(antes) or PALABRA.match(despues):
                        nuevo = "<%s>%s</%s>" % (etiqueta, dentro, etiqueta)
                    else:
                        continue                # este par ya esta bien
            bloque = bloque[:abre] + nuevo + cola
            cambiado = True
            break
        if not cambiado:
            return bloque


def to_markdown(rendered_html):
    c = Converter()
    c.feed(rendered_html)
    c.close()
    return c.result(), c.images


# ------------------------------------------------------------------------ escritura

def yaml_str(s):
    return '"%s"' % s.replace("\\", "\\\\").replace('"', '\\"')


def clean_title(t):
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


# Slugs heredados de WordPress que no describen el contenido. La clave es el ID
# del documento; los enlaces antiguos siguen funcionando gracias a redirects.json.
SLUG_OVERRIDES = {
    32: "aracnidos",          # slug original: "32"
    23: "quien-somos",        # slug original: "tercera"
    148: "lepidopteros-mariposas-papallones-palometes",  # original: "lipidopteros-..."
    361: "himenopteros",      # original: "himenopteros-2"
}


def write_doc(directory, doc, cats_by_id, tags_by_id, images):
    slug = SLUG_OVERRIDES.get(doc["id"]) or urllib.parse.unquote(doc["slug"]) or ("post-%d" % doc["id"])
    fm = [
        "---",
        "title: %s" % yaml_str(clean_title(doc["title"]["rendered"])),
        "date: %s" % doc["date"],
        "wpId: %d" % doc["id"],
    ]
    cats = [cats_by_id[c] for c in doc.get("categories", []) if c in cats_by_id]
    cats = [c for c in cats if c != "uncategorized"]
    if cats:
        fm.append("categories: [%s]" % ", ".join(yaml_str(c) for c in cats))
    tg = [tags_by_id[t] for t in doc.get("tags", []) if t in tags_by_id]
    if tg:
        fm.append("tags: [%s]" % ", ".join(yaml_str(t) for t in tg))
    if images:
        fm.append("cover: %s" % yaml_str("../../assets/" + images[0]))
    fm.append("---")

    body, _ = to_markdown(doc["content"]["rendered"])
    path = os.path.join(directory, slug + ".md")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(fm) + "\n\n" + body)
    return slug


# ----------------------------------------------------------------------------- main

def main():
    skip_media = "--skip-media" in sys.argv
    for d in (DUMP, ASSETS, POSTS_DIR, PAGES_DIR):
        os.makedirs(d, exist_ok=True)

    print("1/4  Descargando contenido de la API REST...")
    posts = rest("posts", _fields="id,date,modified,slug,title,content,categories,tags")
    pages = rest("pages", _fields="id,date,modified,slug,title,content,categories,tags")
    cats = rest("categories", _fields="id,slug,name,count")
    tags = rest("tags", _fields="id,slug,name,count")
    media = rest("media", _fields="id,source_url,mime_type,alt_text,date")
    for name, obj in [("posts", posts), ("pages", pages), ("categories", cats),
                      ("tags", tags), ("media", media)]:
        with open(os.path.join(DUMP, name + ".json"), "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=1)
    print("     %d entradas, %d paginas, %d categorias, %d etiquetas, %d ficheros"
          % (len(posts), len(pages), len(cats), len(tags), len(media)))

    cats_by_id = {c["id"]: c["slug"] for c in cats}
    tags_by_id = {t["id"]: t["slug"] for t in tags}

    print("2/4  Convirtiendo a markdown...")
    used = set()
    for p in posts:
        body, imgs = to_markdown(p["content"]["rendered"])
        used.update(imgs)
        write_doc(POSTS_DIR, p, cats_by_id, tags_by_id, imgs)
    for p in pages:
        body, imgs = to_markdown(p["content"]["rendered"])
        used.update(imgs)
        write_doc(PAGES_DIR, p, cats_by_id, tags_by_id, imgs)
    print("     %d documentos, %d imagenes referenciadas" % (len(posts) + len(pages), len(used)))

    if skip_media:
        print("3/4  (--skip-media) descarga de imagenes omitida")
    else:
        print("3/4  Descargando imagenes originales...")
        # todo lo de la biblioteca de medios, no solo lo referenciado en el texto
        wanted = dict()
        for m in media:
            rel = local_path(m["source_url"])
            if rel:
                wanted[rel] = m["source_url"]
        for rel in used:
            wanted.setdefault(rel, SITE + "/wp-content/" + rel)
        extra = 0
        for url in adjuntos_del_wxr():
            rel = local_path(url)
            if rel and rel not in wanted:
                wanted[rel] = url
                extra += 1
        if extra:
            print("     +%d adjuntos que solo aparecen en la exportacion XML" % extra)
        ok = new = 0
        for i, (rel, url) in enumerate(sorted(wanted.items()), 1):
            dest = os.path.join(ASSETS, rel)
            if os.path.exists(dest) and os.path.getsize(dest) > 0:
                ok += 1
                continue
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            try:
                data = get(url, binary=True)
            except Exception as e:
                print("     FALLO %s (%s)" % (url, e))
                continue
            with open(dest, "wb") as f:
                f.write(data)
            new += 1
            if new % 25 == 0:
                print("     %d/%d..." % (i, len(wanted)))
        print("     %d nuevas, %d ya estaban (total %d)" % (new, ok, len(wanted)))

    print("4/4  Comprobando que cada imagen referenciada existe en disco...")
    missing = [r for r in sorted(used) if not os.path.exists(os.path.join(ASSETS, r))]
    if missing:
        print("     FALTAN %d:" % len(missing))
        for m in missing[:20]:
            print("       " + m)
    else:
        print("     OK: las %d imagenes del contenido estan descargadas" % len(used))


if __name__ == "__main__":
    main()
