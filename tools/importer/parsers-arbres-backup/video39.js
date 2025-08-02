/* global WebImporter */
export default function parse(element, { document }) {
  // To avoid HierarchyRequestError, do NOT move the original element (since it can't be a <td> child).
  // Instead, create a wrapper div, move the contents of 'element' into it, and insert that div.
  const headerRow = ['Video (video39)'];
  // Create a wrapper div and move all child nodes of 'element' into it
  const wrapper = document.createElement('div');
  while (element.firstChild) {
    wrapper.appendChild(element.firstChild);
  }
  // If there are no children, use the element's textContent as a fallback
  if (!wrapper.hasChildNodes() && element.textContent) {
    wrapper.textContent = element.textContent;
  }
  const cells = [
    headerRow,
    [wrapper]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}