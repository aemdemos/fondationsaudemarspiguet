# DA bulk scripts

Node scripts to change many Document Authoring (DA) pages at once through the
DA Admin API (`admin.da.live`). They run locally and are not published with the site.

| Script | Purpose |
| --- | --- |
| `npm run da-bulk:metadata` | Rename, update, add or delete rows of the page `Metadata` block |
| `npm run da-bulk:restore` | Restore the pages written by a previous run |
| `npm run test:da-bulk` | Run the scripts' tests (mocked DA, no network) |

Requires Node 20+ and `npm install` (dependency: `parse5`).

## Safety

- **Dry run by default**: nothing is written without `--apply`. The dry run prints each change.
- Before writing a page, the script:
  1. saves the current HTML in `tools/da-bulk/backups/<run id>/` (git-ignored);
  2. creates a named DA version (`Before bulk metadata update <run id>`), visible in the DA version history;
  3. writes with `If-Match`: if someone edited the page meanwhile, it is left unchanged.
- Each page is all or nothing. Ambiguous pages (several `Metadata` blocks, duplicated keys,
  target key already present) are reported as errors and not modified.
- Only the changed cells are rewritten; the rest of the document is kept byte for byte.
- Writes update DA only. Preview and publish afterwards (see below).

## Authentication

The scripts use your DA (Adobe IMS) token, valid about 24 hours:

1. Open <https://da.live> and sign in.
2. DevTools > Network, filter on `admin.da.live`, select a request.
3. Copy the `Authorization` request header value (without `Bearer `).
4. In the terminal:

   ```sh
   export DA_TOKEN='eyJ...'
   ```

If `DA_TOKEN` is not set, the token cached by `aem content` in `.hlx/.da-token.json` is used.
**Never commit or share the token.**

## Update metadata

Pages are selected with `--page`, `--pages` and/or `--folder` (combinable, deduplicated).
Plain paths need `--repo`; the org defaults to `audemars-piguet`. Sites:
`fondationsaudemarspiguet`, `arbres-fondationsaudemarspiguet`, `biencommun-fondationsaudemarspiguet`.

```sh
# 1. Dry run on a whole folder (recursive)
npm run da-bulk:metadata -- --repo arbres-fondationsaudemarspiguet --folder /fr \
  --rename "Featured=Homepage highlight"

# 2. Same command with --apply, and a JSON report
npm run da-bulk:metadata -- --repo arbres-fondationsaudemarspiguet --folder /fr \
  --rename "Featured=Homepage highlight" --apply --report report.json
```

Operations are repeatable and applied in the order given. Keys are matched like EDS does
(case-insensitive, `Start Date` = `start-date`).

| Operation | Effect |
| --- | --- |
| `--rename "Old=New"` | Renames the key, keeps the value. Not found: page unchanged |
| `--set "Key=Value"` | Replaces the value, or adds the row if missing |
| `--add "Key=Value"` | Adds the row only if the key is missing |
| `--delete "Key"` | Deletes every row with this key |

More examples:

```sh
# Several operations on selected pages (DA editor or aem.page URLs)
npm run da-bulk:metadata -- \
  --page "https://da.live/edit#/audemars-piguet/arbres-fondationsaudemarspiguet/fr/projets/foo" \
  --page "https://main--arbres-fondationsaudemarspiguet--audemars-piguet.aem.page/en/projects/bar" \
  --set "Template=project" --delete "Old key" --add "Theme=dark"

# Pages listed in a file (one per line, # for comments)
npm run da-bulk:metadata -- --repo fondationsaudemarspiguet --pages pages.txt --delete "Featured"
```

`--folder` also accepts a DA URL (`https://da.live/#/audemars-piguet/<repo>/fr`); `/` targets the
whole site. Other options: `--concurrency` (1-10, default 4), `--label`, `--backup-dir`, `--help`.

Result statuses: `WOULD CHANGE` / `UPDATED`, `UNCHANGED`, `SKIPPED` (no `Metadata` block),
`ERROR`, `ABORTED` (expired token: remaining pages are not processed).
The exit code is 1 if any page failed. Running the same command again is safe.

## Preview and publish

The script changes the DA source only. Then preview and publish the updated pages with
the DA Bulk app (<https://da.live/apps/bulk>): paste the URLs listed as `UPDATED`
(or from the `--report` file).

## Restore

Each `--apply` run prints its backup folder. To roll it back:

```sh
npm run da-bulk:restore -- tools/da-bulk/backups/<run id>          # dry run
npm run da-bulk:restore -- tools/da-bulk/backups/<run id> --apply
```

Pages edited in DA after the bulk run are skipped, to keep those edits; `--force` restores
them anyway. A single page can also be restored from the DA version history.

## Limitations

- Values are written as plain text (no links or formatting).
- Only the page `Metadata` block is changed; `Section Metadata` blocks are ignored.
- Renaming or deleting a key used by code breaks the feature using it. For example,
  `featured` is read by `blocks/home-projects/home-projects.js` and the query index:
  update the code and index configuration in the same delivery.
