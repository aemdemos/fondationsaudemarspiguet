import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  div, h2, input, label, img,
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
  ul.querySelectorAll('picture > img').forEach((image) => {
    const optimizedPic = createOptimizedPicture(image.src, image.alt, false, [{ width: '750' }]);
    moveInstrumentation(image, optimizedPic.querySelector('img'));
    image.closest('picture').replaceWith(optimizedPic);
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
    // This cards block turns into a carousel in small screen views
    // so we need to add the carousel elements, classes and attributes
    block.classList.add('carousel');
    const ulist = block.querySelector('ul');
    ulist.classList.add('carousel-track');
    const cards = block.querySelectorAll('ul li');
    let cardsIdx = 1;
    let radioCard = null;
    const carouselControls = div({ class: 'carousel-controls' });
    let labelPrev = null;
    let labelNext = null;
    const numCards = cards.length;
    cards.forEach((card) => {
      card.classList.add('card');
      if (cardsIdx === 1) {
        radioCard = input({
          type: 'radio', name: 'carousel', id: `card${cardsIdx}`, checked: true,
        });
      } else {
        radioCard = input({ type: 'radio', name: 'carousel', id: `card${cardsIdx}` });
      }
      labelPrev = cardsIdx === 1 ? label({ for: `card${numCards}`, class: `prev prev-btn${cardsIdx}` }, img({ src: '/icons/carousel_left.svg', alt: 'prev' })) : label({ for: `card${cardsIdx - 1}`, class: `prev prev-btn${cardsIdx}` }, img({ src: '/icons/carousel_left.svg', alt: 'prev' }));
      labelNext = cardsIdx === numCards ? label({ for: 'card1', class: `next next-btn${cardsIdx}` }, img({ src: '/icons/carousel_right.svg', alt: 'prev' })) : label({ for: `card${cardsIdx + 1}`, class: `next next-btn${cardsIdx}` }, img({ src: '/icons/carousel_right.svg', alt: 'prev' }));
      cardsIdx += 1;
      block.append(radioCard);
      carouselControls.append(labelPrev, labelNext);
    });
    block.append(carouselControls);
  }
}
