/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const cells = [['Table (no header, tableNoHeader30)']];
  // Find the credits paragraph; robustly get all <p> descendants
  const paragraphs = element.querySelectorAll('p');
  if (paragraphs.length > 0) {
    paragraphs.forEach((p) => {
      // Use childNodes to walk through, but don't reference global Node constants
      let creditBuffer = '';
      p.childNodes.forEach((node) => {
        if (node.nodeType === 3) { // Text node
          creditBuffer += node.textContent;
        } else if (node.nodeName === 'BR') {
          if (creditBuffer.trim()) {
            const span = document.createElement('span');
            span.textContent = creditBuffer.trim();
            cells.push([span]);
          }
          creditBuffer = '';
        }
      });
      // Handle last entry if not followed by <br>
      if (creditBuffer.trim()) {
        const span = document.createElement('span');
        span.textContent = creditBuffer.trim();
        cells.push([span]);
      }
    });
  }
  // Only replace if there is at least a header and one credit row
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}