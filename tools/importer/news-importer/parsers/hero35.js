/* global WebImporter */
export default function parse(element, { document }) {
  // Find the paragraph with the hero text
  const introDiv = element.querySelector('.introdution_text');
  let heroContent = '';
  if (introDiv) {
    const p = introDiv.querySelector('p');
    if (p) heroContent = p;
    else heroContent = '';
  }

  // Prepare the table for the Hero block with 1 column and 3 rows, as per example
  const cells = [
    ['Hero'],
    [''],
    [heroContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
