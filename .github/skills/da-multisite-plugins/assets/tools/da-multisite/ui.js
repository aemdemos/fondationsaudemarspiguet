/**
 * Generic multi-site tool UI. An operation describes its fields, target pages
 * and an in-memory `apply(doc, { target, values })`; this module does the rest.
 * The DOM is built with createElement/textContent only (no innerHTML).
 */
import { LOCALES, ORG, SITES } from './sites.js';
import {
  aemStep, aemUrl, applyTarget, collectAssets, createApi, daEditUrl, expandTargets,
  inspectAsset, planTarget, runPool, targetAssetIds, uploadAsset, valuesFor,
} from './core.js';

const CONCURRENCY = 3;
const SDK_TIMEOUT_MS = 10000;
const AVAILABLE_FILE = new Set(['new', 'exists', 'uploaded']);
const ON_PAGE = new Set(['written', 'unchanged']);
const LABELS = {
  ready: 'Ready',
  unchanged: 'Up to date',
  written: 'Written',
  new: 'New file',
  exists: 'Existing file',
  uploaded: 'Uploaded',
  ok: 'Done',
  missing: 'Not found',
  denied: 'No access',
  conflict: 'Conflict',
  blocked: 'Blocked',
  skipped: 'Skipped',
  error: 'Error',
};

function h(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) return;
    if (key === 'text') node.textContent = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? '' : String(value));
  });
  const present = (child) => child !== null && child !== undefined && child !== false;
  node.append(...children.flat().filter(present));
  return node;
}

const withTimeout = (promise, ms) => Promise.race([
  promise,
  new Promise((resolve, reject) => { setTimeout(() => reject(new Error('timeout')), ms); }),
]);

const errorText = (error) => error?.message || String(error);

function countStates(results) {
  const counts = results.reduce((acc, { state }) => ({
    ...acc, [state]: (acc[state] || 0) + 1,
  }), {});
  return Object.entries(counts).map(([state, count]) => `${count} ${(LABELS[state] || state).toLowerCase()}`).join(', ') || 'nothing to do';
}

function stateCell(result, href) {
  if (!result) return h('span', { class: 'dams-muted', text: '—' });
  return h(
    'div',
    { class: 'dams-result' },
    h('span', { class: `dams-state dams-state-${result.state}`, text: LABELS[result.state] || result.state }),
    result.message ? h('span', { class: 'dams-message', text: result.message }) : null,
    href && result.state === 'ok' ? h('a', {
      href, target: '_blank', rel: 'noopener noreferrer', text: 'Open',
    }) : null,
  );
}

function dataTable(caption, headers, rows) {
  const table = h(
    'table',
    { class: 'dams-table' },
    h('caption', { text: caption }),
    h('thead', {}, h('tr', {}, headers.map((text) => h('th', { scope: 'col', text })))),
    h('tbody', {}, rows.map((cells) => h('tr', {}, cells.map((cell) => h('td', {}, cell))))),
  );
  return h('div', {
    class: 'dams-table-wrap', role: 'region', 'aria-label': caption, tabindex: '0',
  }, table);
}

