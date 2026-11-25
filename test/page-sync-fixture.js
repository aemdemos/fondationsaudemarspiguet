import { createApi } from '../tools/da-multisite/core.js';
import { ORG, SITES } from '../tools/da-multisite/sites.js';
import createDaMock from './da-mock.js';

export default function createFixture({
  siteId = 'arbres', locale = 'en', kind = 'project', exists = false, etags = false,
  mappedSlug = false, missingSheet = false,
} = {}) {
  const site = SITES.find(({ id }) => id === siteId);
  const family = siteId === 'biencommun' ? 'fondation-pour-le-bien-commun' : 'fondation-pour-les-arbres';
  const suffix = kind === 'news'
    ? { en: 'news', fr: 'actualites' }
    : { en: 'projects', fr: 'nos-projets' };
  const roots = { en: `/${family}-${suffix.en}`, fr: `/${family}-${suffix.fr}` };
  const other = locale === 'en' ? 'fr' : 'en';
  const sourcePath = `/${locale}${roots[locale]}/new-article`;
  const targetPath = `/${other}${roots[other]}/${mappedSlug ? 'translated-article' : 'new-article'}`;
  const key = (path) => `${ORG}/${site.repo}${path}.html`;
  const sourceKey = key(sourcePath);
  const targetKey = key(targetPath);
  const sheetKey = `${ORG}/${site.repo}/placeholders.json`;
  const sourceHtml = `<body>
  <header></header>
  <main>
    <div data-aue-resource="urn:source:article">
      <h1>Article ${locale.toUpperCase()} &amp; forests</h1>
      <p><strong>Original</strong> content. :icon-download:</p>
      <picture><img src="https://content.da.live/${ORG}/${site.repo}/.media/photo.png" alt="Photo originale"></picture>
      <p><a href="/${locale}/contact?from=article#form">Contact</a></p>
      <div class="columns"><div><div>Left</div><div>Right</div></div></div>
      <div class="section-metadata"><div><div>Style</div><div>pale-grey-bg</div></div></div>
    </div>
    <div>
      <div class="metadata">
        <div><div>Title</div><div>Original title</div></div>
        <div><div>Start Date</div><div>2026</div></div>
        <div><div>${locale === 'en' ? 'Partner' : 'Partenaire'}</div><div>Association</div></div>
        <div><div>Language</div><div>${locale}</div></div>
      </div>
    </div>
  </main>
  <footer></footer>
</body>`;
  const targetHtml = sourceHtml.replace('Original title', 'Existing translated title')
    .replace('2026', '2025')
    .replace(`<div>Language</div><div>${locale}`, `<div>Language</div><div>${other}`);
  const rows = [roots];
  if (mappedSlug) {
    rows.push({
      [locale]: sourcePath.slice(locale.length + 1),
      [other]: targetPath.slice(other.length + 1),
    });
  }
  const documents = { [sourceKey]: sourceHtml };
  if (exists) documents[targetKey] = targetHtml;
  if (!missingSheet) {
    documents[sheetKey] = JSON.stringify({
      ':type': 'multi-sheet', 'language-switcher': { data: rows },
    });
  }
  const mock = createDaMock({ documents, etags });
  return {
    mock,
    api: createApi(mock.daFetch),
    context: {
      org: ORG, repo: site.repo, path: sourcePath, ref: 'main',
    },
    sourceKey,
    targetKey,
    sheetKey,
    sourcePath,
    targetPath,
    sourceHtml,
    targetHtml,
  };
}
