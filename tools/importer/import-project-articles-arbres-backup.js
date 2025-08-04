const createMetadata = (main, document) => {
    const meta = {};
  
    const title = document.querySelector('[property="og:title"]');
    if (title) {
      meta.Title = title.content;
    }
  
    const desc = document.querySelector('[property="og:description"]');
    if (desc) {
      meta.Description = desc.content;
    }

    const detailInfo = document.querySelector('.projets_detail_container .detail_info');
    if (detailInfo) {
      const labels = detailInfo.querySelectorAll('.projets_detail_label');
      labels.forEach(label => {
        const labelText = label.textContent.trim();
        let nextNode = label.nextSibling;
        let value = '';
        
        // Collect text until we hit the next label or end of container
        while (nextNode && !nextNode.classList?.contains('projets_detail_label')) {
          if (nextNode.nodeType === Node.TEXT_NODE) {
            value += nextNode.textContent.trim();
          } else if (nextNode.nodeType === Node.ELEMENT_NODE) {
            if (nextNode.tagName === 'A') {
              value += nextNode.href || nextNode.textContent.trim();
            } else if (nextNode.tagName === 'BR') {
              value += ' ';
            } else {
              value += nextNode.textContent.trim();
            }
          }
          nextNode = nextNode.nextSibling;
        }
        
        if (labelText && value.trim()) {
          meta[labelText] = value.trim();
        }
      });
    }

    // Handle the image from hero block
    const heroImg = document.querySelector('.projets_detail_hero img');
    if (heroImg) {
      const imgElement = document.createElement('img');
      imgElement.src = heroImg.src;
      imgElement.alt = heroImg.alt || meta.Title || 'Project image';
      meta.Image = imgElement;
    }
    return meta;
  };
  
  
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

      // create the metadata block FIRST, before removing any elements
      const meta = createMetadata(main, document);
      
      // Remove the detail_info element after extracting metadata to prevent duplication
      const detailInfoElement = document.querySelector('.projets_detail_container .detail_info');
      if (detailInfoElement) {
        detailInfoElement.remove();
      }

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
      ]);

      const hero = document.querySelector('.projets_detail_hero');
      if (hero) {
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
        main.append(heroTable);
        
        // Remove the original hero element to prevent duplication
        hero.remove();
      }

      const title = document.querySelector('.projets_detail_container h1');
      if (title) {
        title.textContent = title.textContent.toUpperCase();
        main.append(title);
      }

      const content = document.querySelectorAll('.projets_detail_container .detail_content p');
      if (content && content.length > 0) {
        content.forEach(paragraph => {
          main.append(paragraph);
        });
      }

      const carousel = document.querySelector('.projets_detail_galery .swiper-wrapper');
      if (carousel) {
        const carouselItems = carousel.querySelectorAll('.swiper-slide');
        if (carouselItems && carouselItems.length > 0) {
          const carouselRows = [['Carousel (vertical)']];
          
          carouselItems.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
              carouselRows.push([img]);
            }
          });
          
          const carouselTable = WebImporter.DOMUtils.createTable(carouselRows, document);
          main.append(carouselTable);
        }
      }

      const hr = document.createElement('hr');
      main.append(hr);

      const otherProjects = document.querySelector('.projets_autre h2');
      if (otherProjects) {
        otherProjects.textContent = otherProjects.textContent.toUpperCase();
        main.append(otherProjects);
      }

      const featuredProjectsTable = WebImporter.DOMUtils.createTable([
        ['Featured Projects']
      ], document);
      main.append(featuredProjectsTable);

      const sectionMetadataTable = WebImporter.DOMUtils.createTable([
        ['Section Metadata'],
        ['Style', 'light-grey-bg']
      ], document);
      main.append(sectionMetadataTable);

      // Create and append the metadata block at the very end
      const metadataBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
      main.append(metadataBlock);

      return main;
    },
  
    generateDocumentPath: ({
      // eslint-disable-next-line no-unused-vars
      document, url, html, params,
    }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
  };