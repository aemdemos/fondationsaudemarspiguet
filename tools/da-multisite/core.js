/**
 * Multi-site DA runtime: target expansion, guarded API access and the
 * analyse -> write -> preview -> publish pipeline. No DOM rendering here.
 */
import {
  LOCALES, ORG, REF, SITES,
} from './sites.js';

export const DA_ADMIN = 'https://admin.da.live';
export const AEM_ADMIN = 'https://admin.hlx.page';

// actions.daFetch adds the author's token to every URL: only call these origins.
const API_ORIGINS = new Set([DA_ADMIN, AEM_ADMIN]);
const SAFE_PATH = /^\/[a-z0-9][a-z0-9._/-]*$/i;

export function sitePath(value) {
  const path = String(value ?? '').trim();
  if (!SAFE_PATH.test(path) || path.includes('//')
    || path.split('/').some((segment) => segment === '.' || segment === '..')) {
    throw new Error(`Invalid site path "${path}"`);
  }
  return path;
}

export function safeFileName(name, extensions = []) {
  const lower = String(name ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const dot = lower.lastIndexOf('.');
  const base = (dot > 0 ? lower.slice(0, dot) : '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const ext = dot > 0 ? lower.slice(dot + 1).replace(/[^a-z0-9]/g, '') : '';
  if (!base || !ext) throw new Error(`Invalid file name "${name}"`);
  if (extensions.length && !extensions.includes(ext)) {
    throw new Error(`"${name}" must be one of: ${extensions.join(', ')}`);
  }
  return `${base}.${ext}`;
}

export function assetPath(field, file, locale) {
  const folder = typeof field.folder === 'function' ? field.folder(locale) : field.folder;
  return sitePath(`${sitePath(folder)}/${safeFileName(file.name, field.extensions)}`);
}

export const daEditUrl = ({ org, repo, path }) => `https://da.live/edit#/${org}/${repo}${path}`;
export const aemUrl = ({ org, repo, path }, tier = 'page') => `https://${REF}--${repo}--${org}.aem.${tier === 'live' ? 'live' : 'page'}${path}`;

/**
 * @param {object|Function} pages `{ fr: '/fr/page', en: '/en/page' }` or
 *   `(site, locale) => path | null` (null = not applicable to that site/locale).
 */
export function expandTargets({ pages, siteIds = SITES.map(({ id }) => id), locales = LOCALES }) {
  return SITES.filter(({ id }) => siteIds.includes(id)).flatMap((site) => LOCALES
    .filter((locale) => locales.includes(locale))
    .flatMap((locale) => {
      const raw = typeof pages === 'function' ? pages(site, locale) : pages?.[locale];
      if (raw === null) return [];
      if (!raw) throw new Error(`No page configured for ${site.label} (${locale})`);
      return [{
        id: `${site.id}:${locale}`,
        org: ORG,
        repo: site.repo,
        site,
        locale,
        path: sitePath(raw).replace(/\.html$/i, ''),
      }];
    }));
}

/** Values seen by an operation for one locale; file fields become `{ file, path }`. */
export function valuesFor(fields, input, locale) {
  return Object.fromEntries(fields.map((field) => {
    const raw = field.localized ? input[field.name]?.[locale] : input[field.name];
    if (field.type !== 'file') return [field.name, raw];
    return [field.name, raw ? { file: raw, path: assetPath(field, raw, locale) } : null];
  }));
}

export function collectAssets(fields, input, targets) {
  const assets = new Map();
  targets.forEach((target) => {
    const values = valuesFor(fields, input, target.locale);
    fields.filter(({ type }) => type === 'file').forEach(({ name }) => {
      const value = values[name];
      if (!value) return;
      const id = `${target.repo}${value.path}`;
      if (assets.has(id) && assets.get(id).file !== value.file) {
        throw new Error(`Two different files would be stored as ${value.path}`);
      }
      if (!assets.has(id)) {
        assets.set(id, {
          id,
          org: target.org,
          repo: target.repo,
          site: target.site,
          locale: target.locale,
          path: value.path,
          file: value.file,
        });
      }
    });
  });
  return [...assets.values()];
}

export function targetAssetIds(fields, input, target) {
  const values = valuesFor(fields, input, target.locale);
  return fields.filter(({ type }) => type === 'file')
    .map(({ name }) => values[name])
    .filter(Boolean)
    .map(({ path }) => `${target.repo}${path}`);
}

function readPermissions(resp) {
  if (Array.isArray(resp.permissions)) return resp.permissions;
  const header = resp.headers.get('x-da-actions');
  return header ? header.split('=').pop().split(',').map((value) => value.trim()) : null;
}

export function createApi(daFetch) {
  if (typeof daFetch !== 'function') throw new Error('DA fetch is unavailable. Open this tool from DA.');

  const call = (url, init = {}) => {
    const parsed = new URL(url);
    if (!API_ORIGINS.has(parsed.origin)) throw new Error(`Blocked request to ${parsed.origin}`);
    return daFetch(parsed.href, init);
  };
  const source = ({ org, repo, path }, ext = '') => `${DA_ADMIN}/source/${org}/${repo}${path}${ext}`;
  const upload = (blob) => {
    const body = new FormData();
    body.append('data', blob);
    return body;
  };

  return {
    /** Raw authenticated fetch, restricted to the DA and AEM admin origins. */
    request: call,
    async getDocument(target) {
      const resp = await call(source(target, '.html'));
      return {
        status: resp.status,
        ok: resp.ok,
        etag: resp.headers.get('etag'),
        permissions: readPermissions(resp),
        html: resp.ok ? await resp.text() : '',
      };
    },
    async putDocument(target, html, etag) {
      const resp = await call(source(target, '.html'), {
        method: 'PUT',
        headers: { 'If-Match': etag },
        body: upload(new Blob([html], { type: 'text/html' })),
      });
      return { status: resp.status, ok: resp.ok };
    },
    async createVersion({ org, repo, path }, label) {
      const resp = await call(`${DA_ADMIN}/versionsource/${org}/${repo}${path}.html`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label }),
      });
      return { status: resp.status, ok: resp.ok };
    },
    async headFile(asset) {
      const resp = await call(source(asset), { method: 'HEAD' });
      return { status: resp.status, ok: resp.ok, permissions: readPermissions(resp) };
    },
    // Binaries are not versioned by DA: never overwrite an existing file.
    async createFile(asset) {
      const resp = await call(source(asset), {
        method: 'PUT',
        headers: { 'If-None-Match': '*' },
        body: upload(asset.file),
      });
      return { status: resp.status, ok: resp.ok };
    },
    async aem(action, { org, repo, path }) {
      if (!['preview', 'live'].includes(action)) throw new Error(`Unsupported action ${action}`);
      const resp = await call(`${AEM_ADMIN}/${action}/${org}/${repo}/${REF}${path}`, { method: 'POST' });
      return { status: resp.status, ok: resp.ok, error: resp.headers.get('x-error') || '' };
    },
  };
}

