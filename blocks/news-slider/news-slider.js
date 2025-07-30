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
  a,
  p,
} from '../../scripts/dom-helpers.js';
import { getPathSegments } from '../../scripts/utils.js';

class News {
  // eslint-disable-next-line max-len
  constructor(newsTitle, newsCategory, newsImage, newsPath, newsDescription, newsDate) {
    this.newsTitle = newsTitle;
    this.newsCategory = newsCategory;
    this.newsImage = newsImage;
    this.newsPath = newsPath;
    this.newsDescription = newsDescription;
    this.newsDate = newsDate;
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
      const cardLink = a({ href: result.newsPath });

      // Create image container
      const imageContainer = div({ class: 'image-container' });

      if (result.newsImage && result.newsImage.length > 0) {
        const cardImage = createOptimizedPicture(result.newsImage);
        cardImage.classList.add('lazy', 'slide_img');
        imageContainer.append(cardImage);
      }

      cardLink.append(imageContainer);

      // Create category
      const category = div({ class: 'news-listing-cat' });
      category.textContent = result.newsCategory || '';
      cardLink.append(category);

      // Create date
      const date = div({ class: 'news-listing-date' });
      date.textContent = result.newsDate || '';
      cardLink.append(date);

      // Create title
      const title = h3();
      title.textContent = result.newsTitle || '';
      cardLink.append(title);

      // Create description
      const description = p();
      description.textContent = result.newsDescription || '';
      cardLink.append(description);

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

  // Sort news by date in descending order (latest first)
  const sortedNews = rawNews1.sort((newsA, newsB) => {
    // Parse date format "dd.mm.yyyy"
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0);
      const [day, month, year] = dateStr.split('.');
      return new Date(year, month - 1, day);
    };

    const dateA = parseDate(newsA.date);
    const dateB = parseDate(newsB.date);

    return dateB - dateA; // Descending order (latest first)
  });
  return sortedNews;
}

const loadresults = async (getNews) => {
  const newsResults = [];
  getNews.forEach((newsItem) => {
    // eslint-disable-next-line max-len
    const newsResult = new News(newsItem.title, newsItem.category, newsItem.image, newsItem.path, newsItem.description, newsItem.date);
    newsResults.push(newsResult);
  });
  return resultParsers[blockType](newsResults);
};

export default async function decorate(block) {
  const newsData = await getNewsdata();
  const blockContents = await loadresults(newsData);
  const builtBlock = buildBlock(blockType, blockContents);
  const parentDiv = div(
    builtBlock,
  );
  decorateBlock(builtBlock);
  await loadBlock(builtBlock);

  block.append(parentDiv);
}
