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

    // const detailInfo = document.querySelector('.projets_detail_container .detail_info');
    // if (detailInfo) {
    //   const labels = detailInfo.querySelectorAll('.projets_detail_label');
    //   labels.forEach(label => {
    //     const labelText = label.textContent.trim();
    //     let nextNode = label.nextSibling;
    //     let value = '';
        
    //     // Collect text until we hit the next label or end of container
    //     while (nextNode && !nextNode.classList?.contains('projets_detail_label')) {
    //       if (nextNode.nodeType === Node.TEXT_NODE) {
    //         value += nextNode.textContent.trim();
    //       } else if (nextNode.nodeType === Node.ELEMENT_NODE) {
    //         if (nextNode.tagName === 'A') {
    //           value += nextNode.href || nextNode.textContent.trim();
    //         } else if (nextNode.tagName === 'BR') {
    //           value += ' ';
    //         } else {
    //           value += nextNode.textContent.trim();
    //         }
    //       }
    //       nextNode = nextNode.nextSibling;
    //     }
        
    //     if (labelText && value.trim()) {
    //       meta[labelText] = value.trim();
    //     }
    //   });
    // }

    // // Handle the image from hero block
    // const heroImg = document.querySelector('.projets_detail_hero img');
    // if (heroImg) {
    //   const imgElement = document.createElement('img');
    //   imgElement.src = heroImg.src;
    //   imgElement.alt = heroImg.alt || meta.Title || 'Project image';
    //   meta.Image = imgElement;
    // }
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
      // const detailInfoElement = document.querySelector('.projets_detail_container .detail_info');
      // if (detailInfoElement) {
      //   detailInfoElement.remove();
      // }

      // Remove scroll-to-top button early to prevent it from appearing in content
      const scrollToTop = document.querySelector('#scroll-to-top');
      if (scrollToTop) {
        scrollToTop.remove();
      }

      // use helper method to remove header, footer, etc.
      WebImporter.DOMUtils.remove(main, [
        '#header',
        '#footer',
        // '.projets_listing',
        // '.newsletter_bloc',
        // '.projets_autre_titre',
      ]);

      // const hero = document.querySelector('.projets_detail_hero');
      // if (hero) {
      //   const heroImage = hero.querySelector('img');
      //   const heroImageSrc = heroImage ? heroImage.src : '';
      //   const heroImageAlt = heroImage ? heroImage.alt : '';
      //   const heroContent = hero.querySelector('.projets_detail_hero_intro');
      //   const heroText = heroContent ? heroContent.textContent.trim() : '';
        
      //   // Create image element
      //   const imgElement = document.createElement('img');
      //   if (heroImage) {
      //     imgElement.src = heroImageSrc;
      //     imgElement.alt = heroImageAlt;
      //   }
        
      //   // Create text element
      //   const textElement = document.createElement('div');
      //   textElement.textContent = heroText;
        
      //   // Check if this is an even or odd hero layout
      //   let heroTable;
      //   if (hero.classList.contains('projet-hero-even')) {
      //     // Text first, then image (two-columnar-text-image)
      //     heroTable = WebImporter.DOMUtils.createTable([
      //       ['Hero (two-columnar-text-image)'],
      //       [textElement, imgElement]
      //     ], document);
      //   } else {
      //     // Default odd layout: image first, then text (two-columnar)
      //     heroTable = WebImporter.DOMUtils.createTable([
      //       ['Hero (two-columnar)'],
      //       [imgElement, textElement]
      //     ], document);
      //   }
        
      //   main.append(heroTable);
        
      //   // Remove the original hero element to prevent duplication
      //   hero.remove();
      // }

      const title = document.querySelector('.partenaires .container h1');
      if (title) {
        title.textContent = title.textContent.toUpperCase();
        main.append(title);
      }

      const content = document.querySelectorAll('.partenaires .container p');
      if (content && content.length > 0) {
        content.forEach(paragraph => {
          main.append(paragraph);
        });
      }

      const sectionMetadataTableDetails = WebImporter.DOMUtils.createTable([
        ['Section Metadata'],
        ['Style', 'float-right']
      ], document);
      main.append(sectionMetadataTableDetails);

      const hr1 = document.createElement('hr');
      main.append(hr1);

      const cardsBlock = document.querySelector('.partenaires .partenaires_listing_container .partenaires_listing');
      if (cardsBlock) {
        // The cards are actually the a.myItem elements directly
        const cards = cardsBlock.querySelectorAll('a.myItem');
        console.log(`Found ${cards.length} cards in total`);
        
        if (cards && cards.length > 0) {
          const cardsRows = [['Cards (listing)']];
          
          cards.forEach((card, index) => {
            // Extract the main image from gallery_listing_format
            const galleryImg = card.querySelector('.gallery_listing_format img');
            const galleryImgElement = document.createElement('img');
            
            if (galleryImg) {
              let imgSrc = galleryImg.src || galleryImg.getAttribute('data-src');
              // Normalize URL - convert relative paths to absolute
              if (imgSrc && imgSrc.startsWith('/')) {
                imgSrc = new URL(imgSrc, url).href;
              }
              galleryImgElement.src = imgSrc;
              galleryImgElement.alt = galleryImg.alt || '';
            }
            
            // The card itself is the link (a.myItem)
            const partnerLink = card;
            const partnerLogo = card.querySelector('.partenaires_logo img');
            const partnerName = card.querySelector('h2');
            
            // Create second cell content with logo and link
            const secondCellDiv = document.createElement('div');
            
            if (partnerLogo) {
              const logoElement = document.createElement('img');
              let logoSrc = partnerLogo.src;
              // Normalize URL - convert relative paths to absolute
              if (logoSrc && logoSrc.startsWith('/')) {
                logoSrc = new URL(logoSrc, url).href;
              }
              logoElement.src = logoSrc;
              logoElement.alt = partnerLogo.alt || '';
              secondCellDiv.appendChild(logoElement);
            }
            
            if (partnerLink && partnerLink.href && partnerName) {
              const linkElement = document.createElement('a');
              linkElement.href = partnerLink.href;
              linkElement.target = partnerLink.target || '_blank';
              
              // Create p element with strong tag
              const pElement = document.createElement('p');
              const strongElement = document.createElement('strong');
              strongElement.textContent = partnerName.textContent.trim();
              pElement.appendChild(strongElement);
              linkElement.appendChild(pElement);
              
              secondCellDiv.appendChild(linkElement);
            }
            
            // Add row with two cells
            cardsRows.push([galleryImgElement, secondCellDiv]);
          });
          
          // Create and append the cards table
          const cardsTable = WebImporter.DOMUtils.createTable(cardsRows, document);
          main.append(cardsTable);
          
          // Remove the original partner listing to prevent duplication
          cardsBlock.remove();
        }
      }

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