import {
  toCamelCase,
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
import { applyFadeUpAnimation, getPathSegments } from '../../scripts/utils.js';

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

async function fetchProjectPlaceholders(prefix = 'en') {
  window.placeholders = window.placeholders || {};

  // Check if we already have data loaded
  if (!window.placeholders[prefix] || !window.placeholders['category-news'] || !window.placeholders['category-projects'] || !window.placeholders['language-switcher']) {
    try {
      const resp = await fetch(`/placeholders.json?sheet=${prefix}&sheet=category-news&sheet=category-projects&sheet=language-switcher`);
      const json = resp.ok ? await resp.json() : {};

      // Process main language sheet
      if (json[prefix] && json[prefix].data) {
        const placeholders = {};
        json[prefix].data
          .filter((placeholder) => placeholder.Key)
          .forEach((placeholder) => {
            placeholders[toCamelCase(placeholder.Key)] = placeholder.Text;
          });
        window.placeholders[prefix] = placeholders;
      }

      // Process and store category-news sheet
      if (json['category-news'] && json['category-news'].data) {
        const categoryNewsPlaceholders = {
          en: [],
          fr: [],
        };
        json['category-news'].data.forEach((item) => {
          if (item.en) {
            categoryNewsPlaceholders.en.push(item.en);
          }
          if (item.fr) {
            categoryNewsPlaceholders.fr.push(item.fr);
          }
        });
        window.placeholders['category-news'] = categoryNewsPlaceholders;
      }

      // Process and store category-projects sheet
      if (json['category-projects'] && json['category-projects'].data) {
        const categoryProjectsPlaceholders = {
          en: [],
          fr: [],
        };
        json['category-projects'].data.forEach((item) => {
          if (item.en) {
            categoryProjectsPlaceholders.en.push(item.en);
          }
          if (item.fr) {
            categoryProjectsPlaceholders.fr.push(item.fr);
          }
        });
        window.placeholders['category-projects'] = categoryProjectsPlaceholders;
      }
    } catch (error) {
      // Set default empty structures if loading fails
      window.placeholders[prefix] = window.placeholders[prefix] || {};
      window.placeholders['category-news'] = window.placeholders['category-news'] || { en: [], fr: [] };
      window.placeholders['category-projects'] = window.placeholders['category-projects'] || { en: [], fr: [] };
    }
  }

  return window.placeholders;
}

const blockType = 'cards';

// Result parsers parse the query results into a format that can be used by the block builder for
// the specific block types
const resultParsers = {
  // Parse results into a cards block
  cards: (results) => {
    const blockContents = [];
    // Get path segments to check URL condition
    const pathSegments = getPathSegments();
    const isNewsPage = pathSegments[1] === 'fondation-pour-les-arbres-news' || pathSegments[1] === 'fondation-pour-les-arbres-actualites';

    results.forEach((result) => {
      const cardContainer = div();

      // Create the wrapper anchor tag
      const cardLink = a({ href: result.productsPath });

      // Create image container
      const imageContainer = div({ class: 'image-container' });

      if (result.productsImage && result.productsImage.length > 0) {
        const cardImage = createOptimizedPicture(result.productsImage);
        cardImage.classList.add('lazy', 'slide_img');
        imageContainer.append(cardImage);
      }

      cardLink.append(imageContainer);

      // Create partner info only if not on news pages
      if (!isNewsPage) {
        const partnerInfo = div({ class: 'projets-listing-partners' });
        partnerInfo.textContent = result.productsPartner || '';
        cardLink.append(partnerInfo);
      }

      // Create location and duration info
      const projectInfo = div({ class: 'projets-listing-infos' });
      if (isNewsPage) {
        projectInfo.innerHTML = result.productsDuration || '';
      } else {
        projectInfo.innerHTML = `${result.productsLocation || ''} <br> ${result.productsDuration || ''}`;
      }
      cardLink.append(projectInfo);

      // Create title
      const title = h3();
      title.textContent = result.productsTitle || '';
      cardLink.append(title);

      // Create category
      const category = div({ class: 'projets-listing-cat' });
      category.textContent = result.productsCategory || '';
      cardLink.append(category);

      cardContainer.append(cardLink);
      blockContents.push([cardContainer]);
    });
    return blockContents;
  },
};

async function getProductsdata() {
  let rawProducts1 = await ffetch(`/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-les-arbres-projects' : 'fondation-pour-les-arbres-nos-projets'}/projects-index.json`)
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

  // Additional filter based on URL path and category matching
  const secondPathSegment = currentPathSegments[1];
  let categoryArray = [];

  if (secondPathSegment === 'fondation-pour-les-arbres-news' && window.placeholders['category-news']?.en) {
    categoryArray = window.placeholders['category-news'].en;
  } else if (secondPathSegment === 'fondation-pour-les-arbres-actualites' && window.placeholders['category-news']?.fr) {
    categoryArray = window.placeholders['category-news'].fr;
  } else if (secondPathSegment === 'fondation-pour-les-arbres-projects' && window.placeholders['category-projects']?.en) {
    categoryArray = window.placeholders['category-projects'].en;
  } else if (secondPathSegment === 'fondation-pour-les-arbres-nos-projets' && window.placeholders['category-projects']?.fr) {
    categoryArray = window.placeholders['category-projects'].fr;
  }

  // Filter rawProducts1 based on category matching
  if (categoryArray.length > 0) {
    // Normalize categoryArray for comparison (lowercase, spaces to dashes)
    const normalizedCategoryArray = categoryArray.map((cat) => cat.toLowerCase().replace(/\s+/g, '-'));

    rawProducts1 = rawProducts1.filter((product) => {
      if (!product.category) return false;

      // Split product categories by "|" and normalize each one
      const productCategories = product.category.split('|')
        .map((cat) => cat.trim().toLowerCase().replace(/\s+/g, '-'));

      // Check if any product category matches any category in categoryArray
      const hasMatch = productCategories.some((productCat) => (
        normalizedCategoryArray.includes(productCat)
      ));

      return hasMatch;
    });
  }

  // Determine number of cards to show based on viewport width
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
  const desiredCount = (viewportWidth < 900) ? 2 : 3;

  // Always exclude current project from selection and take the desired count
  const selectedProducts = rawProducts1
    .filter((product) => product.path !== currentPath)
    .slice(0, desiredCount);

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

  const placeholders = await fetchProjectPlaceholders(`${getLanguage()}`);

  // Create the heading based on template
  const heading = h2();
  const headerText = template === 'news-article' ? placeholders[getLanguage()].featuredProjectsHeadingOnNewsArticles : placeholders[getLanguage()].featuredProjectsHeadingOnProjectArticles;
  heading.textContent = headerText;

  const templateCell = block.querySelector('div > div');
  if (templateCell) {
    templateCell.remove();
  }

  block.prepend(heading);

  const render = async () => {
    // Clear previous content except heading
    const nodesToRemove = [...block.querySelectorAll(':scope > div')];
    nodesToRemove.forEach((n) => n.remove());

    const getProducts = await getProductsdata();
    const blockContents = await loadresults(getProducts);
    const builtBlock = buildBlock(blockType, blockContents);
    const parentDiv = div(
      builtBlock,
    );
    decorateBlock(builtBlock);
    await loadBlock(builtBlock);
    builtBlock.classList.add('featured');
    applyFadeUpAnimation(builtBlock, parentDiv);

    block.append(parentDiv);
  };

  await render();

  // Re-render on resize when crossing breakpoints
  let lastBucket = (window.innerWidth < 900) ? 'two' : 'three';
  let resizeRafId;
  const onResize = () => {
    if (resizeRafId) cancelAnimationFrame(resizeRafId);
    resizeRafId = requestAnimationFrame(async () => {
      const currentBucket = (window.innerWidth < 900) ? 'two' : 'three';
      if (currentBucket !== lastBucket) {
        lastBucket = currentBucket;
        await render();
      }
    });
  };
  window.addEventListener('resize', onResize);
}
