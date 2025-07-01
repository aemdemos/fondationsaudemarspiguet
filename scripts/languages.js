import { getLanguage } from './scripts.js';

// Define LANGUAGES constant locally
const LANGUAGES = new Set(['en', 'fr']);

// Alias for consistency with existing code
const getCurrentLanguage = getLanguage;

function getPagePathWithoutLanguage() {
  const { pathname } = window.location;
  const segments = pathname.split('/');

  // If first segment is a language code, remove it
  if (segments.length > 1 && LANGUAGES.has(segments[1])) {
    return `/${segments.slice(2).join('/')}`;
  }

  // If no language in URL, return as-is
  return pathname;
}

export function switchToLanguage(targetLang) {
  const currentLang = getCurrentLanguage();

  if (currentLang === targetLang) {
    return; // Already on target language
  }

  const pagePathWithoutLang = getPagePathWithoutLanguage();
  const newUrl = `/${targetLang}${pagePathWithoutLang}`;

  window.location.href = newUrl;
}

export function switchLanguage() {
  const currentLang = getCurrentLanguage();
  const targetLang = currentLang === 'en' ? 'fr' : 'en';
  switchToLanguage(targetLang);
}
