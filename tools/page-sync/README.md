# Page Sync

A DA **library plugin** for News and Projects articles, on the same registered site, in either direction (FR to EN or EN to FR).

- **Missing counterpart:** create a full, identical copy of the saved source.
- **Existing counterpart:** offer the same single-row metadata selection as [Metadata sync](../metadata-sync/README.md). Never replace an existing page with a full copy.

## Use

1. Open a News or Projects article in DA. Wait for DA to save your edits.
2. Open **Page sync** from the Library.
3. If the counterpart is absent, check the proposed path and select **Analyse**, then **Apply changes...** and confirm.
4. Open the target using the DA link in the results. **Do not forget to translate it before publishing.** Review the title, text, image alternatives, links, metadata names/values and any `Language` row.
5. Preview and publish separately when ready. The translation reminder is repeated in the creation result and publication confirmation. Nothing is automatically previewed or published.

If the page already exists when the tool opens, the **Only metadata can be synced** notice highlights that a full-page copy is unavailable and all other content stays unchanged. Source (read-only) and target paths are listed separately. Choose a **Metadata row to sync**, then Analyse and Apply. This reuses Metadata sync's localized row names, internal-link handling, backup versions and explicit content-comparison fallback when DA has no ETag.

The mode is chosen when the tool opens. Reopen it after creating the page, or if another author creates/deletes the counterpart, to refresh the mode.

## What is copied

The saved DA source is read again at each Analyse and copied **without parsing and reserializing it for the write**. The entire document stays identical: blocks, sections, formatting, images, links, metadata and authoring attributes. No automatic translation, link rewriting, metadata renaming or language change is performed during creation.

The source page is never modified. The snapshot captured during Analyse is used for creation; edits saved after Analyse require a new analysis to be included. Existing assets are referenced, not uploaded or duplicated. Review relative links and image references in the new language context.

## Automatic paths

The site's `language-switcher` sheet supplies existing page/folder correspondences. Otherwise the source slug is retained under the matching locale and article folder:

| Content | EN folder | FR folder |
| --- | --- | --- |
| Arbres Projects | `/en/fondation-pour-les-arbres-projects/` | `/fr/fondation-pour-les-arbres-nos-projets/` |
| Bien Commun Projects | `/en/fondation-pour-le-bien-commun-projects/` | `/fr/fondation-pour-le-bien-commun-nos-projets/` |
| Arbres News | `/en/fondation-pour-les-arbres-news/` | `/fr/fondation-pour-les-arbres-actualites/` |
| Bien Commun News | `/en/fondation-pour-le-bien-commun-news/` | `/fr/fondation-pour-le-bien-commun-actualites/` |

These are the folders used by the listing templates. They are supported on the three registered repositories; the tool never copies between sites or operates on listing pages.

An unavailable sheet is reported explicitly and the known folder pair is used. Rows with an empty target-language cell are also skipped in favor of a usable folder mapping. **Check the destination before confirming:** an existing translated page with a different slug cannot be discovered if it is missing from the sheet. The plugin does not update `placeholders.json`. If you later rename the translated page, update the language-switcher mapping separately.

## Creation safety

- Only a target **404** is considered absent. Authorization failures and server errors never trigger creation.
- Creation uses `If-None-Match: *`, including when DA exposes no ETag. If another author creates the page after Analyse, DA returns 412 and the tool reports a conflict. It never retries with an unconditional write.
- No backup version is requested for a new page: there is no previous content to back up. Existing-page metadata updates still save a version before writing.
- After creation, the target document is read back and checked against the exact analysis snapshot. A mismatch or failed read is reported explicitly, with Preview/Publish disabled for that result.
- Tests use an in-memory DA mock. Before rollout, validate on disposable articles inside a supported folder, for example `/en/fondation-pour-les-arbres-news/drafts/page-sync-test`, including a create collision. Do not test by overwriting a real translation.

## DA configuration

Add a row to the site's `library` sheet (or once at org level):

| title | path | experience |
| --- | --- | --- |
| Page sync | `/tools/page-sync/page-sync.html` | `dialog` |

Sites: `fondationsaudemarspiguet`, `arbres-fondationsaudemarspiguet`, `biencommun-fondationsaudemarspiguet`, under `audemars-piguet`.

The plugin depends on the shared runtime, [Metadata sync's operation](../metadata-sync/operation.js), [language mapping](../languageswitcher/placeholders.js) and [metadata configuration](../../scripts/metadata/config.js).

## Local validation

With the existing local server:

- Interactive mock: `http://localhost:3000/test/page-sync.html`.
- Options: `?site=biencommun&locale=fr&kind=news`, `&exists=true`, `&mapped=true`, `&sheet=missing`, `&etag=present`. By default the mock omits ETags, like the observed DA responses.
- Automated page creation and metadata regression tests: `http://localhost:3000/test/page-sync-regression.html`.
- Shared runtime regressions: `http://localhost:3000/test/da-multisite.html`.

These pages never write real DA content.
