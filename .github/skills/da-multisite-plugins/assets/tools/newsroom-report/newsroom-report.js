/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import mountMultisiteTool from '../da-multisite/ui.js';
import {
  blockRows, cellLinkPaths, findBlock, rowCells, setCellLinks, setCellText,
} from '../da-multisite/da-blocks.js';

const TYPES = {
  report: { fr: 'Rapport', en: 'Report' },
  leaflet: { fr: 'Brochure', en: 'Leaflet' },
};

const operation = {
  title: 'Newsroom report',
  description: 'Adds or updates one document in the report table of the media newsroom on every selected site and language. Rows are matched by PDF path, so running it twice changes nothing.',
  pages: { fr: '/fr/espace-medias', en: '/en/media-newsroom' },
  fields: [
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      default: 'report',
      options: [
        { value: 'report', label: 'Report / Rapport' },
        { value: 'leaflet', label: 'Leaflet / Brochure' },
      ],
    },
    {
      name: 'title', label: 'Title', type: 'text', localized: true, required: true, maxLength: 200,
    },
    {
      name: 'pdf',
      label: 'PDF',
      type: 'file',
      localized: true,
      required: true,
      accept: 'application/pdf,.pdf',
      extensions: ['pdf'],
      maxBytes: 50 * 1024 * 1024,
      folder: (locale) => `/assets/documents/${locale}`,
      help: 'Stored as /assets/documents/<language>/<file-name>.pdf. Existing files are never overwritten.',
    },
    {
      name: 'position',
      label: 'Position of a new row',
      type: 'select',
      default: 'top',
      options: [
        { value: 'top', label: 'First row' },
        { value: 'bottom', label: 'Last row' },
      ],
    },
  ],
  apply(doc, { target, values }) {
    const table = findBlock(doc, 'table', { sectionStyle: 'report' });
    const rows = blockRows(table);
    if (!rows.length) throw new Error('The report table is empty: add a first row manually.');

    const { path } = values.pdf;
    const linksTo = (row) => rowCells(row)
      .some((cell) => cellLinkPaths(cell, target).includes(path));
    const matches = rows.filter(linksTo);
    if (matches.length > 1) throw new Error(`${matches.length} rows already link to ${path}; fix them manually.`);

    // A clone keeps the site-specific link texts and download icon of this page.
    const row = matches[0] || rows[0].cloneNode(true);
    const cells = rowCells(row);
    if (cells.length !== 3) throw new Error(`Unexpected report row with ${cells.length} columns (expected 3).`);
    setCellText(cells[0], TYPES[values.type][target.locale]);
    setCellText(cells[1], values.title);
    setCellLinks(cells[2], path, target);

    if (matches.length) return { summary: `Update the row for ${path}` };
    if (values.position === 'bottom') table.append(row);
    else table.prepend(row);
    return { summary: `Add a ${values.position === 'bottom' ? 'last' : 'first'} row for ${path}` };
  },
};

mountMultisiteTool({ sdk: DA_SDK, operation, root: document.querySelector('#app') });
