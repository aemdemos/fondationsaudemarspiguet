/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row - must be exactly as in the example
  const headerRow = ['Hero (hero20)'];

  // There is no background image in the provided HTML, so image row is empty
  const imageRow = [''];

  // The only content present is a single CTA link
  // Must reference the existing anchor, not clone or create a new one
  const cta = element.querySelector('a');
  // If for some reason anchor is missing, fallback to an empty string
  const contentRow = [cta ? cta : ''];

  // Compose the table as 1 column x 3 rows (header, image, content)
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}