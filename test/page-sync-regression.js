import {
  aemStep, applyTarget, expandTargets, planTarget,
} from '../tools/da-multisite/core.js';
import mountMultisiteTool from '../tools/da-multisite/ui.js';
import createPageOperation from '../tools/page-sync/operation.js';
import createMetadataOperation from '../tools/metadata-sync/operation.js';
import createFixture from './page-sync-fixture.js';

const realFetch = window.fetch.bind(window);
window.fetch = (url, init) => (/\.aem\.(page|live)\//.test(String(url))
  ? Promise.resolve(new Response(null, { status: 404 }))
  : realFetch(url, init));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function configure(fixture, factory = createPageOperation) {
  const operation = factory();
  const configured = { ...operation, ...await operation.setup(fixture) };
  const [target] = expandTargets(configured);
  return { operation: configured, target };
}

async function analyse(fixture, configured, row = 'start-date') {
  const { operation, target } = configured;
  const input = {
    values: { row }, shared: await operation.load({ api: fixture.api, input: { row } }),
  };
  const plan = await planTarget(fixture.api, operation, target, input);
  return {
    plan,
    write: () => applyTarget(fixture.api, operation, target, input, plan, 'Before test'),
  };
}

const puts = (fixture) => fixture.mock.calls.filter(({ method }) => method === 'PUT');
const tests = [];

['fondations', 'arbres', 'biencommun'].forEach((siteId) => {
  ['en', 'fr'].forEach((locale) => {
    ['news', 'project'].forEach((kind) => {
      tests.push([`${siteId} ${locale} ${kind}: exact copy, conditional creation and idempotency`, async () => {
        const fixture = createFixture({ siteId, locale, kind });
        const configured = await configure(fixture);
        assert(configured.target.path === fixture.targetPath, 'Wrong automatic path');
        const run = await analyse(fixture, configured);
        assert(run.plan.state === 'ready' && run.plan.mode === 'create', 'Creation not ready');
        assert(run.plan.html === fixture.sourceHtml, 'Source was transformed');
        assert(run.plan.warning.includes('translate'), 'Translation reminder missing');
        assert(!puts(fixture).length && !fixture.mock.versions.length, 'Analysis wrote data');
        assert((await run.write()).state === 'created', 'Creation failed');
        assert(fixture.mock.store.get(fixture.targetKey).body === fixture.sourceHtml, 'Copy differs');
        assert(fixture.mock.store.get(fixture.sourceKey).body === fixture.sourceHtml, 'Source changed');
        assert(puts(fixture).length === 1 && puts(fixture)[0].ifNoneMatch === '*', 'No create-only guard');
        assert(!fixture.mock.versions.length, 'Version attempted for a nonexistent page');
        const repeated = await analyse(fixture, configured);
        assert(repeated.plan.state === 'existing', 'Existing page not preserved');
        await repeated.write();
        assert(puts(fixture).length === 1, 'Second run overwrote the page');
      }]);
    });
  });
});

