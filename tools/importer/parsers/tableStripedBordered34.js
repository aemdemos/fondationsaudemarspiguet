/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row as in the example
  const headerRow = ['Table (striped, bordered, tableStripedBordered34)'];

  // Find the actual content element for the single cell
  // The content is fully contained in a <p> inside a nested div
  let content = element.querySelector('p');
  if (!content) {
    // Fallback: take the first non-empty div, or as last resort the element itself
    const divs = element.querySelectorAll('div');
    for (const div of divs) {
      if (div.textContent.trim()) {
        content = div;
        break;
      }
    }
    if (!content) content = element;
  }
  
  // Create table rows. Only one data row, containing all the content in a single cell
  const rows = [headerRow, [content]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}