import { loadFragment } from '../blocks/fragment/fragment.js';
import { defaultSubmitSuccessHandler } from '../blocks/form/rules/functions.js';
import { handleSubmit, submitSuccess } from '../blocks/form/submit.js';
import { getSameOriginUrl } from '../scripts/url-utils.js';
import {
  buildAemPreviewUrl,
  buildDaHashUrl,
  getLanguageDestinationUrl,
  openLanguageDestinations,
} from '../tools/languageswitcher/locale-url-helper.js';

const fixtures = document.querySelector('#fixtures');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertThrows(callback, message) {
  let rejected = false;
  try {
    callback();
  } catch {
    rejected = true;
  }
  assert(rejected, message);
}

async function navigationFrame() {
  const frame = document.createElement('iframe');
  frame.title = 'Navigation test';
  frame.src = '/test/navigation.html?dapreview=1&rum=off';
  fixtures.append(frame);
  await new Promise((resolve, reject) => {
    const started = Date.now();
    const check = () => {
      if (frame.contentWindow?.navigationHandlers) resolve();
      else if (Date.now() - started > 5000) reject(new Error('Navigation fixture timed out'));
      else setTimeout(check, 10);
    };
    check();
  });
  return frame;
}

function submissionForm(doc = document) {
  const form = doc.createElement('form');
  const button = doc.createElement('button');
  button.type = 'submit';
  button.disabled = true;
  form.dataset.submitting = 'true';
  form.append(button);
  return form;
}

async function withIndex(path, data, callback) {
  const originalFetch = window.fetch;
  const originalPlaceholders = window.placeholders;
  const originalSwiper = window.Swiper;
  const originalHlx = window.hlx;
  const { getLanguageFromPath } = await import('../scripts/scripts.js');
  getLanguageFromPath('/en', true);
  window.hlx = { ...originalHlx, codeBasePath: '' };
  window.placeholders = {
    ...originalPlaceholders,
    en: { homeProjectsLeftButton: 'All projects', homeProjectsRightButton: 'Read more' },
  };
  window.Swiper = class Swiper {
    constructor(selector, options) {
      this.slides = [...document.querySelectorAll(`${selector} .swiper-slide`)];
      this.activeIndex = 0;
      this.params = options;
      this.passedParams = options;
      options.on.init.call(this);
    }
  };
  window.fetch = async (url) => {
    assert(typeof url === 'string' && url.includes(path), `Unexpected index request: ${url}`);
    return { ok: true, json: async () => ({ total: data.length, data }) };
  };
  try {
    await callback();
  } finally {
    window.fetch = originalFetch;
    window.placeholders = originalPlaceholders;
    window.Swiper = originalSwiper;
    window.hlx = originalHlx;
    getLanguageFromPath(window.location.pathname, true);
  }
}

