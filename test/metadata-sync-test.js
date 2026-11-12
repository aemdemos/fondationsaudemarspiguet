/**
 * Local harness for tools/metadata-sync. Fixtures APPROXIMATE the DA source of
 * real pages. Choose the page that "opens" the tool with the query string:
 * `?repo=<repo>&path=/en/page`. Exposes window.DA_MOCK / window.DA_FIXTURE.
 */
import createDaMock from './da-mock.js';

const ORG = 'audemars-piguet';
const REPOS = {
  fondations: 'fondationsaudemarspiguet',
  arbres: 'arbres-fondationsaudemarspiguet',
  biencommun: 'biencommun-fondationsaudemarspiguet',
};
const PROJECTS = {
  en: '/en/fondation-pour-les-arbres-projects',
  fr: '/fr/fondation-pour-les-arbres-nos-projets',
};
const PAGES = {
  newsroomEn: [REPOS.fondations, '/en/media-newsroom'],
  newsroomFr: [REPOS.fondations, '/fr/espace-medias'],
  projectEn: [REPOS.arbres, `${PROJECTS.en}/agroforestry-and-green-entrepreneurship`],
  projectFr: [REPOS.arbres, `${PROJECTS.fr}/agroforesterie-et-entrepreneuriat-vert`],
  onlyEn: [REPOS.arbres, '/en/only-in-english'],
  noMetaEn: [REPOS.biencommun, '/en/no-metadata'],
  noMetaFr: [REPOS.biencommun, '/fr/no-metadata'],
  duplicateEn: [REPOS.fondations, '/en/duplicate-rows'],
};
const key = ([repo, path]) => `${ORG}/${repo}${path}.html`;

const cell = (html) => `<div>${html}</div>`;
const row = (label, value) => `<div>${cell(`<p>${label}</p>`)}${cell(value)}</div>`;
const page = (body, metadata) => `<body><header></header><main><div>${body}</div><div><p>Footer section</p>${metadata === null ? '' : `<div class="metadata">${metadata.map(([label, value]) => row(label, value)).join('')}</div>`}</div></main><footer></footer></body>`;
const picture = (src, alt) => `<picture><img src="${src}" alt="${alt}"></picture>`;
const media = (repo, name) => `https://content.da.live/${ORG}/${repo}/.media/${name}`;

const documents = {
  [key(PAGES.newsroomEn)]: page('<h1>Media newsroom</h1>', [
    ['Title', '<p>Media newsroom</p>'],
    ['Description', '<p>News and reports of the Foundations</p>'],
    ['Image', picture(media(REPOS.fondations, 'newsroom.png'), 'Newsroom')],
    ['Theme', '<p>fondations</p>'],
    ['Nav', '<p>/en/nav</p>'],
    ['Language', '<p>en</p>'],
  ]),
  [key(PAGES.newsroomFr)]: page('<h1>Espace médias</h1>', [
    ['Title', '<p>Espace médias</p>'],
    ['Theme', '<p>fondations</p>'],
    ['Nav', '<p>/fr/nav</p>'],
    ['Language', '<p>fr</p>'],
  ]),
  [key(PAGES.projectEn)]: page('<h1>Agroforestry and green entrepreneurship</h1>', [
    ['Title', '<p>Agroforestry and green entrepreneurship</p>'],
    ['Partner', '<p>Association Morija</p>'],
    ['Category(ies)', '<p>Conservation/restoration | Awareness raising</p>'],
    ['Project duration', '<p>2022 → 2026</p>'],
    ['Location(s)', '<p>Togo</p>'],
    ['Link(s)', '<p><a href="https://en.morija.org/">https://en.morija.org/</a></p>'],
    ['Related', `<p><a href="https://main--${REPOS.arbres}--${ORG}.aem.page${PROJECTS.en}#list">All projects</a></p>`],
    ['Photos', '<p>Morija</p>'],
    ['Start Date', '<p>01.01.2000</p>'],
  ]),
  [key(PAGES.projectFr)]: page('<h1>Agroforesterie et entrepreneuriat vert</h1>', [
    ['Title', '<p>Agroforesterie et entrepreneuriat vert</p>'],
    ['Partenaire', '<p>Association Morija</p>'],
    ['Axe(s)', '<p>Conservation/restauration | Sensibilisation</p>'],
    ['Durée du projet', '<p>2022 → 2025</p>'],
    ['Lieu(x)', '<p>Togo</p>'],
    ['Lien(s)', '<p><a href="https://www.morija.org/">https://www.morija.org/</a></p>'],
    ['Photos', '<p>Morija</p>'],
  ]),
  [key(PAGES.onlyEn)]: page('<h1>Only in English</h1>', [['Title', '<p>Only in English</p>']]),
  [key(PAGES.noMetaEn)]: page('<h1>No metadata on FR</h1>', [['Template', '<p>article</p>']]),
  [key(PAGES.noMetaFr)]: page('<h1>Pas de métadonnées</h1>', null),
  [key(PAGES.duplicateEn)]: page('<h1>Duplicate rows</h1>', [
    ['Title', '<p>First title</p>'],
    ['Theme', '<p>fondations</p>'],
    ['title ', '<p>Second title</p>'],
  ]),
  [`${ORG}/${REPOS.fondations}/placeholders.json`]: JSON.stringify({
    ':type': 'multi-sheet',
    'language-switcher': { data: [{ en: '/media-newsroom', fr: '/espace-medias' }] },
  }),
  [`${ORG}/${REPOS.arbres}/placeholders.json`]: JSON.stringify({
    ':type': 'multi-sheet',
    'language-switcher': {
      data: [
        { en: '/fondation-pour-les-arbres-projects', fr: '/fondation-pour-les-arbres-nos-projets' },
        { en: '/fondation-pour-les-arbres-projects/agroforestry-and-green-entrepreneurship', fr: '/fondation-pour-les-arbres-nos-projets/agroforesterie-et-entrepreneuriat-vert' },
      ],
    },
  }),
};

// Published placeholders are "not found": the tool must fall back to the DA source.
const realFetch = window.fetch.bind(window);
window.fetch = (url, init) => (/\.aem\.(page|live)\//.test(String(url))
  ? Promise.resolve(new Response(null, { status: 404 }))
  : realFetch(url, init));

const params = new URLSearchParams(window.location.search);
window.DA_MOCK_CONTEXT = {
  repo: params.get('repo') || REPOS.fondations,
  path: params.get('path') || PAGES.newsroomEn[1],
};
window.DA_MOCK = createDaMock({ documents });
window.DA_FIXTURE = {
  ORG, REPOS, PAGES, key,
};

import('../tools/metadata-sync/metadata-sync.js');