export async function runPool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  const lane = async () => {
    if (next >= items.length) return;
    const index = next;
    next += 1;
    try {
      results[index] = await worker(items[index], index);
    } catch (error) {
      results[index] = { state: 'error', message: error?.message || String(error) };
    }
    await lane();
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, lane));
  return results;
}

export const parseDocument = (html) => new DOMParser().parseFromString(html, 'text/html');
export const serializeDocument = (doc) => doc.body.outerHTML;

function failureState(status) {
  if (status === 404) return 'missing';
  if (status === 401 || status === 403) return 'denied';
  return 'error';
}

export async function inspectAsset(api, asset) {
  const head = await api.headFile(asset);
  if (head.ok) return { state: 'exists', message: 'Already in DA and kept as is; rename the file to add a new version' };
  if (head.status === 404) return { state: 'new', message: 'Will be uploaded' };
  return { state: failureState(head.status), message: `HTTP ${head.status}` };
}

export async function uploadAsset(api, asset, plan) {
  if (plan.state !== 'new') return plan;
  const put = await api.createFile(asset);
  if (put.ok) return { state: 'uploaded', message: 'Uploaded' };
  if (put.status === 412) return { state: 'conflict', message: 'File appeared meanwhile; analyse again' };
  return { state: failureState(put.status), message: `Upload failed (HTTP ${put.status})` };
}

/**
 * Reads the page and runs the operation in memory. Nothing is written.
 * @param {{ values: object, shared?: * }} input `shared` is what `operation.load` returned.
 */
export async function planTarget(api, operation, target, { values, shared }) {
  const source = await api.getDocument(target);
  if (!source.ok) return { state: failureState(source.status), message: `HTTP ${source.status}` };
  if (source.permissions && !source.permissions.includes('write')) {
    return { state: 'denied', message: 'No write permission' };
  }
  if (!source.etag) return { state: 'error', message: 'No ETag from DA; refusing an unprotected write' };

  const doc = parseDocument(source.html);
  const baseline = serializeDocument(doc);
  let result;
  try {
    result = operation.apply(doc, { target, values, shared }) || {};
  } catch (error) {
    return { state: 'error', message: error?.message || String(error) };
  }
  const html = serializeDocument(doc);
  if (html === baseline) return { state: 'unchanged', message: 'Already up to date' };
  return {
    state: 'ready', message: result.summary || 'Change ready', etag: source.etag, html,
  };
}

/** Versions, writes with If-Match, then re-plans to prove the result is idempotent. */
export async function applyTarget(api, operation, target, input, plan, label) {
  if (plan.state !== 'ready') return plan;
  const version = await api.createVersion(target, label);
  if (!version.ok) return { state: 'error', message: `Backup version failed (HTTP ${version.status}); page not written` };

  const put = await api.putDocument(target, plan.html, plan.etag);
  if (put.status === 412) return { state: 'conflict', message: 'Page changed since analysis; analyse again' };
  if (!put.ok) return { state: failureState(put.status), message: `Write failed (HTTP ${put.status})` };

  const check = await planTarget(api, operation, target, input);
  if (check.state !== 'unchanged') {
    return { state: 'error', message: `Written, but verification returned ${check.state}: ${check.message}` };
  }
  return { state: 'written', message: plan.message };
}

export async function aemStep(api, action, item) {
  const result = await api.aem(action, item);
  if (result.ok) return { state: 'ok', message: action === 'live' ? 'Published' : 'Previewed' };
  return { state: failureState(result.status), message: result.error || `HTTP ${result.status}` };
}
