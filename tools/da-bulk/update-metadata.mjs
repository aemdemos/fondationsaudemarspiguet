#!/usr/bin/env node
/**
 * Bulk update of the page `Metadata` block of DA documents.
 * Dry run by default; pass --apply to write. See tools/da-bulk/README.md.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import {
  dirname, join, relative, resolve,
} from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { applyMetadataOperations, OPERATION_TYPES, parseOperation } from './lib/metadata-block.mjs';
import { createDaClient, loadToken, mapWithConcurrency } from './lib/da-client.mjs';
import {
  dedupeTargets, parseFolderRef, parsePageList, parsePageRef, targetId,
} from './lib/targets.mjs';

const TOOL_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ORG = 'audemars-piguet';

const HELP = `Bulk update of the DA "Metadata" block (dry run unless --apply).

Usage:
  npm run da-bulk:metadata -- [pages] [operations] [options]

Pages (combinable):
  --page <ref>          DA editor URL, aem.page/aem.live URL or path (repeatable)
  --pages <file>        File with one page reference per line (# for comments)
  --folder <ref>        Every document below a folder, recursively (repeatable)

Operations (repeatable, applied in the given order, keys are case-insensitive):
  --rename "Old=New"    Rename a key, keeping its value
  --set "Key=Value"     Update a value, or add the row if the key is missing
  --add "Key=Value"     Add a row only if the key is missing
  --delete "Key"        Delete the row(s) with this key

Options:
  --org <org>           DA org for plain paths (default: ${DEFAULT_ORG})
  --repo <repo>         DA repo (site) for plain paths, e.g. arbres-fondationsaudemarspiguet
  --apply               Write the changes (otherwise dry run)
  --concurrency <n>     Pages processed in parallel, 1-10 (default: 4)
  --report <file>       Write a JSON report
  --label <text>        DA version label created before each write
  --backup-dir <dir>    Backup root (default: tools/da-bulk/backups)
  --help                Show this help

Authentication: DA_TOKEN environment variable (see README).`;

function parseCli(argv) {
  const { values, tokens } = parseArgs({
    args: argv,
    tokens: true,
    options: {
      page: { type: 'string', multiple: true },
      pages: { type: 'string', multiple: true },
      folder: { type: 'string', multiple: true },
      rename: { type: 'string', multiple: true },
      set: { type: 'string', multiple: true },
      add: { type: 'string', multiple: true },
      delete: { type: 'string', multiple: true },
      org: { type: 'string', default: DEFAULT_ORG },
      repo: { type: 'string' },
      apply: { type: 'boolean', default: false },
      concurrency: { type: 'string', default: '4' },
      report: { type: 'string' },
      label: { type: 'string' },
      'backup-dir': { type: 'string', default: join(TOOL_DIR, 'backups') },
      help: { type: 'boolean', default: false },
    },
  });

  // tokens keep the command-line order, which matters for chained operations
  const operations = tokens
    .filter((token) => token.kind === 'option' && OPERATION_TYPES.includes(token.name))
    .map((token) => parseOperation(token.name, token.value));

  const concurrency = Number(values.concurrency);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 10) {
    throw new Error('--concurrency must be an integer between 1 and 10');
  }

  return { ...values, operations, concurrency };
}

async function resolveTargets(options, client) {
  const defaults = { org: options.org, repo: options.repo };
  const refs = [
    ...(options.page || []),
    ...(options.pages || []).flatMap((file) => parsePageList(readFileSync(file, 'utf8'))),
  ];
  const pages = refs.map((ref) => parsePageRef(ref, defaults));

  const folders = (options.folder || []).map((ref) => parseFolderRef(ref, defaults));
  const listed = await folders.reduce(async (acc, folder) => {
    const documents = await client.listDocuments(folder);
    console.log(`Listed ${documents.length} document(s) in ${folder.org}/${folder.repo}${folder.path || '/'}`);
    return [...await acc, ...documents];
  }, Promise.resolve([]));

  return dedupeTargets([...pages, ...listed]);
}

const describeOperation = (op) => {
  if (op.type === 'rename') return `rename "${op.from}" -> "${op.to}"`;
  if (op.type === 'delete') return `delete "${op.key}"`;
  return `${op.type} "${op.key}" = "${op.value}"`;
};

const httpError = (status) => {
  if (status === 401) return 'HTTP 401: token missing, invalid or expired';
  if (status === 403) return 'HTTP 403: no permission on this page';
  if (status === 404) return 'HTTP 404: page not found in DA';
  return `HTTP ${status}`;
};

const LABELS = {
  changed: 'WOULD CHANGE',
  updated: 'UPDATED',
  unchanged: 'UNCHANGED',
  skipped: 'SKIPPED',
  error: 'ERROR',
  aborted: 'ABORTED',
};

function printResult(result) {
  console.log(`[${LABELS[result.status]}] ${result.page}`);
  result.changes.forEach((change) => console.log(`    ${change}`));
  result.notes.forEach((note) => console.log(`    (${note})`));
  if (result.error) console.log(`    ${result.error}`);
}

async function main() {
  const options = parseCli(process.argv.slice(2));
  if (options.help) {
    console.log(HELP);
    return 0;
  }
  if (options.operations.length === 0) throw new Error('No operation. Use --rename, --set, --add or --delete (see --help).');

  const { token, source, expiresAt } = loadToken();
  const client = createDaClient(token);
  const targets = await resolveTargets(options, client);
  if (targets.length === 0) throw new Error('No page. Use --page, --pages or --folder (see --help).');

  const runId = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = join(resolve(options['backup-dir']), runId);
  const label = options.label || `Before bulk metadata update ${runId}`;
  const manifest = {
    createdAt: new Date().toISOString(), operations: options.operations, label, pages: [],
  };

  console.log(`Mode: ${options.apply ? 'APPLY (writes to DA)' : 'DRY RUN (no write, add --apply to write)'}`);
  console.log(`Token: ${source}${expiresAt ? `, expires ${new Date(expiresAt).toISOString()}` : ''}`);
  console.log(`Pages: ${targets.length}`);
  console.log(`Operations: ${options.operations.map(describeOperation).join(' | ')}\n`);

  let aborted = false;

  const processPage = async (target) => {
    const page = targetId(target);
    const base = {
      page, changes: [], notes: [],
    };
    if (aborted) return { ...base, status: 'aborted', error: 'stopped after an authentication error' };

    const current = await client.getSource(target);
    if (current.status !== 200) {
      if (current.status === 401) aborted = true;
      return { ...base, status: 'error', error: httpError(current.status) };
    }

    const result = applyMetadataOperations(current.html, options.operations);
    const summary = {
      ...base,
      status: result.status,
      changes: result.changes,
      notes: result.notes,
      error: result.error,
    };
    if (!options.apply || result.status !== 'changed') return summary;

    const backupFile = join(backupDir, `${page}.html`);
    mkdirSync(dirname(backupFile), { recursive: true });
    writeFileSync(backupFile, current.html);

    const version = await client.createVersion(target, label);
    if (!version.ok) {
      const error = `version not created (${httpError(version.status)}), page left unchanged`;
      return { ...summary, status: 'error', error };
    }

    const written = await client.putSource(target, result.html, current.etag);
    if (written.status === 412) {
      return { ...summary, status: 'error', error: 'page modified in DA during the run, left unchanged: run again' };
    }
    if (!written.ok) return { ...summary, status: 'error', error: `write failed (${httpError(written.status)})` };

    manifest.pages.push({
      ...target,
      backup: relative(backupDir, backupFile),
      afterSha256: createHash('sha256').update(result.html).digest('hex'),
    });
    writeFileSync(join(backupDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    return { ...summary, status: 'updated' };
  };

  const results = await mapWithConcurrency(targets, options.concurrency, async (target) => {
    let result;
    try {
      result = await processPage(target);
    } catch (error) {
      result = {
        page: targetId(target), status: 'error', changes: [], notes: [], error: error.message,
      };
    }
    printResult(result);
    return result;
  });

  const counts = results.reduce(
    (acc, { status }) => ({ ...acc, [status]: (acc[status] || 0) + 1 }),
    {},
  );
  const summaryLine = Object.entries(counts).map(([status, n]) => `${LABELS[status]}: ${n}`).join(', ');
  console.log(`\nSummary: ${summaryLine}`);

  if (manifest.pages.length > 0) {
    console.log(`Backups: ${relative(process.cwd(), backupDir)}`);
    console.log('Next: preview/publish the updated pages with https://da.live/apps/bulk');
  }
  if (options.report) {
    writeFileSync(resolve(options.report), `${JSON.stringify({ ...manifest, apply: options.apply, results }, null, 2)}\n`);
    console.log(`Report: ${options.report}`);
  }

  return results.some(({ status }) => ['error', 'aborted'].includes(status)) ? 1 : 0;
}

main()
  .then((code) => { process.exitCode = code; })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
