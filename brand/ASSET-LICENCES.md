# Asset provenance — vadimpex.com

A record of where every visual element on the website comes from, and under what
licence. Keep this file with the site. If anyone ever claims you are using their
material, this is the document that answers them.

Last reviewed: 17 August 2026.

---

## Photography and stock imagery

**There is none.** The website contains no photographs, no stock images, no
illustrations bought or downloaded from any library, and no clip art.

This matters. The usual "you are using our picture, pay us" approach — whether
from a genuine rights holder or one of the outfits that imitates them — depends
on a photograph or a stock graphic being on the page. There is nothing of that
kind here to make a claim against.

## Logo and wordmark

Supplied by Vadimpex as Illustrator artwork:

- `VADIMEX_logo_color_02.ai` — used on light backgrounds
- `VADIMEX_logo_WHITE.ai` — used on dark backgrounds

The web versions in this folder (`logo-horizontal-light.svg`,
`logo-horizontal-dark.svg`) were produced from those files by
`make-logo.py`. Only the arrangement changed: the mark and the wordmark were
placed side by side instead of stacked, because a stacked lockup makes a website
header roughly three times too tall. **No colour was altered.** Every fill is
copied through exactly as drawn in the source artwork.

> **Worth confirming once:** Vadimpex should hold written confirmation from
> whoever originally designed the logo that the rights were transferred to the
> company. This is normal practice and worth having on file regardless of the
> website.

## The converging-lines graphic

The fan of lines on the home page — and the small fan glyph on the membership
cards and in the team section — is **drawn by code**, not an image file. It is
generated at page load from the geometry in `site.html`. There is no external
file, no downloaded asset and no third-party source.

The motif is derived from the triangle in your own logo, which is itself built
from radiating lines. It was created for Vadimpex and is not adapted from anyone
else's work.

## Icons

The sun, moon and menu icons are hand-written SVG paths in the page source. No
icon library is used.

Note that the previous website loaded **Font Awesome** from a public CDN. That
carried its own licence terms and is not present in the new site.

## Typefaces

Two open-source families, both embedded directly in the page:

| Typeface | Designer | Licence |
|---|---|---|
| Archivo | Omnibus-Type | SIL Open Font License 1.1 |
| IBM Plex Sans | IBM | SIL Open Font License 1.1 |
| IBM Plex Mono | IBM | SIL Open Font License 1.1 |

The SIL Open Font License permits commercial use, modification, redistribution
and embedding in a web page at no cost. The one restriction is that the fonts may
not be sold on their own — which is not something the website does.

The full licence text for each family should be kept alongside the font files in
the repository.

## Text

All copy on the website was written for Vadimpex. The Warranty & Return Policy
originates from Vadimpex's own existing document at
`wts.vadimpex.com/warranty-policy.html`.

---

## If someone contacts you claiming otherwise

1. **Do not agree to anything on a telephone call**, and do not pay.
2. Ask for it in writing: the exact page address, the specific element they say
   is theirs, and proof that they hold the rights to it.
3. Check the claim against this file. If the element is on the list above, you
   know its origin.
4. If a written claim ever looks genuine, send it to your lawyer before replying.

Demanding written detail ends most of these approaches on its own, because the
ones operating a scheme rely on a quick decision made over the phone.
