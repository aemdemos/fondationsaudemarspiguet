/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';

    // decorate accordion item
    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-item';
    details.append(summary, body);
    row.replaceWith(details);

    if (block.classList.contains('teams') && block.classList.contains('accordion')) {
      const linkedin = body.querySelector('.button-container');
      const lastP = summary.querySelector('p:last-child');

      // Create the container
      const divContainer = document.createElement('div');
      divContainer.className = 'accordion-teams-div';

      // Create icon div
      const icon = document.createElement('div');
      icon.className = 'accordion-toggle-icon';

      // Append button + icon into div container
      if (linkedin) divContainer.appendChild(linkedin);
      divContainer.appendChild(icon);

      // Append div-container to summary initially
      summary.appendChild(divContainer);

      // Disable default summary click behavior
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      // Icon click should toggle
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Toggle the details element
        if (details.open) {
          details.removeAttribute('open');
        } else {
          details.setAttribute('open', '');
        }
        // Handle all toggle logic in one place
        const isOpen = details.open;
        if (isOpen) {
          icon.classList.add('open');
        } else {
          icon.classList.remove('open');
        }

        if (lastP) lastP.style.display = isOpen ? 'none' : '';
        // Move footer container accordingly
        if (isOpen) {
          body.appendChild(divContainer);
        } else {
          summary.appendChild(divContainer);
        }
      });
    }
  });
}
