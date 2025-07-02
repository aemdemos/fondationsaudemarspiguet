import { createOptimizedPicture, getMetadata } from '../../scripts/aem.js';
import enableAnimationOnScroll from '../../templates/news-article/news-article.js';
import { div, h1 } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  const newsHeader = div(
    { class: 'news-block-header' },
    div({ class: 'page-hero-image' }, div({ class: 'page-hero-image-middle' })),
    div({ class: 'news-detail-big-header' }, div({ class: 'news-detail-category' }), div({ class: 'news-detail-date' }), h1({ class: 'news-detail-title animate-on-scroll' })),
    div({ class: 'page-hero-image-seconde' }),
  );
  const newsCategory = getMetadata('category');
  const newsDate = getMetadata('date');
  const newsTitle = getMetadata('og:title');
  newsHeader.querySelector('.news-detail-category').textContent = newsCategory.replace(',', ' |') || '';
  newsHeader.querySelector('.news-detail-date').textContent = newsDate || '';
  newsHeader.querySelector('.news-detail-title').textContent = newsTitle || '';
  [...block.children].forEach((row) => {
    row.querySelectorAll('img').forEach((img, i) => {
      if (i === 0) {
        newsHeader.querySelector('.page-hero-image').append(createOptimizedPicture(img.src));
      } else if (i === 1) {
        newsHeader.querySelector('.page-hero-image-middle').append(createOptimizedPicture(img.src));
      } else if (i === 2) {
        newsHeader.querySelector('.page-hero-image-seconde').append(createOptimizedPicture(img.src));
      }
    });
  });
  block.textContent = '';
  block.append(newsHeader);
  enableAnimationOnScroll();
}
