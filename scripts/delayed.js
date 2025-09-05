import { applySectionBackgrounds } from './utils.js';

export default function loadswiper() {
  return new Promise((resolve, reject) => {
    // Check if Swiper is already loaded
    if (typeof window.Swiper !== 'undefined') {
      resolve(window.Swiper);
      return;
    }

    // Load CSS first
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
    document.head.appendChild(linkElement);

    // Then load JavaScript
    const scriptrrule = document.createElement('script');
    scriptrrule.setAttribute('type', 'text/javascript');
    scriptrrule.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';

    scriptrrule.onload = () => {
      // Give it a moment for the global Swiper to be available
      setTimeout(() => {
        if (typeof window.Swiper !== 'undefined') {
          resolve(window.Swiper);
        } else {
          reject(new Error('Swiper not found on window after CDN load'));
        }
      }, 100);
    };

    scriptrrule.onerror = () => {
      reject(new Error('Failed to load Swiper script'));
    };

    document.head.append(scriptrrule);
  });
}

// Apply section backgrounds after delay to avoid performance impact
applySectionBackgrounds();
