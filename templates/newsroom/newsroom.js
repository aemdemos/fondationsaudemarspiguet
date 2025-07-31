import {
  div, section, input, span, a,
} from '../../scripts/dom-helpers.js';

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $section = section();
  const $filterContainer = div({ class: 'media-filter-container' });

  // Right container for filter toggle buttons
  const $mediaFilterRight = div({ class: 'media-filter-container-right' });
  const $filterExpandBtn = a({ class: 'filter-expand-btn' });
  const $filterCollapseBtn = a({ class: 'filter-collapse-btn' });

  $mediaFilterRight.append($filterExpandBtn, $filterCollapseBtn);

  // Left container for filter controls
  const $mediaFilterLeft = div(
    { class: 'media-filter-container-left' },
    div(
      { class: 'type-section' },
      input(
        {
          class: 'type-input',
          id: 'filtertypes-selectized',
          placeholder: 'Type',
          type: 'text',
          autocomplete: 'off',
        },
      ),
      // Dropdown container for type options
      div({ class: 'type-dropdown', style: 'display: none;' }),
    ),
    span({ class: 'filter-separator' }, ' | '),
    a({ class: 'view-all-media', href: '#', id: 'view-all-media' }, 'View All'),
    span({ class: 'filter-separator' }, ' | '),
    div(
      { class: 'media-search-section' },
      input(
        {
          class: 'media-search-input',
          id: 'filtermediasearch',
          placeholder: 'Search...',
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
  // Add functionality after DOM is ready
  setupTypeFilter(doc);
  setupSearchFilter(doc);
}

function setupTypeFilter(doc) {
  const typeInput = doc.querySelector('.type-input');
  const typeDropdown = doc.querySelector('.type-dropdown');
  

  if (!typeInput || !typeDropdown) return;


  // Function to get unique values from first column of table
  function getUniqueTypesFromTable() {
    const table = doc.querySelector('.table table') || doc.querySelector('table');
    if (!table) return [];

    const rows = table.querySelectorAll('tbody tr');
    const types = new Set();

    rows.forEach(row => {
      const firstCell = row.querySelector('td:first-child');
      if (firstCell && firstCell.textContent.trim()) {
        types.add(firstCell.textContent.trim());
      }
    });

    return Array.from(types).sort();
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

    // Add unique type options only (removed "All Types" option)
    uniqueTypes.forEach(type => {
      const option = div({ class: 'type-option', 'data-value': type }, type);
      typeDropdown.append(option);
    });

    // Add click listeners to options
    typeDropdown.querySelectorAll('.type-option').forEach(option => {
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

  // Function to filter table rows
  function filterTable(selectedType) {
    const table = doc.querySelector('.table table') || doc.querySelector('table');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const firstCell = row.querySelector('td:first-child');
      if (!firstCell) return;

      const cellText = firstCell.textContent.trim();
      
      // Only show rows that match the selected type (removed empty check for "All Types")
      if (cellText === selectedType) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
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
    resetAllFilters(doc);  // ✅ Use shared function
  });
  }

  // Function to show all table rows (replaces "All Types" functionality)
  function showAllRows() {
    const table = doc.querySelector('.table table') || doc.querySelector('table');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      row.style.display = '';
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
    
    rows.forEach(row => {
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

// Add this function outside both setupTypeFilter and setupSearchFilter
function resetAllFilters(doc) {
  // Reset type filter
  const typeInput = doc.querySelector('.type-input');
  if (typeInput) {
    typeInput.value = 'Type';
  }

  // Reset search filter
  const searchInput = doc.querySelector('.media-search-input');
  const clearBtn = doc.querySelector('.btn-media-search-clear');
  if (searchInput) {
    searchInput.value = '';
  }
 

  // Show all table rows
  const table = doc.querySelector('.table table') || doc.querySelector('table');
  if (table) {
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      row.style.display = '';
    });
  }
}