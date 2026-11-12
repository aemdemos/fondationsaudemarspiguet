#!/usr/bin/env node
/**
 * Restores the pages written by a bulk run from its backup folder.
 * Dry run by default; pass --apply to write. See tools/da-bulk/README.md.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { createDaClient, loadToken, mapWithConcurrency } from './lib/da-client.mjs';
import { targetId } from './lib/targets.mjs';

const HELP = `Restore the pages written by a bulk run (dry run unless --apply).

Usage:
  npm run da-bulk:restore -- <backup folder> [--apply] [--force]

  --apply   Write the backups to DA
  --force   Also restore pages edited in DA after the bulk run (their later edits are lost)`;

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      apply: { type: 'boolean', default: false },
      force: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
  });
  if (values.help || positionals.length !== 1) {
    console.log(HELP);
    return values.help ? 0 : 1;
  }

  const backupDir = positionals[0];
  const manifest = JSON.parse(readFileSync(join(backupDir, 'manifest.json'), 'utf8'));
  const { token } = loadToken();
  const client = createDaClient(token);
  const label = `Before bulk metadata restore ${new Date().toISOString().replace(/[:.]/g, '-')}`;

  console.log(`Mode: ${values.apply ? 'APPLY (writes to DA)' : 'DRY RUN (no write, add --apply to write)'}`);
  console.log(`Pages: ${manifest.pages.length}\n`);

  const results = await mapWithConcurrency(manifest.pages, 4, async (entry) => {
    const page = targetId(entry);
    const report = (status, message) => {
      console.log(`[${status}] ${page}${message ? `\n    ${message}` : ''}`);
      return status;
    };
    try {
      const backup = readFileSync(join(backupDir, entry.backup), 'utf8');
      const current = await client.getSource(entry);
      if (current.status !== 200) return report('ERROR', `HTTP ${current.status}`);
      if (current.html === backup) return report('UNCHANGED', 'already identical to the backup');
      if (sha256(current.html) !== entry.afterSha256 && !values.force) {
        return report('SKIPPED', 'edited in DA after the bulk run; use --force to overwrite');
      }
      if (!values.apply) return report('WOULD RESTORE');

      const version = await client.createVersion(entry, label);
      if (!version.ok) return report('ERROR', `version not created (HTTP ${version.status}), page left unchanged`);
      const written = await client.putSource(entry, backup, current.etag);
      if (!written.ok) return report('ERROR', `write failed (HTTP ${written.status})`);
      return report('RESTORED');
    } catch (error) {
      return report('ERROR', error.message);
    }
  });

  return results.includes('ERROR') ? 1 : 0;
}

main()
  .then((code) => { process.exitCode = code; })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
