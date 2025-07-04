import {
  fetchPlaceholders,
  createOptimizedPicture,
  buildBlock,
  decorateBlock,
  loadBlock,
} from '../../scripts/aem.js';
import { getLanguage } from '../../scripts/scripts.js';
import ffetch from '../../scripts/ffetch.js';
import {
  div,
  h3,
  h2,
  a,
} from '../../scripts/dom-helpers.js';
import getPathSegments from '../../scripts/utils.js';

class Products {
  // eslint-disable-next-line max-len
  constructor(productsPartner, productsDuration, productsTitle, productsCategory, productsImage, productsLocation, productsPath) {
    this.productsPartner = productsPartner;
    this.productsDuration = productsDuration;
    this.productsTitle = productsTitle;
    this.productsCategory = productsCategory;
    this.productsImage = productsImage;
    this.productsLocation = productsLocation;
    this.productsPath = productsPath;
  }
}

const blockType = 'cards';

// Result parsers parse the query results into a format that can be used by the block builder for
// the specific block types
const resultParsers = {
  // Parse results into a cards block
  cards: (results) => {
    const blockContents = [];
    results.forEach((result) => {
      const cardContainer = div();

      // Create the wrapper anchor tag
      const cardLink = a({ href: result.productsPath });

      // Create image container
      const imageContainer = div({ class: 'image_container' });

      if (result.productsImage && result.productsImage.length > 0) {
        const cardImage = createOptimizedPicture(result.productsImage);
        cardImage.classList.add('lazy', 'slide_img');
        imageContainer.append(cardImage);
      }

      cardLink.append(imageContainer);

      // Create partner info
      const partnerInfo = div({ class: 'projets_listing_partners' });
      partnerInfo.textContent = result.productsPartner || '';
      cardLink.append(partnerInfo);

      // Create location and duration info
      const projectInfo = div({ class: 'projets_listing_infos' });
      projectInfo.innerHTML = `${result.productsLocation || ''} <br> ${result.productsDuration || ''}`;
      cardLink.append(projectInfo);

      // Create title
      const title = h3();
      title.textContent = result.productsTitle || '';
      cardLink.append(title);

      // Create category
      const category = div({ class: 'projets_listing_cat' });
      category.textContent = result.productsCategory || '';
      cardLink.append(category);

      cardContainer.append(cardLink);
      blockContents.push([cardContainer]);
    });
    return blockContents;
  },
};

async function getProductsdata() {
  const rawProducts1 = await ffetch(`/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-les-arbres-projects' : 'fondation-pour-les-arbres-nos-projets'}/projects-index.json`)
    .chunks(1000)
    .all();

  // Function to extract years from duration string
  const extractYears = ((duration) => {
    if (!duration) return { year1: 0, year2: 0 };
    const years = duration.split('→').map((year) => parseInt(year.trim(), 10));
    return {
      year1: years[0] || 0,
      year2: years[1] || 0,
    };
  });

  // Sort the array based on year2 first, then year1
  rawProducts1.sort((item1, item2) => {
    const yearsA = extractYears(item1.duration);
    const yearsB = extractYears(item2.duration);

    // Compare year2 first
    if (yearsB.year2 !== yearsA.year2) {
      return yearsB.year2 - yearsA.year2;
    }
    // If year2 is same, compare year1
    return yearsB.year1 - yearsA.year1;
  });

  // Get current page path segments
  const currentPathSegments = getPathSegments();
  const currentPath = `/${currentPathSegments.join('/')}`;

  // Find index of current project
  const currentIndex = rawProducts1.findIndex((product) => product.path === currentPath);

  // If current project is among first 3, remove it and get next one
  let selectedProducts;
  if (currentIndex >= 0 && currentIndex <= 2) {
    selectedProducts = [
      ...rawProducts1.slice(0, currentIndex),
      ...rawProducts1.slice(currentIndex + 1, 4), // Get up to index 4 to ensure we have 3 items
    ];
  } else {
    // If current project is not in first 3, just get first 3
    selectedProducts = rawProducts1.slice(0, 3);
  }

  return selectedProducts;
}

const loadresults = async (getProducts) => {
  const productResults = [];
  getProducts.forEach((product) => {
    // eslint-disable-next-line max-len
    const productResult = new Products(product.partner, product.duration, product.title, product.category, product.image, product.location, product.path);
    productResults.push(productResult);
  });
  return resultParsers[blockType](productResults);
};

export default async function decorate(block) {
  const template = block.querySelector('div > div')?.textContent?.trim();

  const placeholders = await fetchPlaceholders(`${getLanguage()}`);

  // Create the heading based on template
  const heading = h2();
  const headerText = template === 'news-article' ? placeholders.featuredProjectsHeadingOnNewsArticles : placeholders.featuredProjectsHeadingOnProjectArticles;
  heading.textContent = headerText;

  const templateCell = block.querySelector('div > div');
  if (templateCell) {
    templateCell.remove();
  }

  block.prepend(heading);

  const getProducts = await getProductsdata();
  const blockContents = await loadresults(getProducts);
  const builtBlock = buildBlock(blockType, blockContents);
  const parentDiv = div(
    builtBlock,
  );
  decorateBlock(builtBlock);
  await loadBlock(builtBlock);
  builtBlock.classList.add('featured');
  block.append(parentDiv);
}
