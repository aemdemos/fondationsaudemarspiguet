/* global google */
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  div, h2, button,
} from '../../scripts/dom-helpers.js';

function getVisibleCardCount(track, cardsBody) {
  const trackWidth = track.offsetWidth;
  const cardWidth = cardsBody.offsetWidth;
  return Math.floor(trackWidth / cardWidth);
}

function scrollToCard(cardEl) {
  if (cardEl) {
    const track = cardEl.closest('.carousel-track');
    if (track) {
      const cardOffset = cardEl.offsetLeft;
      track.scrollTo({
        left: cardOffset,
        behavior: 'smooth',
      });
    }
  }
}

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
  // Special handling for map-category variant
  if (block.classList.contains('map-category')) {
    const categoryMapping = {
      'View all': { categoryId: 'all', isActive: true },
      Tous: { categoryId: 'all', isActive: true },
      conservation: { categoryId: 'category_3' },
      awareness: { categoryId: 'category_4' },
      preservation: { categoryId: 'category_5' },
      OD: { categoryId: 'category_10' },
    };

    ul.querySelectorAll('li').forEach((li) => {
      const cardBodies = li.querySelectorAll('.cards-card-body');
      if (cardBodies.length >= 2) {
        const iconContainer = cardBodies[0];
        const textContainer = cardBodies[1];

        // Check if this is the "View all" or "Tous" card (no icon)
        const textContent = textContainer.textContent.trim();
        const icon = iconContainer.querySelector('img');

        let categoryInfo;
        if (textContent === 'View all' || textContent === 'Tous') {
          categoryInfo = categoryMapping[textContent];
        } else if (icon) {
          const iconName = icon.getAttribute('data-icon-name');
          categoryInfo = categoryMapping[iconName];
        }

        if (categoryInfo) {
          const anchor = document.createElement('a');
          anchor.href = '#';
          anchor.className = 'works_categorylink';
          anchor.setAttribute('data-categoryid', categoryInfo.categoryId);

          if (categoryInfo.isActive) {
            anchor.classList.add('active');
          }

          // Add immediate click handler with map filtering logic
          anchor.addEventListener('click', (e) => {
            e.preventDefault();

            const myslectcat = anchor.getAttribute('data-categoryid');

            // Remove active class from all category links
            document.querySelectorAll('a.works_categorylink').forEach((link) => {
              link.classList.remove('active');
            });

            // Add active class to clicked anchor
            anchor.classList.add('active');

            // Check if map variables exist and run filtering logic
            if (window.map && window.markers && window.markerCluster && window.bounds) {
              window.bounds = new google.maps.LatLngBounds();
              const markerstocluster = [];
              window.markerCluster.clearMarkers();

              // Close all open popups
              window.infoWindows.forEach((elem) => {
                if (elem) {
                  elem.close();
                }
              });

              window.markers.forEach((marker) => {
                const catmarkers = marker.category;

                if (myslectcat === 'all') {
                  marker.setMap(window.map);
                  markerstocluster.push(marker);
                  window.bounds.extend(marker.position);
                } else if (catmarkers.search(myslectcat) !== -1) {
                  marker.setMap(window.map);
                  markerstocluster.push(marker);
                  window.bounds.extend(marker.position);
                } else {
                  marker.setMap(null);
                }
              });

              window.markerCluster.addMarkers(markerstocluster);
              window.map.fitBounds(window.bounds);
            }
          });

          // For "View all" or "Tous" (first card), wrap the p element
          if (categoryInfo.categoryId === 'all') {
            // Move all content from li into the anchor
            while (li.firstChild) {
              anchor.appendChild(li.firstChild);
            }
            // Put the anchor back into the li
            li.appendChild(anchor);
          } else {
            // For other cards, wrap the entire cards-card-body that contains the icon
            // Clone the entire iconContainer and put it in the anchor
            anchor.appendChild(iconContainer.cloneNode(true));
            // Replace the original iconContainer with the anchor
            iconContainer.parentNode.replaceChild(anchor, iconContainer);
          }
        }
      }
    });

    // Create mobile view for 'View all' and 'CATEGORIES' items AFTER processing
    const mobileItems = [];
    ul.querySelectorAll('li').forEach((li) => {
      const textContent = li.textContent.trim();
      if (textContent === 'View all' || textContent === 'Tous' || textContent === 'CATEGORIES' || textContent === 'AXES') {
        const clonedLi = li.cloneNode(true);

        // Re-apply event listeners to cloned anchor elements
        const clonedAnchor = clonedLi.querySelector('a.works_categorylink');
        if (clonedAnchor) {
          clonedAnchor.addEventListener('click', (e) => {
            e.preventDefault();

            const myslectcat = clonedAnchor.getAttribute('data-categoryid');

            // Remove active class from all category links (including cloned ones)
            document.querySelectorAll('a.works_categorylink').forEach((link) => {
              link.classList.remove('active');
            });

            // Add active class to clicked anchor
            clonedAnchor.classList.add('active');

            // Also update the original anchor to match
            const originalAnchor = document.querySelector(`ul:not(.mobile-view) a.works_categorylink[data-categoryid="${myslectcat}"]`);
            if (originalAnchor) {
              originalAnchor.classList.add('active');
            }

            // Check if map variables exist and run filtering logic
            if (window.map && window.markers && window.markerCluster && window.bounds) {
              window.bounds = new google.maps.LatLngBounds();
              const markerstocluster = [];
              window.markerCluster.clearMarkers();

              // Close all open popups
              window.infoWindows.forEach((elem) => {
                if (elem) {
                  elem.close();
                }
              });

              window.markers.forEach((marker) => {
                const catmarkers = marker.category;

                if (myslectcat === 'all') {
                  marker.setMap(window.map);
                  markerstocluster.push(marker);
                  window.bounds.extend(marker.position);
                } else if (catmarkers.search(myslectcat) !== -1) {
                  marker.setMap(window.map);
                  markerstocluster.push(marker);
                  window.bounds.extend(marker.position);
                } else {
                  marker.setMap(null);
                }
              });

              window.markerCluster.addMarkers(markerstocluster);
              window.map.fitBounds(window.bounds);
            }
          });
        }

        mobileItems.push(clonedLi);
      }
    });

    if (mobileItems.length > 0) {
      // Create mobile ul with class "mobile-view"
      const mobileUl = document.createElement('ul');
      mobileUl.className = 'mobile-view';

      mobileItems.forEach((item) => {
        mobileUl.appendChild(item);
      });

      // Insert mobile ul before the original ul within the same block
      block.insertBefore(mobileUl, ul);
    }
  }
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
    const cardsBodyDiv = block.querySelector('ul li .cards-card-body');

    cards.forEach((card) => {
      card.classList.add('card');
    });

    const prevBtn = button({ class: 'carousel-prev' });
    const nextBtn = button({ class: 'carousel-next' });

    block.append(prevBtn, nextBtn);

    const track = block.querySelector('.carousel-track');
    const prevButton = block.querySelector('.carousel-prev');
    const nextButton = block.querySelector('.carousel-next');
    let currentIndex = 0;

    // initialize buttons
    const visibleCount = getVisibleCardCount(track, cardsBodyDiv);
    prevButton.disabled = currentIndex <= 0;
    nextButton.disabled = currentIndex >= cards.length - visibleCount;

    nextButton.onclick = () => {
      if (currentIndex < cards.length - 1) {
        prevButton.disabled = false;
        currentIndex += 1;
        scrollToCard(cards[currentIndex]);
        // update next button
        const visibleCards = getVisibleCardCount(track, cardsBodyDiv);
        nextButton.disabled = currentIndex >= cards.length - visibleCards;
      }
    };

    prevButton.onclick = () => {
      if (currentIndex > 0) {
        nextButton.disabled = false;
        currentIndex -= 1;
        scrollToCard(cards[currentIndex]);
        // update previous button
        prevButton.disabled = currentIndex <= 0;
      }
    };

    window.addEventListener('resize', () => {
      scrollToCard(cards[currentIndex]);
      if (currentIndex <= 0) {
        prevButton.disabled = true;
      } else {
        prevButton.disabled = false;
      }
      if (currentIndex >= cards.length - getVisibleCardCount(track, cardsBodyDiv)) {
        nextButton.disabled = true;
      } else {
        nextButton.disabled = false;
      }
    });
  }
}
