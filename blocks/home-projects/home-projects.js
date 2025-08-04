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
  
  const blockType = 'columns';
  
  // Result parsers parse the query results into a format that can be used by the block builder for
  // the specific block types
  const resultParsers = {
    // Parse results into a cards block
    columns: (results) => {
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

    // Filter by homepage metadata first - only include items where homepage = "yes"
    const homepageProducts = rawProducts1.filter((item) => item.homepage && item.homepage.toLowerCase() === 'yes');

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
    homepageProducts.sort((item1, item2) => {
      const yearsA = extractYears(item1.duration);
      const yearsB = extractYears(item2.duration);

      // Compare year2 first
      if (yearsB.year2 !== yearsA.year2) {
        return yearsB.year2 - yearsA.year2;
      }
      // If year2 is same, compare year1
      return yearsB.year1 - yearsA.year1;
    });

    return homepageProducts;
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
    const getProducts = await getProductsdata();
    console.log(getProducts);
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
  }
  