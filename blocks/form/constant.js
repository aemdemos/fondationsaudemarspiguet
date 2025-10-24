export const fileAttachmentText = 'Attach';
export const dragDropText = 'Drag and Drop To Upload';

export const DEFAULT_THANK_YOU_MESSAGE = 'Thank you for your submission.';

// Logging Configuration
// To set log level, modify this constant:
export const LOG_LEVEL = 'error'; // Available options: 'off', 'debug', 'info', 'warn', 'error'

// Get current language from document
function getCurrentLanguage() {
  return document.documentElement.lang || 'en';
}

// Error messages by language
const errorMessagesByLanguage = {
  en: {
    accept: 'The specified file type not supported.',
    maxFileSize: 'File too large. Reduce size and try again.',
    maxItems: 'Specify a number of items equal to or less than $0.',
    minItems: 'Specify a number of items equal to or greater than $0.',
    pattern: 'Specify the value in allowed format : $0.',
    minLength: 'Please lengthen this text to $0 characters or more.',
    maxLength: 'Please shorten this text to $0 characters or less.',
    maximum: 'Value must be less than or equal to $0.',
    minimum: 'Value must be greater than or equal to $0.',
    required: 'This field is required',
  },
  fr: {
    accept: 'Le type de fichier spécifié n\'est pas pris en charge.',
    maxFileSize: 'Fichier trop volumineux. Réduisez la taille et réessayez.',
    maxItems: 'Spécifiez un nombre d\'éléments inférieur ou égal à $0.',
    minItems: 'Spécifiez un nombre d\'éléments supérieur ou égal à $0.',
    pattern: 'Spécifiez la valeur au format autorisé : $0.',
    minLength: 'Veuillez allonger ce texte à $0 caractères ou plus.',
    maxLength: 'Veuillez raccourcir ce texte à $0 caractères ou moins.',
    maximum: 'La valeur doit être inférieure ou égale à $0.',
    minimum: 'La valeur doit être supérieure ou égale à $0.',
    required: 'Ce champ est obligatoire.',
  },
};

// Export dynamic error messages based on current language
export const defaultErrorMessages = new Proxy({}, {
  get(target, prop) {
    const lang = getCurrentLanguage();
    const messages = errorMessagesByLanguage[lang] || errorMessagesByLanguage.en;
    return messages[prop];
  },
});

// eslint-disable-next-line no-useless-escape
export const emailPattern = '([A-Za-z0-9][._]?)+[A-Za-z0-9]@[A-Za-z0-9]+(\.?[A-Za-z0-9]){2}\.([A-Za-z0-9]{2,4})?';

let submitBaseUrl = '';

export const SUBMISSION_SERVICE = 'https://forms.adobe.com/adobe/forms/af/submit/';

export function setSubmitBaseUrl(url) {
  submitBaseUrl = url;
}

export function getSubmitBaseUrl() {
  return submitBaseUrl;
}