function createTool({ api, operation, root }) {
  const controls = new Map();
  let run = null;
  let busy = false;
  let confirming = false;

  const status = h('p', { class: 'dams-status', role: 'status', 'aria-live': 'polite' });
  const announce = (message, tone = 'info') => {
    status.textContent = message;
    status.dataset.tone = tone;
  };

  const siteBoxes = SITES.map((site) => h('input', {
    type: 'checkbox', name: 'site', value: site.id, checked: true,
  }));
  const localeBoxes = LOCALES.map((locale) => h('input', {
    type: 'checkbox', name: 'locale', value: locale, checked: true,
  }));
  const checked = (boxes) => boxes.filter((box) => box.checked).map((box) => box.value);

  const choice = (legend, boxes, labels) => h(
    'fieldset',
    { class: 'dams-choice' },
    h('legend', { text: legend }),
    boxes.map((box, index) => h('label', {}, box, ` ${labels[index]}`)),
  );

  function fieldControl(field, locale) {
    const id = `dams-${field.name}${locale ? `-${locale}` : ''}`;
    const helpId = field.help ? `${id}-help` : null;
    const common = {
      id, name: id, required: field.required, 'aria-describedby': helpId,
    };
    let control;
    if (field.type === 'select') {
      control = h('select', common, field.options.map((option) => h('option', {
        value: option.value, text: option.label, selected: option.value === field.default,
      })));
    } else if (field.type === 'file') {
      control = h('input', { ...common, type: 'file', accept: field.accept });
    } else {
      control = h('input', {
        ...common, type: 'text', autocomplete: 'off', maxlength: field.maxLength,
      });
    }
    controls.set(locale ? `${field.name}.${locale}` : field.name, control);
    return h(
      'div',
      { class: 'dams-field', 'data-locale': locale },
      h('label', { for: id, text: `${field.label}${locale ? ` (${locale.toUpperCase()})` : ''}` }),
      control,
      helpId ? h('p', { id: helpId, class: 'dams-help', text: field.help }) : null,
    );
  }

  const syncLocaleControls = () => {
    const active = checked(localeBoxes);
    operation.fields.filter(({ localized }) => localized).forEach((field) => {
      LOCALES.forEach((locale) => {
        controls.get(`${field.name}.${locale}`).disabled = !active.includes(locale);
      });
    });
  };

  function readInput() {
    const siteIds = checked(siteBoxes);
    const locales = checked(localeBoxes);
    const errors = [];
    if (!siteIds.length) errors.push('Select at least one site.');
    if (!locales.length) errors.push('Select at least one language.');
    const input = {};
    operation.fields.forEach((field) => {
      const read = (key, label) => {
        const control = controls.get(key);
        const value = field.type === 'file' ? control.files[0] || null : control.value.trim();
        if (field.required && !value) errors.push(`${label} is required.`);
        if (value && field.maxBytes && value.size > field.maxBytes) errors.push(`${label} is too large.`);
        return value;
      };
      input[field.name] = field.localized
        ? Object.fromEntries(locales.map((locale) => [locale, read(`${field.name}.${locale}`, `${field.label} (${locale.toUpperCase()})`)]))
        : read(field.name, field.label);
    });
    if (!errors.length && operation.validate) {
      errors.push(...(operation.validate(input, { locales }) || []));
    }
    return {
      input, siteIds, locales, errors,
    };
  }

  const form = h('form', { class: 'dams-form', novalidate: true });
  const analyseButton = h('button', { type: 'submit', class: 'dams-primary', text: 'Analyse' });
  const applyButton = h('button', { type: 'button', text: 'Apply changes…' });
  const previewButton = h('button', { type: 'button', text: 'Preview' });
  const publishButton = h('button', { type: 'button', text: 'Publish…' });
  const confirmSlot = h('div', { class: 'dams-confirm-slot' });
  const results = h('div', { class: 'dams-results', 'aria-live': 'off' });

  function updateButtons() {
    const idle = !busy && !confirming;
    const usable = idle && run && !run.stale;
    analyseButton.disabled = !idle;
    applyButton.disabled = !usable || !(run.pages.some(({ content }) => content.state === 'ready')
      || run.files.some(({ content }) => content.state === 'new'));
    previewButton.disabled = !usable
      || !run.pages.some(({ content }) => ON_PAGE.has(content.state));
    publishButton.disabled = !usable || !run.pages.some(({ preview }) => preview?.state === 'ok');
    results.setAttribute('aria-busy', String(busy));
  }

  function render() {
    results.replaceChildren();
    if (run) {
      results.append(dataTable('Pages', ['Site', 'Language', 'Page', 'Content', 'Preview', 'Publish'], run.pages.map((page) => [
        page.target.site.label,
        page.target.locale.toUpperCase(),
        h('a', {
          href: daEditUrl(page.target), target: '_blank', rel: 'noopener noreferrer', text: page.target.path,
        }),
        stateCell(page.content),
        stateCell(page.preview, aemUrl(page.target)),
        stateCell(page.live, aemUrl(page.target, 'live')),
      ])));
      if (run.files.length) {
        results.append(dataTable('Files', ['Site', 'File', 'Content', 'Preview', 'Publish'], run.files.map((file) => [
          file.asset.site.label,
          file.asset.path,
          stateCell(file.content),
          stateCell(file.preview, aemUrl(file.asset)),
          stateCell(file.live, aemUrl(file.asset, 'live')),
        ])));
      }
    }
    updateButtons();
  }

  async function guarded(task) {
    busy = true;
    updateButtons();
    try {
      await task();
    } catch (error) {
      announce(errorText(error), 'error');
    } finally {
      busy = false;
      render();
    }
  }

  function askConfirm(trigger, message, confirmLabel, task) {
    confirming = true;
    updateButtons();
    const close = () => {
      confirming = false;
      confirmSlot.replaceChildren();
    };
    const yes = h('button', {
      type: 'button',
      class: 'dams-primary',
      text: confirmLabel,
      onclick: () => {
        close();
        guarded(task);
      },
    });
    const no = h('button', {
      type: 'button',
      text: 'Cancel',
      onclick: () => {
        close();
        updateButtons();
        trigger.focus();
      },
    });
    confirmSlot.replaceChildren(h('div', { class: 'dams-confirm', role: 'group', 'aria-label': 'Confirmation' }, h('p', { text: message }), yes, no));
    yes.focus();
  }

  const missingFile = (page, key, accepted) => run.files
    .find((file) => page.assetIds.includes(file.asset.id) && !accepted.has(file[key]?.state));

  async function analyse() {
    const {
      input, siteIds, locales, errors,
    } = readInput();
    if (errors.length) {
      announce(errors.join(' '), 'error');
      return;
    }
    const targets = expandTargets({ pages: operation.pages, siteIds, locales });
    const assets = collectAssets(operation.fields, input, targets);
    run = null;
    render();
    announce(`Analysing ${targets.length} page(s) and ${assets.length} file(s)…`);
    const fileResults = await runPool(assets, CONCURRENCY, (asset) => inspectAsset(api, asset));
    const pageResults = await runPool(targets, CONCURRENCY, (target) => planTarget(
      api,
      operation,
      target,
      valuesFor(operation.fields, input, target.locale),
    ));
    run = {
      input,
      stale: false,
      files: assets.map((asset, index) => ({ asset, content: fileResults[index] })),
      pages: targets.map((target, index) => ({
        target,
        assetIds: targetAssetIds(operation.fields, input, target),
        content: pageResults[index],
      })),
    };
    run.pages.forEach((page) => {
      const missing = page.content.state === 'ready' && missingFile(page, 'content', AVAILABLE_FILE);
      if (missing) page.content = { state: 'blocked', message: `File unavailable: ${missing.asset.path}` };
    });
    // Never upload a file that no writable page will link to.
    const needed = new Set(run.pages
      .filter(({ content }) => ['ready', 'unchanged'].includes(content.state))
      .flatMap(({ assetIds }) => assetIds));
    run.files.filter(({ asset, content }) => content.state === 'new' && !needed.has(asset.id))
      .forEach((file) => { file.content = { state: 'skipped', message: 'No writable page uses this file' }; });
    announce(`Analysis: ${countStates(run.pages.map(({ content }) => content))}. Nothing has been written.`);
  }

  async function apply() {
    const label = `Before ${operation.title} ${new Date().toISOString()}`;
    const fileResults = await runPool(
      run.files,
      CONCURRENCY,
      (file) => uploadAsset(api, file.asset, file.content),
    );
    run.files.forEach((file, index) => { file.content = fileResults[index]; });
    const pageResults = await runPool(run.pages, CONCURRENCY, (page) => {
      const missing = page.content.state === 'ready' && missingFile(page, 'content', new Set(['exists', 'uploaded']));
      if (missing) return { state: 'blocked', message: `File unavailable: ${missing.asset.path}` };
      const values = valuesFor(operation.fields, run.input, page.target.locale);
      return applyTarget(api, operation, page.target, values, page.content, label);
    });
    run.pages.forEach((page, index) => { page.content = pageResults[index]; });
    announce(`Write: ${countStates(pageResults)}. Use Preview to check the pages.`);
  }

  async function aemRun(action) {
    const isLive = action === 'live';
    const pages = run.pages.filter((page) => (isLive ? page.preview?.state === 'ok' : ON_PAGE.has(page.content.state)));
    const ids = new Set(pages.flatMap(({ assetIds }) => assetIds));
    const files = run.files.filter((file) => ids.has(file.asset.id)
      && (isLive ? file.preview?.state === 'ok' : ['exists', 'uploaded'].includes(file.content.state)));
    // Files first: a page must never go out before the documents it links to.
    const fileResults = await runPool(
      files,
      CONCURRENCY,
      (file) => aemStep(api, action, file.asset),
    );
    files.forEach((file, index) => { file[action] = fileResults[index]; });
    const pageResults = await runPool(pages, CONCURRENCY, (page) => {
      const missing = missingFile(page, action, new Set(['ok']));
      if (missing) return { state: 'blocked', message: `File step failed: ${missing.asset.path}` };
      return aemStep(api, action, page.target);
    });
    pages.forEach((page, index) => { page[action] = pageResults[index]; });
    announce(`${isLive ? 'Publish' : 'Preview'}: ${countStates(pageResults)}.`);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!busy && !confirming) guarded(analyse);
  });
  form.addEventListener('change', (event) => {
    if (event.target.name === 'locale') syncLocaleControls();
  });
  ['input', 'change'].forEach((type) => form.addEventListener(type, () => {
    if (!run || run.stale || busy) return;
    run.stale = true;
    announce('Inputs changed: run Analyse again before writing.', 'warning');
    updateButtons();
  }));
  applyButton.addEventListener('click', () => {
    const pages = run.pages.filter(({ content }) => content.state === 'ready').length;
    const files = run.files.filter(({ content }) => content.state === 'new').length;
    askConfirm(applyButton, `Write ${pages} page(s) and upload ${files} new file(s) in DA? A version of each page is saved first.`, 'Write in DA', apply);
  });
  previewButton.addEventListener('click', () => guarded(() => aemRun('preview')));
  publishButton.addEventListener('click', () => {
    const pages = run.pages.filter(({ preview }) => preview?.state === 'ok').length;
    askConfirm(publishButton, `Publish ${pages} previewed page(s) and their files to the live sites?`, 'Publish now', () => aemRun('live'));
  });
  window.addEventListener('beforeunload', (event) => {
    if (busy) event.preventDefault();
  });

  form.append(
    h('div', { class: 'dams-scope' }, choice('Sites', siteBoxes, SITES.map(({ label }) => label)), choice('Languages', localeBoxes, LOCALES.map((locale) => locale.toUpperCase()))),
    ...operation.fields.flatMap((field) => (field.localized
      ? LOCALES.map((locale) => fieldControl(field, locale))
      : [fieldControl(field)])),
    h('div', { class: 'dams-actions' }, analyseButton, applyButton, previewButton, publishButton),
  );
  root.replaceChildren(
    h('h1', { text: operation.title }),
    operation.description ? h('p', { class: 'dams-intro', text: operation.description }) : null,
    form,
    confirmSlot,
    status,
    results,
  );
  syncLocaleControls();
  render();
  return { analyse: () => guarded(analyse) };
}

/**
 * @param {{ sdk: Promise, operation: object, root: HTMLElement, timeoutMs?: number }} options
 */
export default async function mountMultisiteTool({
  sdk, operation, root, timeoutMs = SDK_TIMEOUT_MS,
}) {
  root.classList.add('da-multisite');
  const fatal = (message) => root.replaceChildren(
    h('h1', { text: operation.title }),
    h('p', {
      class: 'dams-status', role: 'alert', 'data-tone': 'error', text: message,
    }),
  );
  root.replaceChildren(h('h1', { text: operation.title }), h('p', { class: 'dams-status', role: 'status', text: 'Connecting to DA…' }));

  let session;
  try {
    session = await withTimeout(sdk, timeoutMs);
  } catch (error) {
    fatal('DA is not available. Open this tool from da.live.');
    return null;
  }
  if (session?.context?.org !== ORG) {
    fatal(`This tool only manages the "${ORG}" organization.`);
    return null;
  }
  try {
    return createTool({ api: createApi(session.actions?.daFetch), operation, root });
  } catch (error) {
    fatal(errorText(error));
    return null;
  }
}
