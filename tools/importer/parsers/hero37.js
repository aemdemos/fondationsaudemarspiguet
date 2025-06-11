/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content paragraph (the only visible content in the hero)
  let heroContent = element.querySelector('p');

  // Fallback if the p is not present
  if (!heroContent) {
    heroContent = element;
  }

  // The Hero block should be 1 column, 3 rows:
  // 1. Header row: 'Hero'
  // 2. (Optional) image row: blank if no image
  // 3. Content row
  const cells = [
    ['Hero'],
    [''],
    [heroContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
