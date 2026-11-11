import './dompurify.min.js';

const sanitizer = typeof window === 'undefined' ? null : window.DOMPurify;

export default function setSanitizedContent(element, value) {
  if (!sanitizer?.isSupported) {
    throw new Error('HTML sanitizer is not available');
  }

  const content = sanitizer.sanitize(value ?? '', {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target'],
    RETURN_DOM_FRAGMENT: true,
  });
  content.querySelectorAll('a[target]').forEach((link) => {
    if (link.target.toLowerCase() === '_blank') {
      link.relList.add('noopener');
    }
  });
  element.replaceChildren(content);
}
