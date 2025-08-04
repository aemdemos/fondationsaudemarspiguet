import {
  div, section, input, span, a, h2, img,
} from '../../scripts/dom-helpers.js';
import ffetch from '../../scripts/ffetch.js';
import {
  fetchPlaceholders,
} from '../../scripts/aem.js';
import { getLanguage } from '../../scripts/scripts.js';

async function getNewsdata() {
  const rawNews = await ffetch(`/${getLanguage()}/${getLanguage() === 'en' ? 'fondation-pour-les-arbres-news' : 'fondation-pour-les-arbres-actualites'}/news-index.json`)
    .chunks(1000)
    .all();
  return rawNews;
}

function showNewsArticles(getNews, doc) {
  getNews.forEach((news) => {
    const url = news.path;
    const $newsItem = a({ class: 'news-item', href: url });
    const $newsTitle = h2({ class: 'news-title' }, news.title);
    const $newsDate = span({ class: 'news-date' }, news.date);
    const $newsCategory = span({ class: 'news-category' }, news.category);
    const $newsDescription = div({ class: 'news-description' }, news.description);
    const imageWrapper = div({ class: 'news-image-wrapper' });
    const contentWrapper = div({ class: 'news-content-wrapper' });
    const clearDiv = div({ class: 'clear' });
    const $newsImg = img({ class: 'news-image', src: news.image, alt: news.title });
    imageWrapper.append($newsImg);
    contentWrapper.append($newsCategory, $newsDate, $newsTitle, $newsDescription);
    if (news['article-color']) {
      $newsItem.classList.add(news['article-color']);
    }
    const { layout } = news;
    if (layout) {
      $newsItem.classList.add(layout);
    }
    $newsItem.append(imageWrapper, contentWrapper, clearDiv);
    doc.querySelector('.news-listing').append($newsItem);
  });
}

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('.');
  return new Date(`${year}-${month}-${day}`);
}

export default async function decorate(doc) {
  const $main = doc.querySelector('main');
  const $section = section();
  const $filterContainer = div({ class: 'filter-container' });
  const $newsListingRight = div({ class: 'news-listing-container-right' });
  const $filterTop = a({ class: 'filter-top-btn' });
  const $fitlerBottom = a({ class: 'filter-bottom-btn' });
  $newsListingRight.append($filterTop, $fitlerBottom);
  const placeholders = await fetchPlaceholders(`${getLanguage()}`);
  const { newsLandingCategoryFilter } = placeholders;
  const { newsLandingSearchFilter } = placeholders;
  const { newsLandingViewFilter } = placeholders;
  const $newsListingLeft = div(
    { class: 'news-listing-container-left' },
    div(
      { class: 'category-section' },
      input(
        {
          class: 'category-input', id: 'filtercategories-selectized', placeholder: newsLandingCategoryFilter, type: 'text', autofill: 'no',
        },
      ),
      span({ id: 'width-mirror', style: 'position: absolute; visibility: hidden; white-space: pre; font: inherit;' }, ''),
      div(
        { class: 'category-dropdown' },
      ),
    ),
    span({ class: 'filter-separator' }, ' | '),
    a({ class: 'view-all', href: '#', id: 'view-all' }, newsLandingViewFilter),
    span({ class: 'filter-separator' }, ' | '),
    div(
      { class: 'search-section' },
      input(
        {
          class: 'search-input', id: 'filtersearch', placeholder: newsLandingSearchFilter, type: 'text', minlength: '2', size: '10',
        },
      ),
    ),
    a({ class: 'btn-search-clear', href: '#' }),
  );
  $newsListingRight.append($filterTop, $fitlerBottom);
  $filterContainer.append($newsListingLeft, $newsListingRight);
  const $newsListing = div(
    { class: 'news-listing-container' },
    div(
      { class: 'news-listing' },
    ),
  );
  $section.append($filterContainer, $newsListing);
  const getNews = await getNewsdata();
  console.log(getNews);
  const allCategories = getNews
    .flatMap((item) => (item.category || '').split(','))
    .map((cat) => cat.trim())
    .filter((cat) => cat);
  const uniqueCategories = [...new Set(allCategories)].sort();
  const categoryList = document.createElement('ul');
  uniqueCategories.forEach((category) => {
    const categoryItem = document.createElement('li');
    categoryItem.textContent = category;
    categoryList.appendChild(categoryItem);
  });

  $main.append($section);
  const categorysection = doc.querySelector('.category-dropdown');
  categorysection.appendChild(categoryList);
  const $categoryInput = doc.querySelector('.category-input');
  $categoryInput.addEventListener('click', () => {
    categorysection.style.display = categorysection.style.display === 'block' ? 'none' : 'block';
  });

  const newsListing = document.querySelector('.news-listing');
  const sortedNews = getNews
    .sort((date1, date2) => parseDate(date2.date) - parseDate(date1.date));
  showNewsArticles(sortedNews, doc);
  const categoryItems = categorysection.querySelectorAll('li');
  categoryItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      const selectedCategory = event.target.textContent;
      $categoryInput.value = selectedCategory;
      categorysection.style.display = 'none';
      const filteredNews = getNews.filter((news) => news.category
      && news.category.includes(selectedCategory));
      newsListing.innerHTML = '';
      showNewsArticles(filteredNews, doc);
    });
  });

  document.addEventListener('click', (event) => {
    if (
      !categorysection.contains(event.target)
      && event.target !== $categoryInput
    ) {
      categorysection.style.display = 'none';
    }
  });

  const viewAllButton = doc.getElementById('view-all');
  viewAllButton.addEventListener('click', (event) => {
    event.preventDefault();
    $categoryInput.value = '';
    newsListing.innerHTML = '';
    showNewsArticles(sortedNews, doc);
  });

  const searchInput = document.getElementById('filtersearch');
  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredNews = searchTerm.length < 2
          ? sortedNews
          : sortedNews.filter((news) => {
            const title = news.title.toLowerCase();
            return title.includes(searchTerm);
          });
        newsListing.innerHTML = '';
        showNewsArticles(filteredNews, document);
      }, 300);
    });
  }

  const clearSearchBtn = doc.querySelector('.btn-search-clear');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', (event) => {
      event.preventDefault();
      searchInput.value = '';
      newsListing.innerHTML = '';
      showNewsArticles(getNews, doc);
    });
  }

  const sortByDate = doc.querySelector('.filter-top-btn');
  if (sortByDate) {
    sortByDate.addEventListener('click', (event) => {
      event.preventDefault();
      newsListing.innerHTML = '';
      showNewsArticles(sortedNews, doc);
    });
  }

  const reverseSortByDate = doc.querySelector('.filter-bottom-btn');
  if (reverseSortByDate) {
    reverseSortByDate.addEventListener('click', (event) => {
      event.preventDefault();
      const reverseSortedNews = sortedNews.slice()
        .sort((date1, date2) => parseDate(date1.date) - parseDate(date2.date));
      newsListing.innerHTML = '';
      showNewsArticles(reverseSortedNews, doc);
    });
  }
}
