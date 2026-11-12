/**
 * Pure transformations of the page `Metadata` block in DA source HTML.
 *
 * Only the affected rows/cells are spliced into the original string, so the
 * rest of the document stays byte-identical.
 */
import { parse } from 'parse5';

export const OPERATION_TYPES = ['rename', 'set', 'add', 'delete'];

// Formatting wrappers that are kept when replacing a cell's text. Links are
// deliberately excluded so a new value never keeps a stale href.
const TEXT_WRAPPERS = new Set(['p', 'strong', 'em', 'b', 'i', 'u', 'span']);

/**
 * Same normalization as the EDS pipeline uses for `<meta name>`, so that
 * "Featured", "featured" and "FEATURED" address the same metadata.
 */
export function toMetaName(text) {
  return String(text).trim().toLowerCase().replace(/[^0-9a-z:_]/gi, '-');
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const isElement = (node) => Boolean(node?.tagName);
const elementChildren = (node) => (node.childNodes || []).filter(isElement);

function textContent(node) {
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes || []).map(textContent).join('');
}

function cellText(node) {
  return textContent(node).replace(/\s+/g, ' ').trim();
}

function classTokens(node) {
  const attr = (node.attrs || []).find(({ name }) => name === 'class');
  return attr ? attr.value.trim().split(/\s+/) : [];
}

function findElements(node, predicate, found = []) {
  if (isElement(node) && predicate(node)) found.push(node);
  (node.childNodes || []).forEach((child) => findElements(child, predicate, found));
  (node.content?.childNodes || []).forEach((child) => findElements(child, predicate, found));
  return found;
}

function closestTable(node) {
  let parent = node.parentNode;
  while (parent && parent.tagName !== 'table') parent = parent.parentNode;
  return parent;
}

function hasLocation(node) {
  const loc = node.sourceCodeLocation;
  return Boolean(loc?.startTag && loc?.endTag);
}

function toRow(node, cellTags) {
  const cells = elementChildren(node).filter((el) => cellTags.includes(el.tagName));
  return {
    node,
    cells,
    key: cells[0] ? cellText(cells[0]) : '',
    metaName: cells[0] ? toMetaName(cellText(cells[0])) : '',
    value: cells[1] ? cellText(cells[1]) : '',
  };
}

function findMetadataBlocks(document) {
  const divBlocks = findElements(
    document,
    (el) => el.tagName === 'div' && classTokens(el)[0] === 'metadata',
  ).map((node) => ({
    kind: 'div',
    node,
    rows: elementChildren(node).filter((el) => el.tagName === 'div').map((row) => toRow(row, ['div'])),
  }));

  const tableBlocks = findElements(document, (el) => el.tagName === 'table')
    .map((node) => ({
      node,
      trs: findElements(node, (el) => el.tagName === 'tr').filter((tr) => closestTable(tr) === node),
    }))
    .filter(({ trs }) => trs.length > 0
      && elementChildren(trs[0]).length === 1
      && toMetaName(cellText(trs[0])) === 'metadata')
    .map(({ node, trs }) => ({
      kind: 'table',
      node,
      headerRow: trs[0],
      rows: trs.slice(1).map((tr) => toRow(tr, ['td', 'th'])),
    }));

  return [...divBlocks, ...tableBlocks];
}

/**
 * Element whose inner HTML holds the cell text: descends through single
 * formatting wrappers such as `<p>` or `<strong>` so they are preserved.
 */
function textTarget(cell) {
  let target = cell;
  for (;;) {
    const children = elementChildren(target);
    const hasOwnText = (target.childNodes || [])
      .some((child) => child.nodeName === '#text' && child.value.trim());
    if (children.length !== 1 || hasOwnText || !TEXT_WRAPPERS.has(children[0].tagName)) {
      return target;
    }
    [target] = children;
  }
}

function replaceTextSplice(cell, text) {
  const target = textTarget(cell);
  if (!hasLocation(target)) throw new Error('unexpected markup: unclosed metadata cell');
  return {
    start: target.sourceCodeLocation.startTag.endOffset,
    end: target.sourceCodeLocation.endTag.startOffset,
    text: escapeHtml(text),
  };
}

function newRowHtml(block, key, value) {
  const sample = block.rows.find((row) => row.cells.length >= 2);
  const usesParagraphs = sample
    ? elementChildren(sample.cells[0]).some((el) => el.tagName === 'p')
    : block.kind === 'div';
  const wrap = (text) => (usesParagraphs ? `<p>${escapeHtml(text)}</p>` : escapeHtml(text));

  if (block.kind === 'table') return `<tr><td>${wrap(key)}</td><td>${wrap(value)}</td></tr>`;
  return `<div><div>${wrap(key)}</div><div>${wrap(value)}</div></div>`;
}

function appendRowSplice(block, key, value) {
  const lastRow = block.rows[block.rows.length - 1]?.node || block.headerRow;
  let offset;
  if (lastRow) {
    if (!lastRow.sourceCodeLocation?.endTag) throw new Error('unexpected markup: unclosed metadata row');
    offset = lastRow.sourceCodeLocation.endOffset;
  } else {
    if (!hasLocation(block.node)) throw new Error('unexpected markup: unclosed metadata block');
    offset = block.node.sourceCodeLocation.endTag.startOffset;
  }
  return { start: offset, end: offset, text: newRowHtml(block, key, value) };
}

