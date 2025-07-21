export default async function decorate(block) {
  const [quotation, attribution] = [...block.children].map((c) => c.firstElementChild);
  const blockquote = document.createElement('blockquote');
  // decorate quotation
  quotation.className = 'quote-quotation';

  // Handle bold text in quotation - remove bold and make brown
  const bolds = quotation.querySelectorAll('strong, b');
  bolds.forEach((bold) => {
    const span = document.createElement('span');
    span.innerHTML = bold.innerHTML;
    span.style.color = '#947F5F';
    span.style.fontWeight = 'normal';
    bold.replaceWith(span);
  });

  // Handle italic text in quotation - remove italics and make green
  const italics = quotation.querySelectorAll('em, i');
  italics.forEach((italic) => {
    const span = document.createElement('span');
    span.innerHTML = italic.innerHTML;
    span.style.color = '#6b7e7c';
    span.style.fontStyle = 'normal';
    italic.replaceWith(span);
  });

   // Handle underline text in quotation - remove underline and make brown
  const underlines = quotation.querySelectorAll('u');
  underlines.forEach((underline) => {
    const span = document.createElement('span');
    span.innerHTML = underline.innerHTML;
    span.style.color = '#695D5B';
    span.style.textDecoration = 'none';
    underline.replaceWith(span);
  });

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

  block.innerHTML = '';
  block.append(blockquote);
}
