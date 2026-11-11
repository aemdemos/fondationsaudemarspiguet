import {
  div, h2, input, span, a, img,
} from '../../scripts/dom-helpers.js';
import ffetch from '../../scripts/ffetch.js';
import {
  fetchPlaceholders,
} from '../../scripts/aem.js';
import { getLanguage } from '../../scripts/scripts.js';
import { applyFadeUpAnimation, setInputWidthToText } from '../../scripts/utils.js';

async function getProjectsdata() {
  const { hostname } = window.location;
  let rawProjects = [];

  // Helper function to safely fetch with ffetch
  const safeFetch = async (path) => {
    try {
      const result = await ffetch(path)
        .chunks(1000)
        .all();
      return result;
    } catch (error) {
      return null;
    }
  };

  // Determine the path based on domain
  if (hostname.includes('arbres')) {
    const projectsPath = `/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-les-arbres-projects' : 'fondation-pour-les-arbres-nos-projets'}/projects-index.json`;
    const result = await safeFetch(projectsPath);
    if (result) {
      if (getLanguage() === 'fr') {
        rawProjects = result.filter((project) => project.path.includes('/fr/fondation-pour-les-arbres-nos-projets/'));
      } else {
        rawProjects = result.filter((project) => project.path.includes('/en/fondation-pour-les-arbres-projects/'));
      }
    }
  } else if (hostname.includes('biencommun')) {
    const projectsPath = `/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-le-bien-commun-projects' : 'fondation-pour-le-bien-commun-nos-projets'}/projects-index.json`;
    const result = await safeFetch(projectsPath);
    if (result) {
      if (getLanguage() === 'fr') {
        rawProjects = result.filter((project) => project.path.includes('/fr/fondation-pour-le-bien-commun-nos-projets/'));
      } else {
        rawProjects = result.filter((project) => project.path.includes('/en/fondation-pour-le-bien-commun-projects/'));
      }
    }
  } else {
    // For localhost or other domains, try arbres first, fallback to biencommun
    const arbresPath = `/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-les-arbres-projects' : 'fondation-pour-les-arbres-nos-projets'}/projects-index.json`;
    const bienCommunPath = `/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-le-bien-commun-projects' : 'fondation-pour-le-bien-commun-nos-projets'}/projects-index.json`;

    let result = await safeFetch(arbresPath);

    // ffetch returns empty array for 404s instead of throwing error
    // So we check if result is null OR an empty array, then try fallback
    if (!result || (Array.isArray(result) && result.length === 0)) {
      result = await safeFetch(bienCommunPath);
    }

    if (result && Array.isArray(result) && result.length > 0) {
      rawProjects = result;
    } else {
      rawProjects = []; // Ensure it's an empty array
    }
  }
  return rawProjects;
}

function getProjectCardSlot(projectItemEl) {
  return projectItemEl.closest('.image-fade-wrapper') || projectItemEl;
}

function setProjectItemFilterData($el, project) {
  $el.dataset.filterPath = project.path;
  $el.dataset.filterTitle = (project.title || '').toLowerCase();
  $el.dataset.filterCategory = project.category || '';
  $el.dataset.filterLocation = project.location || '';
  $el.dataset.filterPartner = (project.partner || '').toLowerCase();
}

function showProjectCards(getprojects, doc) {
  getprojects.forEach((projects) => {
    const url = projects.path;
    const $projectsItem = a(
      { class: 'project-item', href: url },
      div(
        { class: 'projects-image-wrapper' },
        img(
          { class: 'projects-image', src: projects.image, alt: projects.title },
        ),
      ),
      div(
        { class: 'projects-partner' },
        span(projects.partner),
      ),
      div(
        { class: 'projects-location' },
        span(projects.location),
      ),
      div(
        { class: 'projects-duration' },
        span(projects.duration),
      ),
      h2({ class: 'projects-title' }, projects.title),
      span({ class: 'projects-date' }, projects.date),
      span({ class: 'projects-category' }, projects.category),
    );
    setProjectItemFilterData($projectsItem, projects);
    doc.querySelector('.projects-listing').append($projectsItem);
  });
  const projectItems = doc.querySelectorAll('.project-item');
  projectItems.forEach((project) => {
    applyFadeUpAnimation(project, project.parentNode);
  });
}

