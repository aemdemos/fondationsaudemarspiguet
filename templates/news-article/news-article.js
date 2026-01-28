import { getMetadata, fetchPlaceholders } from '../../scripts/aem.js';
import {
  applyFadeUpAnimation,
  getLocalizedMetadata,
  getLocalizedUILabel,
} from '../../scripts/utils.js';
import {
  div, h1, a, ul, li,
} from '../../scripts/dom-helpers.js';

export function enableAnimationOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible'); // remove class when out of view
      }
    });
  }, { threshold: 0.1 }); // Trigger when 10% visible

  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach((el) => observer.observe(el));
}

export default async function decorate(doc) {
  const mainSection = doc.querySelector('.news-article-template main');
  const articlecontentSection = div({ class: 'section articlecontent-container' });
  const carouselContainer = doc.querySelector('.news-article-template .carousel-container');
  const featuredProject = doc.querySelector('.news-article-template .featured-projects-container');
  const sidebar = div({ class: 'news-article-sidebar' });

  // Get language and metadata using the new helper
  const language = getMetadata('language');
  const links = getLocalizedMetadata('links', 'newsArticle', doc);
  const author = getLocalizedMetadata('author', 'newsArticle', doc);
  const photos = getLocalizedMetadata('photos', 'newsArticle', doc);

  // Get UI labels
  const photosLabel = getLocalizedUILabel('photos', 'newsArticle', doc);
  const writtenByLabel = getLocalizedUILabel('writtenBy', 'newsArticle', doc);
  const followUsLabel = getLocalizedUILabel('followUs', 'newsArticle', doc);

  const newsDiv = doc.querySelector('.news-article-template .details-sidebar');
  const viewMoreButton = doc.querySelector('.news-article-template .details-sidebar .default-content-wrapper .button-container');
  const buttonDiv = div({ class: 'button-wrapper' });
  buttonDiv.append(viewMoreButton);
  const rightAlignSidebar = doc.querySelector('.news-article-template .details-sidebar.right');

  if (!newsDiv.classList.contains('right')) {
    // Fetch language-specific placeholders dynamically
    const placeholderSheet = `news-article-${language}-properties`;
    const placeholders = await fetchPlaceholders(placeholderSheet);

    const linksArray = links ? links.split(',').map((link) => link.trim()).filter(Boolean) : [];
    const { singleLink, multipleLinks } = placeholders;
    const linkLabel = linksArray.length > 1 ? multipleLinks : singleLink;

    // Build sidebar HTML (no language-specific if/else needed!)
    sidebar.innerHTML = `
      <div> ${linkLabel} </div>
      <div class="photos"> ${photosLabel} </div>
      <div class="author">${writtenByLabel}</div>
        ${author}
      <div> ${followUsLabel} </div>
    `;

    const link = a({ href: links }, links);
    const words = photos.trim().split(',');
    const photoList = ul();
    words.forEach((word) => {
      const listItem = li(word);
      photoList.appendChild(listItem);
    });
    const linkedin = a({ href: 'https://www.linkedin.com/company/audemars-piguet-foundations/', target: '_blank' }, '↳ LinkedIn');
    sidebar.insertBefore(link, sidebar.querySelector('.photos'));
    sidebar.insertBefore(photoList, sidebar.querySelector('.author'));
    sidebar.appendChild(linkedin);
    const articleContent = newsDiv.querySelector('.default-content-wrapper');

    // Get title using the new helper
    const heading = getLocalizedMetadata('title', 'newsArticle', doc);
    let title;
    if (heading) {
      title = h1(heading);
    }

    const newsDetails = div({ class: 'news-details' });
    const categorySection = div({ class: 'news-article-category' });
    const clearDiv = div({ class: 'clear' });

    // Get category and date using the new helper
    categorySection.textContent = getLocalizedMetadata('category', 'newsArticle', doc);
    const dateSection = div({ class: 'news-article-date' });
    dateSection.textContent = getLocalizedMetadata('date', 'newsArticle', doc);

    newsDetails.appendChild(categorySection);
    newsDetails.appendChild(dateSection);
    const innerDiv = div({ class: 'news-article-inner' });
    innerDiv.append(newsDetails, title, sidebar, articleContent, clearDiv);
    newsDiv.append(innerDiv, buttonDiv);
    articlecontentSection.append(carouselContainer, newsDiv);
    mainSection.append(articlecontentSection, featuredProject);
  } else if (rightAlignSidebar.classList.contains('right')) {
    // Build right-aligned sidebar (no language-specific if/else needed!)
    sidebar.innerHTML = `
      <div class="author">${writtenByLabel}</div>
        ${author}
      <div> ${followUsLabel} </div>
    `;
    const linkedin = a({ href: 'https://www.linkedin.com/company/audemars-piguet-foundations/', target: '_blank' }, '↳ LinkedIn');
    sidebar.appendChild(linkedin);
    const articleContent = newsDiv.querySelector('.default-content-wrapper');
    const clearDiv = div({ class: 'clear' });
    const innerDiv = div({ class: 'news-article-inner' });
    innerDiv.append(sidebar, articleContent, clearDiv);
    newsDiv.append(innerDiv, buttonDiv);
  }
  // Add a clear div after the first paragraph to ensure the second paragraph
  // remains in the float: right position for large screen sizes
  const textPara = doc.querySelector('.section.articlecontent-container + div .default-content-wrapper p:first-of-type');
  const clearDiv = div({ class: 'clear' });
  if (textPara) {
    textPara.insertAdjacentElement('afterend', clearDiv);
  }

  // Move text content and image content to be encased by different divs
  const whiteLilacSection = doc.querySelector('.section.articlecontent-container + div');
  const allParas = doc.querySelectorAll('.section.articlecontent-container + div div > p');
  const defaultDiv = doc.querySelector('.section.articlecontent-container + div div.default-content-wrapper');
  const ImageDiv = document.createElement('div');
  ImageDiv.className = 'image-wrapper';

  if (allParas && defaultDiv && whiteLilacSection) {
    defaultDiv.innerHTML = ''; // Clear the default content wrapper
    let numTextPara = 0;
    let numImagePara = 0;
    allParas.forEach((p) => {
      if (!p.querySelector('picture')) {
        defaultDiv.appendChild(p);
        numTextPara += 1;
      } else if (p.querySelector('picture')) {
        ImageDiv.appendChild(p);
        numImagePara += 1;
      }
    });
    if (numTextPara > 0) {
      whiteLilacSection.appendChild(defaultDiv);
      whiteLilacSection.appendChild(clearDiv.cloneNode());
    }
    if (numImagePara > 0) {
      whiteLilacSection.appendChild(ImageDiv);
      whiteLilacSection.appendChild(clearDiv.cloneNode());
    }
  }

  // apply fade out animation to news detail section
  const pictureEl = doc.querySelector('.section.articlecontent-container + div div.image-wrapper p picture');
  const imagePara = doc.querySelector('.section.articlecontent-container + div div.image-wrapper p');
  if (pictureEl && imagePara) {
    applyFadeUpAnimation(pictureEl, imagePara);
  }
}
