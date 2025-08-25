/* global WebImporter */
export default function parse(element, { document }) {
  // Block name as header row, exactly as required
  const headerRow = ['Hero (hero13)'];

  // Background image row: this HTML does not have a background image
  const bgImageRow = [''];

  // Content row: get the actual content paragraph (the message)
  let contentElem = null;
  // Get the deepest <p> inside the structure
  const ps = element.querySelectorAll('p');
  if (ps.length > 0) {
    // Use the first <p> found as content (as in the HTML there is only one)
    contentElem = ps[0];
  } else {
    // Fallback: if no <p>, reference the whole content
    contentElem = element;
  }
  const contentRow = [contentElem];

  const cells = [
    headerRow,
    bgImageRow,
    contentRow
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
