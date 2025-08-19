import {
  createOptimizedPicture,
  buildBlock,
  decorateBlock,
  loadBlock,
  fetchPlaceholders,
} from '../../scripts/aem.js';
import { getLanguage } from '../../scripts/scripts.js';
import ffetch from '../../scripts/ffetch.js';
import {
  div,
  h3,
  a,
} from '../../scripts/dom-helpers.js';
import { applyFadeUpAnimation } from '../../scripts/utils.js';

class Products {
  // eslint-disable-next-line max-len
  constructor(productsPartner, productsDuration, productsTitle, productsCategory, productsImage, productsLocation, productsPath, productsFeatured, productsFeaturedContent) {
    this.productsPartner = productsPartner;
    this.productsDuration = productsDuration;
    this.productsTitle = productsTitle;
    this.productsCategory = productsCategory;
    this.productsImage = productsImage;
    this.productsLocation = productsLocation;
    this.productsPath = productsPath;
    this.productsFeatured = productsFeatured;
    this.productsFeaturedContent = productsFeaturedContent;
  }
}

const blockType = 'columns';

// Result parsers parse the query results into a format that can be used by the
// block builder for the specific block types
const resultParsers = {
  // Parse results into a columns block
  columns: (results, leftButtonText, rightButtonText) => {
    const blockContents = [];
    const currentLanguage = getLanguage();

    results.forEach((result) => {
      const cardContainer = div();

      // 1) Image with cardLink (link only on image)
      if (result.productsImage && result.productsImage.length > 0) {
        const projectImageDiv = div({ class: 'project-image' });
        const imageLink = a({ href: result.productsPath });
        const imageContainer = div({ class: 'image-container' });
        const cardImage = createOptimizedPicture(result.productsImage);
        cardImage.classList.add('lazy', 'slide_img');
        imageContainer.append(cardImage);
        imageLink.append(imageContainer);
        projectImageDiv.append(imageLink);
        cardContainer.append(projectImageDiv);
      }

      // 2) Metadata div
      const metadataDiv = div({ class: 'project-metadata' });

      // a) Category + Location + Duration separated by |
      const categoryLocationDuration = div({ class: 'category-location-duration' });
      const parts = [
        result.productsCategory || '',
        result.productsLocation || '',
        result.productsDuration || '',
      ].filter((part) => part.trim().length > 0);
      categoryLocationDuration.textContent = parts.join(' | ');
      metadataDiv.append(categoryLocationDuration);

      // b) Title
      const title = h3();
      title.textContent = result.productsTitle || '';
      metadataDiv.append(title);

      // c) Featured content
      const featuredContent = div({ class: 'featured-content' });
      featuredContent.textContent = result.productsFeaturedContent || '';
      metadataDiv.append(featuredContent);

      // d) Buttons div
      const buttonsDiv = div({ class: 'buttons-container' });

      // 1st button - Projects listing
      const projectsListingUrl = currentLanguage === 'fr'
        ? '/fr/fondation-pour-les-arbres-nos-projets'
        : '/en/fondation-pour-les-arbres-projects';
      const projectsListingButton = a({ href: projectsListingUrl, class: 'btn-projects-listing' });
      projectsListingButton.textContent = leftButtonText;

      // 2nd button - Individual project
      const projectDetailButton = a({ href: result.productsPath, class: 'btn-project-detail' });
      projectDetailButton.textContent = rightButtonText;

      buttonsDiv.append(projectsListingButton);
      buttonsDiv.append(projectDetailButton);
      metadataDiv.append(buttonsDiv);

      cardContainer.append(metadataDiv);
      cardContainer.classList.add('parent-container');
      blockContents.push([cardContainer]);
    });
    return blockContents;
  },
};