function syncProjectsListingFilters(
  projectsListing,
  $categoryInput,
  $locationInput,
  searchInput,
  options = {},
) {
  const { forceShowAll } = options;
  const categoryVal = ($categoryInput?.value || '').trim();
  const locationVal = ($locationInput?.value || '').trim();
  const searchRaw = (searchInput?.value || '').toLowerCase();

  projectsListing.querySelectorAll('.project-item').forEach((item) => {
    const title = item.dataset.filterTitle || '';
    const category = item.dataset.filterCategory || '';
    const location = item.dataset.filterLocation || '';
    const partner = item.dataset.filterPartner || '';

    const matchCategory = forceShowAll || !categoryVal
      || (category && category.includes(categoryVal));
    const matchLocation = forceShowAll || !locationVal
      || (location && location.includes(locationVal));
    const matchSearch = forceShowAll || searchRaw.length < 2
      || title.includes(searchRaw)
      || category.toLowerCase().includes(searchRaw)
      || location.toLowerCase().includes(searchRaw)
      || partner.includes(searchRaw);

    const show = matchCategory && matchLocation && matchSearch;
    getProjectCardSlot(item).style.display = show ? '' : 'none';
  });
}

function reorderProjectSlots(projectsListing, orderedProjects) {
  const pathToSlot = new Map();
  projectsListing.querySelectorAll('.project-item').forEach((item) => {
    const path = item.dataset.filterPath;
    if (path) pathToSlot.set(path, getProjectCardSlot(item));
  });
  orderedProjects.forEach((project) => {
    const slot = pathToSlot.get(project.path);
    if (slot) projectsListing.appendChild(slot);
  });
}

function getProjectSortDate(project, endYear) {
  const fallback = endYear * 10000 + 1231;
  const value = project.startDate?.trim();
  if (!value) return fallback;

  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (match) {
    const [day, month, year] = match.slice(1).map(Number);
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    if (year > 0 && date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1 && date.getUTCDate() === day) {
      return year * 10000 + month * 100 + day;
    }
  }
  console.warn(`Invalid Start Date for project ${project.path}: "${value}". Expected DD.MM.YYYY; using Duration instead.`);
  return fallback;
}

