/* global WebImporter */
/**
 * Parser for project metadata
 * Extracts project-specific metadata from detail info and OG tags
 */
export default function parse(element, { document }) {
  const meta = {};

  // Extract OG title and description
  const title = document.querySelector('[property="og:title"]');
  if (title) {
    meta.Title = title.content;
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  // Extract project detail information from detail_info
  const detailInfo = document.querySelector('.projets_detail_container .detail_info');
  if (detailInfo) {
    const labels = detailInfo.querySelectorAll('.projets_detail_label');
    labels.forEach(label => {
      const labelText = label.textContent.trim();
      let nextNode = label.nextSibling;
      let value = '';
      
      // Collect text until we hit the next label or end of container
      while (nextNode && !nextNode.classList?.contains('projets_detail_label')) {
        if (nextNode.nodeType === Node.TEXT_NODE) {
          value += nextNode.textContent.trim();
        } else if (nextNode.nodeType === Node.ELEMENT_NODE) {
          if (nextNode.tagName === 'A') {
            value += nextNode.href || nextNode.textContent.trim();
          } else if (nextNode.tagName === 'BR') {
            value += ' ';
          } else {
            value += nextNode.textContent.trim();
          }
        }
        nextNode = nextNode.nextSibling;
      }
      
      if (labelText && value.trim()) {
        meta[labelText] = value.trim();
      }
    });
    
    // Remove the detail_info element after extracting metadata to prevent duplication
    detailInfo.remove();
  }

  // Handle the image from hero block
  const heroImg = document.querySelector('.projets_detail_hero img');
  if (heroImg) {
    const imgElement = document.createElement('img');
    imgElement.src = heroImg.src;
    imgElement.alt = heroImg.alt || meta.Title || 'Project image';
    meta.Image = imgElement;
  }

  // Create and append the metadata block
  const metadataBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
  element.append(metadataBlock);
  
  return meta;
} 