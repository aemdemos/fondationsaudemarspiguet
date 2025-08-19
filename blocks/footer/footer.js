import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { getLanguage } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const currentLang = getLanguage();
  const defaultFooterPath = currentLang === 'fr' ? '/fr/footer' : '/footer';
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : defaultFooterPath;
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Wrap social icons, general footer links and copyright
  // text in a div and wrap general footer links and copyright
  // text in common div so that div layout is correct in >900px view
  const footerMenu = footer.querySelector('.section.footer-s2 > div ul:last-of-type');
  const socialIcons = footer.querySelector('.section.footer-s2 > div p:first-of-type');
  const footerLinks = footer.querySelector('.section.footer-s2 > div ul:first-of-type');
  const copyRight = footer.querySelector('.section.footer-s2 > div p:nth-of-type(2)');
  const footerGeneralWrapper = document.createElement('div');
  footerGeneralWrapper.className = 'footer-general-wrapper';
  footerGeneralWrapper.append(socialIcons);
  footerGeneralWrapper.append(footerLinks);
  footerGeneralWrapper.append(copyRight);
  footerMenu.insertAdjacentElement('beforebegin', footerGeneralWrapper);

  // Add footer general links and copyright text to it's own div
  const linksCRWrapper = document.createElement('div');
  linksCRWrapper.className = 'links-cr-wrapper';
  linksCRWrapper.append(footerLinks);
  linksCRWrapper.append(copyRight);
  footerGeneralWrapper.append(linksCRWrapper);

  block.append(footer);
}
