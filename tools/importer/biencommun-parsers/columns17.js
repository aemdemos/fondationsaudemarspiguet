/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell, exact text
  const headerRow = ['Columns (columns17)'];

  // Get the main content wrapper
  const inside = element.querySelector('.inside') || element;

  // Get the form if it exists (for columns)
  const form = inside.querySelector('form');

  // Prepare left column content: all content from .input_col_1 and button
  let leftColContent = [];
  if (form) {
    const col1 = form.querySelector('.input_col_1');
    if (col1) {
      leftColContent.push(col1);
    }
    // Add the submit button (SEND)
    const submitBtn = form.querySelector('button, input[type="submit"]');
    if (submitBtn) leftColContent.push(submitBtn);
  }

  // Prepare right column content: all content from .input_col_2
  let rightColContent = [];
  if (form) {
    const col2 = form.querySelector('.input_col_2');
    if (col2) {
      rightColContent.push(col2);
    }
  }

  // Compose the columns row
  const columnsRow = [leftColContent, rightColContent];

  // Check for message/info under the form (should span both columns)
  let infoRow = null;
  // The info message is the <div style="padding-top: 20px;">...
  const infoDiv = inside.querySelector('div[style*="padding-top"]');
  if (infoDiv) {
    // Place all its text and elements in the first cell, second cell empty
    infoRow = [[infoDiv], ''];
  }

  // Build the table rows array
  const rows = [headerRow, columnsRow];
  if (infoRow) rows.push(infoRow);

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
