import decorate from '../templates/projects-landing/projects-landing.js';
import decorateHomeProjects from '../blocks/home-projects/home-projects.js';
import { getLanguageFromPath } from '../scripts/scripts.js';

const originalFetch = window.fetch;
const originalPlaceholders = window.placeholders;
const summary = document.querySelector('#summary');
const results = document.querySelector('#results');
const language = new URLSearchParams(window.location.search).get('lang') === 'fr' ? 'fr' : 'en';
const projectFolder = language === 'fr'
  ? 'fondation-pour-les-arbres-nos-projets' : 'fondation-pour-les-arbres-projects';
let data;
let failures = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function project(id, duration, startDate) {
  return {
    path: `/${language}/${projectFolder}/${id}`,
    title: id,
    duration,
    startDate,
    partner: 'Partner',
    category: 'Forest',
    location: 'Switzerland',
    image: '/test/media_example.svg',
  };
}

function order() {
  return [...document.querySelectorAll('.project-item')]
    .map((item) => item.dataset.filterTitle).join(',');
}

async function render(rows) {
  data = rows;
  document.querySelector('main').replaceChildren(
    Object.assign(document.createElement('div'), { className: 'section' }),
  );
  await decorate(document);
}

async function check(name, run) {
  const result = document.createElement('li');
  try {
    await run();
    result.textContent = `PASS: ${name}`;
  } catch (error) {
    failures += 1;
    result.textContent = `FAIL: ${name}: ${error.message}`;
  }
  results.append(result);
}

window.fetch = async (url) => {
  assert(String(url).includes(`/${language}/${projectFolder}/projects-index.json?`), `Unexpected fetch: ${url}`);
  return { ok: true, json: async () => ({ total: data.length, data }) };
};
window.placeholders = {
  projectsLandingCategoryFilter: 'Category',
  projectsLandingLocationFilter: 'Location',
  projectsLandingViewFilter: 'View all',
  projectsLandingSearchFilter: 'Search',
  [language]: { homeProjectsLeftButton: 'All projects', homeProjectsRightButton: 'Read more' },
};
getLanguageFromPath(`/${language}`, true);

try {
  await check('Legacy end-year and start-year ordering without Start Date', async () => {
    await render([
      project('old', '2020 → 2024'),
      project('early', '2021 → 2025'),
      project('late', '2023 → 2025', ''),
    ]);
    assert(order() === 'late,early,old', order());
  });

  await check('Mixed ordering uses exact days and keeps Start Date invisible', async () => {
    await render([
      project('earlier-day', '2020 → 2030', '14.03.2026'),
      project('legacy', '2020 → 2025'),
      project('newer-day', '2020 → 2022', '15.03.2026'),
      project('december', '2020 → 2030', '30.12.2025'),
      project('january', '2020 → 2030', '01.01.2026'),
    ]);
    assert(order() === 'newer-day,earlier-day,january,legacy,december', order());
    const listing = document.querySelector('.projects-listing');
    assert(!listing.textContent.includes('15.03.2026'), 'Start Date was displayed');
    assert(listing.querySelector('.projects-duration').textContent === '2020 → 2022', 'Duration changed');
    document.querySelector('.category-dropdown li').click();
    document.querySelector('#view-all').click();
    document.querySelector('.btn-search-clear').click();
    assert(order() === 'newer-day,earlier-day,january,legacy,december', 'Reset changed order');
    assert([...listing.children].every((item) => item.style.display !== 'none'), 'Cards remain hidden');
  });

  await check('Strict date validation, leap years, whitespace and duration fallback', async () => {
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (message) => warnings.push(message);
    try {
      await render([
        project('leap', '2020 → 2020', ' 29.02.2024 '),
        project('invalid-day', '2020 → 2023', '31.02.2026'),
        project('invalid-format', '2020 → 2022', '2026-03-15'),
        project('non-leap', '2020 → 2021', '29.02.2023'),
        project('invalid-month', '2020 → 2019', '01.13.2026'),
      ]);
      assert(order() === 'leap,invalid-day,invalid-format,non-leap,invalid-month', order());
      assert(warnings.length === 4, `Expected four warnings, got ${warnings.length}`);
    } finally {
      console.warn = originalWarn;
    }
  });

  await check('Equal dates retain legacy ordering; empty indexes render safely', async () => {
    await render([
      project('early', '2021 → 2025', '01.01.2026'),
      project('late', '2023 → 2025', '01.01.2026'),
      project('later-end', '2020 → 2027', '01.01.2026'),
    ]);
    assert(order() === 'later-end,late,early', order());
    await render([]);
    assert(order() === '', 'Empty index rendered cards');
  });

  await check('Home projects use the same ordering and only include featured projects', async () => {
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (message) => warnings.push(message);
    try {
      data = [
        { ...project('earlier-day', '2020 → 2030', '14.03.2026'), featured: 'yes' },
        { ...project('legacy', '2020 → 2025'), featured: 'yes' },
        { ...project('newer-day', '2020 → 2022', '15.03.2026'), featured: 'yes' },
        { ...project('invalid', '2020 → 2024', '31.02.2026'), featured: 'yes' },
        { ...project('hidden', '2020 → 2035', '01.01.2035'), featured: '' },
      ];
      const block = document.createElement('div');
      block.className = 'home-projects block';
      document.querySelector('main').append(block);
      await decorateHomeProjects(block);
      const titles = [...block.querySelectorAll('.project-article h3')].map((title) => title.textContent);
      assert(titles.join(',') === 'newer-day,earlier-day,legacy,invalid', titles.join(','));
      assert(warnings.length === 1 && warnings[0].includes('/invalid'), 'Invalid date warning missing');
      assert(!block.textContent.includes('15.03.2026'), 'Start Date was displayed');
    } finally {
      console.warn = originalWarn;
    }
  });
} finally {
  window.fetch = originalFetch;
  window.placeholders = originalPlaceholders;
  getLanguageFromPath(window.location.pathname, true);
  summary.textContent = failures ? `${failures} checks failed` : 'All 5 checks passed';
  summary.dataset.failures = String(failures);
}
