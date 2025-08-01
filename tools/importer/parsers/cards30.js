/* global WebImporter */
export default function parse(element, { document }) {
  // Header as per spec
  const headerRow = ['Cards (cards30)'];
  const rows = [];

  // Find the card container
  const cardsRoot = element.querySelector('.projets_listing');
  if (!cardsRoot) return;
  const cards = cardsRoot.querySelectorAll(':scope > a.myItem');

  cards.forEach(card => {
    // Image: .image_container img (reference the element)
    let img = card.querySelector('.image_container img');
    // If there is no <img>, fallback to empty cell
    let imgCell = img || '';

    // Compose the text content cell
    const textElements = [];

    // Partner
    const partnerDiv = card.querySelector('.projets_listing_partners');
    if (partnerDiv && partnerDiv.textContent.trim()) {
      textElements.push(partnerDiv);
    }
    // Country/dates
    const infoDiv = card.querySelector('.projets_listing_infos');
    if (infoDiv && infoDiv.textContent.trim()) {
      textElements.push(infoDiv);
    }
    // Title
    const title = card.querySelector('h2');
    if (title && title.textContent.trim()) {
      // Use heading level 3 for consistency and semantic meaning
      const h = document.createElement('h3');
      h.innerHTML = title.innerHTML;
      textElements.push(h);
    }
    // Category
    const catDiv = card.querySelector('.projets_listing_cat');
    if (catDiv && catDiv.textContent.trim()) {
      textElements.push(catDiv);
    }
    // Build the row
    rows.push([imgCell, textElements]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
