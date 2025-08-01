/* global WebImporter */
export default function parse(element, { document }) {
  // The block name, exactly as specified
  const headerRow = ['Table (striped, bordered, tableStripedBordered24)'];

  // Find the innermost content container
  let blockContent = element;
  // .inside_little is a wrapper for the content
  const inside = element.querySelector(':scope > .inside_little');
  if (inside) blockContent = inside;
  // .aos-init contains the quote and attribution
  const aos = blockContent.querySelector(':scope > .aos-init');
  if (aos) blockContent = aos;

  // Collect all <p> elements inside the innermost container
  const ps = Array.from(blockContent.querySelectorAll(':scope > p'));
  // If there are no <p> children, fallback to all content
  let cellContent;
  if (ps.length > 0) {
    cellContent = document.createElement('div');
    ps.forEach(p => cellContent.appendChild(p));
  } else {
    // fallback: reference the entire blockContent
    cellContent = blockContent;
  }

  const rows = [headerRow, [cellContent]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