tests.push(
  ['Explicit page mapping takes precedence over the same-slug folder fallback', async () => {
    const fixture = createFixture({ mappedSlug: true });
    const configured = await configure(fixture);
    assert(configured.target.path === fixture.targetPath, 'Exact mapping not used');
    assert((await (await analyse(fixture, configured)).write()).state === 'created', 'Create failed');
  }],
  ['Missing language-switcher uses the known article folders with a warning', async () => {
    const fixture = createFixture({ missingSheet: true });
    const configured = await configure(fixture);
    assert(configured.target.path === fixture.targetPath, 'Wrong fallback folder');
    assert(configured.operation.description.includes('sheet unavailable'), 'Missing-sheet warning lost');
  }],
  ['An incomplete page mapping falls back to the known folder and same slug', async () => {
    const fixture = createFixture();
    fixture.mock.edit(fixture.sheetKey, (json) => {
      const sheet = JSON.parse(json);
      sheet['language-switcher'].data.push({
        en: fixture.sourcePath.slice(3), fr: '',
      });
      return JSON.stringify(sheet);
    });
    assert((await configure(fixture)).target.path === fixture.targetPath, 'Blank target broke fallback');
  }],
  ['A source without a metadata block can still be copied in full', async () => {
    const fixture = createFixture();
    fixture.mock.edit(fixture.sourceKey, (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      doc.querySelector('.metadata').remove();
      return doc.body.outerHTML;
    });
    const snapshot = fixture.mock.store.get(fixture.sourceKey).body;
    const run = await analyse(fixture, await configure(fixture));
    assert((await run.write()).state === 'created', 'Missing source metadata blocked creation');
    assert(fixture.mock.store.get(fixture.targetKey).body === snapshot, 'Copy changed source content');
  }],
  ['An empty or invalid saved source cannot create a page', async () => {
    const fixture = createFixture();
    const configured = await configure(fixture);
    fixture.mock.edit(fixture.sourceKey, () => '<p>Not a saved DA page</p>');
    let failed = false;
    try { await analyse(fixture, configured); } catch { failed = true; }
    assert(failed && !puts(fixture).length, 'Invalid source accepted');
  }],
  ['A page appearing before analysis is never overwritten', async () => {
    const fixture = createFixture();
    const configured = await configure(fixture);
    fixture.mock.store.set(fixture.targetKey, { body: fixture.targetHtml, etag: '"other"' });
    const run = await analyse(fixture, configured);
    assert(run.plan.state === 'existing', 'Existing target not detected');
    await run.write();
    assert(!puts(fixture).length, 'Existing target was written');
  }],
  ['A page appearing after analysis produces 412 without overwrite or retry', async () => {
    const fixture = createFixture();
    const run = await analyse(fixture, await configure(fixture));
    fixture.mock.store.set(fixture.targetKey, { body: fixture.targetHtml, etag: '"other"' });
    assert((await run.write()).state === 'conflict', 'Create race not detected');
    assert(fixture.mock.store.get(fixture.targetKey).body === fixture.targetHtml, 'Other page lost');
    assert(puts(fixture).length === 1 && puts(fixture)[0].ifNoneMatch === '*', 'Unprotected retry');
  }],
  ['Analysis re-reads the saved source and writing uses that exact snapshot', async () => {
    const fixture = createFixture();
    const configured = await configure(fixture);
    fixture.mock.edit(fixture.sourceKey, (html) => html.replace('Original title', 'Latest title'));
    const run = await analyse(fixture, configured);
    fixture.mock.edit(fixture.sourceKey, (html) => html.replace('Latest title', 'Next edit'));
    assert((await run.write()).state === 'created', 'Creation failed');
    assert(fixture.mock.store.get(fixture.targetKey).body
      === fixture.sourceHtml.replace('Original title', 'Latest title'), 'Wrong source snapshot');
  }],
  ['Read-only site cannot create a missing page', async () => {
    const fixture = createFixture();
    fixture.mock.setReadOnly(fixture.context.repo);
    const run = await analyse(fixture, await configure(fixture));
    assert((await run.write()).state === 'denied', 'Write permission ignored');
    assert(!fixture.mock.store.has(fixture.targetKey), 'Read-only page created');
  }],
  ['Failed creation verification is explicit', async () => {
    const fixture = createFixture();
    const { createDocument } = fixture.api;
    fixture.api.createDocument = async (...args) => {
      const result = await createDocument(...args);
      fixture.mock.edit(fixture.targetKey, (html) => html.replace('Original title', 'Other title'));
      return result;
    };
    const run = await analyse(fixture, await configure(fixture));
    const result = await run.write();
    assert(result.state === 'error' && result.message.includes('verification'), 'Failure hidden');
  }],
  ['Failed creation is reported without retry', async () => {
    const fixture = createFixture();
    const run = await analyse(fixture, await configure(fixture));
    fixture.mock.fail('PUT', `https://admin.da.live/source/${fixture.targetKey}`, 500);
    assert((await run.write()).state === 'error', 'Creation error hidden');
    assert(puts(fixture).length === 1 && !fixture.mock.store.has(fixture.targetKey), 'Unexpected retry');
  }],
  ['Failed verification read is reported after successful creation', async () => {
    const fixture = createFixture();
    const { createDocument } = fixture.api;
    fixture.api.createDocument = async (...args) => {
      const result = await createDocument(...args);
      fixture.mock.fail('GET', `https://admin.da.live/source/${fixture.targetKey}`, 503);
      return result;
    };
    const run = await analyse(fixture, await configure(fixture));
    const result = await run.write();
    assert(result.state === 'error' && result.message.includes('503'), 'Read failure hidden');
  }],
  ['Source read failure cannot create a page', async () => {
    const fixture = createFixture();
    const configured = await configure(fixture);
    fixture.mock.fail('GET', `https://admin.da.live/source/${fixture.sourceKey}`, 404);
    let failed = false;
    try { await analyse(fixture, configured); } catch { failed = true; }
    assert(failed && !puts(fixture).length, 'Missing source accepted');
  }],
  ['Prefixed .html context path is supported', async () => {
    const fixture = createFixture();
    fixture.context.path = `/${fixture.context.org}/${fixture.context.repo}${fixture.sourcePath}.html`;
    assert((await configure(fixture)).target.path === fixture.targetPath, 'Context not normalized');
  }],
);

['en', 'fr'].forEach((locale) => {
  tests.push([`Existing ${locale} counterpart offers metadata sync, not full replacement`, async () => {
    const fixture = createFixture({ exists: true, locale });
    const configured = await configure(fixture);
    assert(!configured.operation.create, 'Existing page offered full copy');
    assert(configured.operation.fields[0].name === 'row', 'Metadata selector missing');
    const run = await analyse(fixture, configured);
    assert(run.plan.warning.includes('not atomic'), 'Missing-ETag warning lost');
    assert((await run.write()).state === 'written', 'Metadata sync failed');
    assert(
      fixture.mock.store.get(fixture.targetKey).body.includes('Existing translated title'),
      'Existing translation was overwritten',
    );
    assert(fixture.mock.store.get(fixture.targetKey).body.includes('2026'), 'Selected row unchanged');
    assert(fixture.mock.versions.length === 1, 'Existing page not backed up');
    assert((await analyse(fixture, configured)).plan.state === 'unchanged', 'Not idempotent');
  }]);
});

