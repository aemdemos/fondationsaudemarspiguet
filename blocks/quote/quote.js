export default async function decorate(block) {
  const [quotation, attribution] = [...block.children].map((c) => c.firstElementChild);
  const blockquote = document.createElement('blockquote');
  // decorate quotation
  quotation.className = 'quote-quotation';
  blockquote.append(quotation);
  // decoration attribution
  if (attribution) {
    attribution.className = 'quote-attribution';
    blockquote.append(attribution);
    const ems = attribution.querySelectorAll('em');
    ems.forEach((em) => {
      const cite = document.createElement('cite');
      cite.innerHTML = em.innerHTML;
      em.replaceWith(cite);
    });
  }

document.querySelectorAll('.block').forEach(block => {
  // Add .colourful class if needed
  if (block.classList.contains('colourful') || block.textContent.includes('colourful')) {
    block.classList.add('colourful');
  }

  // If .colourful, convert h4, h5, h6 to p and add color classes
  if (block.classList.contains('colourful')) {
    ['h4', 'h5', 'h6'].forEach((tag, idx) => {
      block.querySelectorAll(tag).forEach(el => {
        const p = document.createElement('p');
        p.innerHTML = el.innerHTML;
        p.classList.add(`color-${tag}`);
        el.parentNode.replaceChild(p, el);
      });
    });
  }
});

  block.innerHTML = '';
  block.append(blockquote);
}
