/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name exactly as in example
  const headerRow = ['Hero (hero10)'];

  // 2. Background image row: this HTML has none, so leave blank
  const backgroundRow = [''];

  // 3. Content row: use all actual intro content from the p element (keep all formatting)
  // The example wants all relevant content in a single cell referenced as-is
  let introDiv = element.querySelector('.introdution_text');
  let content;
  if (introDiv) {
    // Look for all elements inside introduction text, except the empty .info_bloc
    const contentEls = Array.from(introDiv.childNodes).filter(node => {
      // Exclude empty text nodes and .info_bloc
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('info_bloc')) return false;
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
    // If multiple, use an array. If only one, reference it directly.
    content = contentEls.length === 1 ? contentEls[0] : contentEls;
  } else {
    // Fallback: just use 'element' itself if structure is unexpected
    content = element;
  }

  const cells = [
    headerRow,
    backgroundRow,
    [content]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
