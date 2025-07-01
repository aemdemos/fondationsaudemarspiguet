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
}
