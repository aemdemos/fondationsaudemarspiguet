import { blockSeparator } from '../import.utils.js';

/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must match example exactly
  const headerRow = ['Articleintro'];

  // ----------- Extract content for each column/cell -----------
  // First row, first column: left/top: intro text block
  const leftTop = document.createElement('div');
  console.log(document.querySelector('.news_bloc_header'));

  const leftImgDiv1 = document.querySelector('.news_detail_big_container .page_hero_image');
  if (leftImgDiv1 && leftImgDiv1.style.backgroundImage) {
    const urlMatch = leftImgDiv1.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (urlMatch) {
      console.log('Found background image:', urlMatch[1]);
      const img = document.createElement('img');
      img.src = urlMatch[1];
      img.alt = '';
      leftTop.appendChild(img);
    }
  }
  const leftImgDiv2 = document.querySelector('.news_detail_big_container .page_hero_image_middle');
  if (leftImgDiv2 && leftImgDiv2.style.backgroundImage) {
    const urlMatch = leftImgDiv2.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (urlMatch) {
      const img = document.createElement('img');
      img.src = urlMatch[1];
      img.alt = '';
      leftTop.appendChild(img);
    }
  }

  console.log('Left top images:', leftTop);

  const rightTop = document.createElement('div');

  const rightTopDiv = document.querySelector('.news_detail_big_container .page_hero_image_seconde .page_hero_image_middle');
  if (rightTopDiv && rightTopDiv.style.backgroundImage) {
    const urlMatch = rightTopDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (urlMatch) {
      console.log('Found right top background image:', urlMatch[1]);
      const img = document.createElement('img');
      img.src = urlMatch[1];
      img.alt = '';
      rightTop.appendChild(img);
    }
  }

  console.log('Right top image:', rightTop);

  // --------- Compose the table ---------
  const rows = [
    headerRow,
    [leftTop, rightTop]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  document.querySelector('.news_bloc_header').after(blockSeparator());
  // add a section break (the 3 dashes in Word ---)
  document.querySelector('.news_bloc_header').replaceWith(table);
 // element.replaceWith(table);
  
}
