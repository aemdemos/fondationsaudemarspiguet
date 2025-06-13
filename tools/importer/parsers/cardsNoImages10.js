/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const rows = [['Cards (cardsNoImages10)']];

  // Get the main container holding cards
  const container = element.querySelector('.container_col.team_listing');
  if (!container) return;

  // Get all the direct children divs
  const children = Array.from(container.querySelectorAll(':scope > div'));

  // We need to gather card rows between H2s, and treat each H2 as its own card row
  let cardGroup = [];
  function flushCards() {
    // For each cardGroup entry, push as a table row
    cardGroup.forEach(card => rows.push([card]));
    cardGroup = [];
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    // If the child is a section heading (div.col12 > h2), treat as its own row
    const h2 = child.querySelector('h2');
    if (h2) {
      // If we were accumulating cards, flush them before adding new heading
      if (cardGroup.length > 0) flushCards();
      rows.push([h2]);
      continue;
    }

    // If the child is a separator, flush any accumulated cards
    if (child.classList.contains('separator_hr')) {
      if (cardGroup.length > 0) flushCards();
      continue;
    }

    // If it's a card (col4), process it
    if (child.classList.contains('col4')) {
      const name = child.querySelector('.team_name');
      const role = child.querySelector('.team_fonction');
      const contenair = child.querySelector('.team_contenaire');

      // If it has .team_contenaire, it's a Foundation Board card
      if (contenair) {
        // We'll create a fragment with the name, role, resume, full bio, and LinkedIn
        const frag = document.createDocumentFragment();
        if (name) {
          const strong = document.createElement('strong');
          strong.textContent = name.textContent.trim();
          frag.appendChild(strong);
        }
        if (role) {
          frag.appendChild(document.createElement('br'));
          frag.appendChild(document.createTextNode(role.textContent.trim()));
        }
        const resume = contenair.querySelector('.team_resume');
        if (resume) {
          frag.appendChild(document.createElement('br'));
          frag.appendChild(document.createTextNode(resume.textContent.trim()));
        }
        const contenu = contenair.querySelector('.team_contenu');
        if (contenu) {
          frag.appendChild(document.createElement('br'));
          // Add all paragraphs or nodes as-is
          Array.from(contenu.childNodes).forEach((node) => {
            frag.appendChild(node.cloneNode(true));
          });
        }
        const linkedin = child.querySelector('a.team_linkedin');
        if (linkedin) {
          frag.appendChild(document.createElement('br'));
          frag.appendChild(linkedin);
        }
        cardGroup.push(frag);
      } else {
        // Simple card: just name and role
        const frag = document.createDocumentFragment();
        if (name) {
          const strong = document.createElement('strong');
          strong.textContent = name.textContent.trim();
          frag.appendChild(strong);
        }
        if (role) {
          frag.appendChild(document.createElement('br'));
          frag.appendChild(document.createTextNode(role.textContent.trim()));
        }
        cardGroup.push(frag);
      }
    }
    // ignore .clear and other irrelevant divs
  }

  // Flush any remaining cards
  if (cardGroup.length > 0) flushCards();

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
