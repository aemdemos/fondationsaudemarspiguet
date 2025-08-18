/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Hero block: Table with 1 column, 3 rows
  // [ 'Hero' ], [ Background Image (optional) ], [ Content (headline, subhead, etc) ]
  // The provided HTML has only text, no image or button.

  // Find the main text content (the <p> inside .introdution_text)
  let content = '';
  const introText = element.querySelector('.introdution_text');
  if (introText) {
    const p = introText.querySelector('p');
    if (p) {
      content = p;
    } else {
      // fallback: use the .introdution_text itself if no <p>
      content = introText;
    }
  } else {
    // fallback: use the element itself
    content = element;
  }

  // Build the table rows: header, (empty for bg image), main content
  const tableRows = [
    ['Hero'],
    [''],
    [content]
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
