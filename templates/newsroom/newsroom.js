import {
  div, section, input, span, a,
} from '../../scripts/dom-helpers.js';
import { getLanguageFromPath } from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/aem.js';

// Helper functions to reduce redundancy
function getTable(doc) {
  return doc.querySelector('.table table') || doc.querySelector('table');
}

function getTableRows(doc) {
  const table = getTable(doc);
  return table ? table.querySelectorAll('tbody tr') : [];
}

function showAllRows(doc) {
  getTableRows(doc).forEach((row) => {
    row.style.display = '';
  });
}

function resetButtonStates(doc) {
  const filterTopBtn = doc.querySelector('.filter-top-btn');
  const filterBottomBtn = doc.querySelector('.filter-bottom-btn');
  if (filterTopBtn) filterTopBtn.classList.remove('active');
  if (filterBottomBtn) filterBottomBtn.classList.remove('active');
}

//  Simplified resetAllFilters
function resetAllFilters(doc, typePlaceholder = 'Type') {
  const typeInput = doc.querySelector('.type-input');
  const searchInput = doc.querySelector('.media-search-input');
  if (typeInput) typeInput.value = typePlaceholder;
  if (searchInput) searchInput.value = '';
  resetButtonStates(doc);
  showAllRows(doc);
}

function setupTypeFilter(doc, typePlaceholder = 'Type') {
  const typeInput = doc.querySelector('.type-input');
  const typeDropdown = doc.querySelector('.type-dropdown');
  if (!typeInput || !typeDropdown) return;

  function getUniqueTypesFromTable() {
    const rows = getTableRows(doc);
    const types = new Set();

    rows.forEach((row) => {
      const firstCell = row.querySelector('td:first-child');
      if (firstCell?.textContent.trim()) {
        types.add(firstCell.textContent.trim());
      }
    });

    return Array.from(types).sort();
  }

  function filterTable(selectedType) {
    getTableRows(doc).forEach((row) => {
      const firstCell = row.querySelector('td:first-child');
      if (!firstCell) return;
      const cellText = firstCell.textContent.trim();
      row.style.display = cellText === selectedType ? '' : 'none';
    });
  }

  function populateDropdown() {
    const uniqueTypes = getUniqueTypesFromTable();
    typeDropdown.innerHTML = '';

    if (uniqueTypes.length === 0) {
      typeDropdown.append(div({ class: 'type-option' }, 'No types found'));
      return;
    }

    uniqueTypes.forEach((type) => {
      const option = div({ class: 'type-option', 'data-value': type }, type);
      option.addEventListener('click', () => {
        typeInput.value = type;
        typeDropdown.style.display = 'none';
        filterTable(type);
      });
      typeDropdown.append(option);
    });
  }

  typeInput.addEventListener('click', (e) => {
    e.preventDefault();
    const isVisible = typeDropdown.style.display !== 'none';
    typeDropdown.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) populateDropdown();
  });

  doc.addEventListener('click', (e) => {
    if (!typeInput.contains(e.target) && !typeDropdown.contains(e.target)) {
      typeDropdown.style.display = 'none';
    }
  });

  const viewAllBtn = doc.querySelector('.view-all-media');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetAllFilters(doc, typePlaceholder);
    });
  }
}

function setupSearchFilter(doc) {
  const searchInput = doc.querySelector('.media-search-input');
  const clearBtn = doc.querySelector('.btn-media-search-clear');
  if (!searchInput) return;

  let searchTimeout;

  function filterTableBySearch(searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    getTableRows(doc).forEach((row) => {
      const secondCell = row.querySelector('td:nth-child(2)');
      if (!secondCell) return;
      const cellText = secondCell.textContent.toLowerCase().trim();
      row.style.display = !normalizedSearch || cellText.includes(normalizedSearch) ? '' : 'none';
    });
  }

  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => filterTableBySearch(e.target.value), 300);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.value = '';
      filterTableBySearch('');
      searchInput.focus();
    });
  }
}

