/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get image element (reference, not clone)
  function getImageCell(slide) {
    const imgWrapper = slide.querySelector('.home_news_carousel_img');
    if (!imgWrapper) return '';
    const img = imgWrapper.querySelector('img');
    if (!img) return '';
    // Prefer data-src if present
    const dataSrc = img.getAttribute('data-src');
    if (dataSrc && img.src !== dataSrc) {
      img.src = dataSrc;
    }
    return img;
  }

  // Helper to build the text cell as an array of referenced elements
  function getTextCell(slide) {
    const a = slide.querySelector('a');
    if (!a) return '';
    const parts = [];
    // Title
    const h4 = a.querySelector('.home_news_carousel_titre');
    if (h4) {
      const h3 = document.createElement('h3');
      h3.textContent = h4.textContent;
      parts.push(h3);
    }
    // Categories (can be more than one)
    const catDivs = a.querySelectorAll('.home_news_carousel_cat');
    if (catDivs.length > 0) {
      const categories = Array.from(catDivs).map(cat => cat.textContent.trim()).filter(Boolean).join(', ');
      if (categories) {
        const catP = document.createElement('p');
        catP.textContent = categories;
        parts.push(catP);
      }
    }
    // Date
    const dateDiv = a.querySelector('.home_news_carousel_date');
    if (dateDiv) {
      const dateP = document.createElement('p');
      dateP.textContent = dateDiv.textContent;
      parts.push(dateP);
    }
    // Description paragraph (first <p> inside the <a>)
    const desc = a.querySelector('p');
    if (desc) {
      parts.push(desc);
    }
    // CTA (the link itself, text = title)
    const linkHref = a.getAttribute('href');
    if (linkHref && h4) {
      const link = document.createElement('a');
      link.href = linkHref;
      link.textContent = h4.textContent;
      parts.push(link);
    }
    return parts.length > 0 ? parts : '';
  }

  // Find all slides
  const slidesWrapper = element.querySelector('.swiper-wrapper');
  if (!slidesWrapper) return;
  const slides = slidesWrapper.querySelectorAll('.home_news_carousel_container');
  if (!slides.length) return;

  // Compose table rows
  const rows = [ ['Carousel (carousel7)'] ];
  slides.forEach(slide => {
    const imgCell = getImageCell(slide);
    const textCell = getTextCell(slide);
    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
