// add delayed functionality here
function adjustScrollLimitForShortContent() {
  const main = document.querySelector('main');
  const header = document.querySelector('header .nav-wrapper');

  if (main && header) {
    const mainHeight = main.offsetHeight;
    const headerHeight = header.offsetHeight;
    // If main content is less than 500px, adjust scroll behavior
    if (mainHeight < 500) {
      const maxScroll = mainHeight - headerHeight - 50; // Leave 50px buffer
      window.addEventListener('scroll', () => {
        if (window.scrollY > maxScroll) {
          window.scrollTo(0, maxScroll);
        }
      });
    }
  }
}

// Call the function when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', adjustScrollLimitForShortContent);
} else {
  adjustScrollLimitForShortContent();
}
