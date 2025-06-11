/* global WebImporter */
export default function parse(element, { document }) {
  // Get left and right containers
  const left = element.querySelector('.projets_listing_container_left');
  const right = element.querySelector('.projets_listing_container_right');

  // If left or right is missing, fallback to empty spans to ensure structure
  const leftContent = left ? left : document.createElement('span');
  const rightContent = right ? right : document.createElement('span');

  // Table as per block name
  const headerRow = ['Columns (columns28)'];
  const cells = [
    headerRow,
    [leftContent, rightContent],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
