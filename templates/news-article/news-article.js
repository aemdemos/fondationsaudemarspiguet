import { applyFadeUpAnimation } from '../../scripts/utils.js';

export function enableAnimationOnScroll() {
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

export default function decorate(doc) {
  // Add a clear div after the first paragraph to ensure the second paragraph
  // remains in the float: right position for large screen sizes
  const textPara = doc.querySelector('.section.white-lilac-bg .default-content-wrapper p:first-of-type');
  const clearDiv = doc.createElement('div');
  clearDiv.className = 'clear';
  textPara.insertAdjacentElement('afterend', clearDiv);

  // apply fade out animation to news detail section
  const pictureEl = doc.querySelector('.section.white-lilac-bg .default-content-wrapper p:nth-of-type(2) picture');
  const imagePara = doc.querySelector('.section.white-lilac-bg .default-content-wrapper p:nth-of-type(2)');
  applyFadeUpAnimation(pictureEl, imagePara);
}
