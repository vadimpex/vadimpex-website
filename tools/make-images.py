"""Copies the logo SVGs into the site and renders the raster images a website
needs: favicons and the link-preview (Open Graph) image that appears when
someone shares vadimpex.com in WhatsApp, LinkedIn or email.

Run:  python tools/make-images.py
"""
import os
import re
import shutil

import pymupdf

ROOT = r"C:\Users\nikol\Projects\vadimpex-website"
BRAND = os.path.join(ROOT, "brand")
IMG = os.path.join(ROOT, "assets", "img")
os.makedirs(IMG, exist_ok=True)

RED = "#e31f28"
INK = "#22282a"
PAPER = "#f7f4f2"

# ---------------------------------------------------------------- logo files
for name in ("logo-horizontal-light.svg", "logo-horizontal-dark.svg", "logo-mark.svg"):
    shutil.copyfile(os.path.join(BRAND, name), os.path.join(IMG, name))
    print("copied", name)

mark = open(os.path.join(BRAND, "logo-mark.svg"), encoding="utf-8").read()
mark_vb = re.search(r'viewBox="([^"]+)"', mark).group(1)
mark_inner = mark[mark.index(">", mark.index("<svg")) + 1: mark.rindex("</svg>")]


def render(svg_text, out_name, width, height):
    doc = pymupdf.open(stream=svg_text.encode("utf-8"), filetype="svg")
    pdf = pymupdf.open("pdf", doc.convert_to_pdf())
    page_rect = pymupdf.Rect(0, 0, width, height)
    out = pymupdf.open()
    page = out.new_page(width=width, height=height)
    page.show_pdf_page(page_rect, pdf, 0)
    page.get_pixmap(alpha=False).save(os.path.join(IMG, out_name))
    print("rendered", out_name, "%dx%d" % (width, height))


# ------------------------------------------------------------------ favicons
# the mark on a paper ground, with a little breathing room
favicon = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
    '<rect width="100" height="100" fill="%s"/>'
    '<svg x="14" y="14" width="72" height="72" viewBox="%s">%s</svg>'
    "</svg>" % (PAPER, mark_vb, mark_inner)
)
open(os.path.join(IMG, "favicon.svg"), "w", encoding="utf-8").write(favicon)
render(favicon, "favicon-32.png", 32, 32)
render(favicon, "apple-touch-icon.png", 180, 180)

# ------------------------------------------------------------ preview image
# 1200x630 is the size every messaging app and social network crops to.
W, H = 1200, 630
cx, cy = 980, 560          # the convergence point, echoing the site's hero
lines = []
for i in range(70):
    t = i / 69
    a = (-176 + 168 * t) * 3.141592653589793 / 180
    accent = i % 9 == 0
    x = cx + 1600 * __import__("math").cos(a)
    y = cy + 1600 * __import__("math").sin(a)
    lines.append(
        '<line x1="%.1f" y1="%.1f" x2="%d" y2="%d" stroke="%s" stroke-width="%s" opacity="%s"/>'
        % (x, y, cx, cy, RED if accent else INK, "1" if accent else ".7",
           ".30" if accent else ".12")
    )

logo = open(os.path.join(BRAND, "logo-horizontal-light.svg"), encoding="utf-8").read()
logo_vb = re.search(r'viewBox="([^"]+)"', logo).group(1)
logo_inner = logo[logo.index(">", logo.index("<svg")) + 1: logo.rindex("</svg>")]
logo_w = 300
logo_h = logo_w * float(logo_vb.split()[3]) / float(logo_vb.split()[2])

og = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d">'
    '<rect width="%d" height="%d" fill="%s"/>'
    "%s"
    '<circle cx="%d" cy="%d" r="9" fill="%s"/>'
    '<svg x="72" y="64" width="%d" height="%.1f" viewBox="%s">%s</svg>'
    '<text x="72" y="330" font-family="Archivo, Helvetica, Arial, sans-serif" '
    'font-size="62" font-weight="800" letter-spacing="-1.6" fill="%s">Mobile devices,</text>'
    '<text x="72" y="400" font-family="Archivo, Helvetica, Arial, sans-serif" '
    'font-size="62" font-weight="800" letter-spacing="-1.6" fill="%s">wholesale, since 1994.</text>'
    '<text x="72" y="470" font-family="Helvetica, Arial, sans-serif" font-size="26" '
    'fill="#5f6769">Baden, Austria</text>'
    '<text x="72" y="556" font-family="monospace" font-size="21" letter-spacing="3" '
    'fill="%s">VADIMPEX.COM</text>'
    "</svg>"
    % (W, H, W, H, PAPER, "".join(lines), cx, cy, RED,
       logo_w, logo_h, logo_vb, logo_inner, INK, INK, RED)
)
open(os.path.join(IMG, "og-image.svg"), "w", encoding="utf-8").write(og)
render(og, "og-image.png", W, H)

print("\ndone")
