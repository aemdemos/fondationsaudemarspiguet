/* global WebImporter */
export default function parse(element, { document }) {
  // Correct: header must be a single-cell row
  const headerRow = ['Columns (columns24)'];

  // Get both columns from the HTML
  const leftCol = element.querySelector('.projets_listing_container_left');
  const rightCol = element.querySelector('.projets_listing_container_right');

  // Second row is the two-column content row
  const contentRow = [leftCol, rightCol];

  // Build table: first row is a single cell, second row is two cells
  const cells = [
    headerRow,    // [ 'Columns (columns24)' ] (1 cell)
    contentRow    // [ leftCol, rightCol ]   (2 cells)
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
