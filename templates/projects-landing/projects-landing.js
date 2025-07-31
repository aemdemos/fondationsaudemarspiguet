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
      { class: 'category-section' },
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
  $main.append($section);
}
