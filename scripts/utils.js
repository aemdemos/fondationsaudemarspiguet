import { div } from './dom-helpers.js';

export function getPathSegments() {
  return window.location.pathname.split('/')
    .filter((segment) => segment);
}

export function applyFadeUpAnimation(targetElement, parentContainer) {
  // Create a wrapper div for the fade-up effect
  const targetWrapper = div({ class: 'image-fade-wrapper' });
  targetWrapper.style.opacity = '0';
  targetWrapper.style.transform = 'translateY(80px)';
  targetWrapper.style.transition = 'opacity 1.5s ease-out, transform 1.5s ease-out';

  targetWrapper.append(targetElement);
  parentContainer.append(targetWrapper);

  // Track scroll direction to prevent flickering
  let lastScrollY = window.scrollY;

  // Trigger fade-up animation when element comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;

      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      } else if (!scrollingDown) {
        // Only reset animation when scrolling up and element goes out of view
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(80px)';
      }

      lastScrollY = currentScrollY;
    });
  }, { threshold: 0.1 });

  observer.observe(targetWrapper);
}

export function decoratePartners(doc) {
  const contentDivs = doc.querySelectorAll('.section.floating .default-content-wrapper');
  contentDivs.forEach((contentDiv) => {
    const clearDiv = div({ class: 'clear' });
    const clearDivInner = div({ class: 'clear' });
    const headingWrapper = div({ class: 'heading-wrapper' });
    const contentWrapper = div({ class: 'content-wrapper' });
    const contentPara = contentDiv.querySelector('p');
    const contentUl = contentDiv.querySelector('ul');
    contentWrapper.appendChild(contentPara);
    if (contentUl) {
      contentWrapper.appendChild(contentUl);
    }
    contentWrapper.appendChild(clearDivInner);
    const h1 = contentDiv.querySelector('h1');
    const h2 = contentDiv.querySelector('h2');
    if (h1) {
      headingWrapper.appendChild(h1);
    }
    if (h2) {
      headingWrapper.appendChild(h2);
    }
    contentDiv.append(headingWrapper, contentWrapper, clearDiv);
  });
}
