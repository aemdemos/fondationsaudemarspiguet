import decorate from '../templates/news-article/news-article.js';

const summary = document.querySelector('#summary');
const results = document.querySelector('#results');
let failures = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function check(language, right) {
  const result = document.createElement('li');
  try {
    document.querySelector('meta[name="language"]').content = language;
    window.placeholders = {
      [`news-article-${language}-properties`]: { singleLink: 'Link', multipleLinks: 'Links' },
    };
    document.querySelector('main').innerHTML = `
      <div class="section carousel-container"></div>
      <div class="section details-sidebar${right ? ' right' : ''}">
        <div class="default-content-wrapper">
          <p><a id="report" href="/shared-media/rapport.pdf" data-aue-prop="text">Report</a></p>
          <p><a id="query" href="https://example.com/report.PDF?download=1#page=2" rel="author">Report</a></p>
          <p><a id="page" href="/news/report">Page</a></p>
          <p><a id="other" href="/shared-media/report.docx">Document</a></p>
          <p><a id="fake" href="/report.pdf/other">Not a PDF</a></p>
          <p><a id="mail" href="mailto:report.pdf">Email</a></p>
          <p class="button-container"><a id="button" href="/news">More articles</a></p>
        </div>
      </div>
      <div class="section featured-projects-container">
        <a id="outside" href="/outside.pdf">Outside article</a>
      </div>
    `;
    await decorate(document);

    ['report', 'query'].forEach((id) => {
      const link = document.getElementById(id);
      assert(link.target === '_blank', `${id}: expected a new tab`);
      assert(link.relList.contains('noopener') && link.relList.contains('noreferrer'), `${id}: missing rel`);
    });
    assert(document.getElementById('query').relList.contains('author'), 'Existing rel was lost');
    assert(document.getElementById('report').getAttribute('data-aue-prop') === 'text', 'Instrumentation was lost');
    ['page', 'other', 'fake', 'mail', 'button', 'outside'].forEach((id) => {
      assert(!document.getElementById(id).hasAttribute('target'), `${id}: target changed`);
    });
    result.textContent = `PASS: ${language}, ${right ? 'right' : 'left'} sidebar`;
  } catch (error) {
    failures += 1;
    result.textContent = `FAIL: ${language}, ${right ? 'right' : 'left'} sidebar: ${error.message}`;
  }
  results.append(result);
}

await check('fr', false);
await check('fr', true);
await check('en', false);
await check('en', true);
summary.textContent = failures ? `${failures} checks failed` : 'All checks passed';
summary.dataset.failures = failures;
