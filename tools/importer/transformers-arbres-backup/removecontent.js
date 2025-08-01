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

import { TransformHook } from './transform.js';

export default function transform(hookName, element, { document }) {
  if (hookName === TransformHook.beforePageTransform) {
    // List of CSS classes to remove from the document
    const listofClasses = [
      'detail_info',
      'news_projets_autre',
      'newsletter_bloc',
    ];

    listofClasses.forEach((className) => {
      // Use both element and document to ensure we catch all instances
      const classElements = document.querySelectorAll(`.${className}`);
      classElements.forEach((classElement) => {
        if (classElement) {
          console.log(`Removing element with class: ${className}`);
          classElement.remove();
        }
      });
    });

    // Handle news_detail more specifically - only remove if it doesn't contain metadata elements
    const newsDetailElements = document.querySelectorAll('.news_detail');
    newsDetailElements.forEach((newsDetailElement) => {
      // Check if this element contains metadata that metadataNews parser needs
      const hasMetadata = newsDetailElement.querySelector('.news_detail_cat, .news_detail_date, .news_detail_label');
      if (!hasMetadata) {
        console.log('Removing news_detail element without metadata:', newsDetailElement.className);
        newsDetailElement.remove();
      } else {
        console.log('Keeping news_detail element with metadata:', newsDetailElement.className);
        // Log what metadata elements are found
        const metadataElements = newsDetailElement.querySelectorAll('.news_detail_cat, .news_detail_date, .news_detail_label');
        metadataElements.forEach(el => {
          console.log('Found metadata element:', el.className, el.textContent?.trim());
        });
      }
    });
  }
} 