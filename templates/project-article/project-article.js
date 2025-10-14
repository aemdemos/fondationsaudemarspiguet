import { getMetadata, fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate() {
  const sidebar = document.createElement('div');
  sidebar.className = 'project-article-sidebar';
  const language = getMetadata('language');
  let placeholders;
  if (language === 'en') {
    placeholders = await fetchPlaceholders('project-article-en-properties');
  } else {
    placeholders = await fetchPlaceholders('project-article-fr-properties');
  }
  if (language === 'en') {
    const partner = getMetadata('partner');
    const category = getMetadata('category-ies-');
    const categoryArray = category ? category.split('|').map((link) => link.trim()).filter(Boolean) : [];
    const { singleCategory } = placeholders;
    const { multipleCategory } = placeholders;
    const categoryLabel = categoryArray.length > 1 ? multipleCategory : singleCategory;
    const duration = getMetadata('project-duration');
    const location = getMetadata('location-s-');
    const locationArray = location ? location.split('|').map((link) => link.trim()).filter(Boolean) : [];
    const { singleLocation } = placeholders;
    const { multipleLocation } = placeholders;
    const locationLabel = locationArray.length > 1 ? multipleLocation : singleLocation;
    const links = getMetadata('link-s-');
    const linksArray = links ? links.split(',').map((link) => link.trim()).filter(Boolean) : [];
    const { singleLink } = placeholders;
    const { multipleLinks } = placeholders;
    const linkLabel = linksArray.length > 1 ? multipleLinks : singleLink;
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
      <div> Partner </div>
        ${partner}
      <div> ${categoryLabel} </div>
        ${category}
      <div> Project duration </div>
        ${duration}
      <div> ${locationLabel} </div>
        ${location}
      <div> ${linkLabel} </div>
      <div class="photos"> Photos </div>
    `;
    sidebar.insertBefore(link, sidebar.querySelector('div:last-child'));
    sidebar.appendChild(photoList);
  } else if (language === 'fr') {
    const partner = getMetadata('partenaire');
    const category = getMetadata('axe-s-');
    const categoryArray = category ? category.split('|').map((link) => link.trim()).filter(Boolean) : [];
    const { singleCategory } = placeholders;
    const { multipleCategory } = placeholders;
    const categoryLabel = categoryArray.length > 1 ? multipleCategory : singleCategory;
    const duration = getMetadata('dur-e-du-projet');
    const location = getMetadata('lieu-x-');
    const locationArray = location ? location.split('|').map((link) => link.trim()).filter(Boolean) : [];
    const { singleLocation } = placeholders;
    const { multipleLocation } = placeholders;
    const locationLabel = locationArray.length > 1 ? multipleLocation : singleLocation;
    const links = getMetadata('lien-s-');
    const linksArray = links ? links.split(',').map((link) => link.trim()).filter(Boolean) : [];
    const { singleLink } = placeholders;
    const { multipleLinks } = placeholders;
    const linkLabel = linksArray.length > 1 ? multipleLinks : singleLink;
    const photos = getMetadata('photos');
    const words = photos.trim().split(/\s+/);
    const photoList = document.createElement('ul');
    for (let i = 0; i < words.length; i += 2) {
      const li = document.createElement('li');
      li.textContent = `${words[i]} ${words[i + 1] || ''}`.trim();
      photoList.appendChild(li);
    }
    // Handle multiple links
    const linksFragment = document.createDocumentFragment();
    linksArray.forEach((l) => {
      const link = document.createElement('a');
      link.href = l;
      link.textContent = l;
      linksFragment.appendChild(link);
      linksFragment.appendChild(document.createElement('br'));
    });
    sidebar.innerHTML = `
      <div> Partenaire </div>
        ${partner}
      <div> ${categoryLabel} </div>
        ${category}
      <div>Durée du projet </div>
        ${duration}
      <div> ${locationLabel} </div>
        ${location}
      <div> ${linkLabel} </div>
      <div class="photos"> Photos </div>
    `;
    sidebar.insertBefore(linksFragment, sidebar.querySelector('div:last-child'));
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
