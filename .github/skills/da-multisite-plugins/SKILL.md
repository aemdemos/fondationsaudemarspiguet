---
name: da-multisite-plugins
description: 'Use when creating or changing Document Authoring (DA, da.live, Experience Workspace) plugins, library tools or fullscreen apps that update, preview or publish the same content across several sites (Fondations, Arbres, Bien Commun) and languages (fr, en): multi-site content sync, bulk page updates from one form, newsroom reports, shared sections, multilingual content propagation, cross-site preview and publish.'
---

# Build Multi-Site, Multi-Language DA Plugins

The three sites share one codebase but not their content. A change to a shared page means 3 sites × 2 languages = 6 manual edits. A multi-site plugin turns this into one form: **analyse → confirm → write (versioned, conflict-safe) → preview → publish**, with a per-page status.

Use this skill for author-facing tools running inside DA. Use something else for:

- code changes (blocks, scripts and styles are already shared): use `building-blocks`.
- one-off developer migrations: use `tools/da-bulk`.
- jumping to a page in another language or previewing one page in all languages: use `tools/languageswitcher`.

## Architecture

The reusable runtime is in [assets/](./assets/). Its folders mirror the repository root, so installing means copying files.

| Asset | Repository path | Role |
| --- | --- | --- |
| [sites.js](./assets/tools/da-multisite/sites.js) | `tools/da-multisite/` | Org, ref, locales and site registry (code only, never from the URL) |
| [core.js](./assets/tools/da-multisite/core.js) | `tools/da-multisite/` | Targets, guarded DA/AEM API, plan/apply/verify pipeline, file upload |
| [da-blocks.js](./assets/tools/da-multisite/da-blocks.js) | `tools/da-multisite/` | DA source helpers: sections, blocks, rows, cells, section metadata, links |
| [ui.js](./assets/tools/da-multisite/ui.js), [ui.css](./assets/tools/da-multisite/ui.css) | `tools/da-multisite/` | Generic form, scope selection, confirmations, status tables |
| [newsroom-report](./assets/tools/newsroom-report/) | `tools/newsroom-report/` | Worked example: add or update a report on 6 newsroom pages |
| — (repository only) | `tools/metadata-sync/`, `test/metadata-sync*` | Context-aware library plugin: copies one metadata row from the open page to its other-language counterpart (uses `setup`, `load`, a `select` built from the page, and an optional `?row=` preset from the library entry) |
| [da-mock.js](./assets/test/da-mock.js), [da-sdk-stub.js](./assets/test/da-sdk-stub.js) | `test/` | In-memory DA/AEM and SDK stub for local tests |
| [newsroom-report.html](./assets/test/newsroom-report.html), [newsroom-report-test.js](./assets/test/newsroom-report-test.js) | `test/` | Example test page and fixtures |

A plugin is one declarative **operation** plus `mountMultisiteTool`:

```js
/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import mountMultisiteTool from '../da-multisite/ui.js';
import { findBlock, blockRows, setCellText } from '../da-multisite/da-blocks.js';

const operation = {
  title: 'Shared partner list',
  description: 'Shown above the form for authors.',
  // Path per locale, or (site, locale) => path | null (null = not on that site).
  pages: { fr: '/fr/partenaires', en: '/en/partners' },
  fields: [
    { name: 'name', label: 'Name', type: 'text', localized: true, required: true },
    { name: 'kind', label: 'Kind', type: 'select', options: [{ value: 'ngo', label: 'NGO' }] },
    // { type: 'file', localized, folder: (locale) => `/assets/${locale}`, extensions: ['pdf'], accept, maxBytes }
  ],
  validate: (input, { locales }) => [], // optional extra error messages
  apply(doc, { target, values }) {
    // Mutate the parsed DA source in memory only. Throw on ambiguity.
    const block = findBlock(doc, 'cards', { sectionStyle: 'partners' });
    // ...
    return { summary: 'Add partner X' };
  },
};

mountMultisiteTool({ sdk: DA_SDK, operation, root: document.querySelector('#app') });
```

`values` holds the current locale's values. A localized field resolves to that locale, and a file field becomes `{ file, path }`. `target` is `{ org, repo, site, locale, path }`.

Optional operation members, for tools that depend on the page being edited (library plugins):

| Member | Called | Use |
| --- | --- | --- |
| `setup({ context, api })` | Once, after the SDK and org checks | Read `context.path`, the current page or a sheet; return overrides merged into the operation (`description`, `fields`, `pages`, `siteIds`, `locales`). Throw to show a blocking message. |
| `load({ api, input })` | At each Analyse, before planning | Re-read source data; the result is passed to `apply` as `shared` and reused unchanged for Apply and its verification. |
| `siteIds`, `locales` | At mount | Restrict the scope; a scope with one entry is not shown as checkboxes. |
| `{ type: 'checkboxes', options: [{ value, label, hint, disabled }], default: [] }` | Field | Multiple choice; the value is an array, `required` means at least one. `select` options also accept `disabled`; use a first option with `value: ''` as a placeholder for a required choice. |

`api.request(url, init)` is the guarded `daFetch` (DA and AEM admin origins only) for helpers that need a raw fetch, such as `fetchLanguageSwitcherRows`.

## Rules for `apply`

1. **Idempotent.** Find the existing item by a natural key (link path, ID, slug) and update it, or add it. A second run must return "Up to date". The runtime proves this by re-planning after every write.
2. **Strict, never guessing.** Use `findBlock` (exactly one match) and check the column counts. Throw a clear error when the page structure is unexpected. One page reports an error and the others continue.
3. **Preserve site differences.** Clone an existing row or element from the same page instead of building markup. Icons, link labels and styles differ per site (see [ap-sites.md](./references/ap-sites.md)).
4. **Pure and local.** Use only `doc`, `target`, `values` and `shared`. No network calls, no global state, and no `innerHTML` with author input. Use `textContent`, `setAttribute` and the `da-blocks.js` helpers. Content copied from another DA document is imported with `doc.importNode`.
5. **Minimal.** Touch only the targeted block. Never rewrite whole sections or metadata that the operation does not own.

