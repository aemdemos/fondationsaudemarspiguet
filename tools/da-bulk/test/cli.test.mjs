import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  after, before, describe, it,
} from 'node:test';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const TOOL_DIR = dirname(TEST_DIR);
const MOCK = join(TEST_DIR, 'support', 'mock-da-fetch.mjs');

const SITE = 'audemars-piguet/arbres-fondationsaudemarspiguet';
const row = (key, value) => `<div><div><p>${key}</p></div><div><p>${value}</p></div></div>`;
const page = (rows) => `<body><header></header><main><div><p>Text</p></div><div><div class="metadata">${rows}</div></div></main><footer></footer></body>`;

const ORIGINAL = {
  [`${SITE}/fr/projets/a.html`]: page(row('Title', 'A') + row('Featured', 'oui')),
  [`${SITE}/fr/projets/sub/b.html`]: page(row('Featured', 'oui')),
  [`${SITE}/fr/projets/c.html`]: page(row('Title', 'C')),
  [`${SITE}/fr/projets/d.html`]: '<body><main><div><p>No metadata</p></div></main></body>',
  [`${SITE}/fr/projets/e.html`]: page(row('Featured', 'oui')),
  [`${SITE}/en/x.html`]: page(row('Featured', 'yes')),
};

let work;
let stateFile;
const readState = () => JSON.parse(readFileSync(stateFile, 'utf8'));
const writeState = (state) => writeFileSync(stateFile, JSON.stringify(state));

function run(script, args, { token = 'test-token' } = {}) {
  const env = { ...process.env, MOCK_DA_STATE: stateFile };
  delete env.DA_TOKEN;
  if (token) env.DA_TOKEN = token;
  const result = spawnSync(process.execPath, ['--import', MOCK, join(TOOL_DIR, script), ...args], {
    cwd: work, env, encoding: 'utf8',
  });
  return { code: result.status, out: result.stdout + result.stderr };
}

const updateArgs = (...extra) => [
  '--repo', 'arbres-fondationsaudemarspiguet',
  '--folder', '/fr/projets',
  '--rename', 'Featured=Homepage highlight',
  '--backup-dir', join(work, 'backups'),
  ...extra,
];

