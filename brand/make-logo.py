"""Build web-ready SVG logos from the approved Illustrator artwork.

Colours are never touched. The approved files are:
  VADIMEX_logo_color_02  -> for light backgrounds
  VADIMEX_logo_WHITE     -> for dark backgrounds

Both are stacked lockups (mark above wordmark) on a 1000x1000 canvas. A website
header needs a horizontal lockup, so the two elements are separated at the
natural gap between them and recomposed side by side. Only their positions
change; every fill is copied through exactly as drawn.

The WHITE file also carries a full-page black backdrop so the artwork is visible
in Illustrator's preview. That rectangle is dropped.
"""
import os
import re

import pymupdf

SRC_DIR = r"C:\Users\nikol\Pictures\VADIMPEX_font_fix\vector_files"
OUT = r"C:\Users\nikol\Projects\vadimpex-website\brand"

MARK_RATIO = 1.45   # mark height relative to wordmark height
GAP_RATIO = 0.22    # gap relative to mark width

os.makedirs(OUT, exist_ok=True)


def union(rs):
    return pymupdf.Rect(
        min(r.x0 for r in rs), min(r.y0 for r in rs),
        max(r.x1 for r in rs), max(r.y1 for r in rs),
    )


def build(src_name, out_name):
    doc = pymupdf.open(os.path.join(SRC_DIR, src_name + ".ai"))
    page = doc[0]
    svg = page.get_svg_image(text_as_path=True)
    page_area = page.rect.get_area()

    draws = page.get_drawings()
    paths = re.findall(r"<path\b[^>]*/>", svg)
    clip = len(paths) - len(draws)
    assert clip >= 0, "more drawings than paths in " + src_name
    art = list(zip(paths[clip:], draws))
    assert len(art) == len(draws), "path/drawing mismatch in " + src_name

    # drop any full-bleed backdrop rectangle (present in the WHITE artwork)
    kept = [(p, d) for (p, d) in art if d["rect"].get_area() < page_area * 0.9]
    dropped = len(art) - len(kept)

    rects = [d["rect"] for _, d in kept]

    # the split between mark and wordmark is the largest vertical gap
    ordered = sorted(rects, key=lambda r: r.y0)
    best, split = -1, None
    for i in range(len(ordered) - 1):
        top = max(r.y1 for r in ordered[:i + 1])
        gap = ordered[i + 1].y0 - top
        if gap > best:
            best, split = gap, top + gap / 2

    mark = [(p, d) for (p, d) in kept if d["rect"].y1 < split]
    word = [(p, d) for (p, d) in kept if d["rect"].y1 >= split]
    mb = union([d["rect"] for _, d in mark])
    wb = union([d["rect"] for _, d in word])

    mark_h = wb.height * MARK_RATIO
    scale = mark_h / mb.height
    mark_w = mb.width * scale
    gap_px = mark_w * GAP_RATIO
    total_w = mark_w + gap_px + wb.width

    out = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.2f %.2f" '
        'role="img" aria-label="VADIMPEX">\n'
        '<g transform="scale(%.6f) translate(%.3f,%.3f)">%s</g>\n'
        '<g transform="translate(%.3f,%.3f)">%s</g>\n</svg>\n'
        % (total_w, mark_h, scale, -mb.x0, -mb.y0, "".join(p for p, _ in mark),
           mark_w + gap_px - wb.x0, (mark_h - wb.height) / 2 - wb.y0,
           "".join(p for p, _ in word))
    )
    open(os.path.join(OUT, out_name), "w", encoding="utf-8").write(out)

    fills = sorted({
        "#%02x%02x%02x" % tuple(int(round(c * 255)) for c in d["fill"])
        for _, d in kept if d.get("fill")
    })
    print("%-28s -> %-28s %d+%d paths, %d dropped, aspect %.2f, fills %s"
          % (src_name, out_name, len(mark), len(word), dropped, total_w / mark_h, fills))
    return out


build("VADIMEX_logo_color_02", "logo-horizontal-light.svg")
build("VADIMEX_logo_WHITE", "logo-horizontal-dark.svg")
