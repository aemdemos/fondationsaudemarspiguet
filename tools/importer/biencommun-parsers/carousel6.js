/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to resolve relative URLs
  function resolveSrc(src) {
    if (!src) return '';
    const a = document.createElement('a');
    a.href = src;
    return a.href;
  }

  // Find the wrapper with slides
  const wrapper = element.querySelector('.swiper-wrapper');
  if (!wrapper) return;
  const slides = Array.from(wrapper.children).filter((el) => el.classList.contains('swiper-slide'));

  // Header row as in example
  const rows = [['Carousel (carousel6)']];

  slides.forEach((slide) => {
    // Extract image (1st cell)
    const img = slide.querySelector('img');
    if (!img) return;
    // Fix src for relative URLs
    if (img.getAttribute('src')) {
      img.src = resolveSrc(img.getAttribute('src'));
    } else if (img.getAttribute('data-src')) {
      img.src = resolveSrc(img.getAttribute('data-src'));
    }

    // Extract text content (2nd cell, optional)
    // Look for any direct child div (to catch typical text containers)
    const textDivs = Array.from(slide.children).filter(
      (el) => el.tagName === 'DIV' && el.textContent.trim()
    );
    // If any text divs found, include their references (not cloned)
    let textContent = '';
    if (textDivs.length === 1) {
      textContent = textDivs[0];
    } else if (textDivs.length > 1) {
      textContent = textDivs;
    }
    rows.push([img, textContent]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
