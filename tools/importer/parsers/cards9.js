/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract the image element (reference) and text fragment for a card anchor
  function extractCardFromAnchor(anchor) {
    // Find the image (always inside .gallery_listing_format img)
    const img = anchor.querySelector('.gallery_listing_format img');
    // Figure out the text column
    let textCol;
    const col6s = anchor.querySelectorAll('.col6');
    if (col6s.length > 1) {
      textCol = col6s[1];
    } else if (col6s.length === 1) {
      textCol = col6s[0];
    } else {
      // For .news_listing_std, the text is directly on the anchor
      textCol = anchor;
    }
    // Compose a fragment for the right-hand cell
    const frag = document.createDocumentFragment();
    // Category (optional)
    const cat = textCol.querySelector('.news_listing_cat');
    if (cat && cat.textContent.trim()) frag.appendChild(cat);
    // Date (optional)
    const date = textCol.querySelector('.news_listing_date');
    if (date && date.textContent.trim()) frag.appendChild(date);
    // Title (h2)
    const h2 = textCol.querySelector('h2');
    if (h2 && h2.textContent.trim()) frag.appendChild(h2);
    // Description (p)
    const desc = textCol.querySelector('p');
    if (desc && desc.textContent.trim()) frag.appendChild(desc);
    return [img, frag];
  }
  // Find the card anchors (direct children of .news_listing)
  const newsListing = element.querySelector('.news_listing');
  const anchors = newsListing ? Array.from(newsListing.children).filter(e => e.tagName === 'A') : [];
  // Build rows
  const cells = [
    ['Cards (cards9)']
  ];
  anchors.forEach(anchor => {
    const [img, textFrag] = extractCardFromAnchor(anchor);
    // Only add if we have an image and some text
    if (img || textFrag.childNodes.length) {
      cells.push([img, textFrag]);
    }
  });
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
