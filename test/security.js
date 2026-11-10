import { createForm } from '../blocks/form/form.js';
import setRichTextContent from '../blocks/form/rich-text.js';
import { defaultSubmitSuccessHandler } from '../blocks/form/rules/functions.js';
import { initAdaptiveForm } from '../blocks/form/rules/index.js';
import { handleSubmit, submitSuccess } from '../blocks/form/submit.js';
import { createLabel } from '../blocks/form/util.js';
import decorateMapBien from '../blocks/map-bien/map-bien.js';
import decorateMap from '../blocks/map/map.js';
import { loadScript } from '../scripts/aem.js';

const results = document.querySelector('#results');
const fixtures = document.querySelector('#fixtures');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function captureMapScripts(decorate, pathname) {
  const originalUrl = window.location.href;
  const originalPlaceholder = window.placeholder;
  const originalHeadAppend = document.head.append;
  const originalBodyAppendChild = document.body.appendChild;
  const headScripts = [];
  let mapScript;
  let mapLoaded;
  const block = document.createElement('div');
  block.append(document.createElement('div'));
  fixtures.append(block);

  window.history.replaceState(null, '', pathname);
  window.placeholder = {};
  document.head.append = function append(...nodes) {
    nodes.forEach((node) => {
      if (node.tagName === 'SCRIPT') {
        headScripts.push(node);
        node.dataset.originalSrc = node.src;
        node.src = 'data:text/javascript,void%200';
      }
    });
    originalHeadAppend.apply(this, nodes);
  };
  document.body.appendChild = function appendChild(node) {
    if (node.tagName === 'SCRIPT') {
      mapScript = node;
      node.dataset.originalSrc = node.src;
      node.src = 'data:text/javascript,void%200';
      mapLoaded = new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Map script did not load')), 3000);
        node.addEventListener('load', () => {
          clearTimeout(timer);
          resolve();
        }, { once: true });
        node.addEventListener('error', () => {
          clearTimeout(timer);
          reject(new Error('Map script failed to load'));
        }, { once: true });
      });
    }
    return originalBodyAppendChild.call(this, node);
  };

  try {
    await decorate(block);
    await mapLoaded;
    return {
      block,
      headScripts,
      mapScript,
      nonce: window.placeholder.nonce,
      insertedIntoBody: mapScript?.parentNode === document.body,
      dependenciesInHead: headScripts.every((script) => script.parentNode === document.head),
    };
  } finally {
    document.head.append = originalHeadAppend;
    document.body.appendChild = originalBodyAppendChild;
    headScripts.forEach((script) => script.remove());
    mapScript?.remove();
    window.placeholder = originalPlaceholder;
    window.history.replaceState(null, '', originalUrl);
  }
}

function assertMapUrl(script, language) {
  assert(script, 'The map script was not appended');
  const url = new URL(script.dataset.originalSrc);
  assert(url.origin === 'https://maps.googleapis.com' && url.pathname === '/maps/api/js', 'Map URL changed');
  assert([...url.searchParams.keys()].join(',') === 'key,callback,language,loading', 'Map URL has unexpected parameters');
  assert(url.searchParams.get('callback') === 'initMap', 'Map callback was altered');
  assert(url.searchParams.get('language') === language, 'Map language is incorrect');
  assert(url.searchParams.get('loading') === 'async', 'Map loading mode changed');
}

