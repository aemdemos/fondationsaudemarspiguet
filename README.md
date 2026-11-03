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

## Shared front-end behavior

Fondations, Arbres and Bien Commun share the same block layouts and interactions.
Image-only heroes keep their natural image height. Project listings use 35:23
image frames; homepage project images use 700:459 frames with `object-fit: cover`.
Project grids have one column through 640px, two through 930px and three above;
homepage project images and text stack through 930px.
Each site's existing color tokens remain in use, including article headings and
inline links. These rules apply wherever the corresponding block/template is used.
In extended news articles, the closing gallery overlaps the background transition
on desktop, while the following text/sidebar section stays clear of the image.
Article body paragraphs use weight 300; bold emphasis remains authored with
`strong` rather than applied automatically to the first paragraph.

LinkedIn URLs remain authored in DA: link the LinkedIn icon to the desired URL.
The footer and hero preserve the icon appearance and open the link in a new tab.
No Universal Editor model change is needed.

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
