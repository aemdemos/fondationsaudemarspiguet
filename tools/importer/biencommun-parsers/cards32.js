/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate <a> children (cards)
  const cards = Array.from(element.querySelectorAll(':scope > a.myItem'));
  const rows = [['Cards (cards32)']];

  cards.forEach((card) => {
    // Image extraction
    const img = card.querySelector('.gallery_listing_format img');
    let imageCell = null;
    if (img) imageCell = img;

    // Text content construction
    const textContent = [];
    // Partner/org name (optional)
    const partner = card.querySelector('.projets_listing_partners');
    if (partner && partner.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = partner.textContent.trim();
      textContent.push(strong, document.createElement('br'));
    }
    // Country/years info (projets_listing_infos, may have <br>)
    const infos = card.querySelector('.projets_listing_infos');
    if (infos && infos.textContent.trim()) {
      // Create a span & preserve <br> for formatting
      const span = document.createElement('span');
      // Instead of .innerHTML, reference actual children, as it may be 'COUNTRY <br> YEARS'
      Array.from(infos.childNodes).forEach((node, idx, arr) => {
        if (node.nodeType === Node.TEXT_NODE) {
          span.appendChild(document.createTextNode(node.textContent.replace(/\s+/g, ' ').trim()));
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
          span.appendChild(document.createElement('br'));
        }
      });
      textContent.push(span, document.createElement('br'));
    }
    // Title (h2)
    const title = card.querySelector('h2');
    if (title && title.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textContent.push(strong, document.createElement('br'));
    }
    // Category (projets_listing_cat)
    const cat = card.querySelector('.projets_listing_cat');
    if (cat && cat.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = cat.textContent.trim();
      textContent.push(span, document.createElement('br'));
    }
    // Remove a possible trailing <br>
    while (textContent.length && textContent[textContent.length-1].tagName === 'BR') {
      textContent.pop();
    }
    // Add row
    rows.push([imageCell, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
