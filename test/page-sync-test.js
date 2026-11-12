import createFixture from './page-sync-fixture.js';

const params = new URLSearchParams(window.location.search);
const fixture = createFixture({
  siteId: params.get('site') || 'arbres',
  locale: params.get('locale') || 'en',
  kind: params.get('kind') || 'project',
  exists: params.get('exists') === 'true',
  etags: params.get('etag') === 'present',
  mappedSlug: params.get('mapped') === 'true',
  missingSheet: params.get('sheet') === 'missing',
});
window.DA_MOCK = fixture.mock;
window.DA_MOCK_CONTEXT = fixture.context;
window.DA_FIXTURE = fixture;

const realFetch = window.fetch.bind(window);
window.fetch = (url, init) => (/\.aem\.(page|live)\//.test(String(url))
  ? Promise.resolve(new Response(null, { status: 404 }))
  : realFetch(url, init));

import('../tools/page-sync/page-sync.js');
