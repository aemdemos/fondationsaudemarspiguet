/* global WebImporter */
export default function parse(element, { document }) {
  // Extract image for left column
  let img = null;
  const imagesContainer = element.querySelector('.projets_detail_hero_images');
  if (imagesContainer) {
    const slideImg = imagesContainer.querySelector('.swiper-slide img');
    if (slideImg) img = slideImg;
  }

  // Extract intro text for right column
  let introText = null;
  const introTextContainer = element.querySelector('.projets_detail_hero_intro_text');
  if (introTextContainer) {
    // Prefer a single <p> if present, else the full container
    const first = introTextContainer.firstElementChild;
    if (introTextContainer.children.length === 1 && first && first.tagName === 'P') {
      introText = first;
    } else {
      introText = introTextContainer;
    }
  }

  // The header row should have only one cell (spanning both columns visually)
  const cells = [
    ['Columns (columns21)'],
    [img, introText]
  ];

  // Build the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
