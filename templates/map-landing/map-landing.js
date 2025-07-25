import {
  div, section,
} from '../../scripts/dom-helpers.js';
import { getLanguage } from '../../scripts/scripts.js';
import {
  fetchPlaceholders,
} from '../../scripts/aem.js';

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  console.log($main);

  const placeholders = await fetchPlaceholders(`${getLanguage()}`);
  console.log(placeholders);
}