async function withFeaturedProjects(path, products, callback, options = {}) {
  const originalUrl = window.location.href;
  const originalFetch = window.fetch;
  const originalHlx = window.hlx;
  const originalPlaceholders = window.placeholders;
  const originalAddEventListener = window.addEventListener;
  const originalWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');
  const resizeListeners = [];
  let resetLanguage;

  window.history.replaceState(null, '', `${path}?dapreview=1&rum=off`);
  window.hlx = { ...originalHlx, codeBasePath: '' };
  window.placeholders = {
    en: {
      featuredProjectsHeadingOnNewsArticles: 'Related projects',
      featuredProjectsHeadingOnProjectArticles: 'More projects',
    },
    fr: {
      featuredProjectsHeadingOnNewsArticles: 'Projets associes',
      featuredProjectsHeadingOnProjectArticles: 'Plus de projets',
    },
    'category-news': options.categoryNews || { en: [], fr: [] },
    'category-projects': { en: [], fr: [] },
    'language-switcher': [],
  };
  window.fetch = async (url) => {
    if (typeof url === 'string' && url.includes('/projects-index.json?')) {
      return { ok: true, json: async () => ({ total: products.length, data: products }) };
    }
    throw new Error(`Unexpected fixture request: ${url}`);
  };
  window.addEventListener = function addEventListener(type, listener, listenerOptions) {
    if (type === 'resize') resizeListeners.push(listener);
    else originalAddEventListener.call(this, type, listener, listenerOptions);
  };
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1200 });

  try {
    const [{ default: decorateFeatured }, languageModule] = await Promise.all([
      import('../blocks/featured-projects/featured-projects.js'),
      import('../scripts/scripts.js'),
    ]);
    resetLanguage = languageModule.getLanguageFromPath;
    resetLanguage(path, true);

    const block = document.createElement('div');
    block.className = 'featured-projects block';
    const row = document.createElement('div');
    const cell = document.createElement('div');
    cell.textContent = options.template || 'project-article';
    row.append(cell);
    block.append(row);
    fixtures.append(block);
    await decorateFeatured(block);
    await callback({ block, resizeListeners });
  } finally {
    window.fetch = originalFetch;
    window.hlx = originalHlx;
    window.placeholders = originalPlaceholders;
    window.addEventListener = originalAddEventListener;
    if (originalWidth) Object.defineProperty(window, 'innerWidth', originalWidth);
    else delete window.innerWidth;
    window.history.replaceState(null, '', originalUrl);
    resetLanguage?.(window.location.pathname, true);
  }
}

