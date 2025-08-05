/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container with all card links
  const cardsContainer = element.querySelector('.projets_listing');
  if (!cardsContainer) return;
  const cardLinks = Array.from(cardsContainer.querySelectorAll(':scope > a.myItem'));
  if (!cardLinks.length) return;

  // Compose rows for the cards block
  const rows = cardLinks.map((a) => {
    // Image: first <img> inside the card
    const img = a.querySelector('img');

    // Text content for the right cell
    const content = [];
    // Title
    const h2 = a.querySelector('h2');
    if (h2 && h2.textContent.trim()) {
      // Use a <strong> for heading-level effect, as in the example
      const strong = document.createElement('strong');
      strong.textContent = h2.textContent.trim();
      content.push(strong);
      content.push(document.createElement('br'));
    }
    // Partners/organization
    const partners = a.querySelector('.projets_listing_partners');
    if (partners && partners.textContent.trim()) {
      const partnersSpan = document.createElement('span');
      partnersSpan.textContent = partners.textContent.trim();
      content.push(partnersSpan);
      content.push(document.createElement('br'));
    }
    // Infos (location and years)
    const infos = a.querySelector('.projets_listing_infos');
    if (infos && (infos.textContent.trim() || infos.innerHTML.trim())) {
      const infosSpan = document.createElement('span');
      // The location and year are separated by a <br>
      // We'll convert <br> to comma-space for compactness
      let txt = infos.innerHTML.replace(/<br\s*\/?>(\s*)?/gi, ', ');
      infosSpan.innerHTML = txt.trim();
      content.push(infosSpan);
      content.push(document.createElement('br'));
    }
    // Category
    const cat = a.querySelector('.projets_listing_cat');
    if (cat && cat.textContent.trim()) {
      const catSpan = document.createElement('span');
      catSpan.textContent = cat.textContent.trim();
      content.push(catSpan);
      content.push(document.createElement('br'));
    }
    // Remove trailing <br>
    while (content.length && content[content.length - 1].tagName === 'BR') {
      content.pop();
    }
    return [img, content];
  });

  // Compose the table (header row followed by card rows)
  const tableRows = [
    ['Cards (cards36)'],
    ...rows
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
