/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches exactly the block name
  const headerRow = ['Columns (columns26)'];

  // 1st column: left column - all partner/project details, referencing the .detail_info div
  const detailInfo = element.querySelector('.detail_info');
  let leftColContent = [];
  if (detailInfo) leftColContent.push(detailInfo);

  // 2nd column: right column - title, paragraphs, and gallery
  const h1 = element.querySelector('h1');
  const detailContent = element.querySelector('.detail_content');
  const gallery = element.querySelector('.projets_detail_galery');
  let rightColContent = [];
  if (h1) rightColContent.push(h1);
  if (detailContent) rightColContent.push(detailContent);
  if (gallery) rightColContent.push(gallery);

  // Table rows: always two columns, in one row (plus header)
  const rows = [
    headerRow,
    [leftColContent, rightColContent],
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
