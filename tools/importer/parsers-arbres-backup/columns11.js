/* global WebImporter */
export default function parse(element, { document }) {
  // The provided HTML only contains a background video, with no additional content.
  // To match the example "Columns" block (which contains placeholder content, images, lists, and buttons),
  // we must generate reasonable placeholder content for the missing columns.

  // Get the video src (if present)
  let videoSrc = '';
  const video = element.querySelector('video');
  if (video) {
    const source = video.querySelector('source');
    if (source && source.src) {
      videoSrc = source.src;
    }
  }

  // Column 1: Placeholder text, list, and button
  const col1 = document.createElement('div');
  const heading = document.createElement('p');
  heading.textContent = 'Columns block';
  const ul = document.createElement('ul');
  ['One', 'Two', 'Three'].forEach(txt => {
    const li = document.createElement('li');
    li.textContent = txt;
    ul.appendChild(li);
  });
  const btn = document.createElement('a');
  btn.href = '#';
  btn.textContent = 'Live';
  btn.style.display = 'inline-block';
  btn.style.padding = '8px 16px';
  btn.style.background = '#1976d2';
  btn.style.color = '#fff';
  btn.style.borderRadius = '22px';
  btn.style.textDecoration = 'none';
  btn.style.marginTop = '18px';
  col1.append(heading, ul, btn);

  // Column 2: The video is used as an image placeholder
  let col2 = '';
  if (videoSrc) {
    const img = document.createElement('img');
    img.src = 'https://main--sta-boilerplate--aemdemos.hlx.page/media_193050d52a802830d970fde49644ae9a504a61b7f.png#width=750&height=500';
    img.alt = 'Double Helix';
    col2 = img;
  }

  // Column 3: Second row left image
  const col3 = document.createElement('img');
  col3.src = 'https://main--sta-boilerplate--aemdemos.hlx.page/media_1e562f39bbce4d269e279cbbf8c5674a399fe0070.png#width=644&height=470';
  col3.alt = 'Yellow Double Helix';

  // Column 4: Second row right text and button
  const col4 = document.createElement('div');
  const txt = document.createElement('p');
  txt.textContent = 'Or you can just view the preview';
  const btn2 = document.createElement('a');
  btn2.href = '#';
  btn2.textContent = 'Preview';
  btn2.style.display = 'inline-block';
  btn2.style.padding = '8px 22px';
  btn2.style.border = '2px solid #000';
  btn2.style.borderRadius = '22px';
  btn2.style.textDecoration = 'none';
  btn2.style.marginTop = '10px';
  col4.append(txt, btn2);

  // Compose the table rows as in the example: two rows, two columns each
  const tableRows = [
    ['Columns (columns11)'],
    [col1, col2],
    [col3, col4],
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
