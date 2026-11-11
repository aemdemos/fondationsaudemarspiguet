import { a } from './dom-helpers.js';

export function createSafeLink(path, attributes = {}) {
  const link = a(attributes);
  if (typeof path === 'string' && path.trim()) {
    try {
      const { protocol } = new URL(path, window.location.href);
      if (protocol === 'http:' || protocol === 'https:') {
        link.setAttribute('href', path);
        return link;
      }
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
    }
  }
  // eslint-disable-next-line no-console
  console.warn('Invalid or unsupported content link URL');
  return link;
}

export function getSameOriginUrl(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError('A non-empty URL is required');
  }
  const url = new URL(value, window.location.href);
  if (!['http:', 'https:'].includes(url.protocol)
    || url.origin !== window.location.origin || url.username || url.password
    || url.pathname.startsWith('//')) {
    throw new Error('URL must use an unambiguous path on the current site origin');
  }
  return url;
}

export function redirectToSameOrigin(value) {
  const url = getSameOriginUrl(value);
  window.location.assign(url.href);
}
