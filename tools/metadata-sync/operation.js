import { LOCALES } from '../da-multisite/sites.js';
import { parseDocument } from '../da-multisite/core.js';
import { loadMapping, mapPath, pageSource } from '../da-multisite/language-pages.js';
import {
  blockRows, findBlocks, hrefLike, linkPath, rowCells, sections, setCellText,
} from '../da-multisite/da-blocks.js';
import { SHARED_FIELDS, SHARED_LABELS, TEMPLATES } from '../../scripts/metadata/config.js';

// Locale-specific rows that must never be copied to another language.
const NEVER_COPY = new Set(['language']);
const PREVIEW_LENGTH = 80;

/** Metadata name as delivered by AEM: "Durée du projet" -> "dur-e-du-projet". */
const toMetaName = (label) => String(label ?? '').trim().toLowerCase().replace(/[^0-9a-z:_]/g, '-');

const FIELDS = [SHARED_FIELDS, ...Object.values(TEMPLATES).map(({ fields }) => fields || {})]
  .flatMap((fields) => Object.values(fields));
const KNOWN_LABELS = [SHARED_LABELS, ...Object.values(TEMPLATES).map(({ labels }) => labels || {})]
  .flatMap((labels) => Object.values(labels))
  .flatMap((byLocale) => Object.values(byLocale));
const keyIn = (field, locale) => field.overrides?.[locale] || field.base;

/** Maps a key between languages with scripts/metadata/config.js (partner -> partenaire). */
function translateKey(key, from, to) {
  const keys = new Set(FIELDS.filter((field) => keyIn(field, from) === key)
    .map((field) => keyIn(field, to)));
  if (keys.size > 1) {
    throw new Error(`"${key}" has several ${to.toUpperCase()} equivalents: ${[...keys].join(', ')}`);
  }
  return keys.size ? [...keys][0] : key;
}

/** Author-facing label whose metadata name is `key`, e.g. "axe-s-" -> "Axe(s)". */
function labelFor(key, sourceRow) {
  if (key === sourceRow.key) return sourceRow.label;
  const known = KNOWN_LABELS.find((label) => toMetaName(label) === key);
  if (known) return known;
  const words = key.replace(/-([a-z]+)-$/, '($1)').replace(/-/g, ' ');
  const guess = `${words.charAt(0).toUpperCase()}${words.slice(1)}`;
  return toMetaName(guess) === key ? guess : key;
}

function metadataBlock(doc) {
  const blocks = findBlocks(doc, 'metadata');
  if (blocks.length > 1) throw new Error(`Expected one metadata block, found ${blocks.length}`);
  return blocks[0] || null;
}

function metadataEntries(block) {
  return blockRows(block).map((row) => {
    const [keyCell, valueCell] = rowCells(row);
    return {
      row,
      key: toMetaName(keyCell?.textContent),
      label: keyCell?.textContent.trim().replace(/\s+/g, ' ') || '',
      cell: valueCell || null,
    };
  }).filter(({ key, cell }) => key && cell);
}

function preview(cell) {
  const text = cell.textContent.trim().replace(/\s+/g, ' ');
  const images = cell.querySelectorAll('img').length;
  return [
    text.length > PREVIEW_LENGTH ? `${text.slice(0, PREVIEW_LENGTH - 1)}…` : text,
    images > 1 ? `${images} images` : images && 'image',
  ].filter(Boolean).join(' + ') || '(empty)';
}

const inLocale = (path, locale) => path === `/${locale}` || path.startsWith(`/${locale}/`);

/** Points internal links (and a value that is only a path) to the target language. */
function localizeValue(cell, { source, target, rows }) {
  const swap = (path) => mapPath(path, source.locale, target.locale, rows).path;
  let count = 0;
  cell.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    const path = linkPath(href, source);
    if (!path || !inLocale(path, source.locale)) return;
    const { search, hash } = new URL(href, 'https://localhost');
    const next = `${hrefLike(href, swap(path), target)}${search}${hash}`;
    if (link.textContent.trim() === href) link.textContent = next;
    link.setAttribute('href', next);
    count += 1;
  });
  const text = cell.textContent.trim();
  const onlyText = [...cell.querySelectorAll('*')].every(({ tagName }) => tagName === 'P');
  if (onlyText && /^\/\S*$/.test(text) && inLocale(text, source.locale)) {
    setCellText(cell, swap(text));
    count += 1;
  }
  return count;
}

async function readSourceRows(api, source) {
  const page = await api.getDocument(source);
  if (!page.ok) throw new Error(`Cannot read the current page (HTTP ${page.status})`);
  const block = metadataBlock(parseDocument(page.html));
  if (!block) throw new Error('The current page has no metadata block.');
  return metadataEntries(block).filter(({ key }) => !NEVER_COPY.has(key));
}

function newRow(doc, label, valueCell) {
  const row = doc.createElement('div');
  const keyCell = doc.createElement('div');
  const text = doc.createElement('p');
  text.textContent = label;
  keyCell.append(text);
  row.append(keyCell, valueCell);
  return row;
}

