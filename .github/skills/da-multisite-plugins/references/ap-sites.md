# AP Foundation Sites

## Registry

Org `audemars-piguet`, ref `main`, locales `fr` and `en`. This is the source of truth for [sites.js](../assets/tools/da-multisite/sites.js).

| Site ID | Label | Repository (DA site) | Preview origin |
| --- | --- | --- | --- |
| `fondations` | Fondations | `fondationsaudemarspiguet` | `https://main--fondationsaudemarspiguet--audemars-piguet.aem.page` |
| `arbres` | Arbres | `arbres-fondationsaudemarspiguet` | `https://main--arbres-fondationsaudemarspiguet--audemars-piguet.aem.page` |
| `biencommun` | Bien Commun | `biencommun-fondationsaudemarspiguet` | `https://main--biencommun-fondationsaudemarspiguet--audemars-piguet.aem.page` |

DA editor: `https://da.live/edit#/audemars-piguet/<repo><path>`. Live sites use `.aem.live`.

## Page Pairs

FR and EN slugs differ, so always map them explicitly per locale.

| Content | FR | EN |
| --- | --- | --- |
| Media newsroom | `/fr/espace-medias` | `/en/media-newsroom` |

Add new pairs here when a tool needs them. If a page exists only on some sites, return `null` from the `pages(site, locale)` function for the others.

## Newsroom Report Table

Observed in the rendered output (`.plain.html`) of the six pages. Confirm against the DA source before changing the example operation.

- A `table no-header` block in a section whose metadata style includes `report`. The style value and key spelling differ per site:
  - Fondations and Bien Commun: key `style`, value `pale-grey-bg , sort, report`.
  - Arbres: key `Style`, value `ashy-grey-bg, sort, report`.
- Three columns per row: type (`Rapport`/`Report`, `Brochure`/`Leaflet`) | title | the links "Découvrir"/"Discover" plus a download icon link, both pointing to the same PDF.
- Download icon: Fondations and Bien Commun use `btn_bien_download`; Arbres uses `btn_arbres_download`. That is why the operation clones an existing row.
- PDF links: Fondations and Arbres render `/assets/documents/{locale}/*.pdf`; Bien Commun renders `./media_*.pdf`. The DA source link form may differ: inspect it.
- No client-side sort was found for these rows, so the position in the table matters (`position` field).
- [table.js](../../../../blocks/table/table.js) `setupReportLinks` adds `download` to icon links (same origin only) and `target="_blank"` to the "Discover" links.

## Existing Tools

- [tools/languageswitcher](../../../../tools/languageswitcher/): a library plugin for one page across locales, with bulk preview/publish and permission checks (`da-permissions.js`, `aem-admin.js`).
- [tools/da-bulk](../../../../tools/da-bulk/): a Node CLI for developer-run bulk edits with dry-run, backups, versions and `If-Match`.

## Content Drift Observed (read-only check)

Report these to the content owners; a tool must not "fix" them silently.

- Fondations EN newsroom: the e-mail link renders as `https://content.da.live/audemars-piguet/biencommun-fondationsaudemarspiguet/ap.fondation@audemarspiguet`, which is a broken `mailto:` (and points to a different site's repository).
- Fondations FR newsroom: the first row repeats "Rapport annuel 2024 … Bien Commun" where the other pages have "Action Now".
- Arbres and Bien Commun (FR and EN): the "Action Now" rows link to the same PDF as the 2024 Bien Commun annual report (`rapportannuel2024-apf4cg-*-edit.pdf`), which looks like a copy/paste error.

Shared pages already differ, so a tool must report "unexpected structure" per page instead of assuming that all six are identical.
