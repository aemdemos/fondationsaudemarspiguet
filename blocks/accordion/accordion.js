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

      const divContainer = document.createElement('div');
      divContainer.className = 'accordion-teams-div';

      const icon = document.createElement('div');
      icon.className = 'accordion-toggle-icon';

      if (linkedin) {
        const linkedinLink = linkedin.querySelector('a.button');
        if (linkedinLink) {
          linkedinLink.setAttribute('target', '_blank');
          linkedinLink.setAttribute('rel', 'noopener noreferrer');
        }
        divContainer.appendChild(linkedin);
      }
      divContainer.appendChild(icon);
      summary.appendChild(divContainer);
      summary.addEventListener('click', (e) => {
        if (e.target.closest('.button-container')) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
      });
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const wasOpen = details.open;
        if (wasOpen) {
          details.removeAttribute('open');
        } else {
          details.setAttribute('open', '');
        }
        const isOpen = !wasOpen;
        if (isOpen) {
          icon.classList.add('open');
        } else {
          icon.classList.remove('open');
        }

        if (lastP) lastP.style.display = isOpen ? 'none' : '';
        if (isOpen) {
          body.appendChild(divContainer);
        } else {
          summary.appendChild(divContainer);
        }
      });
    }
  });
}
