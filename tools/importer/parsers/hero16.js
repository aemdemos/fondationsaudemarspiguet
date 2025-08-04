/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Hero (hero16)'];

  // No background image in provided HTML, so row 2 is empty
  const imageRow = [''];

  // Extract content: title, paragraph, and CTA (if present)
  // Use :scope > div to ensure we get direct descendants
  // The content is nested under .container_col > .col and .col.col_right

  let contentElements = [];
  // Find the main text content container
  const containerCol = element.querySelector('.container_col');
  if (containerCol) {
    // Find the title
    const titleCol = containerCol.querySelector('.col');
    if (titleCol) {
      const h1 = titleCol.querySelector('h1');
      if (h1) contentElements.push(h1);
    }
    // Find the paragraph
    const paraCol = containerCol.querySelector('.col_right');
    if (paraCol) {
      const p = paraCol.querySelector('p');
      if (p) contentElements.push(p);
    }
  }
  // Find CTA link (after the .container_col)
  const cta = element.querySelector('a.btn_retour');
  if (cta) contentElements.push(cta);

  // Ensure at least an empty element if no content is found
  if (contentElements.length === 0) {
    contentElements = [''];
  }

  const contentRow = [contentElements];

  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
