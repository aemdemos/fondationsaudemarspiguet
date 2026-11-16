# fondationsaudemarspiguet

This is a project created by AEMY.

## Environments

Fondations site:
- Preview: https://main--fondationsaudemarspiguet--audemars-piguet.aem.page/
- Live: https://main--fondationsaudemarspiguet--audemars-piguet.aem.live/

Arbres Fondations site:
- Preview: https://main--arbres-fondationsaudemarspiguet--audemars-piguet.aem.page/
- Live: https://main--arbres-fondationsaudemarspiguet--audemars-piguet.aem.live/

Biencommun Fondations site:
- Preview: https://main--biencommun-fondationsaudemarspiguet--audemars-piguet.aem.page/
- Live: https://main--biencommun-fondationsaudemarspiguet--audemars-piguet.aem.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000/`)
1. Open the `fondationsaudemarspiguet` directory in your favorite IDE and start coding :)

## Security regression checks

With the local AEM proxy running, open
`http://localhost:3000/test/security.html?rum=off` and check that every case
passes. Repeat at desktop and mobile viewport sizes. The page uses local mocks
for project-index data and map scripts; it does not submit a real form or load
Google Maps. The fixture is excluded from publication by `.hlxignore`. These
checks do not replace the Snyk scan or integration checks with real content.

Form rich text, descriptions, validation help and confirmation messages are
sanitized with the bundled DOMPurify. Safe formatting, links, image alternatives
and authoring data attributes are retained; executable markup and unsafe link
protocols are removed. Links opening in a new tab receive `rel="noopener"`.
Featured-project metadata is rendered as plain text, and its links accept only
HTTP(S) URLs. Map scripts use French for `fr` paths and English otherwise.

After form submission, redirects accept only HTTP(S) URLs on the current page's
origin (same scheme, host and port), including relative confirmation-page links.
External or executable destinations are rejected rather than followed. This does
not change the submission endpoint on `forms.adobe.com` or the SendGrid iframe.
Language navigation is also confined to the current origin; the separate DA
language tool opens only HTTPS DA or AEM/Helix destinations.
Same-origin redirects rebuild the destination from the browser's current origin
and validated path, query and fragment, never from the input URL's authority.
The DA tool validates every destination before opening any tab in a batch.

Fragments are fetched from the current origin without following HTTP redirects
and are sanitized before decoration. Link fragments directly to their canonical
paths, not redirecting aliases. Safe HTML, relative media and authoring data
attributes remain supported; executable markup is removed. Home-project and
news-slider metadata is built with DOM nodes, and their links accept only HTTP(S).
The local checks include navigation in isolated frames, fragment loading and
mocked project/news indexes; production integrations still need their own checks.

## Shared front-end behavior

Fondations, Arbres and Bien Commun share the same block layouts and interactions.
Scrollable hero carousel arrows navigate to the next slide; the last arrow returns
to the first slide and the top of the page, with reduced-motion support.
On the Fondations homepage, carousel copy is selectable and uses uniform light
typography, retaining the authored highlight colors.
On the Arbres and Bien Commun homepages, formatted carousel text inherits the
surrounding typography while retaining authored highlight colors and underlines.
Fondations content sections using `light-grey-orange-bg` retain the site's light
grey background rather than the Bien Commun beige.
Image-only heroes keep their natural image height. Project listings use 35:23
image frames; homepage project images use 700:459 frames with `object-fit: cover`.
Project grids have one column through 640px, two through 930px and three above;
homepage project images and text stack through 930px.
Project category/location options and news category options become bold on hover
across all three sites.
Filter separators have equal spacing on both sides; category and location inputs
are sized to their displayed text without extra trailing padding.
Project category/location separators stay with their input when filters wrap.
Project map introductions use a centered 1440px container with the back link
in the bottom spacing, without adding an extra row above the map.
Each site's existing color tokens remain in use, including article headings and
inline links. These rules apply wherever the corresponding block/template is used.
Arbres and Bien Commun navigation labels remain uppercase on mobile and desktop,
using the desktop font weights at all widths (600 for main labels, 400 for
submenu links). Navigation links allow accented capitals to render without clipping.
In extended news articles, the closing gallery overlaps the background transition
on desktop, while the following text/sidebar section stays clear of the image.
Article body paragraphs use weight 300; bold emphasis remains authored with
`strong` rather than applied automatically to the first paragraph.

LinkedIn URLs remain authored in DA: link the LinkedIn icon to the desired URL.
The footer and hero preserve the icon appearance and open the link in a new tab.
No Universal Editor model change is needed.

