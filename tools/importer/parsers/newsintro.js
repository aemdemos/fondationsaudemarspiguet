/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must match example exactly
  const headerRow = ['Newsintro'];

  // ----------- Extract content for each column/cell -----------
  // First row, first column: left/top: intro text block
  const leftTop = document.createElement('div');

  const leftImgDiv1 = element.querySelector('.news_detail_big_container .page_hero_image');
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
  const leftImgDiv2 = element.querySelector('.news_detail_big_container .page_hero_image_middle');
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

  const rightTopDiv = element.querySelector('.news_detail_big_container .page_hero_image_seconde .page_hero_image_middle');
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


  // // // Hero block with headline, category, date, and hero image
  // // const newsHeader = element.querySelector('.news_bloc_header');
  // // if (newsHeader) leftTop.appendChild(newsHeader);
  // // // Intro paragraph
  // // const intro = element.querySelector('.news_detail_big_intro');
  // // if (intro) leftTop.appendChild(intro);
  // // // Links and credits
  // // const content1 = element.querySelector('.news_detail_big_content_1');
  // // if (content1) leftTop.appendChild(content1);

  // // First row, second column: right/top: hero/feature image
  // // let rightTop = '';
  // // In the news_bloc_header, there may be hero images as bg-images.
  // // Try to extract the most prominent one for the right cell visual (as in the example)
  // const heroImgDiv = element.querySelector('.news_bloc_header .page_hero_image .page_hero_image_middle.inside_middle');
  // if (heroImgDiv && heroImgDiv.style.backgroundImage) {
  //   const urlMatch = heroImgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
  //   if (urlMatch) {
  //     const img = document.createElement('img');
  //     img.src = urlMatch[1];
  //     img.alt = '';
  //     rightTop = img;
  //   }
  // }
  // // If not found, try to use <img> from gallery as fallback
  // if (!rightTop) {
  //   const gallery1img = element.querySelector('.news_detail_big_galerie1 img');
  //   if (gallery1img) {
  //     const img = document.createElement('img');
  //     img.src = gallery1img.getAttribute('src') || gallery1img.getAttribute('data-src');
  //     img.alt = gallery1img.alt || '';
  //     rightTop = img;
  //   }
  // }

  // // Second row, first column: left/bottom: another image (from second gallery)
  // let leftBottom = '';
  // const gallery2img = element.querySelector('.news_detail_big_galerie2 img');
  // if (gallery2img) {
  //   const img = document.createElement('img');
  //   img.src = gallery2img.getAttribute('src') || gallery2img.getAttribute('data-src');
  //   img.alt = gallery2img.alt || '';
  //   leftBottom = img;
  // }

  // // Second row, second column: right/bottom: summary text, buttons, etc.
  // const rightBottom = document.createElement('div');
  // // Main article body (right side paragraphs, 2nd main content)
  // const contentRight = element.querySelector('.news_detail_big_contenu_right');
  // if (contentRight) rightBottom.appendChild(contentRight);
  // // Main body continued (from .news_detail_big_content_2)
  // const content2 = element.querySelector('.news_detail_big_content_2');
  // if (content2) rightBottom.appendChild(content2);
  // // Final summary/author/buttons
  // const content3 = element.querySelector('.news_detail_big_content_3');
  // if (content3) rightBottom.appendChild(content3);
  // // View more articles button
  // const btnPlus = element.querySelector('.news_detail_btn_plus');
  // if (btnPlus) rightBottom.appendChild(btnPlus);

  // --------- Compose the table ---------
  const rows = [
    headerRow,
    [leftTop, rightTop]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // element.replaceWith(table);
  element.prepend(table);
}
