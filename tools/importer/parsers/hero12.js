/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Hero (hero12)'];
  // Background image row (none present in these HTMLs)
  const backgroundRow = [''];

  // Gather intro paragraph and CTA button as references to existing elements
  let introContent = null;
  let ctaContent = null;
  // Get the two .col.col6 children (order can vary)
  const cols = element.querySelectorAll('.container_col > .col.col6');
  cols.forEach(col => {
    if (col.classList.contains('introdution_text_bloc')) {
      // Get all children (so we retain paragraphs, spans, etc)
      introContent = col;
    } else {
      // The button is in the form in the other column
      ctaContent = col;
    }
  });

  // Compose content row, referencing existing elements (not clones)
  const cellContent = [];
  if (introContent) cellContent.push(introContent);
  if (ctaContent) cellContent.push(ctaContent);
  // If both present, add a space between for readability
  if (introContent && ctaContent) {
    cellContent.splice(1, 0, document.createTextNode(' '));
  }

  const contentRow = [cellContent];

  // Compose the table with 1 column x 3 rows
  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
