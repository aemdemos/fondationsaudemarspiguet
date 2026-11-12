/**
 * Local harness for tools/newsroom-report. Fixtures APPROXIMATE the DA source:
 * replace them with real source (GET https://admin.da.live/source/...) before
 * relying on a new operation. Exposes window.DA_MOCK / window.DA_FIXTURE.
 */
import createDaMock from './da-mock.js';

const ORG = 'audemars-piguet';
const SITES = {
  fondations: {
    repo: 'fondationsaudemarspiguet',
    icon: 'btn_bien_download',
    styleKey: 'style',
    style: 'pale-grey-bg , sort, report',
    href: (path) => path,
  },
  arbres: {
    repo: 'arbres-fondationsaudemarspiguet',
    icon: 'btn_arbres_download',
    styleKey: 'Style',
    style: 'ashy-grey-bg, sort, report',
    href: (path) => `https://content.da.live/${ORG}/arbres-fondationsaudemarspiguet${path}`,
  },
  biencommun: {
    repo: 'biencommun-fondationsaudemarspiguet',
    icon: 'btn_bien_download',
    styleKey: 'style',
    style: 'pale-grey-bg , sort, report',
    href: (path) => `https://main--biencommun-fondationsaudemarspiguet--${ORG}.aem.page${path}`,
  },
};
const COPY = {
  fr: {
    page: '/fr/espace-medias', heading: 'Espace médias', type: 'Rapport', discover: 'Découvrir', title: 'Rapport annuel 2024',
  },
  en: {
    page: '/en/media-newsroom', heading: 'Media newsroom', type: 'Report', discover: 'Discover', title: 'Annual report 2024',
  },
};

const pageKey = (siteId, locale) => `${ORG}/${SITES[siteId].repo}${COPY[locale].page}.html`;

function fixture(site, locale) {
  const copy = COPY[locale];
  const row = (type, title, path) => {
    const href = site.href(path);
    return `<div><div><p>${type}</p></div><div><p>${title}</p></div><div><p><a href="${href}" title="${title}">${copy.discover}</a> <a href="${href}">:${site.icon}:</a></p></div></div>`;
  };
  return `<body><header></header><main><div><h1>${copy.heading}</h1><div class="table"><div><div><p>Contact</p></div><div><p><a href="mailto:press@example.com">press@example.com</a></p></div></div></div></div><div><div class="table no-header">${row(copy.type, copy.title, `/assets/documents/${locale}/annual-report-2024.pdf`)}${row(copy.type, 'Action Now', `/assets/documents/${locale}/action-now.pdf`)}</div><div class="section-metadata"><div><div><p>${site.styleKey}</p></div><div><p>${site.style}</p></div></div></div></div></main><footer></footer></body>`;
}

const documents = Object.fromEntries(Object.keys(SITES).flatMap((siteId) => Object.keys(COPY)
  .map((locale) => [pageKey(siteId, locale), fixture(SITES[siteId], locale)])));

window.DA_MOCK = createDaMock({ documents });
window.DA_FIXTURE = { ORG, SITES, pageKey };

import('../tools/newsroom-report/newsroom-report.js');