async function getProductsdata() {
  const { hostname } = window.location;
  let rawProducts1 = [];

  // Helper function to safely fetch with ffetch
  const safeFetch = async (path) => {
    try {
      const result = await ffetch(path)
        .chunks(1000)
        .all();
      return result;
    } catch (error) {
      return null;
    }
  };

  // Determine the path based on domain
  if (hostname.includes('arbres')) {
    const projectsPath = `/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-les-arbres-projects' : 'fondation-pour-les-arbres-nos-projets'}/projects-index.json`;
    const result = await safeFetch(projectsPath);
    if (result) rawProducts1 = result;
  } else if (hostname.includes('biencommun')) {
    const projectsPath = `/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-le-bien-commun-projects' : 'fondation-pour-le-bien-commun-nos-projets'}/projects-index.json`;
    const result = await safeFetch(projectsPath);
    if (result) rawProducts1 = result;
  } else {
    // For localhost or other domains, try arbres first, fallback to biencommun
    const arbresPath = `/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-les-arbres-projects' : 'fondation-pour-les-arbres-nos-projets'}/projects-index.json`;
    const bienCommunPath = `/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-le-bien-commun-projects' : 'fondation-pour-le-bien-commun-nos-projets'}/projects-index.json`;

    let result = await safeFetch(arbresPath);

    // ffetch returns empty array for 404s instead of throwing error
    // So we check if result is null OR an empty array, then try fallback
    if (!result || (Array.isArray(result) && result.length === 0)) {
      result = await safeFetch(bienCommunPath);
    }

    if (result && Array.isArray(result) && result.length > 0) {
      rawProducts1 = result;
    } else {
      rawProducts1 = []; // Ensure it's an empty array
    }
  }

  // Filter by featured metadata first - only include items where featured has content
  const featuredProducts = rawProducts1.filter((item) => item.featured
    && item.featured.trim().length > 0);

  // Function to extract years from duration string
  const extractYears = ((duration) => {
    if (!duration) return { year1: 0, year2: 0 };
    const years = duration.split('→').map((year) => parseInt(year.trim(), 10));
    return {
      year1: years[0] || 0,
      year2: years[1] || 0,
    };
  });

  // Sort the filtered array based on year2 first, then year1
  featuredProducts.sort((item1, item2) => {
    const yearsA = extractYears(item1.duration);
    const yearsB = extractYears(item2.duration);

    // Compare year2 first
    if (yearsB.year2 !== yearsA.year2) {
      return yearsB.year2 - yearsA.year2;
    }
    // If year2 is same, compare year1
    return yearsB.year1 - yearsA.year1;
  });

  return featuredProducts;
}

const loadresults = async (getProducts) => {
  const currentLanguage = getLanguage();

  // Use centrally loaded placeholders, fallback to fetch if not available
  let placeholders = window.placeholders?.[currentLanguage];
  if (!placeholders) {
    placeholders = await fetchPlaceholders(currentLanguage);
  }

  const leftButtonText = placeholders?.homeProjectsLeftButton || '';
  const rightButtonText = placeholders?.homeProjectsRightButton || '';
  const productResults = [];
  getProducts.forEach((product) => {
    // eslint-disable-next-line max-len
    const productResult = new Products(product.partner, product.duration, product.title, product.category, product.image, product.location, product.path, product.featured, product.featuredcontent);
    productResults.push(productResult);
  });
  return resultParsers[blockType](productResults, leftButtonText, rightButtonText);
};

export default async function decorate(block) {
  const getProducts = await getProductsdata();
  const blockContents = await loadresults(getProducts);
  const builtBlock = buildBlock(blockType, blockContents);
  const parentDiv = div(
    builtBlock,
  );

  applyFadeUpAnimation(builtBlock, parentDiv);

  decorateBlock(builtBlock);
  await loadBlock(builtBlock);
  builtBlock.classList.add('featured');
  builtBlock.querySelectorAll('.columns.block > div').forEach((el, idx) => {
    el.classList.add('project-article');
    // Add odd/even background color
    if (idx % 2 === 0) {
      el.style.backgroundColor = 'var(--projet-bg-odd)';
    } else {
      el.style.backgroundColor = 'var(--projet-bg-even)';
    }
  });

  block.append(parentDiv);
}
