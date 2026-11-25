/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import mountMultisiteTool from '../da-multisite/ui.js';
import createPageOperation from './operation.js';

mountMultisiteTool({
  sdk: DA_SDK,
  operation: createPageOperation(),
  root: document.querySelector('#app'),
});
