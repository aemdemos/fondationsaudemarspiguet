/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header
  const headerRow = ['Columns (columns16)'];

  // -------- LEFT COLUMN --------
  const leftColContent = [];
  // Use children image (background video in .swiper-slide)
  const firstSlide = element.querySelector('.swiper-slide');
  if (firstSlide) {
    // Try grabbing a poster image or fallback image for video
    const video = firstSlide.querySelector('video');
    let img;
    if (video) {
      if (video.poster) {
        img = document.createElement('img');
        img.src = video.poster;
      } else {
        // fallback to first video source as image (not ideal, but required for visual block)
        const srcElem = video.querySelector('source');
        if (srcElem && srcElem.src) {
          img = document.createElement('img');
          img.src = srcElem.src;
        }
      }
      if (img) leftColContent.push(img);
    }
  }
  // Add social icons and copyright below
  const social = element.querySelector('.social_container');
  if (social) leftColContent.push(social);

  // -------- RIGHT COLUMN --------
  const rightColContent = [];
  // There is no explicit tree image, but the block visually presents a second image. Since no <img> is available,
  // and we must not invent content, we'll just include the legend block.
  const legend = element.querySelector('.slide_legende');
  if (legend) rightColContent.push(legend);

  // Ensure cells are never null or empty arrays, so use empty string if not found
  const leftCell = leftColContent.length > 0 ? leftColContent : '';
  const rightCell = rightColContent.length > 0 ? rightColContent : '';

  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
