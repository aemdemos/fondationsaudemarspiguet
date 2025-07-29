import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  div, h2,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((divs) => {
      if (divs.children.length === 1 && divs.querySelector('picture')) divs.className = 'cards-card-image';
      else divs.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
  if (block.classList.contains('listing')) {
    const cardsList = block.querySelectorAll('ul li');
    cardsList.forEach((listItem) => {
      const cardImage = listItem.querySelector('.cards-card-image');
      const cardBody = listItem.querySelector('.cards-card-body');
      const cardLogo = listItem.querySelector('.cards-card-body p img');
      const cardImageWrapper = div({ class: 'cards-image-container' });
      const cardImageLogo = div({ class: 'cards-image-logo' });
      if (cardLogo) {
        cardImageLogo.append(cardLogo);
      }
      cardImageWrapper.append(cardImage, cardImageLogo);
      const link = cardBody.querySelector('p a');
      if (link) {
        cardBody.innerHTML = '';
        const heading = h2(link.textContent);
        link.innerHTML = '';
        link.classList.remove('button', 'primary');
        link.append(cardImageWrapper, heading);
        cardBody.append(link);
      } else {
        const titlePara = cardBody.querySelector('p strong');
        if (titlePara) {
          const heading = h2(titlePara.textContent);
          cardBody.innerHTML = '';
          cardBody.classList.add('no-link');
          cardBody.append(cardImageWrapper, heading);
        }
      }
    });
  }

  if (block.classList.contains('icons-grid')) {
    // Turn icons-grid into a carousel
    const ulist = block.querySelector('ul');
    ulist.classList.add('carousel');
    let currentIndex = 0;
    const items = ulist.querySelectorAll('li');
    const totalItems = items.length;
    let itemsToShow = 1; // Default items to show

    const myObserver = new ResizeObserver((entries) => {
      if (entries[0].contentRect.width < 600) {
        // Handle small screen layout
        itemsToShow = 1;
      } else if (entries[0].contentRect.width >= 600 && entries[0].contentRect.width < 900) {
        // Handle medium screen layout
        itemsToShow = 2;
      } else {
        // Handle large screen layout
        itemsToShow = 3;
      }
    });

    myObserver.observe(block);

    items.forEach((item, idx) => {
      item.style.display = (idx >= currentIndex && idx < currentIndex + itemsToShow) ? 'block' : 'none';
    });

    // Create navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-prev';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-next';

    prevBtn.addEventListener('click', () => {
      items[currentIndex].style.display = 'none';
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      items[currentIndex].style.display = 'block';
    });

    nextBtn.addEventListener('click', () => {
      items[currentIndex].style.display = 'none';
      currentIndex = (currentIndex + 1) % totalItems;
      items[currentIndex].style.display = 'block';
    });

    block.append(prevBtn, nextBtn);
  }
}
