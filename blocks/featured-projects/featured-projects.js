import { fetchPlaceholders } from '../../scripts/aem.js';
import { getLanguage } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const template = block.querySelector('div > div')?.textContent?.trim();

  const placeholders = await fetchPlaceholders(`/${getLanguage()}`);

  // Create the heading based on template
  const heading = document.createElement('h2');
  const headerText = template === 'news-article' ? placeholders.featuredProjectsHeadingOnNewsArticles : placeholders.featuredProjectsHeadingOnProjectArticles;
  heading.textContent = headerText;

  const templateCell = block.querySelector('div > div');
  if (templateCell) {
    templateCell.remove();
  }

  block.prepend(heading);
}
