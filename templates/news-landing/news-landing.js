import {
  div, section, input, span, a,
} from '../../scripts/dom-helpers.js';
import {
  fetchPlaceholders,
} from '../../scripts/aem.js';
import { getLanguage } from '../../scripts/scripts.js';

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $section = section();
  const $filterContainer = div({ class: 'filter-container' });

  // const $newsListingLeft = div({ class: 'news-listing-container-left' });
  const $newsListingRight = div({ class: 'news-listing-container-right' });
  const $filterTop = a({ class: 'filter-top-btn' });
  const $fitlerBottom = a({ class: 'filter-bottom-btn' });

  $newsListingRight.append($filterTop, $fitlerBottom);
  const placeholders = await fetchPlaceholders(`${getLanguage()}`);
  console.log(placeholders);
  const { newsLandingCategoryFilter } = placeholders;
  const { newsLandingSearchFilter } = placeholders;
  const { newsLandingViewFilter } = placeholders;
  const $newsListingLeft = div(
    { class: 'news-listing-container-left' },
    div(
      { class: 'category-section' },
      input(
        {
          class: 'category-input', id: 'filtercategories-selectized', placeholder: newsLandingCategoryFilter, type: 'text', autofill: 'no',
        },
      ),
    ),
    span({ class: 'filter-separator' }, ' | '),
    a({ class: 'view-all', href: '#', id: 'view-all' }, newsLandingViewFilter),
    span({ class: 'filter-separator' }, ' | '),
    div(
      { class: 'search-section' },
      input(
        {
          class: 'search-input', id: 'filtersearch', placeholder: newsLandingSearchFilter, type: 'text', minlength: '2', size: '10',
        },
      ),
    ),
    a({ class: 'btn-search-clear', href: '#' }),
  );
  $newsListingRight.append($filterTop, $fitlerBottom);
  $filterContainer.append($newsListingLeft, $newsListingRight);
  const $newsListing = div({ class: 'news-listing' });
  $section.append($filterContainer, $newsListing);
  $main.append($section);
}
