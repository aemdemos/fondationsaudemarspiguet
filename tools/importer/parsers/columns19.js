/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: exactly one column, with exact text
  const headerRow = ['Columns (columns19)'];

  // 2. Find slides (columns)
  const slidesWrapper = element.querySelector('.swiper-wrapper');
  let slideDivs = [];
  if (slidesWrapper) {
    slideDivs = Array.from(slidesWrapper.querySelectorAll(':scope > .swiper-slide'));
  }

  // 3. Build content columns (each cell contains image and text as present)
  const contentRow = slideDivs.map(slide => {
    const parts = [];
    const img = slide.querySelector('.pictos_img img');
    if (img) parts.push(img);
    const text = slide.querySelector('.pictos_texte');
    if (text) parts.push(text);
    return parts.length === 1 ? parts[0] : parts;
  });

  // 4. Compose table: 1 header row (1 col), then 1 content row (n cols)
  const cells = [
    headerRow, // Single cell
    contentRow // N columns for the slides
  ];

  // 5. Replace element with table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
