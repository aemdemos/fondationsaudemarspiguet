/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */

function isDate(str) {
    if (typeof str !== 'string') return false;
    const date = new Date(str);
    return !Number.isNaN(Number(date));
  }
  
  /**
   * Parse the document for metadata cell values.
   *
   * @param {HTMLElement} element The root query element.
   * @param {Object} props Additional parse function props.
   */
export default function parse(element, { document }) {
    const meta = WebImporter.Blocks.getMetadata(document) || {};

    // The below one's are for the News articles page
    const newsCategoryRawText = document.querySelector('.news_detail_cat')?.textContent.trim();
    if (newsCategoryRawText) {
        const formattedText = newsCategoryRawText?.split('|').map(t => t.trim()).join(', ');
        meta.Category = formattedText;
    }

    const newsDate = document.querySelector('.news_detail_date')?.textContent.trim();
    if (newsDate) {
        meta.Date = newsDate;
    }

    const allNewsLabels = document.querySelectorAll('.news_detail_label');

    allNewsLabels.forEach(label => {
        const labelText = label.textContent.trim();
      
        if (labelText === 'Link(s)' || labelText === 'Lien(s)') {
          const links = [];
          let currentNode = label.nextElementSibling;
      
          while (currentNode) {
            if (currentNode.nodeType === 1 && currentNode.tagName === 'A' && currentNode.classList.contains('link_black')) {
              links.push(currentNode.href);
            } else if (currentNode.nodeType === 1 && currentNode.classList.contains('news_detail_label')) {
              // Stop at the next label
              break;
            }
            currentNode = currentNode.nextSibling;
          }
      
          meta.links = links.join(', ');
      
        } else if (labelText === 'Photos') {
          const photoNames = [];
          let currentNode = label.nextSibling;
      
          while (currentNode) {
            if (currentNode.nodeType === 3) {
              // Text node
              const text = currentNode.textContent.trim();
              if (text) photoNames.push(text);
            } else if (currentNode.nodeType === 1) {
              if (currentNode.tagName === 'BR') {
                // Just skip <br>
              } else if (currentNode.classList.contains('news_detail_label')) {
                break; // stop at next label
              }
            }
            currentNode = currentNode.nextSibling;
          }
      
          meta.photos = photoNames.join(', ');
        } else if (labelText === 'Written by' || labelText === 'Rédaction') {
            const textNode = label.nextSibling;
            if (textNode && textNode.nodeType === 3) { // 3 = Text Node
                meta.Author = textNode.textContent.trim();
            }
        }
      });
    
    // The below one's are for the Project articles page
    const allLabels = document.querySelectorAll('.projets_detail_label');

    if (allLabels) {
        allLabels.forEach(label => {
            if (label.textContent.trim() === 'Category(ies)') {
                const nextNode = label.nextSibling;
                if (nextNode && nextNode.nodeType === 3) { // 3 = Text Node
                    const projectCategoryRawText = nextNode.textContent.trim();
                    meta.Category = projectCategoryRawText?.split('|').map(t => t.trim()).join(', ');
                }
            } else if (label.textContent.trim() === 'Project duration') {
                const nextNode = label.nextSibling;
                if (nextNode && nextNode.nodeType === 3) { // 3 = Text Node
                    meta.Date = nextNode.textContent.trim();
                }
            } else if (label.textContent.trim() === 'Location(s)') {
                const nextNode = label.nextSibling;
                if (nextNode && nextNode.nodeType === 3) { // 3 = Text Node
                    meta.Locations = nextNode.textContent.trim();
                }
            }
        });  
    }

    Object.entries(meta).forEach(([key, value]) => {
      // use first image
      if (key === 'Image') {
        const [img1] = value.src.split(',');
        // eslint-disable-next-line no-param-reassign
        value.src = img1;
      }
      // convert dates
      if (isDate(value)) {
        meta[key] = new Date(value).toISOString().slice(0, 10);
      }
    });
    // create the block
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'Metadata',
      cells: meta,
    });
    element.append(block);
  }
  