/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match example exactly
  const headerRow = ['Carousel (carousel2)'];
  const slides = [];

  // Find the news listing container that holds the slides
  let newsListing = element.querySelector('.news_listing');
  if (!newsListing) newsListing = element;

  // Each slide is a child <a.myItem>
  const items = Array.from(newsListing.querySelectorAll(':scope > a.myItem'));

  items.forEach((item) => {
    // Find the image (first visible <img> inside)
    const img = item.querySelector('img');

    // Find the content root (either .news_listing_cadre or .container_col_2)
    let contentRoot = item.querySelector('.news_listing_cadre, .container_col_2');
    if (!contentRoot) contentRoot = item;

    // Extract category and date
    const category = contentRoot.querySelector('.news_listing_cat');
    const date = contentRoot.querySelector('.news_listing_date');
    const h2 = contentRoot.querySelector('h2');
    const p = contentRoot.querySelector('p');
    
    // Compose text content, reusing existing elements
    const textContent = [];
    // Compose top line: category | date (if available)
    if ((category && category.textContent.trim()) || (date && date.textContent.trim())) {
      const div = document.createElement('div');
      div.style.fontSize = '0.95em';
      div.style.opacity = '0.8';
      const catText = category ? category.textContent.trim() : '';
      const dateText = date ? date.textContent.trim() : '';
      div.textContent = (catText && dateText) ? `${catText} | ${dateText}` : (catText || dateText);
      textContent.push(div);
    }
    if (h2) textContent.push(h2);
    if (p) textContent.push(p);

    slides.push([img, textContent]);
  });

  // Only create a table if there is at least one slide (besides header)
  if (slides.length > 0) {
    const cells = [headerRow, ...slides];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
