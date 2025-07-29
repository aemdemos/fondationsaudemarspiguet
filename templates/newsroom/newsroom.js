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
}
