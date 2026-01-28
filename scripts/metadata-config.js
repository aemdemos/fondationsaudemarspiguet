/**
 * Metadata field mappings for different languages
 *
 * Structure:
 * {
 *   templateType: {
 *     language: {
 *       logicalFieldName: 'actual-metadata-key'
 *     }
 *   }
 * }
 *
 * To add a new language: Add a new language key (e.g., 'de', 'es') with field mappings
 * To add a new field: Add the field to all language blocks
 * To add a new template: Add a new top-level key with language mappings
 */

const METADATA_MAPS = {
  // News Article Template Metadata
  // Note: News articles use the same metadata keys for both EN and FR
  newsArticle: {
    en: {
      links: 'links',
      author: 'author',
      photos: 'photos',
      title: 'og:title',
      category: 'category',
      date: 'date',
      language: 'language',
    },
    fr: {
      links: 'links',
      author: 'author',
      photos: 'photos',
      title: 'og:title',
      category: 'category',
      date: 'date',
      language: 'language',
    },
  },

  // Project Article Template Metadata
  projectArticle: {
    en: {
      partner: 'partner',
      category: 'category-ies-',
      duration: 'project-duration',
      location: 'location-s-',
      links: 'link-s-',
      photos: 'photos',
      language: 'language',
    },
    fr: {
      partner: 'partenaire',
      category: 'axe-s-',
      duration: 'dur-e-du-projet',
      location: 'lieu-x-',
      links: 'lien-s-',
      photos: 'photos',
      language: 'language',
    },
  },
};

/**
 * UI Labels for different templates and languages
 * These are static labels used in the UI (not from metadata)
 */
const UI_LABELS = {
  newsArticle: {
    en: {
      photos: 'Photos',
      writtenBy: 'Written by',
      followUs: 'Follow us',
    },
    fr: {
      photos: 'Photos',
      writtenBy: 'Rédaction',
      followUs: 'Nous suivre',
    },
  },
  projectArticle: {
    en: {
      partner: 'Partner',
      projectDuration: 'Project duration',
      photos: 'Photos',
    },
    fr: {
      partner: 'Partenaire',
      projectDuration: 'Durée du projet',
      photos: 'Photos',
    },
  },
};

/**
 * Get the metadata key for a given field name and template type
 * @param {string} fieldName - Logical field name (e.g., 'partner', 'category')
 * @param {string} templateType - Template type (e.g., 'newsArticle', 'projectArticle')
 * @param {string} language - Language code (e.g., 'en', 'fr')
 * @returns {string|null} The metadata key or null if not found
 */
export function getMetadataKey(fieldName, templateType, language) {
  return METADATA_MAPS[templateType]?.[language]?.[fieldName] || null;
}

/**
 * Get all metadata keys for a template type and language
 * @param {string} templateType - Template type (e.g., 'newsArticle', 'projectArticle')
 * @param {string} language - Language code (e.g., 'en', 'fr')
 * @returns {object} Object containing all field mappings for the template/language
 */
export function getTemplateMetadataMap(templateType, language) {
  return METADATA_MAPS[templateType]?.[language] || {};
}

/**
 * Get UI label for a template type and language
 * @param {string} labelKey - Label key (e.g., 'photos', 'writtenBy', 'partner')
 * @param {string} templateType - Template type (e.g., 'newsArticle', 'projectArticle')
 * @param {string} language - Language code (e.g., 'en', 'fr')
 * @returns {string} The UI label or the key itself if not found
 */
export function getUILabel(labelKey, templateType, language) {
  return UI_LABELS[templateType]?.[language]?.[labelKey] || labelKey;
}

/**
 * Get all UI labels for a template type and language
 * @param {string} templateType - Template type (e.g., 'newsArticle', 'projectArticle')
 * @param {string} language - Language code (e.g., 'en', 'fr')
 * @returns {object} Object containing all UI labels for the template/language
 */
export function getAllUILabels(templateType, language) {
  return UI_LABELS[templateType]?.[language] || {};
}

/**
 * Check if a template type exists in the configuration
 * @param {string} templateType - Template type to check
 * @returns {boolean} True if template type exists
 */
export function hasTemplateType(templateType) {
  return !!METADATA_MAPS[templateType];
}

/**
 * Get all supported languages for a template type
 * @param {string} templateType - Template type
 * @returns {string[]} Array of language codes
 */
export function getSupportedLanguages(templateType) {
  return METADATA_MAPS[templateType] ? Object.keys(METADATA_MAPS[templateType]) : [];
}

export default METADATA_MAPS;
