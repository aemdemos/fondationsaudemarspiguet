/* global WebImporter */
export default function parse(element, { document }) {
  // Create the exact header row: an array with a single string value
  const headerRow = ['Columns (columns26)'];

  // Get left column content: .social_container div (all left footer info)
  const leftCol = element.querySelector('.social_container') || document.createElement('div');
  // Get right column content: .footer_menu div (all right footer info)
  const rightCol = element.querySelector('.footer_menu') || document.createElement('div');

  // Construct cells: first row is a single header cell, second row is two cells (columns)
  const cells = [
    headerRow,
    [leftCol, rightCol],
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
