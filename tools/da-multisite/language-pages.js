import {
  LOCALES, ORG, REF, SITES,
} from './sites.js';
import { sitePath } from './core.js';
// Installed beside Language Mapper; that existing tool is not duplicated in skill assets.
// eslint-disable-next-line import/no-unresolved
import { fetchLanguageSwitcherRows, resolvePathWithRows } from '../languageswitcher/placeholders.js';

export function pageSource(context) {
  if (context.org !== ORG) throw new Error(`Open this tool in ${ORG}.`);
  const site = SITES.find(({ repo }) => repo === context.repo);
  if (!site) {
    throw new Error(`Open this tool from a page of ${SITES.map(({ label }) => label).join(', ')}.`);
  }
  let path = String(context.path || '').trim().replace(/\.html$/i, '');
  const prefix = `/${ORG}/${site.repo}`;
  if (path === prefix || path.startsWith(`${prefix}/`)) path = path.slice(prefix.length);
  path = sitePath(path.startsWith('/') ? path : `/${path}`);
  const locale = path.split('/')[1];
  if (!LOCALES.includes(locale)) {
    throw new Error(`Open this tool from a page inside ${LOCALES.map((code) => `/${code}/`).join(' or ')}.`);
  }
  return {
    org: ORG, repo: site.repo, site, locale, path,
  };
}

export function mapPath(path, from, to, rows) {
  const rest = path.slice(from.length + 1);
  const mapped = resolvePathWithRows(rows, from, to, rest);
  return { path: mapped || `/${to}${rest}`, mapped: Boolean(mapped) };
}

export async function loadMapping(api, { repo, path }) {
  try {
    const { rows } = await fetchLanguageSwitcherRows(REF, ORG, repo, 'page', undefined, { daFetch: api.request }, path);
    return { rows, error: null };
  } catch (error) {
    return { rows: [], error: error?.message || String(error) };
  }
}