In newsroom report tables, the download-icon link downloads the authored file,
while the Discover link opens it in a new tab. Download links should reference
files on the same origin so browsers honor the `download` attribute.
In news article body text, links to PDF files open in a new tab; other links
keep their existing behavior. This applies to both languages and sidebar layouts.
To check this locally, open `/test/news-article-links.html`.

## Project list ordering (DA)

In each project page's existing `Metadata` table, optionally add:

| Metadata | |
| --- | --- |
| Start Date | 15.03.2026 |

Use the same `Start Date` label on French and English pages and the exact
`DD.MM.YYYY` format. This metadata controls project-list and homepage featured-project ordering; it is
not displayed and does not replace the visible project duration.

The list sorts newest first using `Start Date`. Without it (or if it is empty
or invalid), the duration's end year is treated as 31 December of that year.
All projects share this ordering, including when filters are cleared. Ties use
the previous rule: descending duration end year, then descending start year.
Invalid dates generate a browser console warning and use the duration fallback.

**Index prerequisite:** separately update each Arbres and Bien Commun
`projects-index.json` configuration, in both languages, to expose the page's
`<meta name="start-date" content="15.03.2026">` as the string column `startDate`.
The index configuration is managed outside this repository; no remote content
or configuration is changed here. Until that column is available and the
affected pages are reindexed, the existing duration-based ordering remains.
The homepage applies the same ordering to projects with non-empty `featured`
metadata. Other featured-project blocks are unchanged. No UE model change is needed.

With the local AEM proxy running, open
`http://localhost:3000/test/projects-landing.html?dapreview=1&rum=off` to run
mock-index checks for ordering, date validation, hidden metadata and filter resets.

## Newsletter block (DA)

Add a table named `Newsletter` with the following four configuration rows. Merge
the header cells in DA. The same table works on French and English pages.

| Newsletter | |
| --- | --- |
| fr-desktop | [Inscription newsletter](https://cdn.forms-content-1.sg-form.com/69f432ed-d3a7-11f1-bc0d-4249b32338bc) |
| fr-mobile | [Inscription newsletter](https://cdn.forms-content-1.sg-form.com/78e95634-d3a7-11f1-bc0d-4249b32338bc) |
| en-desktop | [Newsletter subscription](https://cdn.forms-content-1.sg-form.com/358970d4-d3a7-11f1-bc0d-4249b32338bc) |
| en-mobile | [Newsletter subscription](https://cdn.forms-content-1.sg-form.com/b0dca524-cd37-11f1-845e-8636ae059321) |

The site language helper selects `fr` or `en` from the page path (English by
default). Each language needs both formats; missing or invalid required links
leave the authored content unchanged instead of showing the wrong language.
Only one iframe is loaded: desktop when the block has at least 660px of available
width, mobile otherwise. Resizing across that threshold loads the other form and
resets any unsubmitted input. Link labels become accessible iframe titles.
A one-column table with a single link remains supported for a fixed form.

Use the URL, not raw iframe HTML. Only HTTPS URLs on
`cdn.forms-content-1.sg-form.com` are embedded. Missing or unsupported links leave
the authored content unchanged.

The block is centered and limited to 660px wide, using the full available width on
smaller screens. Override `--newsletter-max-width` to adjust this limit. Below a
700px viewport, only the newsletter wrapper uses reduced 4px side padding. The
iframe has a default height of 960px for the mobile format and 800px for desktop.
Internal scrolling remains available. The CSS custom property
`--newsletter-iframe-height` can override the height where needed; there is no
automatic cross-origin height detection. SendGrid widths exclude its internal
padding and document margins: a 600px desktop setting needs 656px in the iframe.
For 375px mobile screens with overlay scrollbars, use a 310px SendGrid content
width (366px including padding and margins). The supplied mobile forms currently
use 350px and still require this SendGrid-side adjustment. Smaller screens or
reserved scrollbar space need reduced SendGrid spacing or a compact reCAPTCHA.

Configure the fields, language, appearance, target list, required unchecked consent
checkbox, and confirmation message in SendGrid. Site CSS cannot style the contents
of the iframe. Verify consent and the complete submission flow in SendGrid before
publishing. Any applicable Content Security Policy must allow the iframe origin;
apply the site's third-party consent policy where required.

Replace the existing newsletter form table in DA when ready; adding this block
does not change remote content or the other Adobe forms. No API key, backend, or
Universal Editor model is needed for this integration.
