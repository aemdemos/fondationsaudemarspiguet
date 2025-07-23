import {
  div, section,
} from '../../scripts/dom-helpers.js';
import { getLanguage } from '../../scripts/scripts.js';
import ffetch from '../../scripts/ffetch.js';
import {
  fetchPlaceholders,
} from '../../scripts/aem.js';

async function getNewsdata() {
  const rawNews = await ffetch(`/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-les-arbres-news' : 'fondation-pour-les-arbres-actualites'}/news-index.json`)
    .chunks(1000)
    .all();
  return rawNews;
}

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $section = section();
  const $filterContainer = div({ class: 'filter-container' });

  const $newsListingLeft = div({ class: 'news-listing-container-left' });
  const $newsListingRight = div({ class: 'news-listing-container-right' });

  $filterContainer.append($newsListingLeft, $newsListingRight);

  const $newsListing = div({ class: 'news-listing' });
  $section.append($filterContainer, $newsListing);
  const placeholders = await fetchPlaceholders(`${getLanguage()}`);

  const getNews = await getNewsdata();

  $main.append($section);
}
