/**
 * Test-only preload (`node --import`) replacing fetch with an in-memory DA
 * Admin API persisted in the JSON file named by MOCK_DA_STATE.
 * State shape: { docs: { "org/repo/path.html": { html, etag } }, log: [], failPut: [] }
 */
import { readFileSync, writeFileSync } from 'node:fs';

const file = process.env.MOCK_DA_STATE;
const load = () => JSON.parse(readFileSync(file, 'utf8'));
const save = (state) => writeFileSync(file, JSON.stringify(state, null, 2));
const json = (body, init = {}) => new Response(JSON.stringify(body), init);

globalThis.fetch = async (input, init = {}) => {
  const url = new URL(input);
  const method = init.method || 'GET';
  const state = load();
  const [, api, ...parts] = url.pathname.split('/');
  const key = parts.map(decodeURIComponent).join('/');
  state.log.push(`${method} /${api}/${key}`);
  save(state);

  if (init.headers?.Authorization !== 'Bearer test-token') return new Response('', { status: 401 });

  if (api === 'source' && method === 'GET') {
    const doc = state.docs[key];
    return doc ? new Response(doc.html, { headers: { etag: doc.etag } }) : new Response('', { status: 404 });
  }

  if (api === 'versionsource' && method === 'POST') {
    state.versions = [...(state.versions || []), { key, ...JSON.parse(init.body) }];
    save(state);
    return json({}, { status: 201 });
  }

  if (api === 'source' && method === 'PUT') {
    if ((state.failPut || []).includes(key)) return new Response('', { status: 500 });
    const doc = state.docs[key];
    const ifMatch = init.headers['If-Match'];
    if (ifMatch && doc && ifMatch !== doc.etag) return new Response('', { status: 412 });
    const html = await init.body.get('data').text();
    state.docs[key] = { html, etag: `"${Number(doc?.etag?.replace(/"/g, '') || 0) + 1}"` };
    save(state);
    return json({}, { status: 200 });
  }

  if (api === 'list' && method === 'GET') {
    const prefix = `${key}/`;
    const names = Object.keys(state.docs).filter((doc) => doc.startsWith(prefix));
    const files = names.filter((doc) => !doc.slice(prefix.length).includes('/'))
      .map((doc) => ({ path: `/${doc}`, name: doc.split('/').pop().replace('.html', ''), ext: 'html' }));
    const folders = [...new Set(names.map((doc) => doc.slice(prefix.length))
      .filter((rest) => rest.includes('/'))
      .map((rest) => rest.split('/')[0]))]
      .map((name) => ({ path: `/${prefix}${name}`, name }));
    return json([...folders, ...files]);
  }

  return new Response('', { status: 400 });
};
