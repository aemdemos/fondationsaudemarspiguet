/* global WebImporter */
export default function parse(element, { document }) {
  // This element does not represent a carousel slide (no image, no slide content), only a CTA button.
  // Therefore, it should NOT generate a Carousel (carousel23) block table.
  // Remove the element to prevent creating an invalid block.
  element.remove();
}
