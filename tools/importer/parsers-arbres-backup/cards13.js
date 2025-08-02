/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards13)'];
  // Select all project card containers
  const cardBlocks = element.querySelectorAll('.home_projet_bloc');
  const rows = [headerRow];

  cardBlocks.forEach(block => {
    // Image (first column)
    let imgEl = block.querySelector('.col6 > a > img');
    // Second column: text content, title, description, CTAs
    const textCol = block.querySelector('.home_projet_texte_btn');
    let cellContent = [];
    if (textCol) {
      const textBlock = textCol.querySelector('.home_projet_texte');
      // Info line (e.g. tags)
      if (textBlock) {
        const infoBloc = textBlock.querySelector('.info_bloc');
        if (infoBloc && infoBloc.textContent.trim()) cellContent.push(infoBloc);
        // Title (h3)
        const h3 = textBlock.querySelector('h3');
        if (h3) cellContent.push(h3);
        // Description (<p>)
        const p = textBlock.querySelector('p');
        if (p) cellContent.push(p);
      }
      // CTAs - all links inside .home_projet_btn
      const btnWrap = textCol.querySelector('.home_projet_btn');
      if (btnWrap) {
        const btns = btnWrap.querySelectorAll('a');
        btns.forEach(btn => {
          cellContent.push(btn);
        });
      }
    }
    rows.push([imgEl, cellContent]);
  });
  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
