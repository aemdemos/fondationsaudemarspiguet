import { div } from '../../scripts/dom-helpers.js';

export default function enableAnimationOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible'); // remove class when out of view
      }
    });
  }, { threshold: 0.1 }); // Trigger when 10% visible

  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach((el) => observer.observe(el));
}

export function applyFadeUpAnimation(pictureElement, pictureContainer) {
  // Create a wrapper div for the fade-up effect
  const imageWrapper = div({ class: 'image-fade-wrapper' });
  imageWrapper.style.opacity = '0';
  imageWrapper.style.transform = 'translateY(80px)';
  imageWrapper.style.transition = 'opacity 1.5s ease-out, transform 1.5s ease-out';

  imageWrapper.append(pictureElement);
  pictureContainer.append(imageWrapper);

  // Trigger fade-up animation when element comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      } else {
        // Reset animation when element goes out of view
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(80px)';
      }
    });
  }, { threshold: 0.1 });

  observer.observe(imageWrapper);
}
