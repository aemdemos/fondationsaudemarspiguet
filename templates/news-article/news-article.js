export function enableAnimationOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible'); // remove class when out of view
      }
    });
  }, { threshold: 0.1 }); // Trigger when 10% visible

  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach((el) => observer.observe(el));
}

function setMainHeightVar(headerEle, doc) {
  const headerHeight = headerEle.offsetHeight;
  const mainEle = doc.querySelector('main');
  if (mainEle) {
    mainEle.style.marginTop = `${headerHeight}px`;
  }
}

function waitForHeaderHeight(doc) {
  const headerEle = doc.querySelector('header .nav-wrapper');

  if (headerEle) {
    setMainHeightVar(headerEle, doc); // Initial call
    window.addEventListener('resize', () => {
      setMainHeightVar(headerEle, doc); // On resize
    }); // Recalculate on resize
  } else {
    setTimeout(() => waitForHeaderHeight(doc), 100); // Retry if header not yet in DOM
  }
}

export default async function decorate(doc) {
  waitForHeaderHeight(doc);
}
