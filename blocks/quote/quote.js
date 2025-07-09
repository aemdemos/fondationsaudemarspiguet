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

  document.querySelectorAll('.quote blockquote h4, .quote blockquote h5, .quote blockquote h6').forEach(el => {
  const p = document.createElement('p');
  p.innerHTML = el.innerHTML;
  el.parentNode.replaceChild(p, el);
});

  block.innerHTML = '';
  block.append(blockquote);
}
