import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { applyMetadataOperations, parseOperation, toMetaName } from '../lib/metadata-block.mjs';

const page = (metadataRows, { extra = '' } = {}) => `<body><header></header><main><div><h1>Title &amp; more</h1><p>Body</p></div><div>${extra}<div class="metadata">${metadataRows}</div></div></main><footer></footer></body>`;
const row = (key, value) => `<div><div><p>${key}</p></div><div><p>${value}</p></div></div>`;
const ops = (...items) => items.map(([type, raw]) => parseOperation(type, raw));

describe('applyMetadataOperations', () => {
  it('renames a key, keeps the value and leaves the rest byte-identical', () => {
    const html = page(row('Title', 'Hello') + row('Featured', 'yes') + row('Template', 'project'));
    const result = applyMetadataOperations(html, ops(['rename', 'Featured=Homepage highlight']));
    assert.equal(result.status, 'changed');
    assert.equal(result.html, html.replace('<p>Featured</p>', '<p>Homepage highlight</p>'));
    assert.deepEqual(result.changes, ['rename "Featured" -> "Homepage highlight" (value: "yes")']);
  });

  it('matches keys like the EDS pipeline (case and spacing)', () => {
    const html = page(row('FEATURED ', 'yes'));
    const result = applyMetadataOperations(html, ops(['rename', 'featured=Homepage highlight']));
    assert.equal(result.status, 'changed');
    assert.match(result.html, /<p>Homepage highlight<\/p>/);
    assert.equal(toMetaName('Durée du projet'), 'dur-e-du-projet');
  });

  it('keeps formatting wrappers of the key cell', () => {
    const html = page('<div><div><p><strong>Featured</strong></p></div><div><p>yes</p></div></div>');
    const result = applyMetadataOperations(html, ops(['rename', 'Featured=Homepage highlight']));
    assert.match(result.html, /<p><strong>Homepage highlight<\/strong><\/p>/);
  });

  it('is unchanged when the key is absent', () => {
    const html = page(row('Title', 'Hello'));
    const result = applyMetadataOperations(html, ops(['rename', 'Featured=Homepage highlight']));
    assert.equal(result.status, 'unchanged');
    assert.equal(result.html, html);
    assert.deepEqual(result.notes, ['"Featured" not found']);
  });

  it('refuses a rename onto an existing key', () => {
    const html = page(row('Featured', 'yes') + row('Homepage highlight', 'no'));
    const result = applyMetadataOperations(html, ops(['rename', 'Featured=Homepage highlight']));
    assert.equal(result.status, 'error');
    assert.equal(result.html, html);
  });

  it('allows a case-only rename', () => {
    const html = page(row('featured', 'yes'));
    const result = applyMetadataOperations(html, ops(['rename', 'featured=Featured']));
    assert.equal(result.status, 'changed');
    assert.match(result.html, /<p>Featured<\/p>/);
  });

  it('refuses ambiguous duplicates for rename and set', () => {
    const html = page(row('Featured', 'a') + row('featured', 'b'));
    assert.equal(applyMetadataOperations(html, ops(['rename', 'Featured=X'])).status, 'error');
    assert.equal(applyMetadataOperations(html, ops(['set', 'Featured=c'])).status, 'error');
  });

  it('sets an existing value and escapes HTML', () => {
    const html = page(row('Theme', 'dark'));
    const result = applyMetadataOperations(html, ops(['set', 'Theme=light <b> & co']));
    assert.equal(result.html, html.replace('<p>dark</p>', '<p>light &lt;b&gt; &amp; co</p>'));
  });

  it('replaces a link value instead of keeping a stale href', () => {
    const html = page('<div><div><p>Link</p></div><div><p><a href="https://old.example">old</a></p></div></div>');
    const result = applyMetadataOperations(html, ops(['set', 'Link=none']));
    assert.match(result.html, /<div><p>none<\/p><\/div>/);
    assert.doesNotMatch(result.html, /old\.example/);
  });

  it('is unchanged when set has the same value', () => {
    const html = page(row('Theme', 'dark'));
    assert.equal(applyMetadataOperations(html, ops(['set', 'Theme=dark'])).status, 'unchanged');
  });

  it('set and add append a row with the same cell markup', () => {
    const html = page(row('Title', 'Hello'));
    const expected = page(row('Title', 'Hello') + row('Start Date', '15.03.2026'));
    assert.equal(applyMetadataOperations(html, ops(['set', 'Start Date=15.03.2026'])).html, expected);
    assert.equal(applyMetadataOperations(html, ops(['add', 'Start Date=15.03.2026'])).html, expected);
  });

  it('appends without <p> when existing cells do not use them', () => {
    const html = page('<div><div>Title</div><div>Hello</div></div>');
    const result = applyMetadataOperations(html, ops(['add', 'Theme=dark']));
    assert.match(result.html, /<div><div>Title<\/div><div>Hello<\/div><\/div><div><div>Theme<\/div><div>dark<\/div><\/div><\/div>/);
  });

  it('add does not overwrite an existing key', () => {
    const html = page(row('Theme', 'dark'));
    const result = applyMetadataOperations(html, ops(['add', 'theme=light']));
    assert.equal(result.status, 'unchanged');
    assert.equal(result.html, html);
  });

  it('deletes every row with the key', () => {
    const html = page(row('Title', 'Hello') + row('Featured', 'a') + row('featured', 'b'));
    const result = applyMetadataOperations(html, ops(['delete', 'Featured']));
    assert.equal(result.html, page(row('Title', 'Hello')));
  });

  it('applies operations in order', () => {
    const html = page(row('Featured', 'yes'));
    const result = applyMetadataOperations(html, ops(
      ['rename', 'Featured=Homepage highlight'],
      ['set', 'Homepage highlight=no'],
      ['add', 'Theme=dark'],
    ));
    assert.equal(result.html, page(row('Homepage highlight', 'no') + row('Theme', 'dark')));
    assert.equal(result.changes.length, 3);
  });

  it('is all-or-nothing when a later operation fails', () => {
    const html = page(row('Featured', 'yes') + row('Theme', 'a') + row('theme', 'b'));
    const result = applyMetadataOperations(html, ops(['delete', 'Featured'], ['set', 'Theme=c']));
    assert.equal(result.status, 'error');
    assert.equal(result.html, html);
    assert.deepEqual(result.changes, []);
  });

  it('skips pages without a Metadata block and ignores section-metadata', () => {
    const html = '<body><main><div><div class="section-metadata"><div><div>Featured</div><div>x</div></div></div></div></main></body>';
    const result = applyMetadataOperations(html, ops(['rename', 'Featured=X']));
    assert.equal(result.status, 'skipped');
    assert.equal(result.html, html);
  });

  it('refuses pages with several Metadata blocks', () => {
    const html = page(row('Featured', 'yes'), { extra: `<div class="metadata">${row('Theme', 'dark')}</div>` });
    assert.equal(applyMetadataOperations(html, ops(['delete', 'Theme'])).status, 'error');
  });

  it('ignores Featured text outside the Metadata block', () => {
    const html = page(row('Featured', 'yes'), { extra: '<div class="cards"><div><div><p>Featured</p></div></div></div>' });
    const result = applyMetadataOperations(html, ops(['rename', 'Featured=Homepage highlight']));
    assert.match(result.html, /<div class="cards"><div><div><p>Featured<\/p>/);
    assert.match(result.html, /<div class="metadata"><div><div><p>Homepage highlight<\/p>/);
  });

  it('supports the imported table form', () => {
    const html = '<body><main><div><table><tbody><tr><td colspan="2">Metadata</td></tr><tr><td>Featured</td><td>yes</td></tr></tbody></table></div></main></body>';
    const result = applyMetadataOperations(html, ops(
      ['rename', 'Featured=Homepage highlight'],
      ['add', 'Theme=dark'],
    ));
    assert.equal(
      result.html,
      '<body><main><div><table><tbody><tr><td colspan="2">Metadata</td></tr><tr><td>Homepage highlight</td><td>yes</td></tr><tr><td>Theme</td><td>dark</td></tr></tbody></table></div></main></body>',
    );
  });

  it('adds the first row to an empty block', () => {
    const html = page('');
    assert.equal(applyMetadataOperations(html, ops(['add', 'Theme=dark'])).html, page(row('Theme', 'dark')));
  });

  it('preserves non-ASCII text and entities elsewhere', () => {
    const html = page(row('Durée du projet', '2020 – 2024') + row('Featured', 'oui'));
    const result = applyMetadataOperations(html, ops(['rename', 'Featured=Mise en avant accueil']));
    assert.equal(result.html, html.replace('<p>Featured</p>', '<p>Mise en avant accueil</p>'));
  });
});

describe('parseOperation', () => {
  it('parses operations', () => {
    assert.deepEqual(parseOperation('rename', 'Featured = Homepage highlight'), { type: 'rename', from: 'Featured', to: 'Homepage highlight' });
    assert.deepEqual(parseOperation('set', 'Link=https://a.example/?x=1'), { type: 'set', key: 'Link', value: 'https://a.example/?x=1' });
    assert.deepEqual(parseOperation('set', 'Featured='), { type: 'set', key: 'Featured', value: '' });
    assert.deepEqual(parseOperation('delete', ' Featured '), { type: 'delete', key: 'Featured' });
  });

  it('rejects invalid input', () => {
    assert.throws(() => parseOperation('rename', 'Featured'));
    assert.throws(() => parseOperation('rename', 'Featured='));
    assert.throws(() => parseOperation('set', '=value'));
    assert.throws(() => parseOperation('delete', ' '));
    assert.throws(() => parseOperation('move', 'a=b'));
  });
});
