# vadimpex.com

The Vadimpex company website. Plain HTML, CSS and one small JavaScript file —
no framework, no build step, no server. Edit a file, push, done.

English is the primary language; German sits under `/de/`.

---

## What is where

```
index.html                  English home page
de/index.html               German home page
imprint/index.html          Imprint (EN)          de/impressum/index.html
privacy/index.html          Privacy policy (EN)   de/datenschutz/index.html
404.html                    Not-found page

assets/css/site.css         All styling
assets/css/fonts.css        @font-face rules (generated)
assets/js/site.js           Theme switch, mobile menu, the routes graphic
assets/fonts/               Archivo + IBM Plex, .woff2, with licences
assets/img/                 Logos, favicons, link-preview image

brand/                      Source artwork and provenance record
tools/                      Scripts that regenerate fonts, logos and images
design/                     Design history — not part of the published site

CNAME                       Tells GitHub Pages the domain is vadimpex.com
.nojekyll                   Serve files as-is, no Jekyll processing
robots.txt, sitemap.xml     For search engines
```

## Making changes

**Text, prices, people, links** — edit the HTML directly. Each page is
self-contained and readable.

**Careful:** the header and footer are repeated in all seven pages. There is no
templating, which is the price of having no build step. If you change a
navigation item or a footer link, change it in every page. A search for the old
text across the folder will find them all.

**When the team changes**, edit the `<ul class="roster">` block in
`index.html` *and* `de/index.html`.

**When a trading platform link changes**, edit the `<ul class="creds">` block in
both home pages.

**The year in the footer and "32 years in the trade" update themselves.** Never
type either as a fixed number — the previous website said "27 years" for five
years because someone did.

## Local preview

Any static file server works. From this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` straight from disk will
mostly work but root-relative paths (`/assets/...`) will not resolve, so use the
server.

## Deployment — GitHub Pages

1. Push this folder to the repository (`vadimpex/vadimpex-website`).
2. Repository **Settings → Pages** → Source: **Deploy from a branch**,
   branch `main`, folder `/ (root)`.
3. Custom domain: `vadimpex.com` — the `CNAME` file already declares it.
4. Tick **Enforce HTTPS** once the certificate is issued (a few minutes).

### DNS at GoDaddy

Point the apex domain at GitHub's servers, replacing the current `A` record:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | vadimpex.github.io |

**Do not touch the MX records.** Company email runs on Google Workspace and is
entirely separate from the website. Changing the `A` record does not affect it.

`wts.vadimpex.com` is a separate site on its own CNAME and is unaffected.

### Rollback

The old site is at `94.155.47.111`. If anything goes wrong, set the `A` record
back to that single value and the old site returns. Keep this note until you are
confident.

## What the site deliberately does not do

- **No cookies, no analytics, no tracking.** That is why there is no cookie
  banner and why the privacy policy is short and true. If you ever add a
  statistics tool, the privacy policy must be updated first.
- **No photography or stock imagery.** The graphics are drawn by code from the
  logo's own motif. See `brand/ASSET-LICENCES.md` for the full provenance.
- **No contact form.** The site invites email and phone instead, so there is no
  form handler to maintain and no spam to filter.

## Before going live — outstanding items

- [ ] Confirm the exact Wirtschaftskammer group wording for the Imprint
      (WKÖ and WKNÖ Sparte Handel are confirmed; the Fachgruppe is not).
- [ ] Pull a current Firmenbuchauszug and check every figure on the Imprint
      still matches. The extract used here dates from 2016.
- [ ] Have a native German speaker read the German pages, especially the legal
      ones.
- [ ] Ask Z Empire to correct "VADIMPEX Handles GmbH" to "Handels".
- [ ] Ask gsmExchange to change the location from Vienna to Baden.

## Regenerating assets

Only needed if a font or the logo changes.

```powershell
powershell -File tools/get-fonts.ps1      # re-download fonts + licences
python tools/make-images.py               # logos, favicons, preview image
python brand/make-logo.py                 # rebuild the horizontal lockups
```

`make-logo.py` reads the approved Illustrator files and only rearranges the mark
and wordmark — it never alters a colour.