[
  '/en/media-newsroom',
  '/en/fondation-pour-les-arbres-projects',
  '/en/fondation-pour-les-arbres-projects/index',
  '/de/fondation-pour-les-arbres-projects/new-article',
].forEach((path) => {
  tests.push([`Reject unsupported source ${path}`, async () => {
    const fixture = createFixture();
    fixture.context.path = path;
    let failed = false;
    try { await configure(fixture); } catch { failed = true; }
    assert(failed && !puts(fixture).length, 'Unsupported path accepted');
  }]);
});

[401, 403, 500].forEach((status) => {
  tests.push([`Target HTTP ${status} is not treated as an absent page`, async () => {
    const fixture = createFixture();
    fixture.mock.fail('GET', `https://admin.da.live/source/${fixture.targetKey}`, status);
    let failed = false;
    try { await configure(fixture); } catch { failed = true; }
    assert(failed && !puts(fixture).length, 'Target error ignored');
  }]);
});

['org', 'repo'].forEach((field) => {
  tests.push([`Unknown ${field} is rejected`, async () => {
    const fixture = createFixture();
    fixture.context[field] = 'outside-the-registry';
    let failed = false;
    try { await configure(fixture); } catch { failed = true; }
    assert(failed && !puts(fixture).length, 'Unregistered target accepted');
  }]);
});

tests.push(
  ['A mapped path outside the matching article folder is rejected', async () => {
    const fixture = createFixture();
    fixture.mock.edit(fixture.sheetKey, (json) => {
      const sheet = JSON.parse(json);
      sheet['language-switcher'].data[0].fr = '/other';
      return JSON.stringify(sheet);
    });
    let failed = false;
    try { await configure(fixture); } catch { failed = true; }
    assert(failed && !puts(fixture).length, 'Unsafe destination accepted');
  }],
  ['Metadata sync remains usable independently, including a preset', async () => {
    const fixture = createFixture({ exists: true });
    const configured = await configure(fixture, () => createMetadataOperation({ preset: 'Start Date' }));
    assert(configured.operation.fields[0].options.length === 1, 'Preset behavior changed');
    assert((await (await analyse(fixture, configured)).write()).state === 'written', 'Metadata failed');
  }],
  ['New pages can be previewed, then published explicitly', async () => {
    const fixture = createFixture();
    const configured = await configure(fixture);
    const run = await analyse(fixture, configured);
    await run.write();
    assert(!fixture.mock.aem.preview.size && !fixture.mock.aem.live.size, 'Automatic publication');
    assert((await aemStep(fixture.api, 'preview', configured.target)).state === 'ok', 'Preview failed');
    assert((await aemStep(fixture.api, 'live', configured.target)).state === 'ok', 'Publish failed');
  }],
);

async function waitFor(check) {
  const deadline = Date.now() + 5000;
  while (!check()) {
    if (Date.now() > deadline) throw new Error('Timed out waiting for UI');
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => { setTimeout(resolve, 10); });
  }
}

tests.push(['Creation UI: confirmation, translation reminder and preview-before-publish', async () => {
  const fixture = createFixture();
  const root = document.createElement('div');
  document.querySelector('#fixtures').append(root);
  const button = (text) => [...root.querySelectorAll('button')]
    .find((node) => node.textContent === text);
  try {
    await mountMultisiteTool({
      sdk: Promise.resolve({
        context: fixture.context, actions: { daFetch: fixture.mock.daFetch },
      }),
      operation: createPageOperation(),
      root,
    });
    button('Analyse').click();
    await waitFor(() => root.querySelector('.dams-state-ready'));
    button('Apply changes…').click();
    assert(root.querySelector('.dams-confirm').textContent.includes('translate'), 'No translation warning');
    assert(!root.querySelector('.dams-confirm').textContent.includes('not atomic'), 'Wrong ETag fallback');
    button('Cancel').click();
    assert(!puts(fixture).length, 'Cancel created a page');
    button('Apply changes…').click();
    button('Write in DA').click();
    await waitFor(() => root.querySelector('.dams-state-created'));
    assert(root.querySelector('.dams-results').textContent.includes('translate'), 'Reminder disappeared');
    assert(button('Publish…').disabled && !button('Preview').disabled, 'Incorrect publication gating');
    button('Preview').click();
    await waitFor(() => !button('Publish…').disabled);
    button('Publish…').click();
    assert(root.querySelector('.dams-confirm').textContent.includes('translate'), 'No publish reminder');
    button('Cancel').click();
    assert(!fixture.mock.aem.live.size, 'Cancel published a page');
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
window.fetch = realFetch;
document.querySelector('#summary').textContent = `${tests.length - failures}/${tests.length} passed`;
document.body.dataset.testStatus = failures ? 'failed' : 'passed';
