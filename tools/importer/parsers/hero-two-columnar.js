/* global WebImporter */
/**
 * Parser for Hero (two-columnar) block
 * Extracts hero content with image and text in two columns
 */
export default function parse(element, { document }) {
  const hero = element.querySelector('.projets_detail_hero');
  if (!hero) return null;

  const heroImage = hero.querySelector('img');
  const heroImageSrc = heroImage ? heroImage.src : '';
  const heroImageAlt = heroImage ? heroImage.alt : '';
  const heroContent = hero.querySelector('.projets_detail_hero_intro');
  const heroText = heroContent ? heroContent.textContent.trim() : '';
  
  // Create image element for the left column
  const imgElement = document.createElement('img');
  if (heroImage) {
    imgElement.src = heroImageSrc;
    imgElement.alt = heroImageAlt;
  }
  
  // Create text element for the right column
  const textElement = document.createElement('div');
  textElement.textContent = heroText;
  
  const heroTable = WebImporter.DOMUtils.createTable([
    ['Hero (two-columnar)'],
    [imgElement, textElement]
  ], document);
  
  // Remove the original hero element and return the table
  hero.remove();
  return heroTable;
} 