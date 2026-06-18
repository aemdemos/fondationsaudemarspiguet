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
    labels.forEach((label) => {
      const labelText = label.textContent.trim();
      let nextNode = label.nextSibling;
      let value = '';

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
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    const main = document.body;

    const meta = createMetadata(main, document);

    const detailInfoElement = document.querySelector('.projets_detail_container .detail_info');
    if (detailInfoElement) {
      detailInfoElement.remove();
    }

    const scrollToTop = document.querySelector('#scroll-to-top');
    if (scrollToTop) {
      scrollToTop.remove();
    }

    WebImporter.DOMUtils.remove(main, [
      '#header',
      '#footer',
      '.projets_listing',
      '.newsletter_bloc',
      '.projets_autre',
    ]);

    // Hero block — layout depends on even/odd class
    const hero = document.querySelector('.projets_detail_hero');
    if (hero) {
      const heroImage = hero.querySelector('img');
      const heroContent = hero.querySelector('.projets_detail_hero_intro');
      const heroText = heroContent ? heroContent.textContent.trim() : '';

      const imgElement = document.createElement('img');
      if (heroImage) {
        imgElement.src = heroImage.src;
        imgElement.alt = heroImage.alt || '';
      }

      const textElement = document.createElement('div');
      textElement.textContent = heroText;

      let heroTable;
      if (hero.classList.contains('projet-hero-even')) {
        heroTable = WebImporter.DOMUtils.createTable([
          ['Hero (two-columnar-text-image)'],
          [textElement, imgElement],
        ], document);
      } else {
        heroTable = WebImporter.DOMUtils.createTable([
          ['Hero (two-columnar)'],
          [imgElement, textElement],
        ], document);
      }

      main.append(heroTable);
      hero.remove();
    }

    // Section break after hero
    main.append(document.createElement('hr'));

    // Title
    const title = document.querySelector('.projets_detail_container h1');
    if (title) {
      title.textContent = title.textContent.toUpperCase();
      main.append(title);
    }

    // Content paragraphs
    const content = document.querySelectorAll('.projets_detail_container .detail_content p');
    if (content && content.length > 0) {
      content.forEach((paragraph) => {
        main.append(paragraph);
      });
    }

    // Section Metadata for the content section
    const sectionMetadataTable = WebImporter.DOMUtils.createTable([
      ['Section Metadata'],
      ['Style', 'light-grey-bg, details-sidebar'],
    ], document);
    main.append(sectionMetadataTable);

    // Section break before carousel
    main.append(document.createElement('hr'));

    // Carousel
    const carousel = document.querySelector('.projets_detail_galery .swiper-wrapper');
    if (carousel) {
      const carouselItems = carousel.querySelectorAll('.swiper-slide');
      if (carouselItems && carouselItems.length > 0) {
        const carouselRows = [['Carousel (vertical)']];

        carouselItems.forEach((slide) => {
          const img = slide.querySelector('img');
          if (img) {
            carouselRows.push([img]);
          }
        });

        const carouselTable = WebImporter.DOMUtils.createTable(carouselRows, document);
        main.append(carouselTable);
      }
    }

    // Metadata block at the end
    const metadataBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
    main.append(metadataBlock);

    return main;
  },

  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};
