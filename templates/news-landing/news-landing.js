import {
  div, section, input, span, a,
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

  // const $newsListingLeft = div({ class: 'news-listing-container-left' });
  const $newsListingRight = div({ class: 'news-listing-container-right' });
  const $filterTop = a({ class: 'filter-top-btn' });
  const $fitlerBottom = a({ class: 'filter-bottom-btn' });

  $newsListingRight.append($filterTop, $fitlerBottom);
  // const $newsListingLeft = div(
  //   { class: 'news-listing-container-left' },
  //   div({ class: 'category-section' }, input({ class: 'category-input', id: 'filtercategories-selectized', placeholder: 'Category', type: 'text', autofill: 'no' })), span({ class: 'filter-separator' }, ' | '), a({ class: 'view-all', href: '#', id: 'view-all' }, 'View All'),
  //   span({ class: 'filter-separator' }, ' | '),
  //   div({ class: 'search-section' }, input({ class: 'search-input', id: 'filtersearch', placeholder: 'Search...', type: 'text', minlength: '2', size: '10' })), a({ class: 'btn-search-clear', href: '#'}));

  const $newsListingLeft = div(
    { class: 'news-listing-container-left' },
    [
      div(
        { class: 'category-section' },
        input({
          class: 'category-input',
          id: 'filtercategories-selectized',
          placeholder: 'Category',
          type: 'text',
          autofill: 'no',
        })
      ),
      span({ class: 'filter-separator' }, ' | '),
      a(
        { class: 'view-all', href: '#', id: 'view-all' },
        'View All'
      ),
      span({ class: 'filter-separator' }, ' | '),
      div(
        { class: 'search-section' },
        input({
          class: 'search-input',
          id: 'filtersearch',
          placeholder: 'Search...',
          type: 'text',
          minlength: '2',
          size: '10',
        })
      ),
      a({ class: 'btn-search-clear', href: '#' })
    ]
  );
  $newsListingRight.append($filterTop, $fitlerBottom);
  $filterContainer.append($newsListingLeft, $newsListingRight);
  const $newsListing = div({ class: 'news-listing' });
  $section.append($filterContainer, $newsListing);
  const placeholders = await fetchPlaceholders(`${getLanguage()}`);
  const getNews = await getNewsdata();
  $main.append($section);
}

