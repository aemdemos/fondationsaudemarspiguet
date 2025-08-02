import { blockSeparator } from '../import.utils.js';

/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must match example exactly
  const headerRow = ['Carousel (vertical)'];

  // ----------- Extract content for each column/cell -----------
  // First row, first column: left/top: intro text block
 // --------- Compose the table ---------
 const rows = [
    headerRow
  ]
  const images = document.querySelectorAll('.news_detail_galery img');
  if (images.length > 0) {
    images.forEach(element => {
        const imagediv = document.createElement('div');
        imagediv.appendChild(element.cloneNode(true));
        rows.push([imagediv]);
    });
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  console.log(table);
  document.querySelector('.news_detail_galery').after(blockSeparator());
  // add a section break (the 3 dashes in Word ---)
  document.querySelector('.news_detail_galery').replaceWith(table);
 // element.replaceWith(table);
  
}
