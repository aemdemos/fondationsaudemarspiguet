import { getMetadata, fetchPlaceholders } from '../../scripts/aem.js';
import { getLocalizedMetadata, getLocalizedUILabel } from '../../scripts/utils.js';

export default async function decorate() {
  const sidebar = document.createElement('div');
  sidebar.className = 'project-article-sidebar';

  // Get language and fetch placeholders dynamically
  const language = getMetadata('language');
  const placeholderSheet = `projects-article-${language}-properties`;
  const placeholders = await fetchPlaceholders(placeholderSheet);

  // Get all metadata using the new helper function
  const partner = getLocalizedMetadata('partner', 'projectArticle');
  const category = getLocalizedMetadata('category', 'projectArticle');
  const duration = getLocalizedMetadata('duration', 'projectArticle');
  const location = getLocalizedMetadata('location', 'projectArticle');
  const links = getLocalizedMetadata('links', 'projectArticle');
  const photos = getLocalizedMetadata('photos', 'projectArticle');

  // Get UI labels (no if/else needed!)
  const partnerLabel = getLocalizedUILabel('partner', 'projectArticle');
  const durationLabel = getLocalizedUILabel('projectDuration', 'projectArticle');
  const photosLabel = getLocalizedUILabel('photos', 'projectArticle');

  // Process arrays for plural/singular labels
  const categoryArray = category ? category.split('|').map((link) => link.trim()).filter(Boolean) : [];
  const { singleCategory, multipleCategory } = placeholders;
  const categoryLabel = categoryArray.length > 1 ? multipleCategory : singleCategory;

  const locationArray = location ? location.split('|').map((link) => link.trim()).filter(Boolean) : [];
  const { singleLocation, multipleLocation } = placeholders;
  const locationLabel = locationArray.length > 1 ? multipleLocation : singleLocation;

  const linksArray = links ? links.split(',').map((link) => link.trim()).filter(Boolean) : [];
  const { singleLink, multipleLinks } = placeholders;
  const linkLabel = linksArray.length > 1 ? multipleLinks : singleLink;

  // Create photo list
  const words = photos.trim().split(/\s+/);
  const photoList = document.createElement('ul');
  for (let i = 0; i < words.length; i += 2) {
    const li = document.createElement('li');
    li.textContent = `${words[i]} ${words[i + 1] || ''}`.trim();
    photoList.appendChild(li);
  }

  // Create link element
  const link = document.createElement('a');
  link.href = links;
  link.textContent = links;

  // Build sidebar HTML (no language-specific if/else needed!)
  sidebar.innerHTML = `
    <div> ${partnerLabel} </div>
      ${partner}
    <div> ${categoryLabel} </div>
      ${category}
    <div> ${durationLabel} </div>
      ${duration}
    <div> ${locationLabel} </div>
      ${location}
    <div> ${linkLabel} </div>
    <div class="photos"> ${photosLabel} </div>
  `;

  sidebar.insertBefore(link, sidebar.querySelector('div:last-child'));
  sidebar.appendChild(photoList);

  const projectDiv = document.querySelector('.project-article-template .details-sidebar');
  const articleContent = projectDiv.querySelector('.default-content-wrapper');
  const heading = projectDiv.querySelector('.default-content-wrapper h1');
  const clearDiv = document.createElement('div');
  clearDiv.className = 'clear';
  const innerDiv = document.createElement('div');
  innerDiv.className = 'project-article-inner';
  innerDiv.append(...[heading, sidebar, articleContent, clearDiv].filter(Boolean));
  projectDiv.appendChild(innerDiv);
}
