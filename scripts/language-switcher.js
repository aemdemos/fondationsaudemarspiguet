import { getLanguage } from './scripts.js';
import { redirectToSameOrigin } from './url-utils.js';

const LANGUAGES = new Set(['en', 'fr']);

// Get page path without language prefix
function getPagePathWithoutLanguage() {
  const segments = window.location.pathname.split('/');
  return segments.length > 1 && LANGUAGES.has(segments[1])
    ? (segments.slice(2).join('/') || '/')
    : window.location.pathname;
}

// Fetch language mappings
async function fetchLanguageMappings() {
  // Use centrally loaded placeholders, fallback to fetch if not available
  if (window.placeholders?.['language-switcher']) {
    return window.placeholders['language-switcher'];
  }

  try {
    const response = await fetch('/placeholders.json?sheet=language-switcher');
    const json = response.ok ? await response.json() : {};
    return json.data || [];
  } catch {
    return [];
  }
}

// Find mapped URL for target language
async function findMappedUrl(targetLang) {
  const mappings = await fetchLanguageMappings();
  const currentLang = getLanguage();
  const currentPath = getPagePathWithoutLanguage();
  const normalizedPath = currentPath === '/' ? '' : currentPath;

  const mapping = mappings.find((item) => {
    const url = item[currentLang];
    if (!url) return false;
    const normalized = url.startsWith('/') ? url.slice(1) : url;
    return (normalized || '') === normalizedPath;
  });

  return mapping?.[targetLang] || currentPath;
}

// Switch to target language
export async function switchToLanguage(targetLang) {
  if (!LANGUAGES.has(targetLang)) {
    throw new Error('Unsupported target language');
  }
  if (getLanguage() === targetLang) return;

  let destination;
  try {
    const mappedUrl = await findMappedUrl(targetLang);

    // Homepage: / <-> /fr
    if (!mappedUrl || mappedUrl === '/') {
      destination = targetLang === 'fr' ? '/fr' : '/';
    } else {
      // Other pages: standard pattern
      const cleanUrl = mappedUrl.startsWith('/') ? mappedUrl : `/${mappedUrl}`;
      destination = `/${targetLang}${cleanUrl}`;
    }
  } catch {
    // Fallback
    const currentPath = getPagePathWithoutLanguage();
    if (currentPath === '/') {
      destination = targetLang === 'fr' ? '/fr' : '/';
    } else {
      destination = `/${targetLang}${currentPath}`;
    }
  }
  redirectToSameOrigin(destination);
}

// Toggle between languages
export function switchLanguage() {
  switchToLanguage(getLanguage() === 'en' ? 'fr' : 'en');
}
