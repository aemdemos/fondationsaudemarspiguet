/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Create header row with exact block name
  const headerRow = ['Columns (columns8)'];

  // 2. Dynamically extract left (image) and right (text) columns
  // LEFT: main image in hero
  let imageEl = null;
  const imagesWrapper = element.querySelector('.projets_detail_hero_images');
  if (imagesWrapper) {
    // There may be a carousel, but always only a single image for this block
    const img = imagesWrapper.querySelector('img');
    if (img) imageEl = img;
  }

  // RIGHT: main intro text in hero
  let textEl = null;
  const introWrapper = element.querySelector('.projets_detail_hero_intro');
  if (introWrapper) {
    // Prefer the first .projets_detail_hero_intro_text as a block
    const txt = introWrapper.querySelector('.projets_detail_hero_intro_text');
    if (txt) textEl = txt;
  }

  // Defensive: if either side is missing, use an empty cell to keep two columns
  const contentRow = [imageEl || '', textEl || ''];

  // 3. Build the table as in the markdown example: header row then one content row
  const cells = [
    headerRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 4. Replace the original element with the new block table
  element.replaceWith(table);
}