describe('update-metadata / restore-backup CLI', () => {
  before(() => {
    work = mkdtempSync(join(tmpdir(), 'da-bulk-'));
    stateFile = join(work, 'state.json');
    writeState({
      docs: Object.fromEntries(Object.entries(ORIGINAL).map(([key, html]) => [key, { html, etag: '"1"' }])),
      log: [],
      failPut: [`${SITE}/fr/projets/e.html`],
    });
  });
  after(() => rmSync(work, { recursive: true, force: true }));

  it('requires a token', () => {
    const { code, out } = run('update-metadata.mjs', updateArgs(), { token: '' });
    assert.equal(code, 1);
    assert.match(out, /No DA token/);
  });

  it('stops after an authentication error', () => {
    const { code, out } = run('update-metadata.mjs', ['--page', `https://da.live/edit#/${SITE}/en/x`, '--rename', 'a=b'], { token: 'wrong' });
    assert.equal(code, 1);
    assert.match(out, /HTTP 401/);
  });

  it('dry run reports without writing', () => {
    const { code, out } = run('update-metadata.mjs', updateArgs('--report', join(work, 'dry.json')));
    assert.equal(code, 0, out);
    assert.match(out, /DRY RUN/);
    assert.match(out, /Pages: 5/);
    assert.match(out, /\[WOULD CHANGE\] .*\/fr\/projets\/a\n {4}rename "Featured" -> "Homepage highlight" \(value: "oui"\)/);
    assert.match(out, /\[WOULD CHANGE\] .*\/fr\/projets\/sub\/b/);
    assert.match(out, /\[UNCHANGED\] .*\/fr\/projets\/c\n {4}\("Featured" not found\)/);
    assert.match(out, /\[SKIPPED\] .*\/fr\/projets\/d\n {4}no Metadata block/);

    const state = readState();
    assert.equal(state.log.filter((line) => !line.startsWith('GET')).length, 0);
    assert.equal(state.docs[`${SITE}/fr/projets/a.html`].html, ORIGINAL[`${SITE}/fr/projets/a.html`]);
    assert.equal(JSON.parse(readFileSync(join(work, 'dry.json'), 'utf8')).results.length, 5);
    assert.equal(existsSync(join(work, 'backups')), false);
  });

  it('applies with versions, backups and per-page errors', () => {
    const { code, out } = run('update-metadata.mjs', updateArgs('--apply'));
    assert.equal(code, 1, out);
    assert.match(out, /\[UPDATED\] .*\/fr\/projets\/a/);
    assert.match(out, /\[UPDATED\] .*\/fr\/projets\/sub\/b/);
    assert.match(out, /\[ERROR\] .*\/fr\/projets\/e\n.*\n {4}write failed \(HTTP 500\)/);

    const { docs, versions } = readState();
    const a = `${SITE}/fr/projets/a.html`;
    assert.equal(docs[a].html, ORIGINAL[a].replace('<p>Featured</p>', '<p>Homepage highlight</p>'));
    assert.equal(docs[`${SITE}/fr/projets/c.html`].html, ORIGINAL[`${SITE}/fr/projets/c.html`]);
    assert.equal(docs[`${SITE}/en/x.html`].html, ORIGINAL[`${SITE}/en/x.html`]);
    assert.deepEqual(versions.map(({ key }) => key).sort(), [a, `${SITE}/fr/projets/e.html`, `${SITE}/fr/projets/sub/b.html`]);
    assert.match(versions[0].label, /^Before bulk metadata update /);

    const [runDir] = readdirSync(join(work, 'backups'));
    const manifest = JSON.parse(readFileSync(join(work, 'backups', runDir, 'manifest.json'), 'utf8'));
    assert.deepEqual(manifest.pages.map(({ path }) => path).sort(), ['/fr/projets/a', '/fr/projets/sub/b']);
    assert.equal(readFileSync(join(work, 'backups', runDir, `${a}`), 'utf8'), ORIGINAL[a]);
  });

  it('is idempotent on a second run', () => {
    const state = readState();
    state.failPut = [];
    writeState(state);
    const { out } = run('update-metadata.mjs', updateArgs());
    assert.match(out, /\[UNCHANGED\] .*\/fr\/projets\/a/);
    assert.match(out, /\[WOULD CHANGE\] .*\/fr\/projets\/e/);
  });

  it('refuses to write if the page changes during the run (If-Match)', () => {
    const target = { org: 'audemars-piguet', repo: 'arbres-fondationsaudemarspiguet', path: '/fr/projets/e' };
    const result = spawnSync(process.execPath, ['--import', MOCK, '--input-type=module', '-e', `
      const { createDaClient } = await import(${JSON.stringify(join(TOOL_DIR, 'lib', 'da-client.mjs'))});
      const put = await createDaClient('test-token').putSource(${JSON.stringify(target)}, '<body></body>', '"stale"');
      console.log(put.status);
    `], { env: { ...process.env, MOCK_DA_STATE: stateFile }, encoding: 'utf8' });
    assert.equal(result.stdout.trim(), '412');
  });

  it('restores only pages untouched since the run, unless forced', () => {
    const [runDir] = readdirSync(join(work, 'backups'));
    const backup = join(work, 'backups', runDir);
    const b = `${SITE}/fr/projets/sub/b.html`;
    const a = `${SITE}/fr/projets/a.html`;

    const state = readState();
    state.docs[b] = { html: `${state.docs[b].html}<!-- edited -->`, etag: '"9"' };
    writeState(state);

    const dry = run('restore-backup.mjs', [backup]);
    assert.equal(dry.code, 0, dry.out);
    assert.match(dry.out, /\[WOULD RESTORE\] .*\/fr\/projets\/a/);
    assert.match(dry.out, /\[SKIPPED\] .*\/fr\/projets\/sub\/b\n {4}edited in DA after the bulk run/);
    assert.notEqual(readState().docs[a].html, ORIGINAL[a]);

    const applied = run('restore-backup.mjs', [backup, '--apply']);
    assert.equal(applied.code, 0, applied.out);
    assert.equal(readState().docs[a].html, ORIGINAL[a]);
    assert.notEqual(readState().docs[b].html, ORIGINAL[b]);

    const forced = run('restore-backup.mjs', [backup, '--apply', '--force']);
    assert.match(forced.out, /\[UNCHANGED\] .*\/fr\/projets\/a/);
    assert.match(forced.out, /\[RESTORED\] .*\/fr\/projets\/sub\/b/);
    assert.equal(readState().docs[b].html, ORIGINAL[b]);
  });

  it('accepts page URLs and page list files', () => {
    const list = join(work, 'pages.txt');
    writeFileSync(list, '# pages\nhttps://main--arbres-fondationsaudemarspiguet--audemars-piguet.aem.page/en/x\n/fr/projets/c\n');
    const { code, out } = run('update-metadata.mjs', [
      '--repo', 'arbres-fondationsaudemarspiguet',
      '--pages', list,
      '--page', `https://da.live/edit#/${SITE}/en/x`,
      '--set', 'Theme=dark',
    ]);
    assert.equal(code, 0, out);
    assert.match(out, /Pages: 2/);
    assert.match(out, /add "Theme" = "dark"/);
  });
});
