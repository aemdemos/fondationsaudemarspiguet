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

  document.querySelectorAll('.block').forEach((currentBlock) => {
  // Add .colourful class if needed
    if (currentBlock.classList.contains('colourful') || currentBlock.textContent.includes('colourful')) {
      currentBlock.classList.add('colourful');
    }

    // If .colourful, convert h4, h5, h6 to p and add color classes
    if (currentBlock.classList.contains('colourful')) {
      ['h4', 'h5', 'h6'].forEach((tag) => {
        currentBlock.querySelectorAll(tag).forEach((el) => {
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
