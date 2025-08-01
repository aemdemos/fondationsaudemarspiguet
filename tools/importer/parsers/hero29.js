/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Hero (hero29)'];

  // --- 1. Extract background image ---
  let bgImg = null;
  const headerPage = element.querySelector('.header_page');
  if (headerPage) {
    // Prefer the first visible <img>
    const img = headerPage.querySelector('img');
    if (img) bgImg = img;
  }

  // --- 2. Extract hero text: title (h1), and subheading/paragraph (p) ---
  // Look inside .introdution_page .container_col > .col
  let heroTitle = null;
  let heroParagraph = null;
  const introPage = element.querySelector('.introdution_page');
  if (introPage) {
    const cols = introPage.querySelectorAll('.container_col > .col');
    for (const col of cols) {
      if (!heroTitle) {
        const h1 = col.querySelector('h1');
        if (h1) heroTitle = h1;
      }
      if (!heroParagraph) {
        const p = col.querySelector('p');
        if (p) heroParagraph = p;
      }
    }
  }

  // Build the text content for the last row
  const textCellContent = [];
  if (heroTitle) textCellContent.push(heroTitle);
  if (heroParagraph) textCellContent.push(heroParagraph);

  // --- 3. Assemble table rows as per guidelines ---
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [textCellContent.length ? textCellContent : '']
  ];

  // --- 4. Create and replace ---
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}