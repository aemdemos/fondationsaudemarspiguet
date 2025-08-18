/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Columns block with variant columns14
  const headerRow = ['Columns (columns14)'];

  // Find all the columns content: each .swiper-slide contains one column
  const wrapper = element.querySelector('.swiper-wrapper');
  if (!wrapper) return;
  const slides = Array.from(wrapper.children).filter(slide => slide.classList.contains('swiper-slide'));
  // For each slide, extract its main content (the .chiffre_slide div)
  const columns = slides.map(slide => {
    // The full .chiffre_slide is the visual column, so reference it directly
    const chiffre = slide.querySelector('.chiffre_slide');
    // Defensive: if not found, just use the slide
    return chiffre || slide;
  });

  // Only output if at least one column found
  if (!columns.length) return;

  // Compose rows: first header, then a row with each column's content in a cell
  const rows = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  element.replaceWith(table);
}
