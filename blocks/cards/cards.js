import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  div, h2, button,
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
    // This cards block turns into a carousel in small screen views
    // so we need to add the carousel elements, classes and attributes
    block.classList.add('carousel');
    const ulist = block.querySelector('ul');
    ulist.classList.add('carousel-track');
    const cards = block.querySelectorAll('ul li');
    const numCards = cards.length;
    console.log('num cards', numCards);
    cards.forEach((card) => {
      card.classList.add('card');
    });

    const prevBtn = button({ class: 'carousel-prev' });
    const nextBtn = button({ class: 'carousel-next' });

    block.append(prevBtn, nextBtn);

    const track = block.querySelector('.carousel-track');
    const prevButton = block.querySelector('.carousel-prev');
    const nextButton = block.querySelector('.carousel-next');
    let index = 0;

    const scrollAmount = () => {
      const card = block.querySelector('.card');
      return card.offsetWidth;
    };

    nextButton.onclick = () => {
      index += 1;
      console.log('index', index);
      track.scrollTo({ left: scrollAmount(), behavior: 'smooth' });
      prevButton.disabled = false;
      if (index >= numCards) {
        nextButton.disabled = true;
      }
    };

    prevButton.onclick = () => {
      index -= 1;
      console.log('index', index);
      track.scrollTo({ left: -scrollAmount(), behavior: 'smooth' });
      nextButton.disabled = false;
      if (index <= 0) {
        prevButton.disabled = true;
      }
    };
  }
}
