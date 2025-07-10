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
  // Move text content and image content to be encased by different divs
  const whiteLilacSection = doc.querySelector('.section.white-lilac-bg');
  const allParas = doc.querySelectorAll('.section.white-lilac-bg div > p');
  const defaultDiv = doc.querySelector('.section.white-lilac-bg div.default-content-wrapper');
  const ImageDiv = document.createElement('div');
  ImageDiv.className = 'image-wrapper';
  const clearDiv = doc.createElement('div');
  clearDiv.className = 'clear';

  if (allParas && defaultDiv && whiteLilacSection) {
    defaultDiv.innerHTML = ''; // Clear the default content wrapper
    let numTextPara = 0;
    let numImagePara = 0;
    allParas.forEach((p) => {
      if (!p.querySelector('picture')) {
        defaultDiv.appendChild(p);
        numTextPara += 1;
      } else if (p.querySelector('picture')) {
        ImageDiv.appendChild(p);
        numImagePara += 1;
      }
    });
    if (numTextPara > 0) {
      whiteLilacSection.appendChild(defaultDiv);
      whiteLilacSection.appendChild(clearDiv);
    }
    if (numImagePara > 0) {
      whiteLilacSection.appendChild(ImageDiv);
      whiteLilacSection.appendChild(clearDiv.cloneNode());
    }
  }

  // apply fade out animation to news detail section
  const pictureEl = doc.querySelector('.section.white-lilac-bg div.image-wrapper p picture');
  const imagePara = doc.querySelector('.section.white-lilac-bg div.image-wrapper p');
  if (pictureEl && imagePara) {
    applyFadeUpAnimation(pictureEl, imagePara);
  }
}
