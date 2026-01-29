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

export const SUPPORTED_LANGUAGES = ['en', 'fr'];

export const SHARED_FIELDS = {
  photos: { base: 'photos' },
  language: { base: 'language' },
};

export const SHARED_LABELS = {
  photos: {
    en: 'Photos',
    fr: 'Photos',
  },
};

export const TEMPLATES = {
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
