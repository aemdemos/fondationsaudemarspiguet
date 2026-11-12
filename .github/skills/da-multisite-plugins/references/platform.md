# DA Platform Reference for Multi-Site Tools

These facts were verified against the DA SDK source, da-admin and the Experience Workspace docs. Re-verify anything marked *assumption* before relying on it, because DA evolves quickly.

## Contents

- [SDK](#sdk)
- [daFetch](#dafetch)
- [Source API](#source-api)
- [AEM Admin API](#aem-admin-api)
- [CORS](#cors)
- [Configuration](#configuration)
- [Local development](#local-development)
- [Backend changes](#backend-changes)

## SDK

`import DA_SDK from 'https://da.live/nx/utils/sdk.js'` resolves to `{ context, token, actions, ... }` **only inside a DA iframe**. Outside DA it never resolves, so always race it against a timeout (`mountMultisiteTool` waits 10 s).

- `context`: `org`, `repo`, `ref`, `path` and so on for the site where the tool was opened. Use it to check the org, not to choose org or repositories. In a library plugin, `path` is the page being edited, without org, repo or `.html` (for example `/en/media-newsroom`; da-live builds it from the editor hash). Accept a `/{org}/{repo}` prefix or `.html` defensively.
- `token`: the author's IMS token. Never store it, log it or put it in a URL.
- `actions`: `daFetch`, `sendText`, `sendHTML`, `setHref`, `setHash`, `closeLibrary`, `setPrompt`, `showPanel`, `makeDraggable`, `subscribeChatTurnCompleted`. `sendText`, `sendHTML` and `closeLibrary` only make sense in a library plugin.

Load the SDK in the HTML (`<script src="https://da.live/nx/utils/sdk.js" type="module">`) and import it in the module.

## daFetch

`actions.daFetch(url, init)`:

- adds `Authorization: Bearer <token>` to **every URL**, and also `x-content-source-authorization` for `https://admin.hlx.page`. This is why `createApi` allows only `https://admin.da.live` and `https://admin.hlx.page`.
- sets `resp.permissions` from the `x-da-actions` header (`/org/repo/path=read,write`).
- on 401, starts the DA sign-in. A network failure becomes a `500` Response, not an exception.

## Source API

Base: `https://admin.da.live`. The paths include the extension for documents.

| Call | Use |
| --- | --- |
| `GET /source/{org}/{repo}{path}.html` | DA source plus `ETag` plus `x-da-actions` |
| `HEAD /source/{org}/{repo}{file}` | Existence and permissions of a file |
| `PUT /source/{org}/{repo}{path}.html` (FormData `data` = Blob) | Write a document |
| `PUT` with `If-Match: <etag>` | 412 if the document changed since it was read |
| `PUT` with `If-None-Match: *` | Create-only; 412 if it exists (*assumption for binaries: confirm the 412 on a draft file*) |
| `POST /versionsource/{org}/{repo}{path}.html` with JSON `{ "label": "..." }` | Named version (requires write permission) |
| `GET /list/{org}/{repo}{folder}` | Folder listing, paginated with the `da-continuation-token` header |

- The source format is `<body><header></header><main><div>…section…</div></main><footer></footer></body>`. A block is `<div class="name variant">`, rows are child `div`s and cells are their child `div`s, possibly containing `<p>`. Section metadata is `div.section-metadata` with key/value rows. Icons are authored as `:icon-name:` text.
- Parse with `DOMParser`, serialize `doc.body.outerHTML` (as Adobe's update-tree example does), and compare serialized baseline with serialized result to detect real changes.
- **Binaries (PDF, images) are not versioned.** Never overwrite them. Ask authors to use a new file name for a new version.
- Link forms found in DA source vary (`/path`, `https://content.da.live/{org}/{repo}/path`, AEM host URLs, relative links). `linkPath` normalizes them and `hrefLike` writes new links in the same form as the row they replace.

## AEM Admin API

Base: `https://admin.hlx.page`. Use `REF = main`.

| Call | Use |
| --- | --- |
| `POST /preview/{org}/{site}/{ref}{path}` | Preview a page (no extension) or a file (with extension) |
| `POST /live/{org}/{site}/{ref}{path}` | Publish what is currently previewed |
| `GET /status/{org}/{site}/{ref}{path}` | Preview and live status |
| `POST /preview\|live/{org}/{site}/{ref}/*` with `{ "paths": [...] }` | Bulk job (202 plus a job URL under `/job/...`); use it for many pages |

- Errors are explained in the `x-error` header.
- Preview pushes the **whole current DA source** of a page, including other authors' unpreviewed edits. Say so in the tool's documentation.
- Files must be previewed and published before the pages that link to them.

## CORS

Verified from a `*.aem.page` origin:

- `admin.da.live`: `Access-Control-Allow-Origin: *`, all request headers; exposes `ETag`, `X-da-actions`, `X-da-child-actions`, `x-error` and `da-continuation-token`.
- `admin.hlx.page`: reflects the `aem.page` origin with credentials, allows `Authorization` and `x-content-source-authorization`, and exposes `x-error`. Cross-site calls work (a tool served from the Fondations site can preview Arbres pages).

## Configuration

Site configuration: `https://da.live/config#/{org}/{site}/`. An org-level configuration (`#/{org}/`) applies to all sites; site sheets override it. Without an org-level entry, configure each of the three sites.

- **Fullscreen app** (`apps` sheet): `title`, `description`, `image`, `path`, `ref`. App URL: `https://da.live/app/{org}/{site}/{path-without-.html}`, for example `https://da.live/app/audemars-piguet/fondationsaudemarspiguet/tools/newsroom-report/newsroom-report`. The app is listed on `https://da.live/apps#/{org}/{site}`.
- **Library plugin** (`library` sheet): `title`, `path` (for example `/tools/<name>/<name>.html`), `icon`, `experience` (`dialog`), and optionally `format` and `ref`. Open it from the editor's library while editing a page. The query string of `path` is kept in the iframe URL (da-live `calculateSources` then `toPreviewProxyUrl`), so one tool can back several entries with presets (`/tools/metadata-sync/metadata-sync.html?row=start-date`). Commas split `path` into several sources, and the entry name is derived from `title`, so titles must be distinct.

A multi-site batch tool fits a fullscreen app best. A library plugin suits actions on the open document (`sendHTML`) or a tool reached from a specific page.

## Local development

- Add `?ref=<branch>` to the DA app or editor URL to load tools from a branch, or `?ref=local` to load them from `http://localhost:3000` (`aem up`).
- `.hlxignore` excludes `test/*`, `*.md` and dot-folders from publishing. `tools/<name>/` is published with the site code.
- Test pages under `test/` use an importmap that points `https://da.live/nx/utils/sdk.js` to `/test/da-sdk-stub.js`.

## Backend changes

DA may move sites to a new source backend (helix6 `api.aem.live`). The Structured Content API (`sc-api.adobeaem.workers.dev`) is an alternative for structured data. Before building a tool, check that `admin.da.live/source/...` still serves the target sites. Keep all API calls in `createApi` so that a migration only touches one place.
