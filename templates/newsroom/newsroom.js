import {
  div, section, input, span, a,
} from '../../scripts/dom-helpers.js';

// Function to fetch placeholders from JSON endpoint
async function fetchPlaceholders() {
  try {
    const response = await fetch('https://main--fondationsaudemarspiguet--aemdemos.aem.page/placeholders.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data; // Return the data object or empty object if not found
  } catch (error) {
    return {}; // Return empty object on error
  }
}

// Function to detect current language
function getCurrentLanguage() {
  // Check URL path
  const currentPath = window.location.pathname;
  if (currentPath.startsWith('/fr/') || currentPath.includes('/fr/')) {
    return 'fr';
  }
  // Default to English
  return 'en';
}

// Function to get placeholder text with fallback
function getPlaceholderText(placeholders, key, fallback) {
  const currentLang = getCurrentLanguage();

  // Check if we have data for the current language
  if (!placeholders[currentLang] || !placeholders[currentLang].data) {
    return fallback;
  }
  // Find the placeholder by key (case-insensitive)
  const placeholder = placeholders[currentLang].data.find(
    (item) => item.Key.toLowerCase() === key.toLowerCase(),
  );
  return placeholder ? placeholder.Text : fallback;
}

// Add this function outside both setupTypeFilter and setupSearchFilter
function resetAllFilters(doc, typePlaceholder = 'Type') {
  // Reset type filter
  const typeInput = doc.querySelector('.type-input');
  if (typeInput) {
    typeInput.value = typePlaceholder;
  }

  // Reset search filter
  const searchInput = doc.querySelector('.media-search-input');
  if (searchInput) {
    searchInput.value = '';
  }

  // Reset sort button states
  const filterTopBtn = doc.querySelector('.filter-top-btn');
  const filterBottomBtn = doc.querySelector('.filter-bottom-btn');
  if (filterTopBtn) filterTopBtn.classList.remove('active');
  if (filterBottomBtn) filterBottomBtn.classList.remove('active');

  // Show all table rows
  const table = doc.querySelector('.table table') || doc.querySelector('table');
  if (table) {
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      row.style.display = '';
    });
  }
}

function setupTypeFilter(doc, typePlaceholder = 'Type') {
  const typeInput = doc.querySelector('.type-input');
  const typeDropdown = doc.querySelector('.type-dropdown');
  if (!typeInput || !typeDropdown) return;

  // Function to get unique values from first column of table
  function getUniqueTypesFromTable() {
    const table = doc.querySelector('.table table') || doc.querySelector('table');
    if (!table) return [];

    const rows = table.querySelectorAll('tbody tr');
    const types = new Set();

    rows.forEach((row) => {
      const firstCell = row.querySelector('td:first-child');
      if (firstCell && firstCell.textContent.trim()) {
        types.add(firstCell.textContent.trim());
      }
    });

    return Array.from(types).sort();
  }
  // Function to filter table rows
  function filterTable(selectedType) {
    const table = doc.querySelector('.table table') || doc.querySelector('table');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');

    rows.forEach((row) => {
      const firstCell = row.querySelector('td:first-child');
      if (!firstCell) return;
      const cellText = firstCell.textContent.trim();
      // Only show rows that match the selected type
      if (cellText === selectedType) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }
  // Function to populate dropdown
  function populateDropdown() {
    const uniqueTypes = getUniqueTypesFromTable();

    // Clear existing dropdown
    typeDropdown.innerHTML = '';

    if (uniqueTypes.length === 0) {
      const noOptions = div({ class: 'type-option' }, 'No types found');
      typeDropdown.append(noOptions);
      return;
    }

    // Add unique type options only
    uniqueTypes.forEach((type) => {
      const option = div({ class: 'type-option', 'data-value': type }, type);
      typeDropdown.append(option);
    });

    // Add click listeners to options
    typeDropdown.querySelectorAll('.type-option').forEach((option) => {
      option.addEventListener('click', () => {
        const value = option.getAttribute('data-value');
        const displayText = option.textContent;
        typeInput.value = displayText;
        typeDropdown.style.display = 'none';
        // Filter table based on selection
        filterTable(value);
      });
    });
  }

  // Toggle dropdown on input click
  typeInput.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeDropdown.style.display === 'none') {
      populateDropdown();
      typeDropdown.style.display = 'block';
    } else {
      typeDropdown.style.display = 'none';
    }
  });

  // Close dropdown when clicking outside
  doc.addEventListener('click', (e) => {
    if (!typeInput.contains(e.target) && !typeDropdown.contains(e.target)) {
      typeDropdown.style.display = 'none';
    }
  });

  // Handle "View All" click - this will show all rows (replaces "All Types" functionality)
  const viewAllBtn = doc.querySelector('.view-all-media');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetAllFilters(doc, typePlaceholder);
    });
  }
}

// Separate the search functionality into its own function
function setupSearchFilter(doc) {
  const searchInput = doc.querySelector('.media-search-input');
  const clearBtn = doc.querySelector('.btn-media-search-clear');

  if (!searchInput) return;

  let searchTimeout;

  // Function to filter table rows based on search
  function filterTableBySearch(searchTerm) {
    const table = doc.querySelector('.table table') || doc.querySelector('table');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    const normalizedSearch = searchTerm.toLowerCase().trim();

    rows.forEach((row) => {
      const secondCell = row.querySelector('td:nth-child(2)');
      if (!secondCell) return;

      const cellText = secondCell.textContent.toLowerCase().trim();

      if (normalizedSearch === '' || cellText.includes(normalizedSearch)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  // Search input event listener with debounce
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    // Debounce search to avoid too many rapid calls
    searchTimeout = setTimeout(() => {
      filterTableBySearch(searchTerm);
    }, 300); // Wait 300ms after user stops typing
  });

  // Clear button functionality
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.value = '';
      filterTableBySearch('');
      searchInput.focus(); // Keep focus on search input
    });
  }
}

