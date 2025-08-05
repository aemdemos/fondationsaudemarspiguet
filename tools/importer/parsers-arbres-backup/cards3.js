/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards3)'];
  const cells = [headerRow];

  // Find the listing container
  const listing = element.querySelector('.partenaires_listing');
  if (!listing) return;

  // Get all direct children that are cards
  const items = Array.from(listing.children).filter(child => child.classList.contains('myItem'));

  items.forEach(item => {
    // First cell: main image for the card
    let mainImg = null;
    const galleryImg = item.querySelector('.image_container .gallery_listing_format img');
    if (galleryImg) mainImg = galleryImg;

    // Second cell: title and logo (possibly wrapped in a link)
    const content = [];
    const h2 = item.querySelector('h2');
    if (h2) {
      const strong = document.createElement('strong');
      strong.innerHTML = h2.innerHTML;
      content.push(strong);
    }
    const logoImg = item.querySelector('.partenaires_logo img');
    if (logoImg) {
      content.push(document.createElement('br'));
      content.push(logoImg);
    }
    // If item is an <a>, wrap title+logo in link
    let rightCell = content;
    if (item.tagName === 'A' && item.href) {
      const link = document.createElement('a');
      link.href = item.href;
      link.target = '_blank';
      content.forEach(el => link.appendChild(el));
      rightCell = link;
    }
    cells.push([mainImg, rightCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
