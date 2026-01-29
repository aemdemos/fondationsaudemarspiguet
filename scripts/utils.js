import { div } from './dom-helpers.js';
import { getMetadata } from './aem.js';
import {
  getMetadataKey, getTemplateMetadataMap, getUILabel,
} from './metadata/api.js';

/**
 * Get localized metadata value for a field
 * @param {string} fieldName - Field name (e.g., 'partner', 'category')
 * @param {string} templateType - Template type (e.g., 'newsArticle', 'projectArticle')
 * @param {Document} doc - Document object (optional)
 * @returns {string} Metadata value or empty string
 */
export function getLocalizedMetadata(fieldName, templateType, doc = document) {
  const language = getMetadata('language', doc) || 'en';
  const metadataKey = getMetadataKey(fieldName, templateType, language);

  if (!metadataKey) {
    return getMetadata(fieldName, doc);
  }

  return getMetadata(metadataKey, doc);
}

/**
 * Get multiple localized metadata values
 * @param {string[]} fieldNames - Array of field names
 * @param {string} templateType - Template type
 * @param {Document} doc - Document object (optional)
 * @returns {object} Object with field names and values
 */
export function getLocalizedMetadataMultiple(fieldNames, templateType, doc = document) {
  const result = {};
  fieldNames.forEach((fieldName) => {
    result[fieldName] = getLocalizedMetadata(fieldName, templateType, doc);
  });
  return result;
}

/**
 * Get all metadata for a template
 * @param {string} templateType - Template type
 * @param {Document} doc - Document object (optional)
 * @returns {object} All field names and values
 */
export function getAllLocalizedMetadata(templateType, doc = document) {
  const language = getMetadata('language', doc) || 'en';
  const metadataMap = getTemplateMetadataMap(templateType, language);

  const result = {};
  Object.keys(metadataMap).forEach((fieldName) => {
    result[fieldName] = getLocalizedMetadata(fieldName, templateType, doc);
  });

  return result;
}

/**
 * Get localized UI label
 * @param {string} labelKey - Label key (e.g., 'photos', 'writtenBy')
 * @param {string} templateType - Template type
 * @param {Document} doc - Document object (optional)
 * @returns {string} Localized UI label
 */
export function getLocalizedUILabel(labelKey, templateType, doc = document) {
  const language = getMetadata('language', doc) || 'en';
  return getUILabel(labelKey, templateType, language);
}

export function getPathSegments() {
  return window.location.pathname.split('/')
    .filter((segment) => segment);
}

export function applyFadeUpAnimation(targetElement, parentContainer) {
  const isBanner = targetElement.classList.contains('horizontal-banner');

  const targetWrapper = div({ class: 'image-fade-wrapper' });
  targetWrapper.style.opacity = '0';
  targetWrapper.style.transform = 'translateY(100px)';
  targetWrapper.style.transition = 'opacity 1.5s ease-out, transform 1.5s ease-out';
  if (isBanner) {
    targetWrapper.classList.add('horizontal-banner');
  }
  targetWrapper.append(targetElement);
  parentContainer.append(targetWrapper);

  // Track scroll direction to prevent flickering
  let lastScrollY = window.scrollY;

  // Trigger fade-up animation when element comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;

      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      } else if (!scrollingDown) {
        // Only reset animation when scrolling up and element goes out of view
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(100px)';
      }

      lastScrollY = currentScrollY;
    });
  }, { threshold: 0.1 });

  observer.observe(targetWrapper);
}

// Apply fade-up animation to split-fade sections on fondations site
function applyFadeUpAnimationSplitFade() {
  const splitFadeSections = document.querySelectorAll('.section.fade-up');
  splitFadeSections.forEach((section) => {
    const imageElement = section.querySelector('picture');
    const parentContainer = section.querySelector('p:last-of-type');

    // Only apply animation if both elements exist within this section
    if (imageElement && parentContainer) {
      applyFadeUpAnimation(imageElement, parentContainer);
    }
  });
}

// Wait for DOM to be ready and then try with a small delay
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(applyFadeUpAnimationSplitFade, 50);
  });
} else {
  setTimeout(applyFadeUpAnimationSplitFade, 50);
}

export function decorateListingCards(doc) {
  const contentDivs = doc.querySelectorAll('.section.float-right .default-content-wrapper');
  contentDivs.forEach((contentDiv) => {
    const containerCol = div({ class: 'container-col' });
    const clearDiv = div({ class: 'clear' });
    const clearDivInner = div({ class: 'clear' });
    const headingWrapper = div({ class: 'heading-wrapper' });
    const contentWrapper = div({ class: 'content-wrapper' });
    const children = Array.from(contentDiv.children);
    children.forEach((child) => {
      if (child.tagName === 'H1' || child.tagName === 'H2') {
        headingWrapper.appendChild(child);
      } else {
        contentWrapper.appendChild(child);
      }
    });
    contentWrapper.appendChild(clearDivInner);
    containerCol.append(headingWrapper, contentWrapper, clearDiv);
    contentDiv.append(containerCol);
  });
}

export function setInputWidthToText(inputEl) {
  const textToMeasure = inputEl.value || inputEl.placeholder;
  const spanForWidth = document.createElement('span');
  const style = getComputedStyle(inputEl);
  spanForWidth.style.font = style.font;
  spanForWidth.style.letterSpacing = style.letterSpacing;
  spanForWidth.style.whiteSpace = 'pre';
  spanForWidth.style.position = 'absolute';
  spanForWidth.style.visibility = 'hidden';
  spanForWidth.textContent = textToMeasure;
  document.body.appendChild(spanForWidth);
  const width = spanForWidth.offsetWidth;
  spanForWidth.remove();
  inputEl.style.width = `${width + 10}px`;
}

export async function setClassDataBg() {
  try {
    const response = await fetch('/.da/library/blocks.json');
    if (!response.ok) {
      return null;
    }

    const jsonData = await response.json();

    const backgroundOption = jsonData.options?.data?.find(
      (item) => item.key === 'background',
    );

    if (!backgroundOption || !backgroundOption.values) {
      return null;
    }

    const backgroundValues = {};
    const valuesString = backgroundOption.values;

    const valuesList = valuesString.split('|').map((val) => val.trim());

    valuesList.forEach((valueItem) => {
      const [name, colorCode] = valueItem.split('=');
      if (name && colorCode) {
        backgroundValues[name.trim()] = colorCode.trim();
      }
    });

    return backgroundValues;
  } catch (error) {
    return null;
  }
}

export async function applySectionBackgrounds() {
  try {
    const backgroundValues = await setClassDataBg();
    if (!backgroundValues) {
      return;
    }

    // Find all divs with class "section" that have "data-background" attribute
    const sectionsWithDataBackground = document.querySelectorAll('.section[data-background]');

    sectionsWithDataBackground.forEach((sectionDiv) => {
      const dataBackgroundValue = sectionDiv.getAttribute('data-background');
      if (!dataBackgroundValue) return;

      // Find matching background value in our backgroundValues object
      const matchingKey = Object.keys(backgroundValues).find(
        (key) => backgroundValues[key] === dataBackgroundValue,
      );

      if (matchingKey && !sectionDiv.classList.contains(matchingKey)) {
        sectionDiv.classList.add(matchingKey);
      }
    });
  } catch (error) {
    // Silent error handling
  }
}
