import {
  div, section,
} from '../../scripts/dom-helpers.js';
import { getLanguage } from '../../scripts/scripts.js';
import ffetch from '../../scripts/ffetch.js';
import {
  fetchPlaceholders,
} from '../../scripts/aem.js';

async function getProjectsdata() {
  const rawProducts = await ffetch(`/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-les-arbres-projects' : 'fondation-pour-les-arbres-nos-projets'}/projects-index.json`)
    .chunks(1000)
    .all();
  return rawProducts;
}

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $section = section();
  const $filterContainer = div({ class: 'filter-container' });

  const $projectsListingLeft = div({ class: 'projects-listing-container-left' });
  const $projectsListingRight = div({ class: 'projects-listing-container-right' });

  $filterContainer.append($projectsListingLeft, $projectsListingRight);

  const $projectsListing = div({ class: 'projects-listing' });
  $section.append($filterContainer, $projectsListing);
  const placeholders = await fetchPlaceholders(`${getLanguage()}`);
  console.log(placeholders);

  const getProjects = await getProjectsdata();
  console.log(getProjects);

  $main.append($section);
}
