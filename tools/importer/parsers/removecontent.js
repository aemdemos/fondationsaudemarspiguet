/* global WebImporter */
export default function parse(element, { document }) {

    // ----------- Extract content for each column/cell -----------
    const listofClasses = [
        'detail_info',
        'news_projets_autre',
        'newsletter_bloc',
        'news_detail',
        'aos-animate',
    ];

    listofClasses.forEach((className) => {
        const classElement = document.querySelector(`.${className}`);
        console.log(classElement);
        if (classElement) { classElement.remove(); }
    });
}
