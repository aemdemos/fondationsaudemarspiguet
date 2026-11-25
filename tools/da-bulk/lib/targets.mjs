/**
 * Resolves page references (DA editor URLs, aem.page/aem.live URLs, DA source
 * URLs or plain paths) to { org, repo, path } where path has no extension.
 */

const DA_HOSTS = new Set(['da.live', 'www.da.live']);
const AEM_HOST = /^[a-z0-9-]+--([a-z0-9-]+)--([a-z0-9-]+)\.aem\.(?:page|live)$/i;

export function normalizePath(rawPath) {
  let path = decodeURIComponent(String(rawPath).trim()).split(/[?#]/)[0];
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.split('/').includes('..')) throw new Error(`Invalid path "${rawPath}"`);
  if (path.endsWith('/')) path = `${path}index`;
  path = path.replace(/\.html$/i, '').replace(/\/{2,}/g, '/');
  if (path === '/') throw new Error(`Invalid path "${rawPath}"`);
  return path;
}

function fromSegments(segments, ref) {
  const [org, repo, ...rest] = segments.filter(Boolean);
  if (!org || !repo || rest.length === 0) throw new Error(`Cannot resolve org/repo/path from "${ref}"`);
  return { org, repo, path: normalizePath(rest.join('/')) };
}

/**
 * @param {string} ref
 * @param {{ org?: string, repo?: string }} defaults used for plain paths
 */
export function parsePageRef(ref, defaults = {}) {
  const value = String(ref).trim();
  if (!/^https?:\/\//i.test(value)) {
    if (!defaults.org || !defaults.repo) {
      throw new Error(`"${value}" is a plain path: pass --org and --repo, or use a full URL`);
    }
    return { org: defaults.org, repo: defaults.repo, path: normalizePath(value) };
  }

  const url = new URL(value);
  const host = url.hostname.toLowerCase();

  if (DA_HOSTS.has(host)) {
    // e.g. https://da.live/edit#/org/repo/fr/page
    return fromSegments(url.hash.replace(/^#/, '').split('/'), value);
  }

  if (host === 'admin.da.live' && url.pathname.startsWith('/source/')) {
    return fromSegments(url.pathname.replace(/^\/source\//, '').split('/'), value);
  }

  const aem = host.match(AEM_HOST);
  if (aem) {
    return { org: aem[2], repo: aem[1], path: normalizePath(url.pathname) };
  }

  throw new Error(`Unsupported URL "${value}"`);
}

function normalizeFolder(rawPath) {
  const path = `/${decodeURIComponent(String(rawPath).trim()).split(/[?#]/)[0]}`
    .replace(/\/{2,}/g, '/')
    .replace(/\/$/, '');
  if (path.split('/').includes('..')) throw new Error(`Invalid folder "${rawPath}"`);
  return path;
}

/**
 * Resolves a folder reference: `https://da.live/#/org/repo/fr/projets` or a
 * plain path such as `/fr/projets` (requires defaults). `/` is the site root.
 */
export function parseFolderRef(ref, defaults = {}) {
  const value = String(ref).trim();
  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    if (!DA_HOSTS.has(url.hostname.toLowerCase())) {
      throw new Error(`Folder URLs must be da.live browse URLs, got "${value}"`);
    }
    const [org, repo, ...rest] = url.hash.replace(/^#/, '').split('/').filter(Boolean);
    if (!org || !repo) throw new Error(`Cannot resolve org/repo from "${value}"`);
    return { org, repo, path: normalizeFolder(rest.join('/')) };
  }
  if (!defaults.org || !defaults.repo) {
    throw new Error(`"${value}" is a plain folder path: pass --org and --repo, or use a da.live URL`);
  }
  return { org: defaults.org, repo: defaults.repo, path: normalizeFolder(value) };
}

/**
 * Parses the content of a pages file: one reference per line, blank lines
 * and lines starting with `#` are ignored.
 */
export function parsePageList(text) {
  return String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

export const targetId = ({ org, repo, path }) => `${org}/${repo}${path}`;

export function dedupeTargets(targets) {
  const seen = new Map();
  targets.forEach((target) => {
    const id = targetId(target);
    if (!seen.has(id)) seen.set(id, target);
  });
  return [...seen.values()];
}
