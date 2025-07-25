import { div } from '../../scripts/dom-helpers.js';
import { createOptimizedPicture, getMetadata } from '../../scripts/aem.js';
import { applyFadeUpAnimation } from '../../scripts/utils.js';

export default function decorate(block) {
  const mainContent = div(
    { class: 'news-detail-big-content-1' },
    div(
      { class: 'inside-middle' },
      div({ class: 'news-links' }),
      div({ class: 'news-photos' }),
    ),
    div({ class: 'news-detail-big-galerie-1' }),
  );
  const rightContent = div({ class: 'news-detail-big-contenu-right' });

  // Get metadata
  const links = getMetadata('links')?.split(',').map((link) => `<a href="${link.trim()}">${link.trim()}</a>`).join('<br>');
  const photos = getMetadata('photos');

  // Set metadata content
  if (links) {
    const linksDiv = mainContent.querySelector('.news-links');
    linksDiv.innerHTML = `<div>Link(s)</div>${links}`;
  }
  if (photos) {
    const photosDiv = mainContent.querySelector('.news-photos');
    photosDiv.innerHTML = `<div>Photos</div>${photos}`;
  }

  // Transfer content from block to the new structure
  const contentRows = [...block.children];
  if (contentRows.length > 0) {
    const firstRow = contentRows[0];
    const subChildren = [...firstRow.children];

    // Handle first sub-child (text content)
    if (subChildren.length > 0) {
      const textContent = subChildren[0];
      if (textContent) {
        const middleDiv = mainContent.querySelector('.inside-middle');
        // Insert text content before the metadata sections
        const linksDiv = middleDiv.querySelector('.news-links');
        middleDiv.insertBefore(textContent.cloneNode(true), linksDiv);
      }
    }

    // Handle second sub-child (image)
    if (subChildren.length > 1) {
      const imageContent = subChildren[1];
      const img = imageContent.querySelector('img');
      if (img) {
        const pictureElement = createOptimizedPicture(img.src);
        const pictureContainer = mainContent.querySelector('.news-detail-big-galerie-1');
        applyFadeUpAnimation(pictureElement, pictureContainer);
      }
    }

    // Handle right content if it exists
    if (contentRows.length > 1) {
      const rightContentRow = contentRows[1].querySelector('div');
      if (rightContentRow) {
        rightContent.innerHTML = rightContentRow.innerHTML;
      }
    }
  }

  // Clear and append the new structure
  block.textContent = '';
  block.append(mainContent, rightContent);
}
