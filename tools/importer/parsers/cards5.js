/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards5)'];

  // Get all card links
  const cards = Array.from(element.querySelectorAll('a.myItem.projets_liste_bg_ap-biencommun'));

  const rows = cards.map(card => {
    // --- Left cell: Image ---
    let img = card.querySelector('.gallery_listing_format img');

    // --- Right cell: Text content ---
    // Title (h2)
    const h2 = card.querySelector('h2');
    let titleStrong = null;
    if (h2 && h2.textContent.trim()) {
      titleStrong = document.createElement('strong');
      titleStrong.textContent = h2.textContent.trim();
    }
    // Partner (projets_listing_partners)
    const partners = card.querySelector('.projets_listing_partners');
    // Country/dates (projets_listing_infos)
    const infos = card.querySelector('.projets_listing_infos');
    // Category (projets_listing_cat)
    const cat = card.querySelector('.projets_listing_cat');

    // Compose text cell
    const textNodes = [];
    if (titleStrong) textNodes.push(titleStrong);
    if (partners && partners.textContent.trim()) {
      textNodes.push(document.createElement('br'));
      textNodes.push(document.createTextNode(partners.textContent.trim()));
    }
    if (infos && infos.textContent.trim()) {
      textNodes.push(document.createElement('br'));
      textNodes.push(document.createTextNode(infos.textContent.trim()));
    }
    if (cat && cat.textContent.trim()) {
      textNodes.push(document.createElement('br'));
      textNodes.push(document.createTextNode(cat.textContent.trim()));
    }
    // To maintain correct structure (single cell, vertical text stack) wrap in a div
    const textDiv = document.createElement('div');
    textNodes.forEach(n => textDiv.appendChild(n));

    return [img, textDiv];
  });

  const tableArray = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(block);
}