## Workflow

1. **Scope.** Define the change, the page per site and locale, the pages that may be absent (`null`), the natural key, and who runs the tool. Keep one operation per author intent. Prefer a few explicit fields over free HTML.
2. **Read the real DA source** of every target page with the author's or developer's access (`GET https://admin.da.live/source/{org}/{repo}{path}.html`, or copy it from DA). Do not design transforms from `.plain.html` or the live DOM: they are rendered output with different icons, media URLs and wrappers. Record the site and locale differences.
3. **Install the runtime** if `tools/da-multisite/` is missing. Copy `assets/tools/da-multisite/` → `tools/da-multisite/`, and copy `assets/test/da-mock.js` and `assets/test/da-sdk-stub.js` → `test/`. Never fork the runtime per plugin. Improve it in place, keep both copies identical (`diff -r .github/skills/da-multisite-plugins/assets/tools/da-multisite tools/da-multisite`), and re-test the existing tools that use it.
4. **Create the plugin.** Copy `assets/tools/newsroom-report/` → `tools/<name>/` (`<name>.html`, `<name>.js`). Then write the operation.
5. **Create the fixtures.** Copy the example test page and script to `test/<name>.html` and `test/<name>-test.js`. Paste the real DA source of each site and locale variant, with personal data removed.
6. **Test locally** following [Testing](#testing). Nothing remote is touched.
7. **Test in DA on a branch.** Push the branch, then open `https://da.live/app/audemars-piguet/<repo>/tools/<name>/<name>?ref=<branch>`, or use `ref=local` with `aem up`. For the first real runs, point `pages` at copies under `/drafts/` and get the user's go-ahead before targeting live pages.
8. **Register the tool for authors** (configuration is done by an admin, with the user's approval). Per site, or once at org level, in `https://da.live/config#/audemars-piguet/<repo>/`:
   - fullscreen app (recommended for multi-site work): `apps` sheet with `title`, `description`, `image` and `path` = `https://da.live/app/audemars-piguet/<repo>/tools/<name>/<name>`.
   - library plugin: `library` sheet with `title`, `path` = `/tools/<name>/<name>.html`, `icon` and `experience` = `dialog`.
9. **Document it** for authors: purpose, fields, what is never overwritten, and how to restore a version. Use a README next to the tool.

## Testing

- Lint: `node_modules/.bin/eslint tools/da-multisite tools/<name> test/da-mock.js test/da-sdk-stub.js test/<name>-test.js` and `node_modules/.bin/stylelint "tools/da-multisite/*.css"`. Then run `npm run lint` as the repository gate (`lint:css` does not cover `tools/`). To lint the skill's own assets under `.github/`, add `--no-ignore`.
- Browser: with `aem up`, open `http://localhost:3000/test/<name>.html`. The importmap replaces the DA SDK, and `window.DA_MOCK` exposes the mock. Check that:
  - **Analyse**: every page is "Ready" and the mock records no write call.
  - **Apply**: each page is written once; one version per page; new files uploaded; site icons, link labels and link forms preserved; unrelated blocks untouched.
  - **Re-analyse**: every page is "Up to date" (idempotency) and existing files are kept.
  - **Concurrent edit** (`DA_MOCK.edit(key, fn)` between Analyse and Apply): that page shows "Conflict", the others are written.
  - **Read-only site** (`DA_MOCK.setReadOnly(repo)`): its pages show "No access" and its files are "Skipped".
  - **Injected failure** (`DA_MOCK.fail(method, url, status)`): a failed version means the page is not written; a failed file preview means the page is blocked.
  - **Missing page or ambiguous block**: explicit errors; the other pages are unaffected.
  - **Inputs changed after Analyse**: the run is marked stale and Apply/Preview/Publish are disabled.
  - **Wrong org** (`DA_MOCK_CONTEXT`) **or outside DA** (`DA_MOCK_NO_SDK`): a blocking message is shown.
  - **Preview then Publish**: files go before pages, and only previewed items are published.
  - **Keyboard and accessibility**: fields are labelled, focus moves to the confirmation, statuses are announced, and the layout works at 320 px.
- Real DA (branch, drafts) before handover: compare the written source with a manual edit, preview one page per site, and check the newsroom download links.

## Safety

Follow [safety.md](./references/safety.md). Non-negotiable:

- Analyse is read-only. Writing and publishing each require an explicit confirmation in the UI.
- Every page write uses `If-Match` with the ETag from the analysis, after a named version. No ETag means no write.
- Never overwrite binaries (DA does not version them). Files are created with `If-None-Match: *`.
- Preview and publish files before the pages that link to them, and publish only what was previewed.
- `daFetch` sends the author's token to any URL. Call only `admin.da.live` and `admin.hlx.page`, through `createApi`.
- The registry lives in code, and the org must match `context.org`. Never build org or repositories from the URL or a sheet; the only path exception (current page → language counterpart) is described in [safety.md](./references/safety.md).
- A library plugin never writes the page open in the editor; it writes other pages only.
- The agent never publishes, edits DA content or changes DA configuration on its own. Those steps belong to the user.

## References

- [platform.md](./references/platform.md): verified DA SDK, Source API, versions, conditional writes, CORS, AEM Admin API, configuration and local development.
- [safety.md](./references/safety.md): pipeline, states, failure handling, security and UX requirements.
- [ap-sites.md](./references/ap-sites.md): AP sites, page pairs, known site differences and content drift.
