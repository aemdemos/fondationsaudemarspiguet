import {
  div, section,
} from '../../scripts/dom-helpers.js';

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $section = section();
  const $filterContainer = div({ class: 'filter-container' });

  const $newsListingLeft = div({ class: 'news-listing-container-left' });
  const $newsListingRight = div({ class: 'news-listing-container-right' });

  $filterContainer.append($newsListingLeft, $newsListingRight);

  const $newsListing = div({ class: 'news-listing' });
  $section.append($filterContainer, $newsListing);

  $main.append($section);
}
