/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <p> containing the buttons
  const p = element.querySelector('p');

  // Defensive: check if <p> exists and has <a>s
  let columnsRow = [];
  if (p) {
    // Get all immediate <a> children (the buttons)
    columnsRow = Array.from(p.querySelectorAll('a'));
    // If there are no buttons, leave cell empty for that column
    if (columnsRow.length === 0) {
      columnsRow = [''];
    }
  } else {
    // If <p> not found, create an empty single cell (still a valid row)
    columnsRow = [''];
  }

  // Header row must contain exactly one cell as per the standard and example
  const headerRow = ['Columns (columns40)'];

  // Build and replace with the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);
  element.replaceWith(table);
}
