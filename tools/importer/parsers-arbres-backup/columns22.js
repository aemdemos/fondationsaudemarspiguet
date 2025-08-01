/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row - must be a string, not the element
  const headerRow = ['Columns (columns22)'];

  // To avoid HierarchyRequestError, do not put the element directly in the table if it is a <div> containing the table!
  // Instead, move the child elements to a new container or fragment
  const fragment = document.createDocumentFragment();
  while (element.firstChild) {
    fragment.appendChild(element.firstChild);
  }

  // Move all nodes from fragment to an array for the table cell
  const cellContent = Array.from(fragment.childNodes);
  // If all content was text nodes, we can keep as is; if empty, cellContent will be []
  // If there is no content, fallback to an empty string
  const contentRow = [cellContent.length > 0 ? cellContent : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
