import { getMetadata } from '../../scripts/aem.js';

export default function enableAnimationOnScroll() {
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

export async function decorate() {
  const sidebar = document.createElement('div');
  sidebar.className = 'news-article-sidebar';
  const language = getMetadata('language');
  const author = getMetadata('author');
  const newsDiv = document.querySelector('.news-article-template .details-sidebar')
  const right_align_sidebar = document.querySelector('.news-article-template .details-sidebar.right')
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
    const link = document.createElement('a');
    link.href = links;
    link.textContent = links;
    const words = photos.trim().split(',');
    const photoList = document.createElement('ul');
    for (let i = 0; i < words.length; i += 1) {
      const li = document.createElement('li');
      li.textContent = `${words[i]}`
      photoList.appendChild(li);
    }
    const linkedin = document.createElement('a');
    linkedin.href = 'https://www.linkedin.com/company/audemars-piguet-foundations/';
    linkedin.textContent = '↳ LinkedIn';
    linkedin.target = '_blank';
    sidebar.insertBefore(link, sidebar.querySelector('.photos'));
    sidebar.insertBefore(photoList, sidebar.querySelector('.author'));
    sidebar.appendChild(linkedin);
    const articleContent = newsDiv.querySelector('.default-content-wrapper');
    const heading = getMetadata('og:title');
    let h1;
    if (heading) {
      h1 = document.createElement('h1');
      h1.textContent = heading;
    }
    const newsDetails = document.createElement('div');
    newsDetails.className = 'news-details';
    const categorySection = document.createElement('div');
    const clearDiv = document.createElement('div');
    clearDiv.className = 'clear';
    categorySection.className = 'news-article-category';
    categorySection.textContent = getMetadata('category');
    const dateSection = document.createElement('div');
    dateSection.className = 'news-article-date';
    dateSection.textContent = getMetadata('date');
    newsDetails.appendChild(categorySection);
    newsDetails.appendChild(dateSection);
    const innerDiv = document.createElement('div');
    innerDiv.className = 'news-article-inner';
    innerDiv.appendChild(newsDetails);
    innerDiv.appendChild(h1);
    innerDiv.appendChild(sidebar);
    innerDiv.appendChild(articleContent);
    innerDiv.appendChild(clearDiv);
    newsDiv.appendChild(innerDiv);

  } else if (right_align_sidebar.classList.contains('right')) {
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
  const linkedin = document.createElement('a');
  linkedin.href = 'https://www.linkedin.com/company/audemars-piguet-foundations/';
  linkedin.textContent = '↳ LinkedIn';
  linkedin.target = '_blank';
  sidebar.appendChild(linkedin);
  const articleContent = newsDiv.querySelector('.default-content-wrapper');
  const heading = getMetadata('og:title');
  let h1;
  if (heading) {
    h1 = document.createElement('h1');
    h1.textContent = heading;
  }
  const newsDetails = document.createElement('div');
  newsDetails.className = 'news-details';
  const clearDiv = document.createElement('div');
  clearDiv.className = 'clear';
  const innerDiv = document.createElement('div');
  innerDiv.className = 'news-article-inner';
  innerDiv.appendChild(newsDetails);
  innerDiv.appendChild(h1);
  innerDiv.appendChild(sidebar);
  innerDiv.appendChild(articleContent);
  innerDiv.appendChild(clearDiv);
  newsDiv.appendChild(innerDiv);
  }
}
decorate();