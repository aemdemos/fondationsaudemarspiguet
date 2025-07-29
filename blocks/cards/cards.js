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

    const mediaQuerySmallScreen = window.matchMedia('(max-width: 599px)');
    const mediaQueryMediumScreen = window.matchMedia('(min-width: 600px) and (max-width: 899px)');
    const mediaQueryLargeScreen = window.matchMedia('(min-width: 900px)');

    if (mediaQuerySmallScreen.matches) {
      // Show 1 item on small screens
      items.forEach((item, idx) => {
        item.style.display = (idx === currentIndex) ? 'block' : 'none';
      });
    } else if (mediaQueryMediumScreen.matches) {
      // Show 2 items on medium screens
      items.forEach((item, idx) => {
        item.style.display = (idx >= currentIndex && idx < currentIndex + 2) ? 'block' : 'none';
      });
    } else if (mediaQueryLargeScreen.matches) {
      // Show 3 items on large screens
      items.forEach((item, idx) => {
        item.style.display = (idx >= currentIndex && idx < currentIndex + 3) ? 'block' : 'none';
      });
    }
    mediaQuerySmallScreen.addEventListener('change', () => {
      // Hide items depending on viewport size
      items.forEach((item, idx) => {
        item.style.display = (idx >= currentIndex && idx < currentIndex + 1) ? 'block' : 'none';
      });
    });

    mediaQueryMediumScreen.addEventListener('change', () => {
      items.forEach((item, idx) => {
        item.style.display = (idx >= currentIndex && idx < currentIndex + 2) ? 'block' : 'none';
      });
    });

    // Create navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-prev';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-next';

    mediaQueryLargeScreen.addEventListener('change', () => {
      items.forEach((item) => {
        item.style.display = 'block';
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      });
    });

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
