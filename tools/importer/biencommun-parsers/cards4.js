/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row for block
  const rows = [['Cards (cards4)']];

  // Find all card blocks
  const cardBlocks = element.querySelectorAll('.home_projet_bloc');
  cardBlocks.forEach(card => {
    // Image column (first col)
    const imgCol = card.querySelector('.col.col6:not(.home_projet_texte_btn)');
    let imgEl = null;
    if (imgCol) {
      imgEl = imgCol.querySelector('img');
    }

    // Text content column (second col)
    const textCol = card.querySelector('.col.col6.home_projet_texte_btn');
    // Compose text cell as a fragment containing info, h3, p, and CTAs
    const textCell = document.createElement('div');
    if (textCol) {
      // Info/Meta
      const info = textCol.querySelector('.home_projet_texte .info_bloc');
      if (info) textCell.appendChild(info);

      // Title
      const title = textCol.querySelector('.home_projet_texte h3');
      if (title) textCell.appendChild(title);

      // Description
      const desc = textCol.querySelector('.home_projet_texte p');
      if (desc) textCell.appendChild(desc);

      // CTAs
      const btnContainer = textCol.querySelector('.home_projet_btn');
      if (btnContainer) {
        // Use only the a elements (existing DOM nodes)
        const btnDiv = document.createElement('div');
        btnContainer.querySelectorAll('a').forEach(a => btnDiv.appendChild(a));
        if (btnDiv.childNodes.length) textCell.appendChild(btnDiv);
      }
    }

    // Only add row if both key elements are present
    if (imgEl && textCell.childNodes.length) {
      rows.push([
        imgEl,
        textCell
      ]);
    }
  });

  // Replace element with new block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
