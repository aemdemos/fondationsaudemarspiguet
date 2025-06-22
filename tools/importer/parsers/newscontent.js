import { blockSeparator } from '../import.utils.js';

/* global WebImporter */
export default function parse(element, { document }) {
    // Table header: must match example exactly
    const headerRow = ['Newscontent'];

    // ----------- Extract content for each column/cell -----------
    // First row, first column: left/top: intro text block
    const leftTop = document.createElement('div');

    const rightTop = document.createElement('div');

    const rightTopDivimg = element.querySelector('.news_detail_big_container .news_detail_big_content_1 .news_detail_big_galerie1 img');
    if (rightTopDivimg) {
        rightTop.appendChild(rightTopDivimg);
    }

    console.log('Right top image:', rightTop);

    const bottom = document.createElement('div');

    const bottomDiv = element.querySelector('.news_detail_big_contenu_right');
    if (bottomDiv) {
        bottom.appendChild(bottomDiv);
    }

    // --------- Compose the table ---------
    const rows = [
        headerRow,
        [leftTop, rightTop],
        [bottom]
    ];

    // Create and replace
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.querySelector('.news_detail_big_content_1').after(blockSeparator());
    // add a section break (the 3 dashes in Word ---)
    element.querySelector('.news_detail_big_content_1').replaceWith(table);
    // element.replaceWith(table);

}
