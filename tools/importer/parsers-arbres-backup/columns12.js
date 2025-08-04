/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct child project card <a> elements
  const projectLinks = Array.from(element.querySelectorAll(':scope > a.myItem'));
  if (!projectLinks.length) return;

  // The header row must be a single cell
  const headerRow = ['Columns (columns12)'];
  // The columns row must have as many cells as there are project cards, each cell with a project <a> element
  const columnsRow = projectLinks.map(card => card);

  const table = WebImporter.DOMUtils.createTable([headerRow, columnsRow], document);
  element.replaceWith(table);
}
