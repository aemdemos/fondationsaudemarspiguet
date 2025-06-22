import { blockSeparator } from '../import.utils.js';

/* global WebImporter */
export default function parse(element, { document }) {
 // Table header: must match example exactly
 const headerRow = ['Sectionmetadata'];

 // ----------- Extract content for each column/cell -----------
 const listofClasses = [
    'news_detail_big_intro',
    'news_detail_big_content_2',
    'news_detail_btn_plus',
  ];

  listofClasses.forEach((className) => {
    const classElement = document.querySelector(`.${className}`);
    if (classElement && className === 'news_detail_big_intro') {
        const leftTop = document.createElement('div');
        const rightTop = document.createElement('div');
        leftTop.textContent = 'Style';
        rightTop.textContent = 'White-smoke-bg';
        const rows = [
            headerRow,
            [leftTop, rightTop]
          ];
        // Create and replace
        const table = WebImporter.DOMUtils.createTable(rows, document);
        console.log('Table created:', table);
        classElement.after(table);
        // insert before block separator before the next sibling of classElement
        const blockSep = blockSeparator();
        classElement.nextElementSibling.insertAdjacentElement('afterend', blockSep);
    } else if (classElement && className === 'news_detail_big_content_2') {
        const leftTop = document.createElement('div');
        const rightTop = document.createElement('div');
        leftTop.textContent = 'Style';
        rightTop.textContent = 'White-lilac-bg';
        const rows = [
            headerRow,
            [leftTop, rightTop]
          ];
        // Create and replace
        const table = WebImporter.DOMUtils.createTable(rows, document);
        console.log('Table created:', table);
        classElement.after(table);
        // insert before block separator before the next sibling of classElement
        const blockSep = blockSeparator();
        classElement.nextElementSibling.insertAdjacentElement('afterend', blockSep);
    } else if (classElement && className === 'news_detail_btn_plus') {
        const leftTop = document.createElement('div');
        const rightTop = document.createElement('div');
        leftTop.textContent = 'Style';
        rightTop.textContent = 'details-sidebar';
        const rows = [
            headerRow,
            [leftTop, rightTop]
          ];
        // Create and replace
        const table = WebImporter.DOMUtils.createTable(rows, document);
        console.log('Table created:', table);
        classElement.after(table);
        // insert before block separator before the next sibling of classElement
        const blockSep = blockSeparator();
        classElement.nextElementSibling.insertAdjacentElement('afterend', blockSep);
    }
  });
}
