/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards7)'];
  const rows = [headerRow];

  // Find all individual card anchors
  const cardAnchors = element.querySelectorAll('.partenaires_listing .myItem');

  cardAnchors.forEach((a) => {
    // First cell: card main image (the image in .gallery_listing_format)
    let cardImage = null;
    const galleryDiv = a.querySelector('.gallery_listing_format');
    if (galleryDiv) {
      cardImage = galleryDiv.querySelector('img');
    }

    // Second cell: logo (above), then title as strong (on next line)
    const cellContent = [];
    const logoImg = a.querySelector('.partenaires_logo img');
    if (logoImg) {
      cellContent.push(logoImg);
    }
    const h2 = a.querySelector('h2');
    if (h2) {
      // Add <br> only if logo is present
      if (logoImg) cellContent.push(document.createElement('br'));
      // Use <strong> for the heading
      const strong = document.createElement('strong');
      strong.textContent = h2.textContent;
      cellContent.push(strong);
    }
    rows.push([
      cardImage,
      cellContent.length === 1 ? cellContent[0] : cellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
