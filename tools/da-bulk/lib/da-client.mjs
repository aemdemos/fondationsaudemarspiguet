/**
 * Minimal DA Admin API client (https://admin.da.live) for Node scripts.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const DA_ADMIN = 'https://admin.da.live';

const TRANSIENT_STATUSES = new Set([429, 500, 502, 503, 504]);
const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

/**
 * Expiry (ms since epoch) of an Adobe IMS access token, or null if unknown.
 */
export function tokenExpiry(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
    if (payload.exp) return Number(payload.exp) * 1000;
    if (payload.created_at && payload.expires_in) {
      return Number(payload.created_at) + Number(payload.expires_in);
    }
  } catch {
    // not a JWT: let the API decide
  }
  return null;
}

/**
 * Reads the DA token from DA_TOKEN, falling back to the AEM CLI cache
 * `.hlx/.da-token.json`. The token value is never logged.
 */
export function loadToken({ env = process.env, cwd = process.cwd(), now = Date.now() } = {}) {
  let token = env.DA_TOKEN;
  let source = 'DA_TOKEN';

  const cacheFile = join(cwd, '.hlx', '.da-token.json');
  if (!token && existsSync(cacheFile)) {
    token = JSON.parse(readFileSync(cacheFile, 'utf8')).access_token;
    source = '.hlx/.da-token.json';
  }

  token = String(token || '').trim().replace(/^Bearer\s+/i, '');
  if (!token) {
    throw new Error('No DA token. Set DA_TOKEN (see tools/da-bulk/README.md).');
  }

  const expiresAt = tokenExpiry(token);
  if (expiresAt && expiresAt <= now) {
    throw new Error(`The DA token from ${source} expired at ${new Date(expiresAt).toISOString()}. Get a new one.`);
  }
  return { token, source, expiresAt };
}

const encodePath = (path) => path.split('/').map(encodeURIComponent).join('/');
const documentPath = ({ org, repo, path }) => `/${encodePath(`${org}/${repo}${path}`)}.html`;

export function createDaClient(token, { fetchImpl = fetch, retries = 3, baseDelay = 1000 } = {}) {
  /**
   * `idempotent` requests are retried on network errors and 5xx. Writes are
   * only retried on 429, which guarantees the request was not processed.
   */
  async function request(path, init = {}, { idempotent = true } = {}, attempt = 0) {
    const retry = async (retryAfterSeconds) => {
      await sleep(retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : baseDelay * 2 ** attempt);
      return request(path, init, { idempotent }, attempt + 1);
    };

    let resp;
    try {
      resp = await fetchImpl(`${DA_ADMIN}${path}`, {
        ...init,
        headers: { ...init.headers, Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      if (idempotent && attempt < retries) return retry(0);
      throw error;
    }

    const retryable = resp.status === 429 || (idempotent && TRANSIENT_STATUSES.has(resp.status));
    if (retryable && attempt < retries) return retry(Number(resp.headers.get('retry-after')));
    return resp;
  }

  async function getSource(target) {
    const resp = await request(`/source${documentPath(target)}`);
    return {
      status: resp.status,
      html: resp.ok ? await resp.text() : '',
      etag: resp.headers.get('etag'),
    };
  }

  /** Creates a named version of the current content (visible in DA's Versions panel). */
  async function createVersion(target, label) {
    const resp = await request(`/versionsource${documentPath(target)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label }),
    }, { idempotent: false });
    return { status: resp.status, ok: resp.ok };
  }

  /** Writes HTML; with `etag`, DA rejects the write (412) if the page changed meanwhile. */
  async function putSource(target, html, etag) {
    const form = new FormData();
    form.append('data', new Blob([html], { type: 'text/html' }), 'index.html');
    const resp = await request(`/source${documentPath(target)}`, {
      method: 'PUT',
      headers: etag ? { 'If-Match': etag } : {},
      body: form,
    }, { idempotent: false });
    return { status: resp.status, ok: resp.ok };
  }

  async function listPage({ org, repo, path }, continuationToken) {
    const resp = await request(
      `/list/${encodePath(`${org}/${repo}${path}`)}`,
      continuationToken ? { headers: { 'da-continuation-token': continuationToken } } : {},
    );
    if (!resp.ok) throw new Error(`Cannot list ${org}/${repo}${path || '/'} (HTTP ${resp.status})`);
    const items = await resp.json();
    const next = resp.headers.get('da-continuation-token');
    if (!next) return items;
    return [...items, ...await listPage({ org, repo, path }, next)];
  }

  /**
   * Recursively lists the documents (.html) below a folder.
   * @returns {Promise<{ org: string, repo: string, path: string }[]>}
   */
  async function listDocuments(folder) {
    const prefix = `/${folder.org}/${folder.repo}`;
    const items = await listPage(folder);

    const documents = items
      .filter((item) => item.ext === 'html')
      .map((item) => ({ ...folder, path: item.path.slice(prefix.length).replace(/\.html$/, '') }));

    const subfolders = items
      .filter((item) => !item.ext)
      .map((item) => ({ ...folder, path: item.path.slice(prefix.length) }));

    // sequential on purpose, to stay well below DA rate limits
    return subfolders.reduce(
      async (acc, sub) => [...await acc, ...await listDocuments(sub)],
      Promise.resolve(documents),
    );
  }

  return {
    getSource, createVersion, putSource, listDocuments,
  };
}

/**
 * Runs `fn` over `items` with at most `limit` concurrent calls, keeping order.
 */
export async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    if (next >= items.length) return;
    const index = next;
    next += 1;
    results[index] = await fn(items[index], index);
    await worker();
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
