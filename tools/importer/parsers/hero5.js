/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two columns inside the block
  const cols = element.querySelectorAll('.col.col6');
  let introContent = [];
  let ctaContent = [];

  // Helper to check if node is an element or non-empty text node
  function isMeaningfulNode(node) {
    return (node.nodeType === 1) || // ELEMENT_NODE
           (node.nodeType === 3 && node.textContent && node.textContent.trim()); // TEXT_NODE
  }

  // Extract text/intro content from the first col
  if (cols.length > 0) {
    introContent = Array.from(cols[0].childNodes).filter(isMeaningfulNode);
  }

  // Extract CTA/form from the second col
  if (cols.length > 1) {
    ctaContent = Array.from(cols[1].childNodes).filter(isMeaningfulNode);
  }

  // Compose the main content cell (text + CTA in a single cell, separated by <br> if both present)
  const contentCell = [];
  if (introContent.length > 0) {
    contentCell.push(...introContent);
  }
  if (ctaContent.length > 0) {
    if (contentCell.length > 0) {
      contentCell.push(document.createElement('br'));
    }
    contentCell.push(...ctaContent);
  }

  // Table structure: Header row, empty row (for background image), content row (text + CTA)
  const tableRows = [
    ['Hero'],
    [''],
    [contentCell]
  ];
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
