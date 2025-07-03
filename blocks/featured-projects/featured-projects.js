import { fetchPlaceholders } from '../../scripts/aem.js';
import { getLanguage } from '../../scripts/scripts.js';
import ffetch from '../../scripts/ffetch.js';

class Products {
  constructor(productsPartner, productsDuration, productsTitle, productsCategory, productsImage) {
    this.productsPartner = productsPartner;
    this.productsDuration = productsDuration;
    this.productsTitle = productsTitle;
    this.productsCategory = productsCategory;
    this.productsImage = productsImage;
  }
}

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
  rawProducts1.sort((a, b) => {
    const yearsA = extractYears(a.duration);
    const yearsB = extractYears(b.duration);

    // Compare year2 first
    if (yearsB.year2 !== yearsA.year2) {
      return yearsB.year2 - yearsA.year2;
    }
    // If year2 is same, compare year1
    return yearsB.year1 - yearsA.year1;
  });

  console.log(rawProducts1);

  // Get the first 3 entries from the sorted data
  const firstThreeProducts = rawProducts1.slice(0, 3);

  return firstThreeProducts;
}

const loadresults = async (getProducts) => {
  const productResults = [];
  getProducts.forEach((product) => {
    // eslint-disable-next-line max-len
    const productResult = new Products(product.partner, product.duration, product.title, product.category, product.image);
    productResults.push(productResult);
  });
  console.log(productResults);
};

export default async function decorate(block) {
  const template = block.querySelector('div > div')?.textContent?.trim();

  const placeholders = await fetchPlaceholders(`${getLanguage()}`);

  // Create the heading based on template
  const heading = document.createElement('h2');
  const headerText = template === 'news-article' ? placeholders.featuredProjectsHeadingOnNewsArticles : placeholders.featuredProjectsHeadingOnProjectArticles;
  heading.textContent = headerText;

  const templateCell = block.querySelector('div > div');
  if (templateCell) {
    templateCell.remove();
  }

  block.prepend(heading);

  const getProducts = await getProductsdata();
  await loadresults(getProducts);
}
