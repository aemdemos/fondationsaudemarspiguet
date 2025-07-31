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
import loadswiper from '../../scripts/delayed.js';

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

      // Create category/categories directly (no wrapper)
      if (result.newsCategory && result.newsCategory.length > 0) {
        // Split by comma, trim, and create a div for each category
        result.newsCategory.split(',').map((cat) => cat.trim()).forEach((cat) => {
          if (cat) {
            const categoryDiv = div({ class: 'news-listing-cat' });
            categoryDiv.textContent = cat;
            cardLink.append(categoryDiv);
          }
        });
      } else {
        // If no category, append an empty category div for consistency
        const categoryDiv = div({ class: 'news-listing-cat' });
        categoryDiv.textContent = '';
        cardLink.append(categoryDiv);
      }

      // Create date
      const date = div({ class: 'news-listing-date' });
      date.textContent = result.newsDate || '';
      // Add the date to the card link (separately from categories)
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

  // Keep parentDiv for decorateBlock to work properly
  const parentDiv = div(builtBlock);

  decorateBlock(builtBlock);
  await loadBlock(builtBlock);

  // Work with existing UL/LI structure for Swiper
  // Add Swiper classes to existing elements
  const cardsBlock = parentDiv.querySelector('.cards');
  if (cardsBlock) {
    cardsBlock.classList.add('swiper', 'news-swiper');
  }

  // Find the ul and add swiper-wrapper class
  const ul = parentDiv.querySelector('ul');
  if (ul) {
    ul.classList.add('swiper-wrapper');

    // Add swiper-slide class to each li
    Array.from(ul.children).forEach((li) => {
      if (li.tagName === 'LI') {
        li.classList.add('swiper-slide');
      }
    });
  }

  // Add navigation buttons to the cards block
  if (cardsBlock) {
    const prevButton = div({ class: 'swiper-button-prev' });
    const nextButton = div({ class: 'swiper-button-next' });
    cardsBlock.appendChild(prevButton);
    cardsBlock.appendChild(nextButton);

    // Add pagination
    const pagination = div({ class: 'swiper-pagination' });
    cardsBlock.appendChild(pagination);
  }

  console.log('🔧 Swiper structure applied to existing UL/LI:', parentDiv);
  block.append(parentDiv);

  // Initialize Swiper
  console.log('🔄 Loading Swiper from CDN...');
  loadswiper().then((Swiper) => {
    console.log('✅ Swiper loaded successfully, initializing...');
    try {
      // Function to update slide opacity based on visibility
      const updateSlideOpacity = (swiperInstance) => {
        const { slides, activeIndex, params } = swiperInstance;
        const { slidesPerView } = params;

        // Calculate how many slides are currently visible
        let currentSlidesPerView = 1;
        if (typeof slidesPerView === 'number') {
          currentSlidesPerView = slidesPerView;
        } else if (swiperInstance.currentBreakpoint) {
          currentSlidesPerView = swiperInstance.passedParams.slidesPerView;
        }

        slides.forEach((slide, index) => {
          // A slide is considered visible if it's within the active range
          const isVisible = index >= activeIndex && index < activeIndex + currentSlidesPerView;

          if (isVisible) {
            slide.style.opacity = '1';
            slide.classList.add('swiper-slide-visible');
          } else {
            slide.style.opacity = '0.2';
            slide.classList.remove('swiper-slide-visible');
          }
        });
      };

      // eslint-disable-next-line no-unused-vars
      const swiper = new Swiper('.news-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        },
        on: {
          init() {
            updateSlideOpacity(this);
          },
          slideChange() {
            updateSlideOpacity(this);
          },
          breakpoint() {
            // Update opacity when breakpoint changes (screen resize)
            setTimeout(() => updateSlideOpacity(this), 100);
          },
        },
      });
      console.log('🎉 Swiper initialized successfully with UL/LI structure');
    } catch (error) {
      console.error('❌ Failed to create Swiper instance:', error);
    }
  }).catch((error) => {
    console.error('❌ Failed to load Swiper from CDN:', error);
  });
}