export default [
  {
    name: 'M01 - redirects accept only canonical same-origin HTTP(S) destinations',
    run() {
      ['/thanks', 'thanks', '?done=1', '#thanks', `${window.location.origin}/merci`]
        .forEach((value) => {
          assert(getSameOriginUrl(value).origin === window.location.origin, 'Local URL was rejected');
        });
      [
        'https://evil.example/thanks', '//evil.example/thanks', '/\\evil.example/thanks',
        'https://forms.adobe.com/thanks', 'https://example.org@evil.example/',
        // eslint-disable-next-line no-script-url
        'javascript:alert(1)', 'data:text/html,test', 'blob:https://example.org/test',
        `https://${window.location.hostname}/thanks`, '', null,
      ].forEach((value) => {
        assertThrows(() => getSameOriginUrl(value), `Unsafe redirect accepted: ${value}`);
      });
    },
  },
  {
    name: 'M02 - configured and server-event form redirects reject external destinations',
    run() {
      const form = submissionForm();
      fixtures.append(form);
      form.dataset.redirectUrl = '//evil.example/thanks';
      assertThrows(() => submitSuccess({}, form), 'Configured external redirect was accepted');
      assert(form.dataset.submitting === 'false' && !form.querySelector('button').disabled, 'Submit state was stuck');
      delete form.dataset.redirectUrl;
      assertThrows(
        () => submitSuccess({ payload: { body: { redirectUrl: 'https://evil.example' } } }, form),
        'Event-provided external redirect was accepted',
      );
      assertThrows(
        () => defaultSubmitSuccessHandler({
          // eslint-disable-next-line no-script-url
          event: { payload: { body: { redirectUrl: 'javascript:alert(1)' } } },
          form: { $id: 'missing-form' },
        }),
        'Adaptive external redirect was accepted',
      );
    },
  },
  {
    name: 'M03 - refused submission redirects show an error and restore submit state',
    async run() {
      const form = submissionForm();
      form.dataset.source = 'sheet';
      form.dataset.action = '/contact';
      form.dataset.redirectUrl = 'https://evil.example/thanks';
      const originalFetch = window.fetch;
      window.fetch = async () => ({ ok: true });
      form.querySelector('button').disabled = false;
      form.dataset.submitting = 'false';
      fixtures.append(form);
      try {
        await handleSubmit({ preventDefault() {}, submitter: form.querySelector('button') }, form);
        assert(form.querySelector('.error-message'), 'Refused redirect was silently ignored');
        assert(!form.querySelector('.success-message'), 'Refused redirect displayed success');
        assert(form.dataset.submitting === 'false' && !form.querySelector('button').disabled, 'Submit state was stuck');
      } finally {
        window.fetch = originalFetch;
      }
    },
  },
  {
    name: 'M04 - both form handlers still perform permitted same-origin navigation',
    async run() {
      const frame = await navigationFrame();
      const target = frame.contentWindow;
      const form = submissionForm(target.document);
      target.document.body.append(form);
      form.dataset.redirectUrl = '#configured-thanks';
      target.navigationHandlers.submitSuccess({}, form);
      assert(target.location.hash === '#configured-thanks', 'Configured local navigation failed');
      delete form.dataset.redirectUrl;
      target.navigationHandlers.submitSuccess({
        payload: { body: { redirectUrl: '#event-thanks' } },
      }, form);
      assert(target.location.hash === '#event-thanks', 'Event local navigation failed');
      target.navigationHandlers.defaultSubmitSuccessHandler({
        event: { payload: { body: { redirectUrl: '#adaptive-thanks' } } },
        form: { $id: 'unused' },
      });
      assert(target.location.hash === '#adaptive-thanks', 'Adaptive local navigation failed');
    },
  },
  {
    name: 'M04b - native submission responses do not turn their JSON body into a redirect',
    async run() {
      const form = submissionForm();
      form.dataset.source = 'sheet';
      form.dataset.action = '/contact';
      form.dataset.submitting = 'false';
      form.querySelector('button').disabled = false;
      fixtures.append(form);
      const originalFetch = window.fetch;
      const requests = [];
      window.fetch = async (url) => {
        requests.push(url);
        return new Response(JSON.stringify({ redirectUrl: 'https://evil.example/thanks' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      };
      try {
        await handleSubmit({ preventDefault() {}, submitter: form.querySelector('button') }, form);
        assert(requests.length === 1 && requests[0].startsWith('https://forms.adobe.com/adobe/forms/af/submit/'), 'Submission endpoint changed');
        assert(fixtures.querySelector('.success-message'), 'Native response confirmation changed');
        assert(!form.querySelector('.error-message'), 'Native response was incorrectly treated as a redirect');
        assert(form.dataset.submitting === 'false' && !form.querySelector('button').disabled, 'Submit state was not restored');
      } finally {
        window.fetch = originalFetch;
      }
    },
  },
  {
    name: 'M05 - language navigation confines mapped paths and preserves local destinations',
    async run() {
      const frame = await navigationFrame();
      const target = frame.contentWindow;
      const handlers = target.navigationHandlers;
      target.history.replaceState(null, '', '/en/test');
      handlers.getLanguageFromPath('/en/test', true);
      let rejected = false;
      try {
        await handlers.switchToLanguage('//evil.example');
      } catch {
        rejected = true;
      }
      assert(rejected && target.location.pathname === '/en/test', 'Unsupported language navigated');
      target.placeholders = { 'language-switcher': [{ en: 'test', fr: '/..//evil.example' }] };
      rejected = false;
      try {
        await handlers.switchToLanguage('fr');
      } catch {
        rejected = true;
      }
      assert(rejected && target.location.pathname === '/en/test', 'Escaping mapped path navigated');
      target.placeholders = {
        'language-switcher': [{ en: 'test', fr: '../test/fr/translated.html' }],
      };
      const loaded = new Promise((resolve) => {
        frame.addEventListener('load', resolve, { once: true });
      });
      await handlers.switchToLanguage('fr');
      await Promise.race([
        loaded,
        new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Language navigation timed out')), 5000);
        }),
      ]);
      assert(target.location.origin === window.location.origin, 'Language navigation left the site');
      assert(target.location.pathname === '/test/fr/translated.html', 'Mapped language destination changed');
    },
  },
  {
    name: 'M06 - language tool allows only HTTPS DA and AEM destinations',
    run() {
      const urls = [
        buildDaHashUrl('edit', 'org', 'repo', ['fr', 'page']),
        buildAemPreviewUrl('main', 'org', 'repo', ['fr', 'page'], 'page'),
        buildAemPreviewUrl('feature-branch', 'org', 'repo', ['en'], 'live'),
        'https://main--repo--org.hlx.page/en',
      ];
      urls.forEach((value) => assert(getLanguageDestinationUrl(value).href === value, 'Tool URL changed'));
      [
        // eslint-disable-next-line no-script-url
        'javascript:alert(1)', 'https://evil.example/', 'http://da.live/edit',
        'https://da.live.evil.example/edit', 'https://da.live:444/edit',
        'https://user:password@da.live/edit', '//da.live/edit',
      ].forEach((value) => assertThrows(() => getLanguageDestinationUrl(value), `Unsafe tool destination accepted: ${value}`));
    },
  },
  {
    name: 'R01 - form navigation ignores an external document base and preserves URL components',
    async run() {
      const frame = await navigationFrame();
      const target = frame.contentWindow;
      const base = target.document.createElement('base');
      base.href = 'https://evil.example/';
      target.document.head.append(base);
      const form = submissionForm(target.document);
      target.document.body.append(form);
      form.dataset.redirectUrl = `${window.location.origin}/test/navigation.html`
        + '?dapreview=1&rum=off&value=%252F%3F%23#confirmed';
      const loaded = new Promise((resolve) => {
        frame.addEventListener('load', resolve, { once: true });
      });
      target.navigationHandlers.submitSuccess({}, form);
      await Promise.race([
        loaded,
        new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Form navigation timed out')), 5000);
        }),
      ]);
      assert(target.location.origin === window.location.origin, 'Document base changed the destination origin');
      assert(target.location.pathname === '/test/navigation.html', 'Redirect path changed');
      assert(target.location.search === '?dapreview=1&rum=off&value=%252F%3F%23', 'Query encoding changed');
      assert(target.location.hash === '#confirmed', 'Redirect fragment changed');
    },
  },
  {
    name: 'R02 - language tool validates all destinations before opening any tabs',
    run() {
      const originalOpen = window.open;
      const calls = [];
      window.open = (...args) => { calls.push(args); };
      try {
        const valid = [
          'https://da.live/edit#/org/repo/fr/page',
          'https://main--repo--org.aem.page/fr/page?q=%252F#section',
          'https://feature--repo--org.hlx.live/en/page',
        ];
        openLanguageDestinations(valid);
        assert(calls.length === valid.length, 'Expected tabs were not opened');
        calls.forEach(([href, target, features], index) => {
          assert(href === valid[index], 'Destination components changed');
          assert(target === '_blank' && features === 'noopener,noreferrer', 'Tab protections changed');
        });
        calls.length = 0;
        [
          'https://evil.example/', 'https://da.live.evil.example/',
          'https://main--repo--org.aem.page.evil.example/', 'http://da.live/',
          'https://da.live:444/', 'https://user@da.live/',
        ].forEach((value) => {
          assertThrows(() => openLanguageDestinations([valid[0], value]), 'Unsafe batch accepted');
          assert(calls.length === 0, 'Part of an invalid batch opened');
        });
      } finally {
        window.open = originalOpen;
      }
    },
  },
  {
    name: 'M07 - fragments sanitize remote HTML while preserving structure, media and instrumentation',
    async run() {
      const originalFetch = window.fetch;
      const originalHlx = window.hlx;
      window.hlx = { ...originalHlx, codeBasePath: '' };
      const requests = [];
      window.fetch = async (url, options) => {
        requests.push({ url, options });
        return {
          ok: true,
          text: async () => '<div data-aue-resource="urn:fragment">'
            + '<h2>Fragment heading</h2><p data-aue-prop="text">Safe <strong>content</strong> '
            + '<a href="/contact">Contact</a><a href="javascript:alert(1)">Unsafe</a></p>'
            + '<picture><source srcset="./media_example.svg"><img src="./media_example.svg" '
            + 'alt="Example" onerror="window.securityProbe = true"></picture>'
            + '<script>window.securityProbe = true</script><svg onload="window.securityProbe = true"></svg></div>',
        };
      };
      try {
        await Promise.all(['', '.html', '.plain.html'].map(async (suffix) => {
          const fragment = await loadFragment(`/test/example${suffix}`);
          assert(fragment.querySelector('.section'), 'Fragment section was not decorated');
          assert(fragment.querySelector('[data-aue-resource="urn:fragment"]'), 'Fragment instrumentation was lost');
          assert(fragment.querySelector('[data-aue-prop="text"] strong')?.textContent === 'content', 'Safe rich text was lost');
          assert(fragment.querySelector('a[href="/contact"]'), 'Safe fragment link was lost');
          assert(!fragment.querySelector('script, svg, [onerror], a[href^="javascript:"]'), 'Fragment retained unsafe markup');
          assert(fragment.querySelector('img')?.alt === 'Example', 'Fragment image alternative was lost');
          const image = fragment.querySelector('img');
          assert(image.src === `${window.location.origin}/test/media_example.svg`, 'Fragment image base changed');
          assert(fragment.querySelector('source').srcset === `${window.location.origin}/test/media_example.svg`, 'Fragment source base changed');
          if (!image.complete) {
            await new Promise((resolve, reject) => {
              const timer = setTimeout(() => reject(new Error('Fragment image timed out')), 3000);
              image.addEventListener('load', () => {
                clearTimeout(timer);
                resolve();
              }, { once: true });
              image.addEventListener('error', () => {
                clearTimeout(timer);
                reject(new Error('Fragment image failed to load'));
              }, { once: true });
            });
          }
          assert(image.naturalWidth > 0, 'Fragment image did not load');
        }));
        assert(requests.every(({ url, options }) => (
          url === `${window.location.origin}/test/example.plain.html` && options.redirect === 'error'
        )), 'Fragment request is not confined to its origin');
      } finally {
        window.fetch = originalFetch;
        window.hlx = originalHlx;
      }
    },
  },
  {
    name: 'M08 - fragments reject cross-origin paths before fetching and surface request failures',
    async run() {
      const originalFetch = window.fetch;
      let calls = 0;
      window.fetch = async () => {
        calls += 1;
        throw new TypeError('Redirect or network failure');
      };
      try {
        await Promise.all(['//evil.example/fragment', '/\\evil.example/fragment'].map(async (value) => {
          let rejected = false;
          try {
            await loadFragment(value);
          } catch {
            rejected = true;
          }
          assert(rejected, 'External fragment path was accepted');
        }));
        assert(calls === 0, 'External fragment was fetched');
        let rejected = false;
        try {
          await loadFragment('/redirected-fragment');
        } catch {
          rejected = true;
        }
        assert(rejected && calls === 1, 'Fragment request failure was hidden');
        window.fetch = async () => ({ ok: false });
        assert(await loadFragment('/missing-fragment') === null, 'Missing fragment behavior changed');
      } finally {
        window.fetch = originalFetch;
      }
    },
  },
  {
    name: 'M09 - home projects keep DOM-only metadata, featured filtering and sorted links',
    async run() {
      const payload = '<strong onclick="window.securityProbe = true">Text</strong>';
      await withIndex('/projects-index.json?', [
        {
          path: '/en/projects/one',
          title: payload,
          category: 'Forest',
          location: payload,
          duration: '2022 → 2026',
          featured: 'yes',
          featuredcontent: payload,
        },
        {
          // eslint-disable-next-line no-script-url
          path: 'javascript:alert(1)',
          title: 'Older',
          duration: '2020 → 2024',
          featured: 'yes',
          image: '/icons/flech-to-top-en.svg',
        },
        { path: '/en/projects/hidden', title: 'Hidden', featured: '' },
      ], async () => {
        const { default: decorate } = await import('../blocks/home-projects/home-projects.js');
        const block = document.createElement('div');
        block.className = 'home-projects block';
        fixtures.append(block);
        await decorate(block);
        const rows = block.querySelectorAll('.columns.block.featured > div');
        assert(rows.length === 2, 'Featured filtering changed');
        assert(rows[0].querySelector('h3')?.textContent === payload, 'Title was not rendered as text');
        assert(!block.querySelector('[onclick], strong'), 'Project metadata was parsed as HTML');
        assert(rows[0].querySelector('.featured-content')?.textContent === payload, 'Featured text changed');
        assert(rows[0].querySelector('.btn-project-detail')?.getAttribute('href') === '/en/projects/one', 'Project link or order changed');
        assert(rows[0].querySelector('.btn-projects-listing')?.textContent === 'All projects', 'Project button label changed');
        assert(!rows[1].querySelector('a[href^="javascript:"]'), 'Project index retained an unsafe link');
        assert(rows[1].querySelector('picture img')?.hasAttribute('alt'), 'Project image structure changed');
      });
    },
  },
  {
    name: 'M10 - news slider keeps DOM-only metadata, date order and carousel structure',
    async run() {
      const payload = '<strong onclick="window.securityProbe = true">News</strong>';
      await withIndex('/news-index.json?', [
        {
          path: '/en/news/newer',
          title: payload,
          description: payload,
          category: 'Nature, Culture',
          date: '11.11.2026',
          'article-color': 'brown',
        },
        {
          // eslint-disable-next-line no-script-url
          path: 'javascript:alert(1)/en/news',
          title: 'Older',
          date: '01.10.2026',
          image: '/icons/flech-to-top-en.svg',
        },
        { path: '/short', title: 'Filtered', date: '12.11.2026' },
      ], async () => {
        const { default: decorate } = await import('../blocks/news-slider/news-slider.js');
        const block = document.createElement('div');
        block.className = 'news-slider block';
        fixtures.append(block);
        await decorate(block);
        const slides = block.querySelectorAll('.swiper-wrapper > .swiper-slide');
        assert(slides.length === 2, 'News filtering or slide count changed');
        assert(slides[0].querySelector('h3')?.textContent === payload, 'News title was not rendered as text');
        assert(!block.querySelector('[onclick], strong'), 'News metadata was parsed as HTML');
        assert(slides[0].querySelector('a')?.getAttribute('href') === '/en/news/newer', 'News link or date order changed');
        assert(slides[0].classList.contains('color-brown'), 'News color variant was lost');
        assert(slides[0].querySelectorAll('.news-listing-cat').length === 2, 'News categories changed');
        assert(block.querySelector('.swiper-button-prev') && block.querySelector('.swiper-button-next'), 'Carousel controls were lost');
        assert(!slides[1].querySelector('a[href^="javascript:"]'), 'News index retained an unsafe link');
        assert(slides[1].querySelector('picture img')?.hasAttribute('alt'), 'News image structure changed');
      });
    },
  },
];
