import heroTwoColumnarParser from './parsers/hero-two-columnar.js';
import carouselVerticalParser, { createCarouselTable } from './parsers/carousel-vertical.js';
import projectMetadataParser from './parsers/project-metadata.js';

export default {  
  /**
     * Apply DOM operations to the provided document and return
     * the root element to be then transformed to Markdown.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @returns {HTMLElement} The root element to be transformed
     */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // Remove scroll-to-top button early to prevent it from appearing in content
    const scrollToTop = document.querySelector('#scroll-to-top');
    if (scrollToTop) {
      scrollToTop.remove();
    }

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      '#header',
      '#footer',
      '.projets_listing',
      '.newsletter_bloc',
      '.projets_autre',
    ]);

    // Extract content elements BEFORE calling parsers that remove DOM elements
    const titleElement = document.querySelector('.projets_detail_container h1');
    const content = document.querySelectorAll('.projets_detail_container .detail_content p');
    
    // Extract carousel content early using the parser to prevent other parsers from interfering
    const carouselItems = carouselVerticalParser(main, { document, extractOnly: true }) || [];

    // Parse project metadata FIRST before other parsers remove elements
    // Create a temporary container for metadata
    const metadataContainer = document.createElement('div');
    
    // Debug: Check if detail_info exists before metadata parsing
    console.log('Detail info before metadata parsing:', !!document.querySelector('.projets_detail_container .detail_info'));
    
    projectMetadataParser(metadataContainer, { document });
    const metadataBlock = metadataContainer.querySelector('table');
    
    // Debug: Check if detail_info still exists after metadata parsing
    console.log('Detail info after metadata parsing:', !!document.querySelector('.projets_detail_container .detail_info'));
    
    // Ensure any remaining detail_info elements are removed
    const remainingDetailInfo = document.querySelectorAll('.projets_detail_container .detail_info');
    remainingDetailInfo.forEach(element => {
      console.log('Removing remaining detail_info element');
      element.remove();
    });

    // Parse Hero (two-columnar) block and get the table
    const heroTable = heroTwoColumnarParser(main, { document });
    if (heroTable) {
      main.append(heroTable);
    }

    // Add the content elements in the correct order between hero and carousel
    const hr1 = document.createElement('hr');
    main.append(hr1);

    if (titleElement) {
      titleElement.textContent = titleElement.textContent.toUpperCase();
      main.append(titleElement);
    }

    if (content && content.length > 0) {
      content.forEach(paragraph => {
        main.append(paragraph);
      });
    }

    const sectionMetadataTable1 = WebImporter.DOMUtils.createTable([
      ['Section Metadata'],
      ['Style', 'details-sidebar, light-grey-bg']
    ], document);
    main.append(sectionMetadataTable1);

    const hr2 = document.createElement('hr');
    main.append(hr2);

    // Create Carousel (vertical) block from pre-extracted items using the parser's helper function
    // This ensures proper placement since we extracted content early
    const carouselTable = createCarouselTable(carouselItems, document);
    
    if (carouselTable) {
      console.log('Appending carousel table to main');
      main.append(carouselTable);
    }

    // Append the metadata block with all extracted properties
    if (metadataBlock) {
      main.append(metadataBlock);
    }

    return main;
  },

  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};