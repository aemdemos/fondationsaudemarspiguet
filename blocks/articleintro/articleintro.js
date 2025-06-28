import { createOptimizedPicture } from '../../scripts/aem.js';
// import { moveInstrumentation } from '../../scripts/scripts.js';
import { div } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  const newsHeader = div(
    { class: 'news-block-header' },
    div({ class: 'page-hero-image' }, div({ class: 'page-hero-image-middle' })),
    // div({ class: 'page-hero-image' }),
    div({ class: 'news-detail-big-header' }),
    div({ class: 'page-hero-image-seconde' }),
    // div({ class: 'page-hero-image-seconde' }),
  );
  [...block.children].forEach((row) => {
    row.querySelectorAll('img').forEach((img, i) => {
      // if is 0, add the first image as background to div of class: 'page-hero-image'
      if (i === 0) {
        // newsHeader.querySelector('.page-hero-image').style.backgroundImage = `url(${img.src})`;
        newsHeader.querySelector('.page-hero-image').append(createOptimizedPicture(img.src));
        console.log(newsHeader.querySelector('.page-hero-image'));
      } else if (i === 1) {
        newsHeader.querySelector('.page-hero-image-middle').append(createOptimizedPicture(img.src));
        // newsHeader.querySelector('.page-hero-image-middle').style.backgroundImage = `url(${img.src})`;
      } else if (i === 2) {
        // if is 1, add the second image as background to div of class: 'page-hero-image-seconde'
        // newsHeader.querySelector('.page-hero-image-seconde-middle').style.backgroundImage = `url(${img.src})`;
        newsHeader.querySelector('.page-hero-image-seconde').append(createOptimizedPicture(img.src));
      }
    });
  });
  block.textContent = '';
  block.append(newsHeader);
}
