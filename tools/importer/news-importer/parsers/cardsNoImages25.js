/* global WebImporter */
export default function parse(element, { document }) {
  // Header as per block name
  const headerRow = ['Cards (cardsNoImages25)'];
  const rows = [headerRow];

  // Get the table of cards
  const table = element.querySelector('table.medias_listing');
  if (!table) return;
  const trs = table.querySelectorAll('tbody > tr');

  trs.forEach((tr) => {
    const tds = tr.querySelectorAll('td');
    if (tds.length < 2) return;
    // Reference the original TDs, but create proper structure for cards
    // Card cell content: Type (bold), Title (span), CTA (link) -- all in one cell
    const typeText = tds[0].textContent.trim();
    const titleTd = tds[1];
    const titleText = titleTd.textContent.trim();
    let linkEl = null;
    if (tds.length > 2) {
      linkEl = tds[2].querySelector('a');
    }

    // Build the card cell content
    const cellContent = [];

    // Type as <strong>
    if (typeText) {
      const strong = document.createElement('strong');
      strong.textContent = typeText;
      cellContent.push(strong);
      cellContent.push(' ');
    }
    // Title as <span> (as in source it's not a heading, but could be made one)
    if (titleText) {
      const span = document.createElement('span');
      span.textContent = titleText;
      cellContent.push(span);
    }
    // CTA as a link, below (on a new line)
    if (linkEl && linkEl.getAttribute('href')) {
      cellContent.push(document.createElement('br'));
      cellContent.push(linkEl);
    }
    rows.push([cellContent]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
