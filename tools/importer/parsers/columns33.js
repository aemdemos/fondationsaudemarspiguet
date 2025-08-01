/* global WebImporter */
export default function parse(element, { document }) {
  // Extract left and right blocks
  const left = element.querySelector('.projets_listing_container_left');
  const right = element.querySelector('.projets_listing_container_right');

  // Helper to get all direct children, preserving order and whitespace nodes
  function collectChildren(parent) {
    if (!parent) return [''];
    // Return all child nodes as-is if non-empty, else an empty string
    const nodes = Array.from(parent.childNodes).filter(
      n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
    );
    return nodes.length ? nodes : [''];
  }

  // Compose table cells as per spec:
  // Row 1: header row, single cell
  // Row 2: two columns (left, right)
  const cells = [
    ['Columns (columns33)'],
    [collectChildren(left), collectChildren(right)]
  ];

  // Create the table using WebImporter helper
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
