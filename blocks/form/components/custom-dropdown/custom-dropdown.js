export default function decorate(block) {
  const selectElements = block.querySelectorAll('.drop-down-wrapper select');
  const createElement = (tag, className, textContent = '') => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent) el.textContent = textContent;
    return el;
  };

  const closeAllDropdowns = (exceptDropdown = null) => {
    document.querySelectorAll('.custom-dropdown.open').forEach((dd) => {
      if (dd !== exceptDropdown) dd.classList.remove('open');
    });
  };

  selectElements.forEach((select) => {
    if (select.parentElement.querySelector('.custom-dropdown')) return;

    const customDropdown = createElement('div', 'custom-dropdown');
    const dropdownSelected = createElement('div', 'custom-dropdown-selected');
    const selectedText = createElement('span', 'custom-dropdown-text');
    const dropdownArrow = createElement('span', 'custom-dropdown-arrow');
    const dropdownOptions = createElement('div', 'custom-dropdown-options');

    const selectedOption = select.querySelector('option[selected]') || select.options[0];
    selectedText.textContent = selectedOption?.textContent || 'Select an option';

    dropdownSelected.append(selectedText, dropdownArrow);

    const updateSelection = (index, optionText) => {
      select.selectedIndex = index;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      selectedText.textContent = optionText;
      dropdownOptions.querySelectorAll('.custom-dropdown-option').forEach((opt) => {
        opt.classList.toggle('selected', opt.dataset.index === String(index));
      });
      customDropdown.classList.remove('open');
    };

    // Event delegation for options
    dropdownOptions.addEventListener('click', (e) => {
      const option = e.target.closest('.custom-dropdown-option');
      if (option && !option.classList.contains('disabled')) {
        updateSelection(Number(option.dataset.index), option.textContent);
      }
    });

    // Add hover active class
    dropdownOptions.addEventListener('mouseover', (e) => {
      const option = e.target.closest('.custom-dropdown-option');
      if (option && !option.classList.contains('disabled')) {
        dropdownOptions.querySelectorAll('.custom-dropdown-option').forEach((opt) => {
          opt.classList.remove('active');
        });
        option.classList.add('active');
      }
    });

    dropdownOptions.addEventListener('mouseout', (e) => {
      const option = e.target.closest('.custom-dropdown-option');
      if (option) option.classList.remove('active');
    });

    // Create options
    Array.from(select.options).forEach((option, index) => {
      const customOption = createElement('div', 'custom-dropdown-option', option.textContent);
      customOption.dataset.value = option.value;
      customOption.dataset.index = index;
      if (option.disabled) customOption.classList.add('disabled');
      if (option.selected) customOption.classList.add('selected');
      dropdownOptions.appendChild(customOption);
    });

    customDropdown.append(dropdownSelected, dropdownOptions);

    // Toggle dropdown
    dropdownSelected.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = customDropdown.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) {
        customDropdown.classList.add('open');
      }
    });

    // Close on blur (when focus moves elsewhere)
    dropdownSelected.addEventListener('blur', () => {
      // Small delay to allow click events to process first
      setTimeout(() => {
        if (!customDropdown.contains(document.activeElement)) {
          customDropdown.classList.remove('open');
        }
      }, 150);
    });

    // Keyboard navigation
    let focusedIndex = -1;
    const maxIndex = select.options.length - 1;

    const updateFocusedOption = (newIndex) => {
      focusedIndex = newIndex;
      const options = dropdownOptions.querySelectorAll('.custom-dropdown-option:not(.disabled)');
      if (focusedIndex === -1) {
        options.forEach((opt) => opt.classList.remove('focused'));
      } else {
        options.forEach((opt, idx) => opt.classList.toggle('focused', idx === focusedIndex));
        options[focusedIndex]?.scrollIntoView({ block: 'nearest' });
      }
    };

    const clearFocus = () => updateFocusedOption(-1);

    dropdownSelected.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (customDropdown.classList.contains('open') && focusedIndex >= 1) {
            const options = dropdownOptions.querySelectorAll('.custom-dropdown-option:not(.disabled)');
            const focusedOption = options[focusedIndex];
            if (focusedOption) {
              updateSelection(Number(focusedOption.dataset.index), focusedOption.textContent);
              clearFocus();
            }
          } else {
            customDropdown.classList.add('open');
          }
          break;

        case 'ArrowDown': {
          e.preventDefault();
          if (!customDropdown.classList.contains('open')) customDropdown.classList.add('open');
          let newIndex;
          if (focusedIndex < 1) {
            newIndex = 1;
          } else if (focusedIndex === maxIndex) {
            newIndex = -1;
          } else {
            newIndex = focusedIndex + 1;
          }
          updateFocusedOption(newIndex);
          break;
        }

        case 'ArrowUp':
          e.preventDefault();
          if (focusedIndex > 1) {
            updateFocusedOption(focusedIndex - 1);
          } else if (focusedIndex === 1) {
            clearFocus();
          }
          break;

        case 'Escape':
          customDropdown.classList.remove('open');
          clearFocus();
          break;

        default:
          break;
      }
    });

    // Setup accessibility
    Object.assign(dropdownSelected, {
      tabIndex: 0,
    });
    dropdownSelected.setAttribute('role', 'button');
    dropdownSelected.setAttribute('aria-haspopup', 'listbox');

    select.style.display = 'none';
    select.parentElement.appendChild(customDropdown);
  });

  // Global event listeners to close dropdowns on any outside interaction
  // Close on any click outside dropdowns
  document.addEventListener('click', (e) => {
    const openDropdown = document.querySelector('.custom-dropdown.open');
    if (openDropdown && !openDropdown.contains(e.target)) {
      closeAllDropdowns();
    }
  });

  // Close on window resize
  window.addEventListener('resize', () => {
    closeAllDropdowns();
  });

  // Close on focus change to non-dropdown elements
  document.addEventListener('focusin', (e) => {
    const openDropdown = document.querySelector('.custom-dropdown.open');
    if (openDropdown && !openDropdown.contains(e.target)) {
      closeAllDropdowns();
    }
  });
}