// Function to update button visual states
function updateSortButtonStates(doc, activeSort) {
  const filterTopBtn = doc.querySelector('.filter-top-btn');
  const filterBottomBtn = doc.querySelector('.filter-bottom-btn');

  if (!filterTopBtn || !filterBottomBtn) return;

  // Remove active classes
  filterTopBtn.classList.remove('active');
  filterBottomBtn.classList.remove('active');

  // Add active class to the appropriate button
  if (activeSort === 'asc') {
    filterTopBtn.classList.add('active');
  } else if (activeSort === 'desc') {
    filterBottomBtn.classList.add('active');
  }
}

// Function to sort table by first column
function sortTableByFirstColumn(doc, order = 'asc') {
  const table = doc.querySelector('.table table') || doc.querySelector('table');
  if (!table) return;

  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  // Get all rows as an array
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // Filter out hidden rows (from current filters) and store their visibility
  const rowsWithVisibility = rows.map((row) => ({
    element: row,
    isVisible: row.style.display !== 'none',
    firstCellText: row.querySelector('td:first-child')?.textContent.trim() || '',
  }));

  // Sort the array based on first column text
  rowsWithVisibility.sort((rowA, rowB) => {
    const textA = rowA.firstCellText.toLowerCase();
    const textB = rowB.firstCellText.toLowerCase();
    if (order === 'asc') {
      return textA.localeCompare(textB);
    }
    return textB.localeCompare(textA);
  });

  // Clear the tbody
  tbody.innerHTML = '';

  // Re-append rows in sorted order, maintaining their visibility
  rowsWithVisibility.forEach(({ element, isVisible }) => {
    // Restore visibility state
    element.style.display = isVisible ? '' : 'none';
    tbody.appendChild(element);
  });

  // Add visual feedback to show which sort is active
  updateSortButtonStates(doc, order);
}

function setupSortButtons(doc) {
  const filterTopBtn = doc.querySelector('.filter-top-btn');
  const filterBottomBtn = doc.querySelector('.filter-bottom-btn');

  if (!filterTopBtn || !filterBottomBtn) {
    return;
  }

  // Sort ascending (A-Z) when top button is clicked
  filterTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sortTableByFirstColumn(doc, 'asc');
  });

  // Sort descending (Z-A) when bottom button is clicked
  filterBottomBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sortTableByFirstColumn(doc, 'desc');
  });
}

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $section = section();
  const $filterContainer = div({ class: 'media-filter-container' });

  // Fetch placeholders from JSON endpoint
  const placeholders = await fetchPlaceholders();

  // Get placeholder text with fallbacks using the correct keys from your JSON
  const typePlaceholder = getPlaceholderText(placeholders, 'media-newsroom-type-filter', 'Type');
  const viewAllText = getPlaceholderText(placeholders, 'media-newsroom-view-filter', 'View all');
  const searchPlaceholder = getPlaceholderText(placeholders, 'media-newsroom-search-filter', 'Search...');

  // Right container for filter toggle buttons
  const $mediaFilterRight = div({ class: 'media-filter-container-right' });
  const $filterTopBtn = a({ class: 'filter-top-btn' });
  const $filterBottomBtn = a({ class: 'filter-bottom-btn' });

  $mediaFilterRight.append($filterTopBtn, $filterBottomBtn);

  // Left container for filter controls
  const $mediaFilterLeft = div(
    { class: 'media-filter-container-left' },
    div(
      { class: 'type-section' },
      input(
        {
          class: 'type-input',
          id: 'filtertypes-selectized',
          placeholder: typePlaceholder, // Use dynamic placeholder
          type: 'text',
          autocomplete: 'off',
        },
      ),
      // Dropdown container for type options
      div({ class: 'type-dropdown', style: 'display: none;' }),
    ),
    span({ class: 'filter-separator' }, ' | '),
    a({ class: 'view-all-media', href: '#', id: 'view-all-media' }, viewAllText),
    span({ class: 'filter-separator' }, ' | '),
    div(
      { class: 'media-search-section' },
      input(
        {
          class: 'media-search-input',
          id: 'filtermediasearch',
          placeholder: searchPlaceholder, // Use dynamic placeholder
          type: 'text',
          minlength: '2',
          size: '12',
        },
      ),
    ),
    a({ class: 'btn-media-search-clear', href: '#' }),
  );

  $filterContainer.append($mediaFilterLeft, $mediaFilterRight);

  // Container for media results
  // eslint-disable-next-line no-unused-vars
  const $mediaListing = div({ class: 'media-listing' });

  // Append to section and main
  $section.append($filterContainer);

  // Find existing light-grey-bg section and insert filter before it
  const lightGreySection = $main.querySelector('.light-grey-bg');
  if (lightGreySection) {
    lightGreySection.parentNode.insertBefore($section, lightGreySection);
  } else {
    // If no light-grey-bg section found, just add to top of main
    $main.insertBefore($section, $main.firstChild);
  }

  // Add sorting functionality to buttons
  setupSortButtons(doc);

  // Add functionality after DOM is ready
  setupTypeFilter(doc, typePlaceholder);
  setupSearchFilter(doc);
}
