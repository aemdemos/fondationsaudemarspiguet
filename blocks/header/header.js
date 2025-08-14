import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { switchLanguage } from '../../scripts/language-switcher.js';
import { getLanguage } from '../../scripts/scripts.js';
import { getPathSegments } from '../../scripts/utils.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');
const root = document.documentElement;

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Adjusts the scroll limit for short content
 */
function adjustScrollLimitForShortContent() {
  const main = document.querySelector('main');
  const header = document.querySelector('header .nav-wrapper');
  const footer = document.querySelector('footer');

  if (main && header) {
    const mainHeight = main.offsetHeight;
    const footerHeight = footer ? footer.offsetHeight : 0;
    // If main content is less than 1000px, adjust scroll behavior
    if (mainHeight < 1500) {
      const maxScroll = mainHeight - (footerHeight * 0.25); // Leave 40% of footer height buffer
      window.addEventListener('scroll', () => {
        if (window.scrollY > maxScroll) {
          window.scrollTo(0, maxScroll);
        }
      });
    }
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const currentLang = getLanguage();
  const defaultNavPath = currentLang === 'fr' ? '/fr/nav' : '/nav';
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : defaultNavPath;
  const fragment = await loadFragment(navPath);
  const logoWrapper = document.createElement('div');
  logoWrapper.className = 'nav-logo-wrapper';
  const menuWrapper = document.createElement('div');
  menuWrapper.className = 'nav-menu-wrapper';
  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
  logoWrapper.append(navBrand);
  logoWrapper.append(navSections);
  logoWrapper.append(hamburger);
  menuWrapper.append(nav.querySelector('.nav-tools'));
  nav.append(logoWrapper);
  nav.append(menuWrapper);
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  const firstMenuItem = document.querySelector('.default-content-wrapper > ul > li');
  const firstMenuItemTitle = firstMenuItem?.querySelector('p');
  const submenu = firstMenuItem?.querySelector('ul');

  if (firstMenuItemTitle && submenu) {
    firstMenuItemTitle.addEventListener('mouseenter', () => {
      submenu.classList.add('show');
      nav.classList.add('hovered');
    });

    firstMenuItem.addEventListener('mouseleave', () => {
      submenu.classList.remove('show');
      nav.classList.remove('hovered');
    });
  }

  const menuItems = nav.querySelectorAll('.default-content-wrapper > ul > li');
  if (menuItems.length > 0) {
    menuItems.forEach((item, index) => {
      if (index !== 0) {
        item.addEventListener('mouseenter', () => {
          nav.classList.add('hovered');
        });
        item.addEventListener('mouseleave', () => {
          nav.classList.remove('hovered');
        });
      }
    });
  }

  const scrollLimit = block.querySelector('header .nav-wrapper').offsetHeight;
  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollLimit) {
      navWrapper.classList.add('non-sticky');
    } else {
      navWrapper.classList.remove('non-sticky');
    }
  });

  const currentUrl = window.location.href;
  const menuLinks = nav.querySelectorAll('.default-content-wrapper > ul > li a');
  if (menuLinks) {
    menuLinks.forEach((link) => {
      const title = link.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      if (currentUrl.includes(title)) {
        link.classList.add('active');
        const parentLi = link.parentElement.parentElement.parentElement;
        if (parentLi.tagName === 'LI') {
          parentLi.classList.add('active');
        }
      }
    });
  }

  // Initialize language switcher
  const languageSwitcher = nav.querySelector('.nav-sections > div > p');
  if (languageSwitcher) {
    languageSwitcher.style.cursor = 'pointer';
    languageSwitcher.addEventListener('click', (e) => {
      e.preventDefault();
      switchLanguage();
    });
  }
  /**
 * Adjusts the scroll limit for short content
 */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', adjustScrollLimitForShortContent);
  } else {
    adjustScrollLimitForShortContent();
  }
}
