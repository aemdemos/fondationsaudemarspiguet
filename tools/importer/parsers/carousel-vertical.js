/* global WebImporter */
/**
 * Parser for Carousel (vertical) block
 * Extracts carousel images from project detail gallery
 */
export default function parse(element, { document, extractOnly = false }) {
  const carousel = element.querySelector('.projets_detail_galery .swiper-wrapper');
  if (!carousel) return null;

  const carouselItems = carousel.querySelectorAll('.swiper-slide');
  if (!carouselItems || carouselItems.length === 0) return null;

  // Extract carousel content
  const extractedItems = [];
  carouselItems.forEach(slide => {
    const img = slide.querySelector('img');
    if (img) {
      extractedItems.push(img.cloneNode(true));
    }
  });

  // If extractOnly mode, remove the gallery and return extracted items
  if (extractOnly) {
    const gallery = document.querySelector('.projets_detail_galery');
    if (gallery) {
      gallery.remove();
    }
    return extractedItems;
  }

  // Otherwise, create and return the table (original behavior)
  const carouselRows = [['Carousel (vertical)']];
  extractedItems.forEach(img => {
    carouselRows.push([img]);
  });
  
  const carouselTable = WebImporter.DOMUtils.createTable(carouselRows, document);
  
  // Remove the original carousel element and return the table
  carousel.closest('.projets_detail_galery').remove();
  return carouselTable;
}

// Helper function to create carousel table from pre-extracted items
export function createCarouselTable(extractedItems, document) {
  if (!extractedItems || extractedItems.length === 0) return null;
  
  const carouselRows = [['Carousel (vertical)']];
  extractedItems.forEach(img => {
    carouselRows.push([img]);
  });
  
  return WebImporter.DOMUtils.createTable(carouselRows, document);
} 