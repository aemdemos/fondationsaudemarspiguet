/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row for Cards block
  const rows = [['Cards']];

  // Find the wrapper containing the slides
  const wrapper = element.querySelector('.swiper-wrapper');
  if (wrapper) {
    const slides = wrapper.querySelectorAll('.swiper-slide');
    slides.forEach((slide) => {
      const contentDiv = slide.querySelector('.chiffre_slide_texte');
      if (contentDiv) {
        // Reference the real heading and span nodes
        const h4 = contentDiv.querySelector('h4');
        const span = contentDiv.querySelector('span');
        // Compose the card content
        const cardContent = [];
        if (h4) {
          cardContent.push(h4);
        }
        if (span) {
          cardContent.push(document.createElement('br'));
          cardContent.push(span);
        }
        if (cardContent.length > 0) {
          rows.push([cardContent]);
        }
      }
    });
  }

  // Create table and replace original element
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
