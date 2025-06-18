import { div } from '../../scripts/dom-helpers.js';
import { loadScript } from '../../scripts/aem.js';

function googleMapLoader() {
  const mapScript = document.createElement('script');
  // mapScript.nonce = generateNonce();
  console.log(`Google Maps script nonce: ${mapScript.nonce}`);
  mapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyByG84JqtyiGaS_SUF4ruHrdIjQgM01t9U&callback=initMap`;
  mapScript.defer = true;
  (document.body || document.head).appendChild(mapScript);
}

export default async function decorate(block) {
  const mapDiv = div({ id: 'map' });
  block.append(mapDiv);
  await loadScript('/blocks/map/initmapscript.js');
  googleMapLoader();
}
