/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the left info column (detail_info)
  const detailInfo = element.querySelector('.detail_info');
  // Extract the right content column (detail_content)
  const detailContent = element.querySelector('.detail_content');
  // Extract all gallery images from the swiper-slide > img in the gallery block
  const gal = element.querySelector('.projets_detail_galery');
  let galleryImages = [];
  if (gal) {
    galleryImages = Array.from(gal.querySelectorAll('.swiper-slide img'));
  }

  // Compose table rows as per block requirement
  // Header row: block name
  const headerRow = ['Columns (columns1)'];
  // First columns row: detailInfo (left), detailContent (right)
  const firstRow = [detailInfo, detailContent];
  // If there are images, arrange them in a second row
  let secondRow = null;
  if (galleryImages.length > 0) {
    // Arrange images between two columns for visual balance
    if (galleryImages.length === 1) {
      secondRow = [galleryImages[0], ''];
    } else if (galleryImages.length === 2) {
      secondRow = [galleryImages[0], galleryImages[1]];
    } else {
      // More than 2 images: split as equally as possible
      const half = Math.ceil(galleryImages.length / 2);
      secondRow = [galleryImages.slice(0, half), galleryImages.slice(half)];
    }
  }

  // Build the cells array: always header and first row, add second row if images exist
  const cells = [headerRow, firstRow];
  if (secondRow) {
    cells.push(secondRow);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
