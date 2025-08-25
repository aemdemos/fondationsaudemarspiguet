/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background-image from a style and return an <img> element
  function bgImgToImg(styleBg) {
    const bg = styleBg || '';
    if (bg && bg.includes('url')) {
      const urlMatch = bg.match(/url\(["']?(.+?)["']?\)/);
      if (urlMatch) {
        const img = document.createElement('img');
        img.src = urlMatch[1];
        img.alt = '';
        return img;
      }
    }
    return null;
  }

  // Helper: get first <img> from a container (handle lazy as well)
  function getFirstImgFrom(container) {
    if (!container) return null;
    const img = container.querySelector('img');
    if (!img) return null;
    if (!img.src && img.dataset && img.dataset.src) {
      img.src = img.dataset.src;
    }
    return img;
  }

  // Column 1, Row 1: Left
  const col1Row1 = [];
  // Main hero image on the left (from .news_bloc_header > .page_hero_image)
  const newsBlocHeader = element.querySelector('.news_bloc_header');
  let leftHeroImg;
  if (newsBlocHeader) {
    const hero = newsBlocHeader.querySelector('.page_hero_image');
    if (hero) {
      leftHeroImg = bgImgToImg(hero.style.backgroundImage);
      if (leftHeroImg) col1Row1.push(leftHeroImg);
    }
  }
  // Add intro text (from .news_detail_big_intro .col6)
  const introCol = element.querySelector('.news_detail_big_intro .col6');
  if (introCol) {
    col1Row1.push(introCol);
  }
  // Add links/photos (from .news_detail_big_content_1 .detail_info)
  const detailInfo = element.querySelector('.news_detail_big_content_1 .detail_info');
  if (detailInfo) {
    col1Row1.push(detailInfo);
  }
  // Add gallery image 1
  const gal1Img = getFirstImgFrom(element.querySelector('.news_detail_big_galerie1'));
  if (gal1Img) {
    col1Row1.push(gal1Img);
  }

  // Column 2, Row 1: Right
  const col2Row1 = [];
  // Block header (title/category/date)
  if (newsBlocHeader) {
    const header = newsBlocHeader.querySelector('.news_detail_big_header');
    if (header) col2Row1.push(header);
    // The secondary hero image
    const hero2Mid = newsBlocHeader.querySelector('.page_hero_image_seconde .page_hero_image_middle');
    if (hero2Mid) {
      const img2 = bgImgToImg(hero2Mid.style.backgroundImage);
      if (img2) col2Row1.push(img2);
    }
  }
  // Main right content paragraph
  const contenuRight = element.querySelector('.news_detail_big_contenu_right');
  if (contenuRight) {
    col2Row1.push(contenuRight);
  }

  // Column 1, Row 2: Left
  const col1Row2 = [];
  // Section .news_detail_big_content_2 (text & image)
  const bigContent2 = element.querySelector('.news_detail_big_content_2');
  if (bigContent2) {
    col1Row2.push(bigContent2);
  }

  // Column 2, Row 2: Right
  const col2Row2 = [];
  // Section .news_detail_big_content_3 (content & author/social)
  const content3 = element.querySelector('.news_detail_big_content_3');
  if (content3) {
    col2Row2.push(content3);
  }
  // 'Voir plus d’articles' button
  const btnPlus = element.querySelector('.news_detail_btn_plus');
  if (btnPlus) {
    col2Row2.push(btnPlus);
  }

  // Compose the table as in the markdown example: header row, then two rows of two columns
  const cells = [
    ['Columns (columns8)'],
    [col1Row1, col2Row1],
    [col1Row2, col2Row2]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
