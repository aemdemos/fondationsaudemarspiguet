import { getLanguage, moveInstrumentation } from '../../scripts/scripts.js';

function getFormUrl(link) {
  if (!link) return null;
  try {
    const url = new URL(link.href);
    if (url.origin === 'https://cdn.forms-content-1.sg-form.com'
      && !url.username && !url.password) return url.href;
  } catch {
    return null;
  }
  return null;
}

export default function decorate(block) {
  const rows = [...block.children];
  const language = getLanguage();
  const forms = new Map();
  rows.forEach((row) => {
    const link = row.querySelector('a[href]');
    const url = getFormUrl(link);
    if (!url) return;
    const key = rows.length === 1 && row.children.length === 1
      ? 'default' : row.firstElementChild.textContent.trim().toLowerCase();
    forms.set(key, { link, url });
  });
  const mobile = forms.get(`${language}-mobile`) || forms.get('default');
  const desktop = forms.get(`${language}-desktop`) || forms.get('default');
  if (!mobile || !desktop) return;

  const fallbackTitle = language === 'fr'
    ? 'Inscription newsletter' : 'Newsletter subscription';
  const iframe = document.createElement('iframe');
  iframe.loading = 'lazy';
  const updateForm = () => {
    const format = block.clientWidth >= 660 ? 'desktop' : 'mobile';
    const { link, url } = format === 'desktop' ? desktop : mobile;
    block.dataset.format = format;
    if (iframe.src === url) return;
    const label = link.textContent.trim();
    iframe.title = label && label !== link.href ? label : fallbackTitle;
    iframe.lang = language;
    iframe.src = url;
  };

  moveInstrumentation(mobile.link, iframe);
  block.replaceChildren(iframe);
  updateForm();
  const observer = new ResizeObserver(() => {
    if (!block.isConnected) {
      observer.disconnect();
      return;
    }
    updateForm();
  });
  observer.observe(block);
}
