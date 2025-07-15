import { getMetadata } from '../../scripts/aem.js';

export default async function decorate() {
  const sidebar = document.createElement('div');
  sidebar.className = 'project-article-sidebar';
  const language = getMetadata('language');
  if (language === 'en') {
    const partner = getMetadata('partner');
    const category = getMetadata('category-ies-');
    const duration = getMetadata('project-duration');
    const location = getMetadata('location-s-');
    const links = getMetadata('link-s-');
    const photos = getMetadata('photos');
    const words = photos.trim().split(/\s+/);
    const photoList = document.createElement('ul');
    for (let i = 0; i < words.length; i += 2) {
      const li = document.createElement('li');
      li.textContent = `${words[i]} ${words[i + 1] || ''}`.trim();
      photoList.appendChild(li);
    }
    const link = document.createElement('a');
    link.href = links;
    link.textContent = links;
    sidebar.innerHTML = `
      <div> partner </div>
        ${partner}
      <div> Categories </div>
        ${category}
      <div>Project Duration </div>
        ${duration}
      <div> Location </div>
        ${location}
      <div> Link(s) </div>
      <div class="photos"> Photos </div>
    `;
    sidebar.insertBefore(link, sidebar.querySelector('div:last-child'));
    sidebar.appendChild(photoList);
  } else if (language === 'fr') {
    const partner = getMetadata('partenaire');
    const category = getMetadata('axe-s-');
    const duration = getMetadata('dur-e-du-projet');
    const location = getMetadata('lieu-x-');
    const links = getMetadata('lien-s-');
    const photos = getMetadata('photos');
    const words = photos.trim().split(/\s+/);
    const photoList = document.createElement('ul');
    for (let i = 0; i < words.length; i += 2) {
      const li = document.createElement('li');
      li.textContent = `${words[i]} ${words[i + 1] || ''}`.trim();
      photoList.appendChild(li);
    }
    const link = document.createElement('a');
    link.href = links;
    link.textContent = links;
    sidebar.innerHTML = `
      <div> Partenaire </div>
        ${partner}
      <div> Axe(s) </div>
        ${category}
      <div>Durée du projet </div>
        ${duration}
      <div> Lieu(x) </div>
        ${location}
      <div> Lien(s) </div>
      <div class="photos"> Photos </div>
    `;
    sidebar.insertBefore(link, sidebar.querySelector('div:last-child'));
    sidebar.appendChild(photoList);
  }
  const projectDiv = document.querySelector('.project-article-template .details-sidebar');
  const articleContent = projectDiv.querySelector('.default-content-wrapper');
  const heading = projectDiv.querySelector('.default-content-wrapper h1');
  const clearDiv = document.createElement('div');
  clearDiv.className = 'clear';
  const innerDiv = document.createElement('div');
  innerDiv.className = 'project-article-inner';
  innerDiv.append(heading, sidebar, articleContent, clearDiv);
  projectDiv.appendChild(innerDiv);
}
