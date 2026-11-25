/**
 * Helpers for DA source HTML: `main > div` sections, `div.<block> <variants>`
 * blocks, rows and cells, and `.section-metadata` key/value tables.
 */
import { REF } from './sites.js';

const AEM_HOST = /^[a-z0-9-]+--([a-z0-9-]+)--([a-z0-9-]+)\.aem\.(page|live)$/i;
const normalize = (value) => String(value ?? '').trim().toLowerCase().replace(/\s+/g, '-');

export const sections = (doc) => [...doc.querySelectorAll('main > div')];
export const blockName = (element) => element.classList[0] || '';
export const blockRows = (block) => [...block.children];
export const rowCells = (row) => [...row.children];

export function sectionMetadata(section) {
  const meta = [...section.children].find((child) => child.classList.contains('section-metadata'));
  if (!meta) return {};
  return Object.fromEntries(blockRows(meta)
    .map((row) => rowCells(row))
    .filter((cells) => cells.length >= 2)
    .map(([key, value]) => [normalize(key.textContent), value.textContent.trim()]));
}

export const sectionStyles = (section) => String(sectionMetadata(section).style || '')
  .split(',').map(normalize).filter(Boolean);

/**
 * @param {Document} doc DA source document
 * @param {string} name block class, e.g. `table`
 * @param {{ sectionStyle?: string, variant?: string }} [options]
 */
export function findBlocks(doc, name, { sectionStyle, variant } = {}) {
  return sections(doc)
    .filter((section) => !sectionStyle || sectionStyles(section).includes(normalize(sectionStyle)))
    .flatMap((section) => [...section.children].filter((child) => blockName(child) === name
      && child.tagName === 'DIV'
      && (!variant || child.classList.contains(normalize(variant)))));
}

/** Returns the single matching block; ambiguity is an error, never a guess. */
export function findBlock(doc, name, options = {}) {
  const blocks = findBlocks(doc, name, options);
  if (blocks.length !== 1) {
    const scope = [options.variant && `variant "${options.variant}"`, options.sectionStyle && `section style "${options.sectionStyle}"`]
      .filter(Boolean).join(', ');
    throw new Error(`Expected one "${name}" block${scope ? ` (${scope})` : ''}, found ${blocks.length}`);
  }
  return blocks[0];
}

/** Replaces text while keeping a single wrapping paragraph when the cell has one. */
export function setCellText(cell, text) {
  const only = cell.children.length === 1 ? cell.firstElementChild : null;
  const target = only && only.tagName === 'P' && cell.childNodes.length === 1 ? only : cell;
  target.textContent = text;
}

/**
 * Converts a link from a target page into a site path (`/assets/x.pdf`).
 * Returns null for external links, mailto, other sites or other orgs.
 */
export function linkPath(href, { org, repo, path }) {
  if (!href) return null;
  let url;
  try {
    url = new URL(href, `https://${REF}--${repo}--${org}.aem.page${path}`);
  } catch (error) {
    return null;
  }
  const prefix = `/${org}/${repo}/`;
  if (url.hostname === 'content.da.live') {
    return url.pathname.startsWith(prefix) ? url.pathname.slice(prefix.length - 1) : null;
  }
  const aem = url.hostname.match(AEM_HOST);
  if (aem && aem[1].toLowerCase() === repo && aem[2].toLowerCase() === org) return url.pathname;
  return null;
}

/** Builds an href for `path` in the same form as `previousHref` (DA, AEM host or path). */
export function hrefLike(previousHref, path, { org, repo }) {
  let url;
  try {
    url = new URL(previousHref);
  } catch (error) {
    return path;
  }
  if (url.hostname === 'content.da.live') return `https://content.da.live/${org}/${repo}${path}`;
  if (AEM_HOST.test(url.hostname)) return `${url.origin}${path}`;
  return path;
}

export const cellLinkPaths = (cell, target) => [...cell.querySelectorAll('a[href]')]
  .map((link) => linkPath(link.getAttribute('href'), target))
  .filter(Boolean);

/** Points every link of the cell to `path`; link text and icons are kept. */
export function setCellLinks(cell, path, target) {
  const links = [...cell.querySelectorAll('a[href]')];
  if (!links.length) throw new Error('Expected at least one link in the cell');
  links.forEach((link) => {
    link.setAttribute('href', hrefLike(link.getAttribute('href'), path, target));
    link.removeAttribute('title');
  });
}
