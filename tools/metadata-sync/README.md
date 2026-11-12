# Metadata Sync

A Document Authoring (DA) **library plugin** that copies **one row** of the **metadata** block from the page being edited to the same page in the other language (EN → FR or FR → EN) of the same site. The other rows of the target page are not touched.

It uses the shared multi-site runtime in [`tools/da-multisite`](../da-multisite/) (see the `da-multisite-plugins` skill).

The reusable implementation is in [operation.js](./operation.js); [metadata-sync.js](./metadata-sync.js) remains the DA entry point. [Page sync](../page-sync/README.md) reuses the same operation for existing News/Projects counterparts and can create a full copy when the counterpart is absent. Metadata sync itself still updates only one row and does not create missing pages.

## Behavior

- **Source.** The page open in the editor. It is read, never written.
- **Target.** Its counterpart in the other language, on the same site. The path comes from the site's `language-switcher` sheet (`placeholders.json`), for example Fondations `/en/media-newsroom` ↔ `/fr/espace-medias`. Without a matching row, the same path under the other locale is used, and the tool says so.
- **Row.** One row per run: either chosen by the author in a list (each entry shows its current value), or fixed by the library entry with `?row=` (see [Configuration](#configuration)). The row is matched by metadata name. The localized names in [`scripts/metadata/config.js`](../../scripts/metadata/config.js) are mapped: Partner ↔ Partenaire, Category(ies) ↔ Axe(s), Project duration ↔ Durée du projet, Location(s) ↔ Lieu(x), Link(s) ↔ Lien(s).
  - If the target page has that row, only its value is replaced. Otherwise the row is added at the end of the block, with the label used in the target language. The other rows are never modified.
  - The `Language` row is never offered.
  - A row present twice on the source page cannot be selected. A row present twice on the target page stops the update.
- **Value.** Copied as is: text, formatting, images and links. Nothing is translated. Internal links to the source locale (`/en/...`) are switched to the target locale with the same mapping, and anchors and query strings are kept.
- **Missing block.** If the target page has no metadata block, one is created at the end of the last section.
- **Safety.** Analyse is read-only and shows the planned change. Apply asks for confirmation and saves a DA version of the target page ("Before Metadata sync" followed by the date and time). With an ETag, the write uses `If-Match`: a concurrent change produces "Conflict"; analyse again.
  - Some DA responses have no ETag (observed on Arbres). In that case the tool warns in the analysis and asks to **Write with content comparison**. It re-reads the target without browser caching before versioning and again immediately before writing, comparing its exact source with the analysis snapshot. Changed content, lost permissions, failed reads or a failed backup stop the write.
  - **Content comparison is not atomic.** An edit made between the final read and the write can still be overwritten. Coordinate with other authors and avoid simultaneous edits of the target. An ETag supplied by the final read is used if available; the document ID or modification date is never substituted for an ETag.
  - Preview and Publish are separate actions; Publish requires confirmation.

## How to Use

1. Open the EN or FR page in DA and wait a few seconds so that DA saves your last edits.
2. Open **Metadata sync** (or a preset entry such as **Sync Start Date**) from the Library.
3. Choose the row to copy (already selected for a preset entry), then select **Analyse**.
4. Check the planned change, then **Apply**, then **Preview** (and **Publish** when ready).

To undo a change, restore the "Before Metadata sync" version of the target page from the DA version history.

## Configuration

Add a row to the `library` sheet of each site, in `https://da.live/config#/audemars-piguet/<repo>/` (or once at org level):

| title | path | experience |
| --- | --- | --- |
| Metadata sync | `/tools/metadata-sync/metadata-sync.html` | `dialog` |
| Sync Start Date | `/tools/metadata-sync/metadata-sync.html?row=start-date` | `dialog` |

The first entry lets the author choose the row. An entry with `?row=<name>` fixes the row: the list only contains that row, and the tool refuses to run if the page does not have it. `<name>` is the metadata name (the label in lower case, with `-` for spaces and symbols: `start-date`, `category-ies-`) or the label itself (`Start%20Date`), in either language: `?row=partner` also works on a FR page with `Partenaire`. Avoid commas in `path`: DA uses them to separate sources. Give each entry a distinct `title`.

Repositories: `fondationsaudemarspiguet`, `arbres-fondationsaudemarspiguet`, `biencommun-fondationsaudemarspiguet`. An optional `icon` column can point to an SVG.

To test a branch, add `?ref=<branch>` to the DA editor URL, or `?ref=local` with `aem up`.

## Limits

- The tool reads the content saved in DA, not unsaved keystrokes.
- Only the metadata block of the page is handled. Values set by bulk metadata (`Template`, `Language`…) are not shown.
- Different pages that share a target (for example several pages that fall back to the same path) are not detected. Check the target shown in the description.

## Local Test

With `aem up`, open `http://localhost:3000/test/metadata-sync.html?repo=arbres-fondationsaudemarspiguet&path=/en/fondation-pour-les-arbres-projects/agroforestry-and-green-entrepreneurship`. The DA SDK and the DA/AEM APIs are mocked in memory ([`test/metadata-sync-test.js`](../../test/metadata-sync-test.js)). Other fixtures: `/en/media-newsroom`, `/fr/espace-medias` and `/en/duplicate-rows` (Fondations), `/en/only-in-english` (Arbres), and `/en/no-metadata` (Bien Commun, `repo=biencommun-fondationsaudemarspiguet`). Add `&row=<name>` to test a preset entry.

Add `&etag=missing` to reproduce DA responses without an ETag. Run the automated concurrency checks at `http://localhost:3000/test/da-multisite.html`: versioning, both comparison checkpoints, permissions, failed requests, ETag conflicts and the warning/confirmation UI. All writes in these tests stay in memory.