// Simplified sorting functions
function updateSortButtonStates(doc, activeSort) {
  resetButtonStates(doc);
  const btn = doc.querySelector(activeSort === 'asc' ? '.filter-top-btn' : '.filter-bottom-btn');
  if (btn) btn.classList.add('active');
}

function sortTableByFirstColumn(doc, order = 'asc') {
  const table = getTable(doc);
  const tbody = table?.querySelector('tbody');
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll('tr'));
  const rowsWithVisibility = rows.map((row) => ({
    element: row,
    isVisible: row.style.display !== 'none',
    firstCellText: row.querySelector('td:first-child')?.textContent.trim() || '',
  }));

  rowsWithVisibility.sort((rowA, rowB) => {
    const textA = rowA.firstCellText.toLowerCase();
    const textB = rowB.firstCellText.toLowerCase();
    return order === 'asc' ? textA.localeCompare(textB) : textB.localeCompare(textA);
  });

  tbody.innerHTML = '';
  rowsWithVisibility.forEach(({ element, isVisible }) => {
    element.style.display = isVisible ? '' : 'none';
    tbody.appendChild(element);
  });

  updateSortButtonStates(doc, order);
}

function setupSortButtons(doc) {
  const filterTopBtn = doc.querySelector('.filter-top-btn');
  const filterBottomBtn = doc.querySelector('.filter-bottom-btn');
  if (!filterTopBtn || !filterBottomBtn) return;

  filterTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sortTableByFirstColumn(doc, 'asc');
  });

  filterBottomBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sortTableByFirstColumn(doc, 'desc');
  });
}

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $section = section();
  const $filterContainer = div({ class: 'media-filter-container' });

  // Use direct access to placeholders for language switching
  const currentLang = getLanguageFromPath();
  await fetchPlaceholders(currentLang);
  const placeholderData = window.placeholders[currentLang] || {};
  const typePlaceholder = placeholderData.mediaNewsroomTypeFilter || 'Type';
  const viewAllText = placeholderData.mediaNewsroomViewFilter || 'View all';
  const searchPlaceholder = placeholderData.mediaNewsroomSearchFilter || 'Search...';

  // Create filter components
  const $mediaFilterRight = div({ class: 'media-filter-container-right' });
  const $filterTopBtn = a({ class: 'filter-top-btn' });
  const $filterBottomBtn = a({ class: 'filter-bottom-btn' });
  $mediaFilterRight.append($filterTopBtn, $filterBottomBtn);

  const $mediaFilterLeft = div(
    { class: 'media-filter-container-left' },
    div(
      { class: 'type-section' },
      input({
        class: 'type-input',
        id: 'filtertypes-selectized',
        placeholder: typePlaceholder,
        type: 'text',
        autocomplete: 'off',
      }),
      div({ class: 'type-dropdown', style: 'display: none;' }),
    ),
    span({ class: 'filter-separator' }, ' | '),
    a({ class: 'view-all-media', href: '#', id: 'view-all-media' }, viewAllText),
    span({ class: 'filter-separator' }, ' | '),
    div(
      { class: 'media-search-section' },
      input({
        class: 'media-search-input',
        id: 'filtermediasearch',
        placeholder: searchPlaceholder,
        type: 'text',
        minlength: '2',
        size: '12',
      }),
    ),
    a({ class: 'btn-media-search-clear', href: '#' }),
  );

  $filterContainer.append($mediaFilterLeft, $mediaFilterRight);
  $section.append($filterContainer);

  // Insert filter section
  const lightGreySection = $main.querySelector('.light-grey-bg');
  if (lightGreySection) {
    lightGreySection.parentNode.insertBefore($section, lightGreySection);
  } else {
    $main.insertBefore($section, $main.firstChild);
  }

  // Initialize functionality
  setupSortButtons(doc);
  setupTypeFilter(doc, typePlaceholder);
  setupSearchFilter(doc);
}
