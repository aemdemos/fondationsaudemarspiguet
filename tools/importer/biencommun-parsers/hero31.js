/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: always the block name
  const headerRow = ['Hero (hero31)'];
  // No background image present, so leave cell empty
  const imageRow = [''];

  // Extract content: h2 and p
  // The structure is: section_page > inside.container > container_col > cols
  const container = element.querySelector('.inside.container');
  let heading = null;
  let para = null;
  if (container) {
    const cols = container.querySelectorAll(':scope > .container_col > .col');
    for (const col of cols) {
      if (!heading) {
        heading = col.querySelector('h2');
      }
      if (!para) {
        para = col.querySelector('p');
      }
    }
  }

  // Prepare the content cell, referencing existing elements
  const content = [];
  if (heading) content.push(heading);
  if (para) content.push(para);
  // If both are missing, leave cell blank (fallback)
  const contentRow = [content.length > 0 ? content : ''];

  // Build the block table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
