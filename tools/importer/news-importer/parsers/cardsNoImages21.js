/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const headerRow = ['Cards (cardsNoImages21)'];
  const cells = [headerRow];

  // Get all immediate swiper slides (cards)
  const slides = element.querySelectorAll('.swiper-wrapper > .swiper-slide');

  slides.forEach((slide) => {
    const pictosText = slide.querySelector('.pictos_texte');
    if (!pictosText) return; // skip if missing
    // We'll keep heading and description as in the markup, using existing elements
    const rowEls = [];
    // Heading
    const heading = pictosText.querySelector('h4');
    if (heading) {
      rowEls.push(heading);
    }
    // Description (all text nodes and non-h4 elements)
    Array.from(pictosText.childNodes).forEach((node) => {
      if (node.nodeType === 3 && node.textContent.trim()) { // 3 = TEXT_NODE
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        rowEls.push(p);
      }
      if (node.nodeType === 1 && node.tagName !== 'H4') { // 1 = ELEMENT_NODE
        rowEls.push(node);
      }
    });
    // Only push row if it has content
    if (rowEls.length > 0) {
      cells.push([rowEls]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