export default function createMetadataOperation({
  preset: presetLabel = '', source: initialSource, mapping: initialMapping, targets: initialTargets,
} = {}) {
  const PRESET_LABEL = String(presetLabel).trim();
  const PRESET_ROW = toMetaName(PRESET_LABEL);
  let source;
  let mapping;

  /** Writes only the selected row; the other rows of the target page are left as they are. */
  function apply(doc, { target, shared }) {
    const { row } = shared;
    const key = translateKey(row.key, source.locale, target.locale);
    let block = metadataBlock(doc);
    const notes = [];
    if (!block) {
      const last = sections(doc).at(-1);
      if (!last) throw new Error('The page has no section to hold a metadata block');
      block = doc.createElement('div');
      block.className = 'metadata';
      last.append(block);
      notes.push('metadata block created');
    }
    const matches = metadataEntries(block).filter((entry) => entry.key === key);
    if (matches.length > 1) {
      throw new Error(`"${matches[0].label}" appears ${matches.length} times in this page's metadata`);
    }
    const value = doc.importNode(row.cell, true);
    const switched = localizeValue(value, { source, target, rows: mapping.rows });
    const [match] = matches;
    if (!match) {
      const label = labelFor(key, row);
      block.append(newRow(doc, label, value));
      notes.unshift(`${label} added = ${preview(value)}`);
    } else if (match.cell.innerHTML !== value.innerHTML) {
      match.cell.replaceChildren(...value.childNodes);
      notes.unshift(`${match.label} = ${preview(match.cell)}`);
    } else {
      return { summary: '' };
    }
    if (switched) notes.push(`${switched} link(s) switched to ${target.locale.toUpperCase()}`);
    return { summary: notes.join(' · ') };
  }

  /** Source key of the `?row=` preset, given in either language ("Partner" on a FR page). */
  function presetKey(counts, locale) {
    if (NEVER_COPY.has(PRESET_ROW)) throw new Error(`"${PRESET_LABEL}" is never copied between languages.`);
    const key = [PRESET_ROW, ...LOCALES.filter((code) => code !== locale)
      .map((code) => translateKey(PRESET_ROW, code, locale))]
      .find((candidate) => counts.has(candidate));
    if (!key) throw new Error(`This page has no "${PRESET_LABEL}" row in its metadata block.`);
    if (counts.get(key) > 1) {
      throw new Error(`"${PRESET_LABEL}" appears ${counts.get(key)} times on this page: fix it first.`);
    }
    return key;
  }

  return {
    title: 'Metadata sync',
    allowContentComparison: true,
    fields: [],
    pages: {},
    apply,

    async setup({ context, api }) {
      source = initialSource || pageSource(context);
      const { site, path, locale } = source;
      const [entries, loaded] = await Promise.all([
        readSourceRows(api, source), initialMapping || loadMapping(api, source),
      ]);
      mapping = loaded;
      if (!entries.length) throw new Error('The metadata block of this page has no row to copy.');

      const others = LOCALES.filter((code) => code !== locale);
      const targets = initialTargets || others
        .map((code) => ({ locale: code, ...mapPath(path, locale, code, mapping.rows) }));
      const where = targets.map(({ locale: code, path: target, mapped }) => `${code.toUpperCase()} ${target}${mapped ? '' : ' (same path, not in the language-switcher sheet)'}`).join(', ');
      const counts = new Map();
      entries.forEach(({ key }) => counts.set(key, (counts.get(key) || 0) + 1));
      const preset = PRESET_ROW ? presetKey(counts, locale) : '';
      const options = (preset ? [preset] : [...counts.keys()]).map((key) => {
        const { label, cell } = entries.find((entry) => entry.key === key);
        const repeated = counts.get(key) > 1;
        return {
          value: key,
          label: `${label} — ${repeated ? `appears ${counts.get(key)} times: fix this page first` : preview(cell)}`,
          disabled: repeated,
        };
      });
      const what = preset ? `the "${entries.find(({ key }) => key === preset).label}" row` : 'one row';
      return {
        description: `Copies ${what} of the metadata block of this page (${locale.toUpperCase()} ${path}) to ${where}. `
          + 'Only that row is written: the other rows of the target page are kept. '
          + 'The value is copied as is (no translation); internal links are switched to the target language. '
          + 'This page is never modified. DA saves your edits after a few seconds: wait before analysing.'
          + `${mapping.error ? ` Language-switcher sheet unavailable: ${mapping.error}` : ''}`,
        siteIds: [site.id],
        locales: others,
        pages: Object.fromEntries(targets.map(({ locale: code, path: target }) => [code, target])),
        fields: [{
          name: 'row',
          label: 'Row to copy',
          type: 'select',
          required: true,
          default: preset,
          help: 'Matched by name; translated names (Partner ↔ Partenaire, Category(ies) ↔ Axe(s)…) are mapped. If the target page has no such row, it is added.',
          options: preset ? options : [{ value: '', label: 'Choose a row…' }, ...options],
        }],
      };
    },

    async load({ api, input }) {
      const found = (await readSourceRows(api, source)).filter(({ key }) => key === input.row);
      if (!found.length) throw new Error(`"${input.row}" is no longer on this page: reopen the tool.`);
      if (found.length > 1) throw new Error(`"${found[0].label}" appears ${found.length} times on this page.`);
      return { row: found[0] };
    },
  };
}
