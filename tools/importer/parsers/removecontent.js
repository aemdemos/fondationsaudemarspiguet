/* global WebImporter */
export default function parse(element, { document }) {
 // Table header: must match example exactly
//  const headerRow = ['Sectionmetadata'];

 // ----------- Extract content for each column/cell -----------
 const listofClasses = [
    'detail_info',
    'news_projets_autre',
  ];

  listofClasses.forEach((className) => {
    const classElement = element.querySelector(`.${className}`);
    console.log(classElement);
    classElement.remove();
  });
}
