/* global WebImporter */
export default function parse(element, { document }) {
  // Get the innermost content wrapper for the quote and attribution
  const aosDiv = element.querySelector('.aos-init');
  let contentNodes = [];
  if (aosDiv) {
    // Collect all child elements (likely paragraphs)
    contentNodes = Array.from(aosDiv.children);
  } else {
    // Fallback: get all paragraphs directly
    contentNodes = Array.from(element.querySelectorAll('p'));
  }

  // If nothing found, leave empty for content row
  const contentRow = contentNodes.length > 0 ? [contentNodes] : [''];

  const rows = [
    ['Hero (hero15)'], // Header row: EXACT match as per instructions
    [''],             // Background image row: none in this case
    contentRow        // Text/heading content row
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
