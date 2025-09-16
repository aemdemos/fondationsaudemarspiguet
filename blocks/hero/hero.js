export function createTwoColumnarHeroBlock({
  subheading,
  imageUrl,
  imageAlt = '',
}) {
  // Create main block container
  const block = document.createElement('section');
  block.className = 'hero two-columnar-text-image block';

  // Create inner flex container
  const inner = document.createElement('div');

  // Left column (text)
  const left = document.createElement('div');
  left.innerHTML = `
    <p>${subheading}</p>
  `;

  // Right column (image)
  const right = document.createElement('div');
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = imageAlt;
  right.appendChild(img);

  // Assemble columns
  inner.appendChild(left);
  inner.appendChild(right);
  block.appendChild(inner);

  return block;
}

function createVideoElement(videoUrl, imageUrl) {
  // Create the video element HTML

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
      <video autoplay="" muted="" loop="" poster="${imageUrl}">
          <source src="${videoUrl}" type="video/mp4">
      </video>
  `;

  return wrapper.firstElementChild;
}

export default function decorate(block) {
  if (!block.querySelector('img')) {
    block.classList.add('without-image');
  }

  if (block.classList.contains('video')) {
    // get video url from all anchors tags having mp4 extension
    const videoUrls = [...block.querySelectorAll('a')]
      .filter((a) => a.href.endsWith('.mp4'))
      .map((a) => a.href);
    const videoUrl = videoUrls[0];

    const imageUrl = block.querySelector('img').src;
    block.querySelector('img')?.closest('p')?.remove();
    block.querySelector('a[href$=".mp4"]')?.closest('p')?.remove();
    const videoElement = createVideoElement(videoUrl, imageUrl);
    block.querySelector('div').prepend(videoElement); // appending video element to the div
  }

  const socialCRDiv = block.querySelector('div:nth-of-type(2) > div:first-of-type');
  if (socialCRDiv) {
    socialCRDiv.className = 'social-cr-wrapper';
  }

  const legendDiv = block.querySelector('div:nth-of-type(2) > div:nth-of-type(2)');
  if (legendDiv) {
    legendDiv.className = 'slide-legend';
  }

  // Detect and render two-columnar-text-image hero block
  if (block.classList.contains('two-columnar-text-image')) {
    // Example: extract content from block or use static content
    const heading = block.querySelector('h1')?.textContent || 'Your Heading';
    const subheading = block.querySelector('p')?.textContent || 'Your subheading goes here.';
    const button = block.querySelector('a');
    const buttonText = button?.textContent || 'Learn More';
    const buttonUrl = button?.href || '#';
    const image = block.querySelector('img');
    const imageUrl = image?.src || '/path/to/image.jpg';
    const imageAlt = image?.alt || '';

    const heroBlock = createTwoColumnarHeroBlock({
      heading,
      subheading,
      buttonText,
      buttonUrl,
      imageUrl,
      imageAlt,
    });

    block.replaceWith(heroBlock);
  }
}