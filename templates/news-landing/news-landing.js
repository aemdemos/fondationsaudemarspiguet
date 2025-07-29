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
  const $newsListingLeft = div(
    { class: 'news-listing-container-left' },
    div(
      { class: 'category-section' },
      input(
        {
          class: 'category-input', id: 'filtercategories-selectized', placeholder: 'Category', type: 'text', autofill: 'no',
        },
      ),
      div(
        { class: 'category-dropdown' },
      ),
    ),
    span({ class: 'filter-separator' }, ' | '),
    a({ class: 'view-all', href: '#', id: 'view-all' }, 'View All'),
    span({ class: 'filter-separator' }, ' | '),
    div(
      { class: 'search-section' },
      input(
        {
          class: 'search-input', id: 'filtersearch', placeholder: 'Search...', type: 'text', minlength: '2', size: '10',
        },
      ),
    ),
    a({ class: 'btn-search-clear', href: '#' }),
  );
  $newsListingRight.append($filterTop, $fitlerBottom);
  $filterContainer.append($newsListingLeft, $newsListingRight);
  const $newsListing = div({ class: 'news-listing' });
  $section.append($filterContainer, $newsListing);
  const placeholders = await fetchPlaceholders(`${getLanguage()}`);
  console.log(placeholders);
  const getNews = await getNewsdata();
  const allCategories = getNews
    .flatMap((item) => (item.category || '').split(','))
    .map((cat) => cat.trim())
    .filter((cat) => cat);
  const uniqueCategories = [...new Set(allCategories)].sort();
  const categoryList = document.createElement('ul');
  uniqueCategories.forEach((category) => {
    const categoryItem = document.createElement('li');
    categoryItem.textContent = category;
    categoryList.appendChild(categoryItem);
  });
  console.log(uniqueCategories);
  $main.append($section);
  const categorysection = doc.querySelector('.category-dropdown');
  categorysection.appendChild(categoryList);
  const $categoryInput = doc.querySelector('.category-input');
  $categoryInput.addEventListener('click', () => {
    categorysection.style.display = categorysection.style.display === 'block' ? 'none' : 'block';
  });
}
