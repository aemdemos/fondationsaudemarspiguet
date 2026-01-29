/**
 * Metadata API - Functions to access metadata configuration
 *
 * This file contains all the logic for working with metadata.
 * Configuration data is imported from config.js
 */

import {
  SUPPORTED_LANGUAGES,
  SHARED_FIELDS,
  SHARED_LABELS,
  TEMPLATES,
} from './config.js';

// Compose shared and template-specific resources
function getTemplateConfig(templateType) {
  const template = TEMPLATES[templateType];
  if (!template) return null;

  return {
    fields: { ...SHARED_FIELDS, ...template.fields },
    labels: { ...SHARED_LABELS, ...template.labels },
  };
}

const metadataMapCache = new Map();

/**
 * Get metadata key for a field
 * @param {string} fieldName - Field name (e.g., 'partner', 'category')
 * @param {string} templateType - Template type (e.g., 'newsArticle', 'projectArticle')
 * @param {string} language - Language code (e.g., 'en', 'fr')
 * @returns {string|null} Metadata key or null
 */
export function getMetadataKey(fieldName, templateType, language) {
  const config = getTemplateConfig(templateType);
  const field = config?.fields?.[fieldName];
  if (!field) return null;

  return field.overrides?.[language] || field.base;
}

/**
 * Get all metadata keys for a template
 * @param {string} templateType - Template type (e.g., 'newsArticle', 'projectArticle')
 * @param {string} language - Language code (e.g., 'en', 'fr')
 * @returns {object} All field mappings for the template/language
 */
export function getTemplateMetadataMap(templateType, language) {
  const cacheKey = `${templateType}:${language}`;

  if (metadataMapCache.has(cacheKey)) {
    return metadataMapCache.get(cacheKey);
  }

  const config = getTemplateConfig(templateType);
  const fields = config?.fields || {};
  const result = {};

  Object.keys(fields).forEach((fieldName) => {
    result[fieldName] = getMetadataKey(fieldName, templateType, language);
  });

  metadataMapCache.set(cacheKey, result);
  return result;
}

/**
 * Get UI label (fallback to English if missing)
 * @param {string} labelKey - Label key (e.g., 'photos', 'writtenBy', 'partner')
 * @param {string} templateType - Template type (e.g., 'newsArticle', 'projectArticle')
 * @param {string} language - Language code (e.g., 'en', 'fr')
 * @returns {string} UI label or key if not found
 */
export function getUILabel(labelKey, templateType, language) {
  const config = getTemplateConfig(templateType);
  const label = config?.labels?.[labelKey]?.[language];

  if (!label) {
    const fallback = config?.labels?.[labelKey]?.en;
    if (fallback && language !== 'en' && typeof window !== 'undefined') {
      window.console.warn(`Missing ${language} translation for ${templateType}.${labelKey}, using English`);
    }
    return fallback || labelKey;
  }

  return label;
}

/**
 * Check if template exists
 * @param {string} templateType - Template type to check
 * @returns {boolean} True if exists
 */
export function hasTemplateType(templateType) {
  return !!TEMPLATES[templateType];
}

/**
 * Get supported languages
 * @returns {string[]} Language codes
 */
export function getSupportedLanguages() {
  return [...SUPPORTED_LANGUAGES];
}

/**
 * Validate configuration for missing translations
 * @returns {string[]} Error messages (empty if valid)
 */
export function validateConfiguration() {
  const errors = [];

  Object.keys(TEMPLATES).forEach((templateType) => {
    const config = getTemplateConfig(templateType);
    const { labels } = config;

    Object.entries(labels || {}).forEach(([labelKey, translations]) => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        if (!translations[lang]) {
          errors.push(`Missing ${lang} translation for ${templateType}.${labelKey}`);
        }
      });
    });
  });

  return errors;
}
