/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 *
 * @param {Element} block
 */
export default async function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const header = !block.classList.contains('no-header');

  [...block.children].forEach((row, i) => {
    const tr = document.createElement('tr');
    moveInstrumentation(row, tr);

    [...row.children].forEach((cell) => {
      const td = document.createElement(i === 0 && header ? 'th' : 'td');
      if (i === 0) td.setAttribute('scope', 'column');
      td.innerHTML = cell.innerHTML;

      if (block.classList.contains('block') && block.classList.contains('table')) {
        const pElements = td.querySelectorAll('p');

        pElements.forEach((p) => {
          const parts = p.innerHTML.split(/<br\s*\/?>/i);
          const [beforeBr, afterBr] = parts;
          p.innerHTML = beforeBr;

          if (afterBr && afterBr.trim()) {
            const afterDiv = document.createElement('div');
            afterDiv.className = 'new-div';
            afterDiv.innerHTML = afterBr.trim();
            p.appendChild(afterDiv);
          }
        });
      }
      tr.append(td);
    });
    if (i === 0 && header) thead.append(tr);
    else tbody.append(tr);
  });
  table.append(thead, tbody);
  block.replaceChildren(table);
}
