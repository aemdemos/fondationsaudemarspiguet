import { getLanguage } from '../../scripts/scripts.js';
import {
  fetchPlaceholders,
} from '../../scripts/aem.js';

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  console.log($main);

  const placeholders = await fetchPlaceholders(`${getLanguage()}`);
  console.log(placeholders);

  // Find the cards-wrapper div
  const cardsWrapper = $main.querySelector('.cards-wrapper');

  if (cardsWrapper) {
    console.log('Found cards-wrapper:', cardsWrapper);

    // Find all li elements within the cards-wrapper
    const liElements = cardsWrapper.querySelectorAll('li');

    if (liElements.length >= 6) {
      console.log('Found li elements:', liElements.length);

      // Clone the first two li elements
      const firstLiClone = liElements[0].cloneNode(true);
      const secondLiClone = liElements[1].cloneNode(true);

      // Create a new div to contain the cloned elements
      const clonedDiv = document.createElement('div');
      clonedDiv.className = 'cloned-cards-wrapper';

      // Create a ul container for the cloned li elements
      const clonedUl = document.createElement('ul');
      clonedUl.appendChild(firstLiClone);
      clonedUl.appendChild(secondLiClone);

      // Add the ul to the div
      clonedDiv.appendChild(clonedUl);

      // Insert the new div just above the cards-wrapper
      cardsWrapper.parentNode.insertBefore(clonedDiv, cardsWrapper);
      console.log($main);

      console.log('Cloned first two li elements into new div above cards-wrapper');
    } else {
      console.log('Not enough li elements found in cards-wrapper');
    }
  } else {
    console.log('Cards-wrapper not found in main');
  }
}
