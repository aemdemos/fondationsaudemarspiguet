/**
 * Metadata configuration for multi-language templates
 *
 * How to add a new language:
 * 1. Add language code to SUPPORTED_LANGUAGES
 * 2. Add translations to SHARED_LABELS and template-specific labels
 * 3. Add field overrides (only if metadata key differs from base)
 *
 * How to add a new template:
 * 1. Add entry to TEMPLATES object
 * 2. Define unique fields and labels (shared ones auto-included)
 */

// ==================== CONFIGURATION ====================

const SUPPORTED_LANGUAGES = ['en', 'fr'];

const SHARED_FIELDS = {
  photos: { base: 'photos' },
  language: { base: 'language' },
};

const SHARED_LABELS = {
  photos: {
    en: 'Photos',
    fr: 'Photos',
  },
};

const TEMPLATES = {
  newsArticle: {
    fields: {
      links: { base: 'links' },
      author: { base: 'author' },
      title: { base: 'og:title' },
      category: { base: 'category' },
      date: { base: 'date' },
    },
    labels: {
      writtenBy: {
        en: 'Written by',
        fr: 'Rédaction',
      },
      followUs: {
        en: 'Follow us',
        fr: 'Nous suivre',
      },
    },
  },

  projectArticle: {
    fields: {
      partner: {
        base: 'partner',
        overrides: { fr: 'partenaire' },
      },
      category: {
        base: 'category-ies-',
        overrides: { fr: 'axe-s-' },
      },
      duration: {
        base: 'project-duration',
        overrides: { fr: 'dur-e-du-projet' },
      },
      location: {
        base: 'location-s-',
        overrides: { fr: 'lieu-x-' },
      },
      links: {
        base: 'link-s-',
        overrides: { fr: 'lien-s-' },
      },
    },
    labels: {
      partner: {
        en: 'Partner',
        fr: 'Partenaire',
      },
      projectDuration: {
        en: 'Project duration',
        fr: 'Durée du projet',
      },
    },
  },
};

// ==================== INTERNAL HELPERS ====================

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
const uiLabelsCache = new Map();

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
    if (fallback && language !== 'en') {
      // eslint-disable-next-line no-console
      console.warn(`Missing ${language} translation for ${templateType}.${labelKey}, using English`);
    }
    return fallback || labelKey;
  }

  return label;
}

/**
 * Get all UI labels for a template
 * @param {string} templateType - Template type (e.g., 'newsArticle', 'projectArticle')
 * @param {string} language - Language code (e.g., 'en', 'fr')
 * @returns {object} All UI labels for the template/language
 */
export function getAllUILabels(templateType, language) {
  const cacheKey = `${templateType}:${language}:labels`;

  if (uiLabelsCache.has(cacheKey)) {
    return uiLabelsCache.get(cacheKey);
  }

  const config = getTemplateConfig(templateType);
  const labels = config?.labels || {};
  const result = {};

  Object.keys(labels).forEach((labelKey) => {
    result[labelKey] = getUILabel(labelKey, templateType, language);
  });

  uiLabelsCache.set(cacheKey, result);
  return result;
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

if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  const validationErrors = validateConfiguration();
  if (validationErrors.length > 0) {
    // eslint-disable-next-line no-console
    console.warn('Metadata configuration validation warnings:', validationErrors);
  }
}

// Legacy default export for backward compatibility
const METADATA_MAPS = {};
Object.keys(TEMPLATES).forEach((templateType) => {
  METADATA_MAPS[templateType] = {};
  SUPPORTED_LANGUAGES.forEach((lang) => {
    METADATA_MAPS[templateType][lang] = getTemplateMetadataMap(templateType, lang);
  });
});

export default METADATA_MAPS;
