import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

export function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));

  slides.forEach((slide, idx) => {
    slide.setAttribute('aria-hidden', idx !== realSlideIndex);
    slide.querySelectorAll('a').forEach((link) => {
      if (idx !== realSlideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== realSlideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });

  block.dataset.activeSlide = realSlideIndex;

  // Add grey background behind carousel, starting at its middle
  const templateName = getMetadata('template');
  if (templateName === 'project-article') {
    setTimeout(() => {
      const carouselRect = block.getBoundingClientRect();
      const parent = block.parentNode;
      const existingBg = parent.querySelector('.carousel-bg-grey');
      if (existingBg) {
        existingBg.remove();
      }

      // Make sure the parent is positioned relative
      if (getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative';
      }

      const bgDiv = document.createElement('div');
      bgDiv.className = 'carousel-bg-grey';
      bgDiv.style.position = 'absolute';
      bgDiv.style.left = '50%';
      bgDiv.style.transform = 'translateX(-50%)';
      bgDiv.style.width = '100vw';
      bgDiv.style.top = `${block.offsetTop + carouselRect.height / 2}px`;
      bgDiv.style.height = `${carouselRect.height}px`;
      bgDiv.style.background = 'var(--projet-bg-page-suite)'; // Grey color
      bgDiv.style.zIndex = '0';
      bgDiv.style.pointerEvents = 'none';

      parent.insertBefore(bgDiv, block);
    }, 0);
  }
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');
  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }
  return slide;
}

function centerIndicators(block) {
  const container = block.querySelector('.carousel-slides-container');
  const indicators = container.querySelector('.carousel-slide-indicators');
  if (container && indicators) {
    const containerHeight = container.offsetHeight;
    const indicatorsHeight = indicators.offsetHeight;
    // Set top so the indicators are vertically centered
    indicators.style.top = `${(containerHeight - indicatorsHeight) / 2}px`;
    indicators.style.transform = 'none'; // Remove translateY(-50%) if set in CSS
  }
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  let rows = block.querySelectorAll(':scope > div');
  const isScrollable = block.classList.contains('scrollable');
  let socialContainer = null;
  let slidelegende = null;
  if (block.classList.contains('hero-banner')) {
    rows = Array.from(rows).filter((row) => {
      const hasPicture = row.querySelector('picture');
      if (!hasPicture) {
        // Handle row without picture
        socialContainer = row.querySelector('div:nth-child(1)');
        slidelegende = row.querySelector('div:nth-child(2)');
        if (socialContainer) {
          console.log(socialContainer);
          const linkedin = socialContainer.querySelector('.icon.icon-linkedin');
          if (linkedin) {
            const link = document.createElement('a');
            link.href = 'https://www.linkedin.com/company/audemars-piguet-foundations/';
            link.target = '_blank'; // optional: open in new tab
            link.rel = 'noopener noreferrer';
            // move the span into the anchor
            linkedin.parentNode.insertBefore(link, linkedin);
            link.appendChild(linkedin);
          }
          socialContainer.classList.add('social-cr-wrapper');
        }
        if (slidelegende) {
          slidelegende.classList.add('slide-legend');
        }
        row.remove();
        return false;
      }
      return true; // keep only picture rows in "rows"
    });
  }

  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  // block.prepend(slidesWrapper);

  // Detect vertical carousel and add class
  const isVertical = block.classList.contains('vertical') || block.classList.contains('carousel-vertical');
  if (isVertical) {
    block.classList.add('carousel-vertical');
  }

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    container.append(slideIndicatorsNav);

    // Only add navigation buttons if NOT vertical
    if (!isVertical) {
      const slideNavButtons = document.createElement('div');
      slideNavButtons.classList.add('carousel-navigation-buttons');
      slideNavButtons.innerHTML = `
        <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
        <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
      `;
      container.append(slideNavButtons);
    }
  }
  let slide;
  rows.forEach((row, idx) => {
    slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    if (isScrollable && socialContainer && slidelegende) {
      const content = slide.querySelector('.carousel-slide-content');
      const directionIcon = content?.querySelector('p:last-of-type');
      const socialClone = socialContainer.cloneNode(true);
      const legendClone = slidelegende.cloneNode(true);
      if (directionIcon) {
        // Create wrapper div
        const directionIconDiv = document.createElement('div');
        directionIconDiv.classList.add('direction-icon-section');
        // Move the <p> into wrapper
        directionIconDiv.appendChild(directionIcon);
        // Insert before social block
        slide.append(directionIconDiv, socialClone, legendClone);
      } else {
        slide.append(socialClone, legendClone);
      }
    }
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
      if (isScrollable) {
        // Scroll into view when indicator is clicked
        indicator.querySelector('button').addEventListener('click', () => {
          slide.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  });

  container.append(slidesWrapper);
  block.prepend(container);
  // Remove empty divs left behind
  block.querySelectorAll('div').forEach((div) => {
    if (!div.children.length && !div.textContent.trim()) {
      div.remove();
    }
  });

  if (isScrollable) {
    // Scroll-snap mode (CSS controls the snapping)
    const slides = block.querySelectorAll('.carousel-slide');
    const indicators = block.querySelectorAll('.carousel-slide-indicator');
    indicators.forEach((indicator, idx) => {
      const btn = indicator.querySelector('button');
      btn.addEventListener('click', () => {
        slides[idx].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.slideIndex, 10);
          entry.target.classList.add('active');
          // 🔹 Remove 'active' from others
          slides.forEach((s) => {
            if (s !== entry.target) s.classList.remove('active');
          });
          indicators.forEach((ind, i) => {
            ind.querySelector('button').toggleAttribute('disabled', i === idx);
          });
        }
      });
    }, { threshold: 0.6 });

    slides.forEach((s) => observer.observe(s));
  } else {
    // Show the first slide by default
    showSlide(block, 0);

    // Autoplay functionality
    const autoAdvance = () => {
      const slides = block.querySelectorAll('.carousel-slide');
      const current = parseInt(block.dataset.activeSlide, 10) || 0;
      const next = (current + 1) % slides.length;
      showSlide(block, next);
      block.carouselTimer = setTimeout(autoAdvance, 4000); // 4000ms = 4 seconds
    };
    block.carouselTimer = setTimeout(autoAdvance, 4000);

    if (!isSingleSlide) {
      bindEvents(block);
    }
    centerIndicators(block);
    window.addEventListener('resize', () => centerIndicators(block));
  }
}
