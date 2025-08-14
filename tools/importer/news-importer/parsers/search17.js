/* global WebImporter */
export default function parse(element, { document }) {
  // The block for Search (search17) only needs the block name and a query index URL as shown in the example.
  // Critically, in this source HTML, there is no actual query index URL in the markup: this is a generic UI search/filter bar.
  // Per block guidelines and the markdown sample, we must provide the canonical block structure: 1-column, 2-rows, block name as header, second row is the index URL link.
  // The example index URL is always used for this block.
  const headerRow = ['Search (search17)'];
  const url = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const link = document.createElement('a');
  link.href = url;
  link.textContent = url;
  const cells = [
    headerRow,
    [link]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
