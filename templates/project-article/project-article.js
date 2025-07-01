import {getMetadata } from '../../scripts/aem.js';
export default async function decorate() {
  const sidebar = document.createElement('div');
  sidebar.className = 'project-article-sidebar';
  const language = getMetadata('language');
  if (language === 'en') {
    let partner = getMetadata('partner');
    let category = getMetadata('category-ies-');
    let duration = getMetadata('project-duration');
    let location = getMetadata('location-s-');
    let links = getMetadata('link-s-');
    let photos = getMetadata('photos');
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
    let partner = getMetadata('partenaire');
    let category = getMetadata('axe-s-');
    let duration = getMetadata('dur-e-du-projet');
    let location = getMetadata('lieu-x-');
    let links = getMetadata('lien-s-');
    let photos = getMetadata('photos');
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
  const innerDiv = document.createElement('div');
  innerDiv.className = 'project-article-inner';
  innerDiv.appendChild(heading);
  innerDiv.appendChild(sidebar);
  innerDiv.appendChild(articleContent);
  projectDiv.appendChild(innerDiv);
}