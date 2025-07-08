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

  // Trigger fade-up animation when element comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      } else {
        // Reset animation when element goes out of view
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(100px)';
      }
    });
  }, { threshold: 0.1 });

  observer.observe(targetWrapper);
}
