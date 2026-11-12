# Safety Requirements for Multi-Site Tools

A multi-site tool writes six pages with one click. These rules keep a mistake from multiplying by six. The runtime in `tools/da-multisite/` implements them. Do not bypass it.

## Pipeline

| Step | What happens | Guarantee |
| --- | --- | --- |
| 1. Analyse | `GET` every target and check files with `HEAD`; run `apply` in memory | Read-only; reports a state per page and file |
| 2. Confirm | Inline confirmation states the number of pages and files and any non-atomic fallback | Explicit author intent |
| 3. Upload files | `PUT` with `If-None-Match: *`, only files needed by a writable page | Never overwrites a binary |
| 4. Version | `POST /versionsource` with label `Before <tool> <ISO date>` | A restorable copy exists before the write |
| 5. Write | `PUT` the analysed HTML with `If-Match: <analysed ETag>` | Concurrent edits produce "Conflict"; see the explicit no-ETag exception below |
| 6. Verify | Re-read and re-run `apply`; it must report "Up to date" | Proves the write and the idempotency |
| 7. Preview | Files, then the pages whose files succeeded | No page links to a missing file |
| 8. Publish | Confirmed; only items that were previewed, files first | Live is never ahead of preview |

If any input changes after Analyse, the run is stale. Apply, Preview and Publish are disabled until a new analysis.

### Missing ETag

The default is to refuse a changed-page write without an ETag. An operation may explicitly set `allowContentComparison: true` only when this weaker protection is acceptable (Metadata sync does so). The analysis and write confirmation must warn that the fallback is **not atomic**, with a distinct "Write with content comparison" confirmation.

For these pages, retain the exact original HTML in memory. Re-read with `cache: 'no-store'` and compare it before versioning, then again immediately before PUT. Any content difference, read failure or lost write permission aborts the write; version failure also blocks it. If the final read supplies an ETag, use it for `If-Match`. Never retry a 412 without the conditional header.

An edit between the last read and PUT can still be lost. Do not describe this fallback as conflict-safe or equivalent to conditional writes. Keep the named backup and post-write verification, and coordinate with other authors. Never use a document ID, date, hash, or `*` as a substitute revision token.

## States

| State | Meaning | Author action |
| --- | --- | --- |
| Ready | Change computed, nothing written | Apply |
| Up to date | Page already contains the change | None |
| Written | Version saved, page written and verified | Preview |
| Conflict | Page changed since Analyse (412 or source comparison mismatch) | Analyse again |
| No access | 401/403 or no `write` in `x-da-actions` | Ask for access, or deselect the site |
| Not found | Page or file missing (404) | Check the page mapping |
| Blocked | A required file is unavailable or failed a step | Fix the file, then rerun |
| Skipped | File not needed by any writable page | None |
| Error | Unexpected structure or HTTP error; message shown | Fix the content or the tool |

Each site and language is independent: one failure never stops the others, and reruns are safe because the operation is idempotent.

## Security

- **Token scope.** `daFetch` attaches the author's token to every URL. Only `createApi` may call it, and it allows only `https://admin.da.live` and `https://admin.hlx.page`.
- **Targets.** Org, repositories, locales and paths come from `sites.js` and the operation, never from the query string, `postMessage` data, author input or remote sheets. Check `context.org`. One bounded exception: a library plugin may take the page being edited from `context.path` and map it to its other-language counterpart with the same site's `language-switcher` sheet (see `tools/metadata-sync`). It requires `context.repo` to be a registered site, keeps the same repository, validates the path with `sitePath`, stays inside a registered locale folder, and shows the target to the author before any write.
- **Paths.** Validate them with `sitePath` (no `..`, `//`, scheme or spaces). Derive file names with `safeFileName` (lowercase ASCII and an allowed extension).
- **DOM.** Build the UI and edit the DA source with `createElement`, `textContent` and `setAttribute`. Never put author input into `innerHTML` or `insertAdjacentHTML`. Do not write `javascript:` or external URLs unless the operation requires them, and then validate them with an allowlist.
- **Secrets.** Never log or persist tokens, document bodies or file contents (`console`, `localStorage`, URLs).
- **Least privilege.** The tool can only do what the author can do in DA. Do not add service credentials.
- **Limits.** Bound text length (`maxLength`) and file size (`maxBytes`). Use a concurrency of 3 so that the DA and Admin rate limits are respected.

## UX and Accessibility

- Show every target before anything is written: site, language, a link to DA, the planned change, then the result. Never show only "done".
- Keep Write and Publish visually and textually distinct from Analyse and Preview, and put each behind its own confirmation.
- Use labelled controls, `fieldset`/`legend` for the site and language choices, a `role="status"` live region, statuses that use text and not only color, visible focus, and keyboard-only operation.
- State in the tool description what is never overwritten and how to restore a version (DA editor → History).
- Keep the UI language consistent with the existing tools (English), with authored values in their own locale.

## Recovery

- **Wrong text on some pages**: correct the inputs and rerun. Rows are matched by their key and updated.
- **Bad write**: restore the `Before <tool> …` version from the DA history of each affected page, then preview again.
- **Wrong file uploaded**: upload the corrected file under a new name and rerun. Delete the unused file in DA manually.
