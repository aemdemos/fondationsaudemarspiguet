/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get first image from gallery block if present
  function getHeroImage() {
    const gallery = element.querySelector('.projets_detail_galery');
    if (!gallery) return '';
    const img = gallery.querySelector('img');
    return img || '';
  }

  // Get the title (h1 inside .inside)
  const title = element.querySelector('h1');

  // Get the detail_info block (project metadata)
  const detailInfo = element.querySelector('.detail_info');

  // Get the main content (paragraphs inside .detail_content)
  const detailContent = element.querySelector('.detail_content');

  // Compose the content for the third row: includes detailInfo, title, and detailContent
  // Only include present blocks
  const thirdRow = [];
  if (detailInfo) thirdRow.push(detailInfo);
  if (title) thirdRow.push(title);
  if (detailContent) thirdRow.push(detailContent);

  // Build the Hero table block according to the markdown structure
  // Header must be exactly 'Hero' (not bold, not with asterisks)
  // 3 rows, 1 col: Hero | image (optional) | content (title, subheading, metadata, etc.)
  const cells = [
    ['Hero'],
    [getHeroImage()],
    [thirdRow]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
