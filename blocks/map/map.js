import { div } from '../../scripts/dom-helpers.js';
import getPathSegments from '../../scripts/utils.js';

async function loadScript(src, attrs) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`head > script[src="${src}"]`)) {
      const script = document.createElement('script');
      script.src = src;
      if (attrs) {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const attr in attrs) {
          script.setAttribute(attr, attrs[attr]);
        }
      }
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    } else {
      resolve();
    }
  });
}

function generateNonce() {
  return btoa(crypto.getRandomValues(new Uint8Array(16)).join(''));
}

async function googleMapLoader(nonce, locale) {
  const mapScript = document.createElement('script');
  mapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyByG84JqtyiGaS_SUF4ruHrdIjQgM01t9U&callback=initMap&language=${locale}&loading=async`;
  mapScript.defer = true;
  mapScript.async = true;
  mapScript.nonce = nonce;
  (document.body || document.head).appendChild(mapScript);
}

async function loadMapScripts(nonce) {
  // Load initmapscript.js first so it defines initMap()
  await loadScript('/blocks/map/infobox.js', window.placeholder);
  await loadScript('/blocks/map/initmapscript.js', nonce);

  // Then load other dependencies
  await loadScript('/blocks/map/mapstyles.js', nonce);
  await loadScript('/blocks/map/markerclusterer.js', nonce);
}

export default async function decorate(block) {
  block.querySelector('div').id = 'map';
  const mapCategory = div({ class: 'map-category' });
  block.prepend(mapCategory);
  const [locale] = getPathSegments();

  // Generate and store nonce
  window.placeholder = window.placeholder || {};
  window.placeholder.nonce = generateNonce();

  const { nonce } = window.placeholder;

  await loadMapScripts(window.placeholder);
  await googleMapLoader(nonce, locale);
}
