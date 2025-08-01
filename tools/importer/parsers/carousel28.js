/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel wrapper
  const carousel = element.querySelector('.home_news_carousel .swiper-wrapper');
  if (!carousel) return;
  
  const headerRow = ['Carousel (carousel28)'];
  const rows = [headerRow];

  // Get all slides
  const slides = carousel.querySelectorAll('.home_news_carousel_container');

  slides.forEach((slide) => {
    // IMAGE
    let img = null;
    const imgContainer = slide.querySelector('.home_news_carousel_img');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }
    // TEXT CONTENT
    const cellContent = [];
    // Grab the <a> link as the context for children
    const link = slide.querySelector('a');
    if (link) {
      // TITLE as H2
      const title = link.querySelector('.home_news_carousel_titre');
      if (title && title.textContent.trim()) {
        const h2 = document.createElement('h2');
        h2.innerHTML = title.innerHTML; // preserve any <b>, <br>, etc
        cellContent.push(h2);
      }
      // CATEGORIES (can be multiple)
      const cats = link.querySelectorAll('.home_news_carousel_cat');
      if (cats.length > 0) {
        const catWrap = document.createElement('div');
        cats.forEach((cat, idx) => {
          if (idx > 0) catWrap.appendChild(document.createTextNode(' '));
          catWrap.appendChild(cat);
        });
        cellContent.push(catWrap);
      }
      // DATE
      const date = link.querySelector('.home_news_carousel_date');
      if (date && date.textContent.trim()) {
        const dateWrap = document.createElement('div');
        dateWrap.appendChild(date);
        cellContent.push(dateWrap);
      }
      // DESCRIPTION
      const desc = link.querySelector('p');
      if (desc && desc.textContent.trim()) {
        cellContent.push(desc);
      }
      // CTA: place link to the article, only if link has an href and title exists
      if (title && link.href) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = title.textContent.trim();
        cellContent.push(a);
      }
    }
    // If no <a> found, handle possible stray content
    else {
      // Try to get title, etc. from the direct slide
      const title = slide.querySelector('.home_news_carousel_titre');
      if (title && title.textContent.trim()) {
        const h2 = document.createElement('h2');
        h2.innerHTML = title.innerHTML;
        cellContent.push(h2);
      }
      const cats = slide.querySelectorAll('.home_news_carousel_cat');
      if (cats.length > 0) {
        const catWrap = document.createElement('div');
        cats.forEach((cat, idx) => {
          if (idx > 0) catWrap.appendChild(document.createTextNode(' '));
          catWrap.appendChild(cat);
        });
        cellContent.push(catWrap);
      }
      const date = slide.querySelector('.home_news_carousel_date');
      if (date && date.textContent.trim()) {
        const dateWrap = document.createElement('div');
        dateWrap.appendChild(date);
        cellContent.push(dateWrap);
      }
      const desc = slide.querySelector('p');
      if (desc && desc.textContent.trim()) {
        cellContent.push(desc);
      }
    }
    rows.push([img, cellContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
