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
  // add clear div between text and image paragraphs to avoid image floating to left
  const imagePara = doc.querySelector('.section.white-lilac-bg .default-content-wrapper p:last-of-type');
  const clearDiv = doc.createElement('div');
  clearDiv.className = 'clear';
  if (imagePara) {
    imagePara.insertAdjacentElement('beforebegin', clearDiv);
  }

  // add clear div to after the default content wrapper to avoid layout issues with next section
  const defaultDiv = doc.querySelector('.section.white-lilac-bg .default-content-wrapper');
  if (defaultDiv) {
    defaultDiv.appendChild(clearDiv.cloneNode());
  }

  // apply fade out animation to news detail section
  const pictureEl = doc.querySelector('.section.white-lilac-bg .default-content-wrapper p:last-of-type picture');
  applyFadeUpAnimation(pictureEl, imagePara);
}