function sortProjects(projects) {
  return projects.map((project) => {
    const [start, end] = (project.duration || '').replace(/\s*→\s*/, '→').split('→')
      .map((year) => parseInt(year.trim(), 10));
    const startYear = Number.isFinite(start) ? start : 0;
    const endYear = Number.isFinite(end) ? end : 0;
    return {
      project,
      date: getProjectSortDate(project, endYear),
      startYear,
      endYear,
    };
  }).sort((left, right) => right.date - left.date
    || right.endYear - left.endYear || right.startYear - left.startYear)
    .map(({ project }) => project);
}

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $section = doc.querySelector('main .section:last-of-type');
  const $filterContainer = div({ class: 'filter-container' });
  let { placeholders } = window;
  if (!placeholders) {
    placeholders = await fetchPlaceholders(`${getLanguage()}`);
  }
  const { projectsLandingCategoryFilter } = placeholders;
  const { projectsLandingLocationFilter } = placeholders;
  const { projectsLandingViewFilter } = placeholders;
  const { projectsLandingSearchFilter } = placeholders;

  const $projectsListingRight = div({ class: 'projects-listing-container-right' });

  let $mapLink;
  if (window.location.hostname.includes('biencommun')) {
    $mapLink = a({ class: 'map-link-btn', href: '/en/fondation-pour-le-bien-commun-projects-map', id: 'map-link' }, 'See map');
  } else {
    $mapLink = a({ class: 'map-link-btn', href: '/en/fondation-pour-les-arbres-projects-map', id: 'map-link' }, 'See map');
  }
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
      div(
        { class: 'category-dropdown' },
      ),
      span({ class: 'filter-separator' }, '|'),
    ),
    div(
      { class: 'location-section' },
      input(
        {
          class: 'location-input', id: 'filterlocations-selectized', placeholder: projectsLandingLocationFilter, type: 'text', autofill: 'no',
        },
      ),
      div(
        { class: 'location-dropdown' },
      ),
      span({ class: 'filter-separator' }, '|'),
    ),
    a({ class: 'view-all', href: '#', id: 'view-all' }, projectsLandingViewFilter),
    span({ class: 'filter-separator' }, '|'),
    div(
      { class: 'search-section' },
      input(
        {
          class: 'search-input', id: 'filtersearch', placeholder: projectsLandingSearchFilter, type: 'text', minlength: '2', size: '10',
        },
      ),
      a({ class: 'btn-search-clear', href: '#' }),
    ),
  );

  $filterContainer.append($projectsListingLeft, $projectsListingRight);
  const $projectsListing = div(
    { class: 'projects-listing-container' },
    div(
      { class: 'projects-listing' },
    ),
  );
  $section.append($filterContainer, $projectsListing);
  const getProjects = sortProjects(await getProjectsdata());
  const allCategories = getProjects
    .flatMap((item) => (item.category || '').split('|'))
    .map((cat) => cat.trim())
    .filter((cat) => cat);
  const uniqueCategories = [...new Set(allCategories)].sort();
  const categoryList = doc.createElement('ul');
  uniqueCategories.forEach((category) => {
    const categoryItem = doc.createElement('li');
    categoryItem.textContent = category;
    categoryList.appendChild(categoryItem);
  });

  const allLocations = getProjects
    .flatMap((item) => (item.location || '').split('|'))
    .map((cat) => cat.trim())
    .filter((cat) => cat);
  const uniqueLocations = [...new Set(allLocations)].sort();
  const locationList = doc.createElement('ul');
  uniqueLocations.forEach((category) => {
    const locationItem = doc.createElement('li');
    locationItem.textContent = category;
    locationList.appendChild(locationItem);
  });

  $main.append($section);

  showProjectCards(getProjects, doc);
  const categorysection = doc.querySelector('.category-dropdown');
  const locationsection = doc.querySelector('.location-dropdown');
  locationsection.appendChild(locationList);
  categorysection.appendChild(categoryList);
  const $categoryInput = doc.querySelector('.category-input');
  $categoryInput.addEventListener('click', () => {
    locationsection.style.display = 'none';
    categorysection.style.display = categorysection.style.display === 'block' ? 'none' : 'block';
  });

  const $locationInput = doc.querySelector('.location-input');
  $locationInput.addEventListener('click', () => {
    categorysection.style.display = 'none';
    locationsection.style.display = locationsection.style.display === 'block' ? 'none' : 'block';
  });

  const inputCat = doc.querySelector('.category-input');
  const inputLocation = doc.querySelector('.location-input');
  doc.addEventListener('click', (e) => {
    if (
      !categorysection.contains(e.target)
      && !locationsection.contains(e.target)
      && e.target !== $categoryInput
      && e.target !== $locationInput
    ) {
      categorysection.style.display = 'none';
      locationsection.style.display = 'none';
    }
  });

  const projectsListing = doc.querySelector('.projects-listing');
  const searchInput = document.getElementById('filtersearch');
  const categoryItems = categorysection.querySelectorAll('li');
  const locationItems = locationsection.querySelectorAll('li');
  categoryItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      const selectedCategory = event.target.textContent;
      $categoryInput.value = selectedCategory;
      setInputWidthToText(inputCat);
      categorysection.style.display = 'none';
      locationsection.style.display = 'none';
      syncProjectsListingFilters(
        projectsListing,
        $categoryInput,
        $locationInput,
        searchInput,
      );
    });
  });

  locationItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      const selectedLocation = event.target.textContent;
      $locationInput.value = selectedLocation;
      setInputWidthToText(inputLocation);
      locationsection.style.display = 'none';
      categorysection.style.display = 'none';

      syncProjectsListingFilters(
        projectsListing,
        $categoryInput,
        $locationInput,
        searchInput,
      );
    });
  });

  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        syncProjectsListingFilters(
          projectsListing,
          $categoryInput,
          $locationInput,
          searchInput,
        );
      }, 300);
    });
  }

  const viewAllButton = doc.getElementById('view-all');
  viewAllButton.addEventListener('click', (event) => {
    event.preventDefault();
    requestAnimationFrame(() => {
      setInputWidthToText(inputCat);
      setInputWidthToText(inputLocation);
      setInputWidthToText(searchInput);
    });
    $categoryInput.value = '';
    $locationInput.value = '';
    searchInput.value = '';
    reorderProjectSlots(projectsListing, getProjects);
    syncProjectsListingFilters(
      projectsListing,
      $categoryInput,
      $locationInput,
      searchInput,
      { forceShowAll: true },
    );
  });

  const clearSearchBtn = doc.querySelector('.btn-search-clear');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', (event) => {
      event.preventDefault();
      searchInput.value = '';
      reorderProjectSlots(projectsListing, getProjects);
      syncProjectsListingFilters(
        projectsListing,
        $categoryInput,
        $locationInput,
        searchInput,
        { forceShowAll: true },
      );
    });
  }

  requestAnimationFrame(() => {
    setInputWidthToText(inputCat);
    setInputWidthToText(inputLocation);
    setInputWidthToText(searchInput);
  });
}