const tests = [
  {
    name: '01 - rich form legends retain formatting without executable content',
    run() {
      const legend = createLabel({
        id: 'terms',
        label: {
          richText: true,
          value: 'Accept <strong onmouseover="window.securityProbe = true">terms</strong> '
            + '<a href="javascript:alert(1)">unsafe</a> '
            + '<a href="/conditions" target="_blank" data-aue-prop="link">conditions</a>',
        },
      }, 'legend');
      fixtures.append(legend);

      assert(legend.querySelector('strong')?.textContent === 'terms', 'Formatting was lost');
      assert(!legend.querySelector('[onmouseover]'), 'Event handler was retained');
      assert(!legend.querySelector('a[href^="javascript:"]'), 'Unsafe link was retained');
      const link = legend.querySelector('a[href="/conditions"]');
      assert(link?.target === '_blank', 'Safe link target was lost');
      assert(link.dataset.aueProp === 'link', 'Authoring instrumentation was lost');
      legend.remove();
    },
  },
  {
    name: '01b - rich and plain text fields preserve their intended rendering',
    async run() {
      const { form } = await createForm({
        id: 'text-form',
        action: '/contact',
        items: [
          {
            id: 'rich-text',
            name: 'rich-text',
            fieldType: 'plain-text',
            richText: true,
            value: '<strong onclick="window.securityProbe = true">Rich</strong> '
              + '<a href="javascript:alert(1)">unsafe</a> <a href="/help">help</a>',
          },
          {
            id: 'plain-text',
            name: 'plain-text',
            fieldType: 'plain-text',
            richText: false,
            value: '<strong>Plain</strong>',
          },
        ],
      });
      fixtures.append(form);

      const rich = form.querySelector('#rich-text');
      const plain = form.querySelector('#plain-text');
      assert(rich.querySelector('strong')?.textContent === 'Rich', 'Rich text formatting was lost');
      assert(!rich.querySelector('[onclick]'), 'Rich text retained an event handler');
      assert(!rich.querySelector('a[href^="javascript:"]'), 'Rich text retained an unsafe link');
      assert(rich.querySelector('a[href="/help"]'), 'Safe rich text link was lost');
      assert(plain.textContent === '<strong>Plain</strong>', 'Plain text was parsed as HTML');
      assert(!plain.querySelector('strong'), 'Plain text unexpectedly contains markup');
    },
  },
  {
    name: '01c - sanitizer preserves editor markup and rejects obfuscated payloads',
    async run() {
      await loadScript('/scripts/dompurify.min.js');
      assert(window.DOMPurify?.version === '3.4.17', 'The shared sanitizer was not loaded');
      const authored = '<p class="authored" data-aue-resource="urn:test" '
        + 'data-richtext-resource="urn:rich"><span style="color: red">Hello</span> '
        + '<a href="/help" target="_blank" rel="external">Help</a> '
        + '<img src="/icons/flech-to-top-en.svg" alt="Arrow" onerror="window.securityProbe = true"></p> '
        + '<a href="java&#x09;script:alert(1)">unsafe</a><svg onload="window.securityProbe = true"></svg>'
        + '<script>window.securityProbe = true</script>';
      const element = document.createElement('div');
      setRichTextContent(element, authored);
      fixtures.append(element);

      const paragraph = element.querySelector('p');
      const link = paragraph.querySelector('a');
      assert(paragraph.dataset.aueResource === 'urn:test', 'Editor instrumentation was lost');
      assert(paragraph.dataset.richtextResource === 'urn:rich', 'Rich text instrumentation was lost');
      assert(paragraph.classList.contains('authored'), 'Authored class was lost');
      assert(paragraph.querySelector('span').style.color === 'red', 'Authored formatting was lost');
      assert(link.getAttribute('href') === '/help' && link.target === '_blank', 'Safe link changed');
      assert(link.relList.contains('external') && link.relList.contains('noopener'), 'Safe link protections changed');
      assert(paragraph.querySelector('img')?.alt === 'Arrow', 'Image alternative was lost');
      assert(!element.querySelector('script, svg, [onerror]'), 'Unsafe markup was retained');
      assert(!element.querySelector('a[href^="java"]'), 'Obfuscated unsafe link was retained');

      const editorHtml = window.DOMPurify.sanitize(authored, { USE_PROFILES: { html: true } });
      const editorDocument = new DOMParser().parseFromString(editorHtml, 'text/html');
      assert(editorDocument.querySelector('[data-aue-resource="urn:test"]'), 'Editor sanitization changed');
      assert(!editorDocument.querySelector('script, svg, [onerror]'), 'Editor sanitization is unsafe');
    },
  },
  {
    name: '02 - form descriptions preserve safe markup without executable content',
    async run() {
      const { form } = await createForm({
        id: 'contact-form',
        action: '/contact',
        items: [{
          id: 'contact',
          name: 'contact',
          fieldType: 'text-input',
          label: { value: 'Contact' },
          description: '<p>Helpful <strong onclick="window.securityProbe = true">information</strong> '
            + '<a href="javascript:alert(1)">unsafe</a> <a href="/help">Help</a></p>',
        }],
      });
      fixtures.append(form);

      const input = form.querySelector('input');
      const help = form.querySelector('.field-description');
      assert(help.id === 'contact-description', 'Description ID was lost');
      assert(input.getAttribute('aria-describedby') === help.id, 'Description is not associated');
      assert(help.querySelector('strong')?.textContent === 'information', 'Formatting was lost');
      assert(help.querySelector('a[href="/help"]'), 'Safe link was lost');
      assert(!help.querySelector('[onclick]'), 'Event handler was retained');
      assert(!help.querySelector('a[href^="javascript:"]'), 'Unsafe link was retained');
    },
  },
  {
    name: '03 - invalid events render validation messages as text',
    async run() {
      const message = '<img src=x onerror="window.securityProbe = true"> Required';
      const { form } = await createForm({
        id: 'validation-form',
        action: '/contact',
        items: [{
          id: 'required-contact',
          name: 'required-contact',
          fieldType: 'text-input',
          required: true,
          label: { value: 'Contact' },
          constraintMessages: { required: message },
        }],
      });
      fixtures.append(form);

      const input = form.querySelector('input');
      assert(!form.checkValidity(), 'The required input should be invalid');
      const help = form.querySelector('.field-description');
      assert(help?.textContent === message, 'Validation message was not preserved as text');
      assert(!help.querySelector('img'), 'Validation message was parsed as HTML');
      assert(input.closest('.field-wrapper').classList.contains('field-invalid'), 'Invalid state is missing');

      input.value = 'Valid';
      input.dispatchEvent(new Event('change', { bubbles: true }));
      assert(!form.querySelector('.field-description'), 'Transient validation message was not removed');
      assert(!input.closest('.field-wrapper').classList.contains('field-invalid'), 'Invalid state was not cleared');
    },
  },
  {
    name: '04 - change events restore sanitized form descriptions',
    async run() {
      const { form } = await createForm({
        id: 'change-form',
        action: '/contact',
        items: [{
          id: 'changed-contact',
          name: 'changed-contact',
          fieldType: 'text-input',
          required: true,
          label: { value: 'Contact' },
          description: '<p>Read <strong onmouseover="window.securityProbe = true">this</strong> '
            + '<a href="javascript:alert(1)">unsafe</a> <a href="/help">help</a>.</p>',
        }],
      });
      fixtures.append(form);

      const input = form.querySelector('input');
      assert(!form.checkValidity(), 'The required input should be invalid');
      assert(input.closest('.field-wrapper').classList.contains('field-invalid'), 'Invalid state is missing');
      input.value = 'Valid';
      input.dispatchEvent(new Event('change', { bubbles: true }));

      const help = form.querySelector('.field-description');
      assert(help.querySelector('strong')?.textContent === 'this', 'Description formatting was lost');
      assert(help.querySelector('a[href="/help"]'), 'Safe description link was lost');
      assert(!help.querySelector('[onmouseover]'), 'Restored event handler was retained');
      assert(!help.querySelector('a[href^="javascript:"]'), 'Restored unsafe link was retained');
      assert(!input.closest('.field-wrapper').classList.contains('field-invalid'), 'Invalid state was not cleared');
    },
  },
  {
    name: '04b - adaptive rules safely update descriptions and rich text',
    async run() {
      const originalWorker = window.Worker;
      const originalHlx = window.hlx;
      let worker;
      class TestWorker {
        constructor() {
          worker = this;
        }

        addEventListener(type, listener) {
          if (type === 'message') this.listener = listener;
        }

        postMessage(message) {
          if (message.name === 'init') {
            Promise.resolve().then(() => this.listener({
              data: { name: 'init', payload: message.payload },
            }));
          }
        }

        emit(data) {
          return this.listener({ data });
        }
      }

      window.Worker = TestWorker;
      window.hlx = { ...originalHlx, codeBasePath: '' };
      try {
        const form = await initAdaptiveForm({
          id: 'rule-form',
          action: '/contact',
          items: [
            {
              id: 'dynamic-contact',
              name: 'dynamic-contact',
              fieldType: 'text-input',
              required: true,
              description: '<p>Initial help</p>',
            },
            {
              id: 'dynamic-text',
              name: 'dynamic-text',
              fieldType: 'plain-text',
              richText: true,
              value: '<strong>Initial text</strong>',
            },
          ],
        }, createForm);
        fixtures.append(form);

        const description = '<p>Updated <strong onmouseover="window.securityProbe = true">help</strong> '
          + '<a href="javascript:alert(1)">unsafe</a> <a href="/help">link</a></p>';
        await worker.emit({
          name: 'fieldChanged',
          payload: {
            field: { id: 'dynamic-contact', fieldType: 'text-input' },
            changes: [{ propertyName: 'description', currentValue: description }],
          },
        });
        const help = form.querySelector('.field-description');
        assert(help.querySelector('strong')?.textContent === 'help', 'Updated help formatting was lost');
        assert(!help.querySelector('[onmouseover]'), 'Updated help retained an event handler');
        assert(!help.querySelector('a[href^="javascript:"]'), 'Updated help retained an unsafe link');

        await worker.emit({
          name: 'fieldChanged',
          payload: {
            field: { id: 'dynamic-text', fieldType: 'plain-text' },
            changes: [{
              propertyName: 'value',
              currentValue: '<strong onclick="window.securityProbe = true">Updated text</strong>',
            }],
          },
        });
        const text = form.querySelector('#dynamic-text');
        assert(text.querySelector('strong')?.textContent === 'Updated text', 'Updated rich text was lost');
        assert(!text.querySelector('[onclick]'), 'Updated rich text retained an event handler');

        const input = form.querySelector('#dynamic-contact');
        form.checkValidity();
        input.value = 'Valid';
        input.dispatchEvent(new Event('change', { bubbles: true }));
        assert(help.textContent.includes('Updated help'), 'Validation restored an outdated description');
        assert(!help.querySelector('[onmouseover]'), 'Validation restored an unsafe description');
      } finally {
        window.Worker = originalWorker;
        window.hlx = originalHlx;
      }
    },
  },
  {
    name: '05 - successful form submission safely renders its confirmation',
    async run() {
      const { form } = await createForm({
        id: 'submit-form',
        action: '/contact',
        items: [
          {
            id: 'contact-input', name: 'contact', fieldType: 'text-input', value: 'Alice',
          },
          {
            id: 'submit-button',
            name: 'submit',
            fieldType: 'button',
            buttonType: 'submit',
            label: { value: 'Send' },
          },
        ],
      });
      form.dataset.source = 'sheet';
      form.dataset.thankYouMsg = '<p>Thank you <strong onclick="window.securityProbe = true">Alice</strong> '
        + '<a href="javascript:alert(1)">unsafe</a> <a href="/next" target="_blank">Continue</a></p>';
      fixtures.append(form);

      let resetCalled = false;
      form.reset = () => { resetCalled = true; };
      const button = form.querySelector('button[type="submit"]');
      const originalFetch = window.fetch;
      const requests = [];
      window.fetch = async (url, options) => {
        requests.push({ url, options });
        return { ok: true };
      };
      try {
        await handleSubmit({ preventDefault() {}, submitter: button }, form);
      } finally {
        window.fetch = originalFetch;
      }

      const message = fixtures.querySelector('.form-message.success-message');
      assert(requests.length === 1, 'Submission was not sent exactly once');
      assert(JSON.parse(requests[0].options.body).data.contact === 'Alice', 'Submission payload changed');
      assert(message?.querySelector('strong')?.textContent === 'Alice', 'Confirmation formatting was lost');
      assert(message.querySelector('a[href="/next"]')?.target === '_blank', 'Safe confirmation link was lost');
      assert(!message.querySelector('[onclick]'), 'Confirmation event handler was retained');
      assert(!message.querySelector('a[href^="javascript:"]'), 'Unsafe confirmation link was retained');
      assert(resetCalled, 'Successful submission did not reset the form');
      assert(form.dataset.submitting === 'false' && !button.disabled, 'Submit state was not restored');
    },
  },
  {
    name: '05b - adaptive form confirmation uses the same sanitization',
    run() {
      const form = document.createElement('div');
      form.id = 'adaptive-form';
      fixtures.append(form);
      defaultSubmitSuccessHandler({
        event: {
          payload: {
            body: {
              thankYouMessage: '<p>Thank you <strong onmouseover="window.securityProbe = true">Alice</strong> '
                + '<a href="javascript:alert(1)">unsafe</a> <a href="/next">Continue</a></p>',
            },
          },
        },
        form: { $id: form.id },
      });

      const message = fixtures.querySelector('.tyMessage');
      assert(message?.querySelector('strong')?.textContent === 'Alice', 'Confirmation formatting was lost');
      assert(message.querySelector('a[href="/next"]'), 'Safe confirmation link was lost');
      assert(!message.querySelector('[onmouseover]'), 'Confirmation event handler was retained');
      assert(!message.querySelector('a[href^="javascript:"]'), 'Unsafe confirmation link was retained');
      assert(message.getAttribute('role') === 'alertdialog', 'Confirmation role was lost');
      assert(document.activeElement === message, 'Confirmation did not receive focus');
    },
  },
  {
    name: '05c - server confirmations, default message and form reset remain functional',
    run() {
      const form = document.createElement('form');
      const input = document.createElement('input');
      input.defaultValue = 'Original';
      input.value = 'Changed';
      const button = document.createElement('button');
      button.type = 'submit';
      button.disabled = true;
      form.dataset.submitting = 'true';
      form.append(input, button);
      const existing = document.createElement('div');
      existing.className = 'form-message success-message';
      fixtures.append(existing, form);

      submitSuccess({
        payload: { body: { thankYouMessage: '<p>Merci <strong>beaucoup</strong></p>' } },
      }, form);
      assert(existing.querySelector('strong')?.textContent === 'beaucoup', 'Server message formatting was lost');
      assert(input.value === 'Original', 'Successful submission did not reset the input');
      assert(!button.disabled && form.dataset.submitting === 'false', 'Submit state was not restored');

      submitSuccess({}, form);
      assert(existing.textContent === 'Thank you for your submission.', 'Default confirmation changed');
      assert(fixtures.querySelectorAll('.success-message').length === 1, 'Confirmation was duplicated');
    },
  },
  {
    name: '05d - adaptive rule engine still initializes in a real worker',
    async run() {
      const worker = new Worker('/blocks/form/rules/RuleEngineWorker.js', { type: 'module' });
      try {
        const state = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('Worker initialization timed out')), 5000);
          worker.addEventListener('message', ({ data }) => {
            clearTimeout(timer);
            resolve(data);
          });
          worker.addEventListener('error', (event) => {
            clearTimeout(timer);
            reject(new Error(event.message));
          });
          worker.postMessage({
            name: 'init',
            codeBasePath: '',
            payload: {
              id: 'worker-form',
              fieldType: 'form',
              properties: {},
              items: [{
                id: 'worker-input',
                name: 'worker-input',
                fieldType: 'text-input',
                type: 'string',
                label: { value: 'Name' },
              }],
              search: '',
            },
          });
        });
        assert(state.name === 'init' && state.payload.items.length === 1, 'Worker state was not initialized');
      } finally {
        worker.terminate();
      }
    },
  },
  {
    name: '06 - Biencommun map URL rejects path-based parameter injection',
    async run() {
      const { mapScript } = await captureMapScripts(
        decorateMapBien,
        '/fr&callback=evil&language=de/projects',
      );
      assertMapUrl(mapScript, 'en');
    },
  },
  {
    name: '07 - map URL rejects path-based parameter injection',
    async run() {
      const { mapScript } = await captureMapScripts(
        decorateMap,
        '/fr&callback=evil&language=de/projects',
      );
      assertMapUrl(mapScript, 'en');
    },
  },
  {
    name: '08 - Biencommun map appends a safe script and preserves localized loading',
    async run() {
      const french = await captureMapScripts(decorateMapBien, '/fr/projects');
      assertMapUrl(french.mapScript, 'fr');
      assert(french.mapScript.async && french.mapScript.defer, 'Async map loading changed');
      assert(french.mapScript.nonce === french.nonce, 'Map nonce was not propagated');
      assert(french.insertedIntoBody && french.dependenciesInHead, 'Map scripts were not inserted');
      assert(french.block.querySelector('#map') && french.block.querySelector('.map-category'), 'Map structure changed');
      const scripts = french.headScripts
        .map((script) => new URL(script.dataset.originalSrc).pathname);
      assert(scripts.join(',') === [
        '/jquery-3.7.1.min.js',
        '/blocks/map-bien/initmapscript.js',
        '/blocks/map-bien/mapstyles.js',
        '/blocks/map-bien/markerclusterer.js',
      ].join(','), 'Map dependency loading order changed');
      assert(french.headScripts.slice(1).every((script) => script.nonce === french.nonce), 'Dependency nonce was lost');

      const english = await captureMapScripts(decorateMapBien, '/en/projects');
      assertMapUrl(english.mapScript, 'en');
      const unknown = await captureMapScripts(decorateMapBien, '/unknown/projects');
      assertMapUrl(unknown.mapScript, 'en');
    },
  },
  {
    name: '09 - map appends a safe script and preserves localized loading',
    async run() {
      const english = await captureMapScripts(decorateMap, '/en/projects');
      assertMapUrl(english.mapScript, 'en');
      assert(english.mapScript.async && english.mapScript.defer, 'Async map loading changed');
      assert(english.mapScript.nonce === english.nonce, 'Map nonce was not propagated');
      assert(english.insertedIntoBody && english.dependenciesInHead, 'Map scripts were not inserted');
      assert(english.block.querySelector('#map') && english.block.querySelector('.map-category'), 'Map structure changed');
      const scripts = english.headScripts
        .map((script) => new URL(script.dataset.originalSrc).pathname);
      assert(scripts.join(',') === [
        '/jquery-3.7.1.min.js',
        '/blocks/map/initmapscript.js',
        '/blocks/map/mapstyles.js',
        '/blocks/map/markerclusterer.js',
      ].join(','), 'Map dependency loading order changed');
      assert(english.headScripts.slice(1).every((script) => script.nonce === english.nonce), 'Dependency nonce was lost');

      const french = await captureMapScripts(decorateMap, '/fr/projects');
      assertMapUrl(french.mapScript, 'fr');
      const root = await captureMapScripts(decorateMap, '/');
      assertMapUrl(root.mapScript, 'en');
    },
  },
  {
    name: '10 - featured projects render index data without executable HTML or links',
    async run() {
      const currentPath = '/en/fondation-pour-les-arbres-projects/current';
      const products = [
        {
          path: `${currentPath}/first`,
          title: 'First project',
          partner: 'Partner',
          category: 'Forest',
          location: 'Switzerland',
          duration: '2022 → 2026',
          image: '/icons/flech-to-top-en.svg',
        },
        {
          // eslint-disable-next-line no-script-url
          path: 'javascript:window.securityProbe=true',
          title: 'Second project',
          partner: 'Partner',
          category: 'Forest',
          location: '<strong onmouseover="window.securityProbe = true">Injected</strong>',
          duration: '2020 → 2025',
          image: '',
        },
        {
          path: `${currentPath}/third`,
          title: 'Third project',
          partner: 'Partner',
          category: 'Forest',
          location: 'France',
          duration: '2018 → 2024',
          image: '',
        },
        {
          path: currentPath,
          title: 'Current project',
          duration: '2024 → 2030',
        },
      ];

      await withFeaturedProjects(currentPath, products, async ({ block, resizeListeners }) => {
        const cards = [...block.querySelectorAll('.cards.featured > ul > li')];
        assert(block.querySelector('h2')?.textContent === 'More projects', 'Project heading changed');
        assert(cards.length === 3, 'Desktop project count changed');
        assert(!cards.some((card) => card.textContent.includes('Current project')), 'Current project was not excluded');
        assert(cards[0].querySelector('a')?.getAttribute('href') === products[0].path, 'Safe project link changed');
        assert(cards[0].querySelector('picture img')?.hasAttribute('alt'), 'Project image alternative was lost');
        assert(cards[0].querySelector('.projets-listing-infos br'), 'Project metadata line break was lost');
        const unsafeInfo = cards[1].querySelector('.projets-listing-infos');
        assert(!unsafeInfo.querySelector('[onmouseover]'), 'Project metadata retained an event handler');
        assert(unsafeInfo.textContent.includes(products[1].location), 'Project metadata was not rendered as text');
        assert(!cards[1].querySelector('a[href^="javascript:"]'), 'Unsafe project link was retained');
        assert(resizeListeners.length === 1, 'Responsive project listener was not installed');

        window.innerWidth = 600;
        resizeListeners[0]();
        await new Promise((resolve, reject) => {
          const started = Date.now();
          const check = () => {
            if (block.querySelectorAll('.cards.featured > ul > li').length === 2) resolve();
            else if (Date.now() - started > 3000) reject(new Error('Mobile projects did not render'));
            else requestAnimationFrame(check);
          };
          check();
        });
        assert(block.querySelectorAll('.cards.featured > ul > li').length === 2, 'Mobile project count changed');
      });
    },
  },
  {
    name: '10b - French news projects retain filtering, links and plain-text metadata',
    async run() {
      const currentPath = '/fr/fondation-pour-les-arbres-actualites/current';
      const products = [
        {
          path: '/fr/projets/un',
          title: 'Premier projet',
          partner: 'Partenaire',
          category: 'Nature',
          location: 'Suisse',
          duration: '2022 → 2026 <strong onclick="window.securityProbe = true">texte</strong>',
        },
        {
          path: 'https://example.org/projets/deux',
          title: 'Second projet',
          partner: 'Partenaire',
          category: 'Nature',
          location: 'France',
          duration: '2020 → 2025',
        },
        {
          path: '/fr/projets/trois',
          title: 'Autre categorie',
          category: 'Culture',
          duration: '2019 → 2024',
        },
      ];
      await withFeaturedProjects(currentPath, products, async ({ block }) => {
        const cards = [...block.querySelectorAll('.cards.featured > ul > li')];
        assert(block.querySelector('h2')?.textContent === 'Projets associes', 'French news heading changed');
        assert(cards.length === 2, 'French category filtering changed');
        assert(cards[1].querySelector('a')?.getAttribute('href') === products[1].path, 'HTTPS project link changed');
        assert(!cards[0].querySelector('.projets-listing-partners'), 'News cards unexpectedly show partners');
        const info = cards[0].querySelector('.projets-listing-infos');
        assert(info.textContent === products[0].duration, 'News duration was not rendered as text');
        assert(!info.querySelector('strong, br'), 'News duration was interpreted as markup');
      }, {
        template: 'news-article',
        categoryNews: { en: [], fr: ['Nature'] },
      });
    },
  },
  {
    name: '11 - editor content patches still preserve safe authoring instrumentation',
    async run() {
      const current = document.createElement('div');
      current.dataset.aueResource = 'urn:editor-test';
      current.textContent = 'Previous content';
      fixtures.append(current);
      await import('../scripts/editor-support.js');

      const updated = new Promise((resolve, reject) => {
        let timer;
        const observer = new MutationObserver(() => {
          const element = fixtures.querySelector('[data-aue-resource="urn:editor-test"]');
          if (element && element !== current) {
            clearTimeout(timer);
            observer.disconnect();
            resolve(element);
          }
        });
        timer = setTimeout(() => {
          observer.disconnect();
          reject(new Error('Editor patch timed out'));
        }, 3000);
        observer.observe(fixtures, { childList: true, subtree: true });
      });

      document.querySelector('main').dispatchEvent(new CustomEvent('aue:content-patch', {
        detail: {
          request: { target: { resource: 'urn:editor-test' } },
          response: {
            updates: [{
              content: '<div data-aue-resource="urn:editor-test"><p data-aue-prop="text">'
                + 'Updated <strong onmouseover="window.securityProbe = true">content</strong> '
                + '<a href="/help">Help</a></p><script>window.securityProbe = true</script></div>',
            }],
          },
        },
      }));
      const element = await updated;
      assert(element.querySelector('[data-aue-prop="text"]'), 'Editor field instrumentation was lost');
      assert(element.querySelector('strong')?.textContent === 'content', 'Editor formatting was lost');
      assert(element.querySelector('a[href="/help"]'), 'Editor link was lost');
      assert(!element.querySelector('script, [onmouseover]'), 'Editor patch retained executable content');
    },
  },
];

const report = { cases: [] };
window.securityTestReport = report;

tests.reduce(async (previous, test) => {
  await previous;
  const result = document.createElement('li');
  try {
    await test.run();
    result.textContent = `PASS ${test.name}`;
    report.cases.push({ name: test.name, passed: true });
  } catch (error) {
    result.textContent = `FAIL ${test.name}: ${error.message}`;
    report.cases.push({ name: test.name, passed: false, error: error.message });
  } finally {
    fixtures.replaceChildren();
  }
  results.append(result);
}, Promise.resolve()).then(() => {
  report.failed = report.cases.filter((result) => !result.passed).length;
  report.passed = report.cases.length - report.failed;
  document.querySelector('#summary').textContent = `${report.passed}/${report.cases.length} passed`;
  document.documentElement.dataset.testStatus = report.failed ? 'failed' : 'passed';
});
