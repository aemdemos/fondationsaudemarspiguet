import {
  div, section, input, span, a,
} from '../../scripts/dom-helpers.js';

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $section = section();
  const $filterContainer = div({ class: 'filter-container' });

  // const $projectsListingLeft = div({ class: 'projects-listing-container-left' });
  const $projectsListingRight = div({ class: 'projects-listing-container-right' });
  const $filterTop = a({ class: 'filter-top-btn' });
  const $filterBottom = a({ class: 'filter-bottom-btn' });

  $projectsListingRight.append($filterTop, $filterBottom);
  const $projectsListingLeft = div(
    { class: 'projects-listing-container-left' },
    div(
      { class: 'category-section' },
      input(
        {
          class: 'category-input', id: 'filtercategories-selectized', placeholder: 'Category', type: 'text', autofill: 'no',
        },
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

  $filterContainer.append($projectsListingLeft, $projectsListingRight);
  const $projectsListing = div({ class: 'projects-listing' });
  $section.append($filterContainer, $projectsListing);
  $main.append($section);
}
