import {
  div, section, input, span, a,
} from '../../scripts/dom-helpers.js';
import ffetch from '../../scripts/ffetch.js';
import {
  fetchPlaceholders,
} from '../../scripts/aem.js';
import { getLanguage } from '../../scripts/scripts.js';

async function getProjectsdata() {
  const rawNews = await ffetch(`/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-les-arbres-projects' : 'fondation-pour-les-arbres-nos-projets'}/projects-index.json`)
    .chunks(1000)
    .all();
  return rawNews;
}

/*  function showProjectCards(getNews, doc) {
  getNews.forEach((news) => {
    const $newsItem = div({ class: 'news-item' });
    const $newsTitle = h2({ class: 'news-title' }, news.title);
    const $newsDate = span({ class: 'news-date' }, news.date);
    const $newsCategory = span({ class: 'news-category' }, news.category);
    const $newsDescription = div({ class: 'news-description' }, news.description);
    const imageWrapper = div({ class: 'news-image-wrapper' });
    const $newsImg = img({ class: 'news-image', src: news.image, alt: news.title });
    imageWrapper.append($newsImg);
    $newsItem.append(imageWrapper, $newsCategory, $newsDate, $newsTitle, $newsDescription);
    doc.querySelector('.news-listing').append($newsItem);
  });
} */

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $section = section();
  const $filterContainer = div({ class: 'filter-container' });

  const placeholders = await fetchPlaceholders(`${getLanguage()}`);
  const { projectsLandingCategoryFilter } = placeholders;
  const { projectsLandingLocationFilter } = placeholders;
  const { projectsLandingViewFilter } = placeholders;
  const { projectsLandingSearchFilter } = placeholders;

  const $projectsListingRight = div({ class: 'projects-listing-container-right' });
  const $mapLink = a({ class: 'map-link-btn', href: '/en/fondation-pour-les-arbres-projects-map', id: 'map-link' }, 'See Map');

  $projectsListingRight.append($mapLink);

  const $projectsListingLeft = div(
    { class: 'projects-listing-container-left' },
    div(
      { class: 'category-dropdown' },
      input(
        {
          class: 'category-input', id: 'filtercategories-selectized', placeholder: projectsLandingCategoryFilter, type: 'text', autofill: 'no',
        },
      ),
    ),
    span({ class: 'filter-separator' }, ' | '),
    div(
      { class: 'location-dropdown' },
      input(
        {
          class: 'location-input', id: 'filterlocations-selectized', placeholder: projectsLandingLocationFilter, type: 'text', autofill: 'no',
        },
      ),
    ),
    span({ class: 'filter-separator' }, ' | '),
    a({ class: 'view-all', href: '#', id: 'view-all' }, projectsLandingViewFilter),
    span({ class: 'filter-separator' }, ' | '),
    div(
      { class: 'search-section' },
      input(
        {
          class: 'search-input', id: 'filtersearch', placeholder: projectsLandingSearchFilter, type: 'text', minlength: '2', size: '10',
        },
      ),
    ),
    a({ class: 'btn-search-clear', href: '#' }),
  );

  $filterContainer.append($projectsListingLeft, $projectsListingRight);
  const $projectsListing = div({ class: 'projects-listing' });
  $section.append($filterContainer, $projectsListing);

  const getProjects = await getProjectsdata();
  const allCategories = getProjects
    .flatMap((item) => (item.category || '').split(','))
    .map((cat) => cat.trim())
    .filter((cat) => cat);
  const uniqueCategories = [...new Set(allCategories)].sort();
  const categoryList = doc.createElement('ul');
  uniqueCategories.forEach((category) => {
    const categoryItem = doc.createElement('li');
    categoryItem.textContent = category;
    categoryList.appendChild(categoryItem);
  });
  $main.append($section);
  const categorysection = doc.querySelector('.category-dropdown');
  categorysection.appendChild(categoryList);
  const $categoryInput = doc.querySelector('.category-input');
  $categoryInput.addEventListener('click', () => {
    categorysection.style.display = categorysection.style.display === 'block' ? 'none' : 'block';
  });
}
