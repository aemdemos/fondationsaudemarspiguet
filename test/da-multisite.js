import {
  applyTarget, createApi, expandTargets, planTarget,
} from '../tools/da-multisite/core.js';
import mountMultisiteTool from '../tools/da-multisite/ui.js';
import createDaMock from './da-mock.js';

const [target] = expandTargets({
  pages: { fr: '/fr/test' }, siteIds: ['fondations'], locales: ['fr'],
});
const key = `${target.org}/${target.repo}${target.path}.html`;
const sourceUrl = `https://admin.da.live/source/${key}`;
const versionUrl = `https://admin.da.live/versionsource/${key}`;
const original = '<body><main><div><h1>Keep this page</h1><div class="metadata"><div><div>Title</div><div>Titre français</div></div><div><div>Start Date</div><div>2025</div></div></div></div></main></body>';
const input = { values: {} };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function fixture({ etags = false, allowContentComparison = true } = {}) {
  const mock = createDaMock({ documents: { [key]: original }, etags });
  const api = createApi(mock.daFetch);
  const operation = {
    title: 'Concurrency test',
    fields: [],
    pages: { fr: target.path },
    siteIds: ['fondations'],
    locales: ['fr'],
    allowContentComparison,
    apply(doc) {
      doc.querySelector('.metadata > div:last-child > div:last-child').textContent = '2026';
      return { summary: 'Start Date = 2026' };
    },
  };
  return {
    mock,
    api,
    operation,
    plan: () => planTarget(api, operation, target, input),
    write: (plan) => applyTarget(api, operation, target, input, plan, 'Before test'),
  };
}

const changed = (html) => html.replace('Titre français', 'Concurrent title');
const puts = (mock) => mock.calls.filter(({ method }) => method === 'PUT');
const tests = [
  ['Missing ETag: analysis is read-only and carries the original source and warning', async () => {
    const f = fixture();
    const plan = await f.plan();
    assert(plan.state === 'ready', 'Analysis was blocked');
    assert(plan.sourceHtml === original && !plan.etag, 'Missing comparison snapshot');
    assert(plan.warning.includes('not atomic'), 'Risk not disclosed');
    assert(
      f.mock.calls.every(({ method, cache }) => method === 'GET' && cache === 'no-store'),
      'Analysis wrote data or used cached reads',
    );
  }],
  ['Other operations still require an ETag unless explicitly opted in', async () => {
    const f = fixture({ allowContentComparison: false });
    assert((await f.plan()).state === 'error', 'Strict analysis allowed a write');
    const result = await f.write({ state: 'ready', sourceHtml: original, html: original });
    assert(
      result.state === 'error' && !f.mock.versions.length && !puts(f.mock).length,
      'Strict apply allowed a write',
    );
  }],
  ['No ETag is needed when the page is already up to date', async () => {
    const f = fixture({ allowContentComparison: false });
    f.mock.edit(key, (html) => html.replace('2025', '2026'));
    assert((await f.plan()).state === 'unchanged', 'No-op was blocked');
  }],
  ['Fallback compares before and after versioning, updates one row and is idempotent', async () => {
    const f = fixture();
    const result = await f.write(await f.plan());
    assert(result.state === 'written', result.message);
    assert(
      f.mock.calls.map(({ method }) => method).join() === 'GET,GET,POST,GET,PUT,GET',
      'Unexpected read/version/write sequence',
    );
    assert(f.mock.calls.filter(({ method }) => method === 'GET')
      .every(({ cache }) => cache === 'no-store'), 'Recheck could use cached content');
    assert(puts(f.mock)[0].ifMatch === null, 'Sent a fake ETag');
    assert(f.mock.versions.length === 1 && f.mock.versions[0].body === original, 'Backup missing');
    assert(f.mock.store.get(key).body === original.replace('2025', '2026'), 'Other rows changed');
    assert((await f.plan()).state === 'unchanged', 'Second analysis was not idempotent');
  }],
  ['Edit after analysis stops before versioning and writing', async () => {
    const f = fixture();
    const plan = await f.plan();
    f.mock.edit(key, changed);
    assert((await f.write(plan)).state === 'conflict', 'Concurrent edit not detected');
    assert(!f.mock.versions.length && !puts(f.mock).length, 'Conflict caused a write');
    assert(f.mock.store.get(key).body === changed(original), 'Concurrent edit was lost');
  }],
  ['Edit during versioning stops before writing', async () => {
    const f = fixture();
    const { createVersion } = f.api;
    f.api.createVersion = async (...args) => {
      const result = await createVersion(...args);
      f.mock.edit(key, changed);
      return result;
    };
    assert((await f.write(await f.plan())).state === 'conflict', 'Second recheck missing');
    assert(f.mock.versions.length === 1 && !puts(f.mock).length, 'Conflict caused a write');
    assert(f.mock.store.get(key).body === changed(original), 'Concurrent edit was lost');
  }],
  ['Missing comparison snapshot never permits a write', async () => {
    const f = fixture();
    const plan = await f.plan();
    delete plan.sourceHtml;
    assert((await f.write(plan)).state === 'error', 'Missing snapshot was accepted');
    assert(!f.mock.versions.length && !puts(f.mock).length, 'Unverified write attempted');
  }],
  ['ETag mode keeps If-Match and does not show the fallback warning', async () => {
    const f = fixture({ etags: true });
    const plan = await f.plan();
    assert(plan.etag && !plan.warning, 'ETag mode was downgraded');
    assert((await f.write(plan)).state === 'written', 'ETag write failed');
    assert(puts(f.mock)[0].ifMatch === plan.etag, 'If-Match was lost');
  }],
  ['ETag conflict remains a conflict without a fallback retry', async () => {
    const f = fixture({ etags: true });
    const plan = await f.plan();
    f.mock.edit(key, changed);
    assert((await f.write(plan)).state === 'conflict', '412 was ignored');
    assert(puts(f.mock).length === 1 && puts(f.mock)[0].ifMatch === plan.etag, 'Write retried');
    assert(f.mock.store.get(key).body === changed(original), 'Concurrent edit was lost');
  }],
  ['An ETag appearing on the final reread is used for the write', async () => {
    const f = fixture();
    const { createVersion } = f.api;
    f.api.createVersion = async (...args) => {
      const result = await createVersion(...args);
      f.mock.setEtags(true);
      return result;
    };
    const expectedEtag = f.mock.store.get(key).etag;
    assert((await f.write(await f.plan())).state === 'written', 'Write failed');
    assert(puts(f.mock)[0].ifMatch === expectedEtag, 'New ETag was not used');
  }],
  ['Permission loss detected by the reread prevents versioning', async () => {
    const f = fixture();
    const plan = await f.plan();
    f.mock.setReadOnly(target.repo);
    assert((await f.write(plan)).state === 'denied', 'Write permission not rechecked');
    assert(!f.mock.versions.length && !puts(f.mock).length, 'Read-only page was written');
  }],
  ['Failed backup prevents writing', async () => {
    const f = fixture();
    f.mock.fail('POST', versionUrl, 500);
    assert((await f.write(await f.plan())).state === 'error', 'Version failure ignored');
    assert(!puts(f.mock).length, 'Wrote without backup');
  }],
  ['Failed PUT is reported without retry', async () => {
    const f = fixture();
    f.mock.fail('PUT', sourceUrl, 500);
    assert((await f.write(await f.plan())).state === 'error', 'PUT failure hidden');
    assert(puts(f.mock).length === 1 && f.mock.store.get(key).body === original, 'Unexpected retry');
  }],
  ['Verification failure is not reported as success', async () => {
    const f = fixture();
    const { putDocument } = f.api;
    f.api.putDocument = async (...args) => {
      const result = await putDocument(...args);
      f.mock.edit(key, (html) => html.replace('2026', '2027'));
      return result;
    };
    const result = await f.write(await f.plan());
    assert(result.state === 'error' && result.message.includes('verification'), 'Failure hidden');
  }],
];

