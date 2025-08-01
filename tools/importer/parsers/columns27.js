/* global WebImporter */
export default function parse(element, { document }) {
  // Extract left column: the intro text block
  const leftDiv = element.querySelector('.projets_detail_hero_intro');
  let leftContent = null;
  if (leftDiv) {
    const introText = leftDiv.querySelector('.projets_detail_hero_intro_text');
    leftContent = introText ? introText : leftDiv;
  }

  // Extract right column: image in the carousel
  const rightDiv = element.querySelector('.projets_detail_hero_images');
  let rightContent = null;
  if (rightDiv) {
    const img = rightDiv.querySelector('.swiper-slide img');
    rightContent = img || rightDiv;
  }

  // Ensure the header row matches the number of columns (2)
  const headerRow = ['Columns (columns27)', ''];
  const contentRow = [leftContent, rightContent];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
