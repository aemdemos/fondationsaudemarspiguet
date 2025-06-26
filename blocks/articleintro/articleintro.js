import { createOptimizedPicture } from '../../scripts/aem.js';
// import { moveInstrumentation } from '../../scripts/scripts.js';
import { div } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  const newsHeader = div(
    { class: 'news-bloc-header' },
    div({ class: 'page_hero_image' }),
    div({ class: 'news_detail_big_header' }),
    div({ class: 'page_hero_image_seconde' }),
  );
  [...block.children].forEach((row) => {
    row.querySelectorAll('img').forEach((img, i) => {
      // if is 0, add the first image as background to div of class: 'page_hero_image'
      if (i === 0) {
        newsHeader.querySelector('.page_hero_image').style.backgroundImage = `url(${img.src})`;
        console.log(newsHeader.querySelector('.page_hero_image'));
      } else if (i === 1) {
        newsHeader.querySelector('.page_hero_image').append(createOptimizedPicture(img.src));
      } else if (i === 2) {
        // if is 1, add the second image as background to div of class: 'page_hero_image_seconde'
        newsHeader.querySelector('.page_hero_image_seconde').style.backgroundImage = `url(${img.src})`;
      }
    });
  });
  block.textContent = '';
  block.append(newsHeader);
}
