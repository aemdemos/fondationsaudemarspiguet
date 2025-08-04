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
    constructor(productsPartner, productsDuration, productsTitle, productsCategory, productsImage, productsLocation, productsPath, productsHomepage) {
      this.productsPartner = productsPartner;
      this.productsDuration = productsDuration;
      this.productsTitle = productsTitle;
      this.productsCategory = productsCategory;
      this.productsImage = productsImage;
      this.productsLocation = productsLocation;
      this.productsPath = productsPath;
      this.productsHomepage = productsHomepage;
    }
  }
  
  const blockType = 'columns';
  
    // Result parsers parse the query results into a format that can be used by the block builder for
  // the specific block types
  const resultParsers = {
    // Parse results into a columns block
    columns: (results) => {
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
          result.productsDuration || ''
        ].filter(part => part.trim().length > 0);
        categoryLocationDuration.textContent = parts.join(' | ');
        metadataDiv.append(categoryLocationDuration);

        // b) Title
        const title = h3();
        title.textContent = result.productsTitle || '';
        metadataDiv.append(title);

        // c) Homepage content
        const homepageContent = div({ class: 'homepage-content' });
        homepageContent.textContent = result.productsHomepage || '';
        metadataDiv.append(homepageContent);

        // d) Buttons div
        const buttonsDiv = div({ class: 'buttons-container' });

        // 1st button - Projects listing
        const projectsListingUrl = currentLanguage === 'fr' 
          ? '/fr/fondation-pour-les-arbres-nos-projets' 
          : '/en/fondation-pour-les-arbres-projects';
        const projectsListingText = currentLanguage === 'fr' 
          ? 'Découvrir les projets' 
          : 'Discover the projects';
        const projectsListingButton = a({ href: projectsListingUrl, class: 'btn-projects-listing' });
        projectsListingButton.textContent = projectsListingText;

        // 2nd button - Individual project
        const projectDetailText = currentLanguage === 'fr' 
          ? 'En savoir plus sur ce projet' 
          : 'Learn more about this project';
        const projectDetailButton = a({ href: result.productsPath, class: 'btn-project-detail' });
        projectDetailButton.textContent = projectDetailText;

        buttonsDiv.append(projectsListingButton);
        buttonsDiv.append(projectDetailButton);
        metadataDiv.append(buttonsDiv);

        cardContainer.append(metadataDiv);
        blockContents.push([cardContainer]);
      });
      return blockContents;
    },
  };
  
    async function getProductsdata() {
    let rawProducts1 = await ffetch(`/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-les-arbres-projects' : 'fondation-pour-les-arbres-nos-projets'}/projects-index.json`)
      .chunks(1000)
      .all();

    // Filter by homepage metadata first - only include items where homepage has any content
    const homepageProducts = rawProducts1.filter((item) => item.homepage && item.homepage.trim().length > 0);

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
      const productResult = new Products(product.partner, product.duration, product.title, product.category, product.image, product.location, product.path, product.homepage);
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
  