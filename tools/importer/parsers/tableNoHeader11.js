/* global WebImporter */
export default function parse(element, { document }) {
  // Find the table inside the element
  const table = element.querySelector('table.medias_listing');
  if (!table) return;

  // Find all rows in the table body
  const rows = Array.from(table.querySelectorAll('tbody > tr'));

  // Build the table cells array
  const cells = [];
  // Add the required block header
  cells.push(['Table (no header)']);

  // For each row, reference the actual <td> elements directly, preserving formatting
  rows.forEach(tr => {
    const tds = Array.from(tr.children); // [type, title, link]
    cells.push(tds);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}