[
  [401, 'denied'], [403, 'denied'], [404, 'missing'], [500, 'error'],
].forEach(([status, state]) => {
  [false, true].forEach((afterVersion) => {
    tests.push([`HTTP ${status} on ${afterVersion ? 'final' : 'first'} reread prevents PUT`, async () => {
      const f = fixture();
      const plan = await f.plan();
      if (afterVersion) {
        const { createVersion } = f.api;
        f.api.createVersion = async (...args) => {
          const result = await createVersion(...args);
          f.mock.fail('GET', sourceUrl, status);
          return result;
        };
      } else {
        f.mock.fail('GET', sourceUrl, status);
      }
      assert((await f.write(plan)).state === state, 'HTTP error mapped incorrectly');
      assert(!puts(f.mock).length, 'Wrote after failed reread');
    }]);
  });
});

async function waitFor(check) {
  const deadline = Date.now() + 4000;
  while (!check()) {
    if (Date.now() > deadline) throw new Error('Timed out waiting for UI');
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => { setTimeout(resolve, 10); });
  }
}

tests.push(['Fallback UI warns in the plan and confirmation; Cancel writes nothing', async () => {
  const f = fixture();
  const root = document.createElement('div');
  document.querySelector('#fixtures').append(root);
  try {
    await mountMultisiteTool({
      sdk: Promise.resolve({
        context: { org: target.org }, actions: { daFetch: f.mock.daFetch },
      }),
      operation: f.operation,
      root,
    });
    root.querySelector('button').click();
    await waitFor(() => root.querySelector('.dams-state-ready'));
    assert(root.querySelector('.dams-results').textContent.includes('not atomic'), 'No plan warning');
    const apply = [...root.querySelectorAll('button')]
      .find((button) => button.textContent === 'Apply changes…');
    apply.click();
    const confirmation = root.querySelector('.dams-confirm');
    assert(confirmation.textContent.includes('not atomic'), 'No confirmation warning');
    assert(
      confirmation.querySelector('button').textContent === 'Write with content comparison',
      'Fallback confirmation is not explicit',
    );
    confirmation.querySelectorAll('button')[1].click();
    assert(!puts(f.mock).length && !f.mock.versions.length, 'Cancel wrote data');
    apply.click();
    root.querySelector('.dams-confirm button').click();
    await waitFor(() => root.querySelector('.dams-state-written'));
    assert(f.mock.versions.length === 1 && puts(f.mock).length === 1, 'Wrong write count');
  } finally {
    root.remove();
  }
}]);

let failures = 0;
await tests.reduce(async (previous, [name, run]) => {
  await previous;
  const item = document.createElement('li');
  try {
    await run();
    item.textContent = `PASS: ${name}`;
  } catch (error) {
    failures += 1;
    item.textContent = `FAIL: ${name}: ${error.message}`;
  }
  document.querySelector('#results').append(item);
}, Promise.resolve());
document.querySelector('#summary').textContent = `${tests.length - failures}/${tests.length} passed`;
document.body.dataset.testStatus = failures ? 'failed' : 'passed';
