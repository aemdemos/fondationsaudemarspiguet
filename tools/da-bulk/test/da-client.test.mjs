import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  createDaClient, loadToken, mapWithConcurrency, tokenExpiry,
} from '../lib/da-client.mjs';
import {
  dedupeTargets, parseFolderRef, parsePageList, parsePageRef,
} from '../lib/targets.mjs';

const jwt = (payload) => `x.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.y`;

describe('parsePageRef', () => {
  const defaults = { org: 'audemars-piguet', repo: 'arbres-fondationsaudemarspiguet' };

  it('resolves DA editor URLs', () => {
    assert.deepEqual(
      parsePageRef('https://da.live/edit#/audemars-piguet/biencommun-fondationsaudemarspiguet/fr/projets/foo'),
      { org: 'audemars-piguet', repo: 'biencommun-fondationsaudemarspiguet', path: '/fr/projets/foo' },
    );
  });

  it('resolves aem.page / aem.live URLs and folder indexes', () => {
    assert.deepEqual(
      parsePageRef('https://main--arbres-fondationsaudemarspiguet--audemars-piguet.aem.page/en/media-newsroom?x=1'),
      { ...defaults, path: '/en/media-newsroom' },
    );
    assert.deepEqual(
      parsePageRef('https://main--arbres-fondationsaudemarspiguet--audemars-piguet.aem.live/fr/'),
      { ...defaults, path: '/fr/index' },
    );
  });

  it('resolves DA source URLs and plain paths', () => {
    assert.deepEqual(
      parsePageRef('https://admin.da.live/source/audemars-piguet/arbres-fondationsaudemarspiguet/fr/a.html'),
      { ...defaults, path: '/fr/a' },
    );
    assert.deepEqual(parsePageRef('fr/a.html', defaults), { ...defaults, path: '/fr/a' });
  });

  it('rejects unsafe or unresolvable references', () => {
    assert.throws(() => parsePageRef('/fr/a'), /--org and --repo/);
    assert.throws(() => parsePageRef('/fr/../a', defaults), /Invalid path/);
    assert.throws(() => parsePageRef('https://example.com/fr/a'), /Unsupported URL/);
    assert.throws(() => parsePageRef('https://da.live/edit#/org/repo'), /Cannot resolve/);
  });

  it('resolves folders', () => {
    assert.deepEqual(parseFolderRef('https://da.live/#/audemars-piguet/arbres-fondationsaudemarspiguet/fr/projets/'), { ...defaults, path: '/fr/projets' });
    assert.deepEqual(parseFolderRef('/', defaults), { ...defaults, path: '' });
  });

  it('reads page lists and dedupes', () => {
    assert.deepEqual(parsePageList('# comment\n/fr/a\n\n  /fr/b  \r\n'), ['/fr/a', '/fr/b']);
    const a = parsePageRef('/fr/a', defaults);
    assert.equal(dedupeTargets([a, parsePageRef('/fr/a.html', defaults)]).length, 1);
  });
});

describe('loadToken', () => {
  it('reads DA_TOKEN, strips Bearer and checks IMS expiry', () => {
    const token = jwt({ created_at: '1000', expires_in: '5000' });
    assert.equal(loadToken({ env: { DA_TOKEN: `Bearer ${token}` }, cwd: '/nonexistent', now: 2000 }).token, token);
    assert.throws(() => loadToken({ env: { DA_TOKEN: token }, cwd: '/nonexistent', now: 7000 }), /expired/);
    assert.throws(() => loadToken({ env: {}, cwd: '/nonexistent' }), /No DA token/);
    assert.equal(tokenExpiry(jwt({ exp: 10 })), 10000);
    assert.equal(tokenExpiry('opaque'), null);
  });
});

