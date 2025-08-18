/* global WebImporter */
export default function parse(element, { document }) {
  // Only output the block header row, as there is no tabular data in the source HTML.
  const cells = [
    ['Table (striped, bordered, tableStripedBordered6)']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
