export default function decorate(block) {
  // add embedded video into hero block
  if (block.classList.contains('video')) {
    const heroVideoPara = block.querySelector('div:first-of-type > div > p.button-container');
    const heroVideoLink = block.querySelector('div:first-of-type > div >  p.button-container > a');
    const videoURL = heroVideoLink.href;
    const heroVideoWrapper = document.createElement('video');
    const videoSource = document.createElement('source');
    videoSource.setAttribute('src', videoURL);
    videoSource.setAttribute('type', 'video/mp4');
    heroVideoWrapper.setAttribute('title', videoURL);
    heroVideoWrapper.setAttribute('autoplay', '');
    heroVideoWrapper.setAttribute('muted', '');
    heroVideoWrapper.setAttribute('loop', '');
    heroVideoWrapper.setAttribute('nofullscreen', '');
    heroVideoWrapper.setAttribute('playsinline', '');
    heroVideoWrapper.setAttribute('style', 'visibility: visible; display: inline;');
    heroVideoWrapper.className = 'video-cover';
    heroVideoWrapper.append(videoSource);
    heroVideoPara.replaceWith(heroVideoWrapper);

    const socialCRDiv = block.querySelector('div:nth-of-type(2) > div:first-of-type');
    socialCRDiv.className = 'social-cr-wrapper';

    const legendDiv = block.querySelector('div:nth-of-type(2) > div:nth-of-type(2)');
    legendDiv.className = 'slide-legend';
  }
}
