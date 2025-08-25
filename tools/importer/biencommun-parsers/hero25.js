/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row per requirements
  const headerRow = ['Hero (hero25)'];

  // No background image found in the source
  const backgroundRow = [''];

  // Gather all relevant content from all .col children (order: heading, addresses, paragraphs)
  const contentElements = [];
  const containerCol = element.querySelector('.container_col');
  if (containerCol) {
    // Process all .col (top-level cols)
    const cols = Array.from(containerCol.querySelectorAll(':scope > .col'));
    cols.forEach(col => {
      // For each col, collect all element children (including their structure)
      Array.from(col.children).forEach(child => contentElements.push(child));
    });
  }

  // Compose the table
  const cells = [
    headerRow,
    backgroundRow,
    [contentElements]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
