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

export function decorateListingCards(doc) {
  const contentDivs = doc.querySelectorAll('.section.float-right .default-content-wrapper');
  contentDivs.forEach((contentDiv) => {
    const containerCol = div({ class: 'container-col' });
    const clearDiv = div({ class: 'clear' });
    const clearDivInner = div({ class: 'clear' });
    const headingWrapper = div({ class: 'heading-wrapper' });
    const contentWrapper = div({ class: 'content-wrapper' });
    const children = Array.from(contentDiv.children);
    children.forEach((child) => {
      if (child.tagName === 'H1' || child.tagName === 'H2') {
        headingWrapper.appendChild(child);
      } else {
        contentWrapper.appendChild(child);
      }
    });
    contentWrapper.appendChild(clearDivInner);
    containerCol.append(headingWrapper, contentWrapper, clearDiv);
    contentDiv.append(containerCol);
  });
}

/**
 * Enables scroll-based animations for elements with 'animate-on-scroll' class
 * Uses the exact same pattern as applyFadeUpAnimation but for horizontal movement
 */
export function enableAnimationOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  elements.forEach((element) => {
    // Set initial styles (starting from right, invisible)
    element.style.opacity = '0';
    element.style.transform = 'translateX(20%)';

    // Create individual observer for each element
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Use Web Animations API for reliable animation
          entry.target.animate([
            { opacity: 0, transform: 'translateX(20%)' },
            { opacity: 1, transform: 'translateX(0)' },
          ], {
            duration: 1500,
            easing: 'ease-out',
            fill: 'forwards',
          });
        } else {
          // Use Web Animations API for instant reset
          entry.target.animate([
            { opacity: 1, transform: 'translateX(0)' },
            { opacity: 0, transform: 'translateX(20%)' },
          ], {
            duration: 100, // Very fast reset
            easing: 'ease-out',
            fill: 'forwards',
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px 0px -50px 0px', // Trigger earlier/later to make reset more visible
    });

    observer.observe(element);
  });
}
