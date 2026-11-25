/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import mountMultisiteTool from '../da-multisite/ui.js';
import createMetadataOperation from './operation.js';

mountMultisiteTool({
  sdk: DA_SDK,
  operation: createMetadataOperation({ preset: new URLSearchParams(window.location.search).get('row') || '' }),
  root: document.querySelector('#app'),
});
