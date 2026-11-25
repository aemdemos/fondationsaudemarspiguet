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
- [tools/metadata-sync](../../../../tools/metadata-sync/): a library plugin that copies one metadata row from the open page to its other-language counterpart on the same site (chosen by the author or preset with `?row=` in the library entry).
- [tools/page-sync](../../../../tools/page-sync/): creates an identical News/Projects counterpart if absent; otherwise offers Metadata sync's single-row update. Its README lists the supported article folder pairs.

## Language Counterparts

- Each site publishes `placeholders.json` with a `language-switcher` sheet: one row per page or folder, `en` and `fr` columns holding the path after the locale (Fondations `/media-newsroom` ↔ `/espace-medias`). Fondations has few rows, Arbres and Bien Commun have dozens (all projects).
- [placeholders.js](../../../../tools/languageswitcher/placeholders.js) loads it (`fetchLanguageSwitcherRows`: published JSON first, DA source as fallback) and maps paths (`resolvePathWithRows`, longest prefix). Without a matching row, the Language Mapper falls back to the same path under the other locale; tools must say so to the author.
- Page sync additionally knows the News and Projects folder pairs from the listing templates (`*-news` ↔ `*-actualites`, `*-projects` ↔ `*-nos-projets` for Arbres and Bien Commun). New article slugs are kept unless a more specific mapping exists. It never modifies the sheet; a translated slug renamed later requires a mapping update.

## Localized Metadata Names

- AEM delivers a metadata row label as a meta name with `label.toLowerCase().replace(/[^0-9a-z:_]/g, '-')`: "Category(ies)" → `category-ies-`, "Durée du projet" → `dur-e-du-projet`, "Start Date" → `start-date`.
- Project pages use different labels per language, mapped in [scripts/metadata/config.js](../../../../scripts/metadata/config.js) (`TEMPLATES.*.fields[*].overrides`): Partner ↔ Partenaire, Category(ies) ↔ Axe(s), Project duration ↔ Durée du projet, Location(s) ↔ Lieu(x), Link(s) ↔ Lien(s). Other names (Title, Description, Image, Photos, Theme…) are the same in both languages.
- `Language` and `Template` usually come from bulk metadata, not from the page; Metadata sync never copies a `Language` row. Page sync's explicitly requested exact full-page copy preserves every row, including `Language` if present, and warns the author to correct locale-specific content before publishing.
- Drift seen on Arbres: the EN project "Agroforestry and green entrepreneurship" has a `Start Date` row that its FR page lacks, and the project durations can differ.

## Content Drift Observed (read-only check)

Report these to the content owners; a tool must not "fix" them silently.

- Fondations EN newsroom: the e-mail link renders as `https://content.da.live/audemars-piguet/biencommun-fondationsaudemarspiguet/ap.fondation@audemarspiguet`, which is a broken `mailto:` (and points to a different site's repository).
- Fondations FR newsroom: the first row repeats "Rapport annuel 2024 … Bien Commun" where the other pages have "Action Now".
- Arbres and Bien Commun (FR and EN): the "Action Now" rows link to the same PDF as the 2024 Bien Commun annual report (`rapportannuel2024-apf4cg-*-edit.pdf`), which looks like a copy/paste error.

Shared pages already differ, so a tool must report "unexpected structure" per page instead of assuming that all six are identical.
