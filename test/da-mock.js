/**
 * In-memory stand-in for `actions.daFetch` (DA Source API + AEM Admin API).
 * Local tests only: it mimics ETags, If-Match / If-None-Match, versions,
 * read-only repositories, injected failures and the preview-before-live rule.
 */
const DA = 'https://admin.da.live';
const AEM = 'https://admin.hlx.page';

export default function createDaMock({ documents = {}, readOnly = [] } = {}) {
  const store = new Map();
  const versions = [];
  const aem = { preview: new Set(), live: new Set() };
  const calls = [];
  const failures = new Map();
  const readOnlyRepos = new Set(readOnly);
  let counter = 0;

  const save = (key, body) => {
    counter += 1;
    store.set(key, { body, etag: `"v${counter}"` });
  };
  Object.entries(documents).forEach(([key, html]) => save(key, html));

  const reply = (status, body = null, headers = {}) => new Response(
    [204, 304].includes(status) ? null : body,
    { status, headers },
  );

  async function readBody(body) {
    const data = body instanceof FormData ? body.get('data') : body;
    return data instanceof Blob ? data.text() : String(data ?? '');
  }

  async function source(method, key, repo, init) {
    const entry = store.get(key);
    const headers = new Headers(init.headers);
    const actions = readOnlyRepos.has(repo) ? 'read' : 'read,write';
    if (method === 'GET' || method === 'HEAD') {
      if (!entry) return reply(404);
      return reply(200, method === 'HEAD' ? null : entry.body, {
        etag: entry.etag,
        'x-da-actions': `/${key}=${actions}`,
      });
    }
    if (method !== 'PUT') return reply(405);
    if (readOnlyRepos.has(repo)) return reply(403);
    const ifMatch = headers.get('if-match');
    if (ifMatch && (!entry || entry.etag !== ifMatch)) return reply(412);
    if (headers.get('if-none-match') === '*' && entry) return reply(412);
    save(key, await readBody(init.body));
    return reply(entry ? 200 : 201, '{}', { etag: store.get(key).etag });
  }

  async function daFetch(url, init = {}) {
    const method = (init.method || 'GET').toUpperCase();
    const parsed = new URL(url);
    calls.push({ method, url: parsed.href });
    const failure = failures.get(`${method} ${parsed.href}`);
    if (failure) return reply(failure, null, { 'x-error': 'Injected failure' });

    if (parsed.origin === DA) {
      const [, route, org, repo, ...rest] = parsed.pathname.split('/');
      const key = `${org}/${repo}/${rest.join('/')}`;
      if (route === 'source') return source(method, key, repo, init);
      if (route === 'versionsource' && method === 'POST') {
        if (readOnlyRepos.has(repo)) return reply(403);
        if (!store.has(key)) return reply(404);
        versions.push({ key, label: JSON.parse(init.body).label, body: store.get(key).body });
        return reply(201, '{}');
      }
    }
    if (parsed.origin === AEM && method === 'POST') {
      const [, action, org, repo, , ...rest] = parsed.pathname.split('/');
      const path = `/${rest.join('/')}`;
      const key = `${org}/${repo}${path}`;
      const exists = store.has(key) || store.has(`${key}.html`);
      if (action === 'preview' && exists) {
        aem.preview.add(key);
        return reply(200, '{}');
      }
      if (action === 'live' && aem.preview.has(key)) {
        aem.live.add(key);
        return reply(200, '{}');
      }
      return reply(404, null, { 'x-error': action === 'live' ? 'Not previewed' : 'No source' });
    }
    return reply(404, null, { 'x-error': 'Unknown mock route' });
  }

  return {
    daFetch,
    store,
    versions,
    aem,
    calls,
    /** Simulates another author saving the document (changes its ETag). */
    edit(key, transform) {
      save(key, transform(store.get(key).body));
    },
    fail(method, url, status) {
      failures.set(`${method} ${url}`, status);
    },
    clearFailures() {
      failures.clear();
    },
    setReadOnly(repo, value = true) {
      if (value) readOnlyRepos.add(repo);
      else readOnlyRepos.delete(repo);
    },
  };
}
