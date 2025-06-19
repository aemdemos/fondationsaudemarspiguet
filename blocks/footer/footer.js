import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  //Add class names to footer sections and wrap general footer links and copyright in common div so that div layout is correct in >900px view
  const firstSection = footer.querySelector('.section:first-child');
  if (firstSection) {
    firstSection.classList.add('footer-general');
  }

  const secondSection = footer.querySelector('.section:nth-of-type(2)');
   if (secondSection) {
    secondSection.classList.add('footer-menu');
  }

  const footerLinks = footer.querySelector('.section.footer-general ul');
  const copyRight = footer.querySelector('.section.footer-general p:last-of-type');
  const linksWrapper = document.createElement('div');
  linksWrapper.className = 'links-cr-wrapper';
  linksWrapper.append(footerLinks);
  linksWrapper.append(copyRight);
  firstSection.append(linksWrapper);
  
  block.append(footer);
}
