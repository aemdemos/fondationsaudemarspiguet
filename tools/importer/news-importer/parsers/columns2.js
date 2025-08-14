/* global WebImporter */
export default function parse(element, { document }) {
  // Extract left column: intro text
  const introDiv = element.querySelector('.projets_detail_hero_intro_text');
  // Might be null if not found, handle gracefully

  // Extract right column: first image inside the carousel
  let img = null;
  const imgEl = element.querySelector('.projets_detail_hero_images .swiper-slide img');
  if (imgEl) img = imgEl;

  // Compose table rows as per block spec
  const headerRow = ['Columns (columns2)'];
  const contentRow = [introDiv, img];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}