import { getMetadata } from '../../scripts/aem.js';
import { applyFadeUpAnimation } from '../../scripts/utils.js';
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
  const sidebar = div({ class: 'news-article-sidebar' });
  const language = getMetadata('language');
  const author = getMetadata('author');
  const newsDiv = doc.querySelector('.news-article-template .details-sidebar');
  const viewMoreButton = doc.querySelector('.news-article-template .details-sidebar .default-content-wrapper .button-container');
  const buttonDiv = div({ class: 'button-wrapper' });
  buttonDiv.append(viewMoreButton);
  const rightAlignSidebar = doc.querySelector('.news-article-template .details-sidebar.right');
  if (!newsDiv.classList.contains('right')) {
    if (language === 'en') {
      sidebar.innerHTML = `      
        <div> Link(s) </div>
        <div class="photos"> Photos </div>
        <div class="author">Written by</div>
          ${author}
        <div> Follow us </div>
      `;
    } else if (language === 'fr') {
      sidebar.innerHTML = `      
        <div> Lien(s) </div>
        <div class="photos"> Photos </div>
        <div class="author">Rédaction</div>
          ${author}
        <div> Nous suivre </div>
      `;
    }
    const links = getMetadata('links');
    const photos = getMetadata('photos');
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
    const heading = getMetadata('og:title');
    let title;
    if (heading) {
      title = h1(heading);
    }
    const newsDetails = div({ class: 'news-details' });
    const categorySection = div({ class: 'news-article-category' });
    const clearDiv = div({ class: 'clear' });
    categorySection.textContent = getMetadata('category');
    const dateSection = div({ class: 'news-article-date' });
    dateSection.textContent = getMetadata('date');
    newsDetails.appendChild(categorySection);
    newsDetails.appendChild(dateSection);
    const innerDiv = div({ class: 'news-article-inner' });
    innerDiv.append(newsDetails, title, sidebar, articleContent, clearDiv);
    newsDiv.append(innerDiv, buttonDiv);
  } else if (rightAlignSidebar.classList.contains('right')) {
    if (language === 'en') {
      sidebar.innerHTML = `
        <div class="author">Written by</div>
          ${author}
        <div> Follow us </div>
      `;
    } else if (language === 'fr') {
      sidebar.innerHTML = `
        <div class="author">Rédaction</div>
          ${author}
        <div> Nous suivre </div>
      `;
    }
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
  // const textPara = doc.querySelector('.section.white-lilac-bg .default-content-wrapper p:first-of-type');
  // const clearDiv = div({ class: 'clear' });
  // textPara.insertAdjacentElement('afterend', clearDiv);
  const lilacSection = doc.querySelector('.section.white-lilac-bg');
  if (lilacSection) {
    const wrapper = lilacSection.querySelector('.default-content-wrapper');
    if (wrapper) {
      const ps = Array.from(wrapper.querySelectorAll('p'));
      if (ps.length > 0) {
        // Create a div for news-content and move all ps except the last one into it
        const newsContentDiv = document.createElement('div');
        newsContentDiv.className = 'news-content';
        for (let i = 0; i < ps.length - 1; i += 1) {
          newsContentDiv.appendChild(ps[i]);
        }
        // Insert news-content div at the top of the wrapper
        if (ps.length > 1) {
          wrapper.insertBefore(newsContentDiv, ps[ps.length - 1]);
        } else {
          wrapper.insertBefore(newsContentDiv, ps[0]);
        }

        // Handle the last p: wrap in div with class news-gallery if it contains picture and img
        const lastP = ps[ps.length - 1];
        if (lastP && lastP.querySelector('picture img')) {
          const galleryDiv = document.createElement('div');
          galleryDiv.className = 'news-gallery';
          // Move all children of lastP into galleryDiv
          while (lastP.firstChild) {
            galleryDiv.appendChild(lastP.firstChild);
          }
          // Replace lastP in the DOM with galleryDiv
          lastP.parentNode.replaceChild(galleryDiv, lastP);
        }
      }
    }
  }

  // apply fade out animation to news detail section
  const pictureEl = doc.querySelector(
    '.section.white-lilac-bg .default-content-wrapper .news-gallery picture',
  );
  const imagePara = doc.querySelector(
    '.section.white-lilac-bg .default-content-wrapper .news-gallery',
  );
  applyFadeUpAnimation(pictureEl, imagePara);
}