describe('createDaClient', () => {
  const recorder = (handler) => {
    const calls = [];
    const fetchImpl = async (url, init) => {
      calls.push({ url, init });
      return handler(url, init, calls.length);
    };
    return { calls, fetchImpl };
  };
  const target = { org: 'o', repo: 'r', path: '/fr/a b' };

  it('reads source with auth and etag', async () => {
    const { calls, fetchImpl } = recorder(() => new Response('<body></body>', { headers: { etag: '"e1"' } }));
    const result = await createDaClient('t', { fetchImpl }).getSource(target);
    assert.deepEqual(result, { status: 200, html: '<body></body>', etag: '"e1"' });
    assert.equal(calls[0].url, 'https://admin.da.live/source/o/r/fr/a%20b.html');
    assert.equal(calls[0].init.headers.Authorization, 'Bearer t');
  });

  it('retries reads on 5xx but writes only on 429', async () => {
    const flaky = recorder((url, init, n) => new Response('', { status: n === 1 ? 503 : 200 }));
    await createDaClient('t', { fetchImpl: flaky.fetchImpl, baseDelay: 1 }).getSource(target);
    assert.equal(flaky.calls.length, 2);

    const failingWrite = recorder(() => new Response('', { status: 503 }));
    const put = await createDaClient('t', { fetchImpl: failingWrite.fetchImpl, baseDelay: 1 }).putSource(target, '<p></p>', '"e1"');
    assert.equal(put.status, 503);
    assert.equal(failingWrite.calls.length, 1);

    const limited = recorder((url, init, n) => new Response('', { status: n === 1 ? 429 : 200 }));
    await createDaClient('t', { fetchImpl: limited.fetchImpl, baseDelay: 1 }).putSource(target, '<p></p>');
    assert.equal(limited.calls.length, 2);
  });

  it('writes multipart "data" with If-Match and creates labelled versions', async () => {
    const { calls, fetchImpl } = recorder(() => new Response('{}', { status: 200 }));
    const client = createDaClient('t', { fetchImpl });
    await client.createVersion(target, 'Before');
    await client.putSource(target, '<body>x</body>', '"e1"');

    assert.equal(calls[0].url, 'https://admin.da.live/versionsource/o/r/fr/a%20b.html');
    assert.equal(calls[0].init.body, '{"label":"Before"}');
    assert.equal(calls[1].init.method, 'PUT');
    assert.equal(calls[1].init.headers['If-Match'], '"e1"');
    const data = calls[1].init.body.get('data');
    assert.equal(data.type, 'text/html');
    assert.equal(await data.text(), '<body>x</body>');
  });

  it('lists documents recursively with continuation tokens', async () => {
    const responses = {
      '/list/o/r/fr|': [[{ path: '/o/r/fr/a.html', ext: 'html' }, { path: '/o/r/fr/sub' }], 'next'],
      '/list/o/r/fr|next': [[{ path: '/o/r/fr/b.html', ext: 'html' }, { path: '/o/r/fr/data.json', ext: 'json' }]],
      '/list/o/r/fr/sub|': [[{ path: '/o/r/fr/sub/c.html', ext: 'html' }]],
    };
    const { fetchImpl } = recorder((url, init) => {
      const key = `${new URL(url).pathname}|${init.headers['da-continuation-token'] || ''}`;
      const [items, next] = responses[key];
      return new Response(JSON.stringify(items), { headers: next ? { 'da-continuation-token': next } : {} });
    });
    const docs = await createDaClient('t', { fetchImpl }).listDocuments({ org: 'o', repo: 'r', path: '/fr' });
    assert.deepEqual(docs.map(({ path }) => path), ['/fr/a', '/fr/b', '/fr/sub/c']);
  });
});

describe('mapWithConcurrency', () => {
  it('keeps order and limits parallelism', async () => {
    let active = 0;
    let peak = 0;
    const out = await mapWithConcurrency([5, 1, 3, 2], 2, async (n) => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((resolve) => { setTimeout(resolve, n); });
      active -= 1;
      return n * 2;
    });
    assert.deepEqual(out, [10, 2, 6, 4]);
    assert.equal(peak, 2);
  });
});
