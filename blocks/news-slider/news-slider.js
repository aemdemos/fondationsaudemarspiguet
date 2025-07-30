import {
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
import { getPathSegments } from '../../scripts/utils.js';

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

async function getNewsdata() {
  const rawNews1 = await ffetch(`/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-les-arbres-news' : 'fondation-pour-les-arbres-actualites'}/news-index.json`)
    .chunks(1000)
    .all();
  return rawNews1;
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
  const getNews = await getNewsdata();
  const blockContents = await loadresults(getNews);
  const builtBlock = buildBlock(blockType, blockContents);
  const parentDiv = div(
    builtBlock,
  );
  decorateBlock(builtBlock);
  await loadBlock(builtBlock);

  block.append(parentDiv);
}
