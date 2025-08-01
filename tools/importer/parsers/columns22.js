/* global WebImporter */
export default function parse(element, { document }) {
  // Find the left and right column content containers
  const left = element.querySelector('.projets_listing_container_left');
  const right = element.querySelector('.projets_listing_container_right');

  function collectContent(container) {
    if (!container) return [];
    return Array.from(container.childNodes).filter((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Ignore empty divs
        if (node.tagName === 'DIV' && !node.textContent.trim() && !node.querySelector('input,select,a')) {
          return false;
        }
        // Hide .clear
        if (node.classList && node.classList.contains('clear')) return false;
        return true;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return false;
    });
  }

  const leftContent = collectContent(left);
  const rightContent = collectContent(right);

  // To match the example: header row has exactly ONE cell, second row has two
  const cells = [
    ['Columns (columns22)'],
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
