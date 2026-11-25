/**
 * Local replacement for https://da.live/nx/utils/sdk.js (mapped by an importmap).
 * Set `window.DA_MOCK` (see da-mock.js) before importing the tool module;
 * set `window.DA_MOCK_CONTEXT` to test another org, or `window.DA_MOCK_NO_SDK`
 * to simulate opening the tool outside DA.
 */
const context = {
  org: 'audemars-piguet',
  repo: 'fondationsaudemarspiguet',
  ref: 'main',
  path: '/tools/test',
  ...window.DA_MOCK_CONTEXT,
};

export default window.DA_MOCK_NO_SDK
  ? new Promise(() => {})
  : Promise.resolve({
    context,
    token: 'local-test-token',
    actions: { daFetch: (url, init) => window.DA_MOCK.daFetch(url, init) },
  });