function applySplices(html, splices) {
  return [...splices]
    .sort((a, b) => b.start - a.start)
    .reduce((acc, { start, end, text }) => acc.slice(0, start) + text + acc.slice(end), html);
}

function findRows(block, key) {
  const name = toMetaName(key);
  return block.rows.filter((row) => row.metaName === name);
}

function planRename(block, op) {
  const matches = findRows(block, op.from);
  if (matches.length === 0) return { splices: [], skip: `"${op.from}" not found` };
  if (matches.length > 1) throw new Error(`"${op.from}" appears ${matches.length} times`);
  const [row] = matches;
  if (row.key === op.to) return { splices: [], skip: `"${op.to}" already named` };
  if (toMetaName(op.from) !== toMetaName(op.to) && findRows(block, op.to).length > 0) {
    throw new Error(`cannot rename "${op.from}": "${op.to}" already exists`);
  }
  return {
    splices: [replaceTextSplice(row.cells[0], op.to)],
    change: `rename "${row.key}" -> "${op.to}" (value: "${row.value}")`,
  };
}

function planSet(block, op) {
  const matches = findRows(block, op.key);
  if (matches.length > 1) throw new Error(`"${op.key}" appears ${matches.length} times`);
  if (matches.length === 0) {
    return {
      splices: [appendRowSplice(block, op.key, op.value)],
      change: `add "${op.key}" = "${op.value}"`,
    };
  }
  const [row] = matches;
  if (row.cells.length < 2) throw new Error(`"${op.key}" row has no value cell`);
  if (row.value === op.value) return { splices: [], skip: `"${op.key}" already "${op.value}"` };
  return {
    splices: [replaceTextSplice(row.cells[1], op.value)],
    change: `set "${row.key}": "${row.value}" -> "${op.value}"`,
  };
}

function planAdd(block, op) {
  if (findRows(block, op.key).length > 0) return { splices: [], skip: `"${op.key}" already exists` };
  return {
    splices: [appendRowSplice(block, op.key, op.value)],
    change: `add "${op.key}" = "${op.value}"`,
  };
}

function planDelete(block, op) {
  const matches = findRows(block, op.key);
  if (matches.length === 0) return { splices: [], skip: `"${op.key}" not found` };
  return {
    splices: matches.map(({ node }) => ({
      start: node.sourceCodeLocation.startOffset,
      end: node.sourceCodeLocation.endOffset,
      text: '',
    })),
    change: `delete "${matches[0].key}" (value: ${matches.map((row) => `"${row.value}"`).join(', ')})`,
  };
}

const PLANNERS = {
  rename: planRename,
  set: planSet,
  add: planAdd,
  delete: planDelete,
};

/**
 * Applies operations in order. A page is all-or-nothing: on any error the
 * original HTML is returned unchanged.
 *
 * @param {string} html DA source HTML
 * @param {object[]} operations e.g. { type: 'rename', from, to }
 * @returns {{ status: 'changed'|'unchanged'|'skipped'|'error', html: string,
 *   changes: string[], notes: string[], error?: string }}
 */
export function applyMetadataOperations(html, operations) {
  const changes = [];
  const notes = [];

  try {
    const updated = operations.reduce((current, op) => {
      const blocks = findMetadataBlocks(parse(current, { sourceCodeLocationInfo: true }));
      if (blocks.length === 0) throw Object.assign(new Error('no Metadata block'), { skipped: true });
      if (blocks.length > 1) throw new Error(`${blocks.length} Metadata blocks found`);

      const { splices, change, skip } = PLANNERS[op.type](blocks[0], op);
      if (change) changes.push(change);
      if (skip) notes.push(skip);
      return applySplices(current, splices);
    }, html);

    return {
      status: updated === html ? 'unchanged' : 'changed',
      html: updated,
      changes,
      notes,
    };
  } catch (error) {
    return {
      status: error.skipped ? 'skipped' : 'error',
      html,
      changes: [],
      notes: [],
      error: error.message,
    };
  }
}

/**
 * Parses CLI values such as `Featured=Homepage highlight`.
 */
export function parseOperation(type, raw) {
  if (!OPERATION_TYPES.includes(type)) throw new Error(`Unknown operation "${type}"`);
  const input = String(raw ?? '');

  if (type === 'delete') {
    const key = input.trim();
    if (!key) throw new Error('--delete requires a key');
    return { type, key };
  }

  const separator = input.indexOf('=');
  if (separator < 0) throw new Error(`--${type} expects "Key=Value", got "${input}"`);
  const left = input.slice(0, separator).trim();
  const right = input.slice(separator + 1).trim();
  if (!left) throw new Error(`--${type} expects a non-empty key`);

  if (type === 'rename') {
    if (!right) throw new Error('--rename expects "Old key=New key"');
    return { type, from: left, to: right };
  }
  return { type, key: left, value: right };
}
