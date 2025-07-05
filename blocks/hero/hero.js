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

export default function decorate(block) {
  // add embedded video into hero block
  if (block.classList.contains('video')) {
    const heroVideoPara = block.querySelector('div:first-of-type > div > p.button-container');
    const heroVideoLink = block.querySelector('div:first-of-type > div >  p.button-container > a');
    const videoURL = heroVideoLink.href;
    const relativeVideoURL = heroVideoLink.getAttribute('href');
    const heroVideoWrapper = document.createElement('video');
    const videoSource = document.createElement('source');
    videoSource.setAttribute('src', videoURL);
    videoSource.setAttribute('type', 'video/mp4');
    heroVideoWrapper.setAttribute('autoplay', '');
    heroVideoWrapper.setAttribute('muted', '');
    heroVideoWrapper.setAttribute('loop', '');
    heroVideoWrapper.setAttribute('nofullscreen', '');
    heroVideoWrapper.setAttribute('playsinline', '');
    heroVideoWrapper.setAttribute('style', 'visibility: visbible; display: inline;');
    heroVideoWrapper.setAttribute('title', relativeVideoURL);
    heroVideoWrapper.className = 'video-cover';
    heroVideoWrapper.append(videoSource);
    heroVideoPara.replaceWith(heroVideoWrapper);

    // Play video after it is in the DOM and ensure it is muted for autoplay
    heroVideoWrapper.muted = true;
    heroVideoWrapper.play().catch(() => {
      // Autoplay might still be blocked, handle error if needed
    });

    const socialCRDiv = block.querySelector('div:nth-of-type(2) > div:first-of-type');
    if (socialCRDiv) {
      socialCRDiv.className = 'social-cr-wrapper';
    }

    const legendDiv = block.querySelector('div:nth-of-type(2) > div:nth-of-type(2)');
    if (legendDiv) {
      legendDiv.className = 'slide-legend';
    }
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
