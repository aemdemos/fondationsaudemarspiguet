import { LOCALES } from '../da-multisite/sites.js';
import { parseDocument, sitePath } from '../da-multisite/core.js';
import { loadMapping, mapPath, pageSource } from '../da-multisite/language-pages.js';
import createMetadataOperation from '../metadata-sync/operation.js';

// Article folders used by the News and Projects listing templates.
const ARTICLE_FOLDERS = [
  { en: '/fondation-pour-les-arbres-projects', fr: '/fondation-pour-les-arbres-nos-projets' },
  { en: '/fondation-pour-le-bien-commun-projects', fr: '/fondation-pour-le-bien-commun-nos-projets' },
  { en: '/fondation-pour-les-arbres-news', fr: '/fondation-pour-les-arbres-actualites' },
  { en: '/fondation-pour-le-bien-commun-news', fr: '/fondation-pour-le-bien-commun-actualites' },
];

const TRANSLATION_WARNING = 'Do not forget to translate the new page before publishing. The entire document is copied unchanged, including links, metadata names, values and any Language row. Review these for the target language.';

export default function createPageOperation() {
  return {
    title: 'Page sync',
    fields: [],
    pages: {},

    async setup({ context, api }) {
      const source = pageSource(context);
      const folder = ARTICLE_FOLDERS.find((pair) => source.path
        .startsWith(`/${source.locale}${pair[source.locale]}/`));
      if (!folder || source.path.endsWith('/') || source.path.endsWith('/index')) {
        throw new Error('Open this tool from a News or Projects article, not a listing page.');
      }
      const locale = LOCALES.find((code) => code !== source.locale);
      const loaded = await loadMapping(api, source);
      // The known folder pair handles new slugs even when the sheet has no page-specific entry.
      const mappedRows = loaded.rows.filter((row) => String(row[locale] ?? '').trim());
      const mapping = { ...loaded, rows: [...mappedRows, folder] };
      const target = { locale, ...mapPath(source.path, source.locale, locale, mapping.rows) };
      target.path = sitePath(target.path);
      if (!target.path.startsWith(`/${locale}${folder[locale]}/`)
        || target.path.endsWith('/') || target.path.endsWith('/index')) {
        throw new Error('The language-switcher counterpart must be an article in the matching News or Projects folder.');
      }
      const destination = { ...source, ...target };
      const current = await api.getDocument(destination);
      if (current.ok) {
        const { setup, ...metadata } = createMetadataOperation({
          source, mapping, targets: [target],
        });
        const configured = await setup({ context, api });
        return {
          ...metadata,
          ...configured,
          title: 'Page sync',
          description: `The ${locale.toUpperCase()} page already exists. It will never be replaced by a full copy. Select one metadata row to sync. ${configured.description}`,
        };
      }
      if (current.status !== 404) {
        throw new Error(`Cannot check the counterpart (HTTP ${current.status}). No page will be created.`);
      }

      const sourcePrefix = `/${source.locale}${folder[source.locale]}`;
      const sameSlug = target.path === `/${locale}${folder[locale]}${source.path.slice(sourcePrefix.length)}`;
      return {
        siteIds: [source.site.id],
        locales: [locale],
        pages: { [locale]: sitePath(target.path) },
        description: `Creates the missing ${locale.toUpperCase()} page ${target.path} from ${source.path} on the same site. `
          + `${sameSlug ? 'The name is kept in the other language folder. ' : 'The language-switcher supplies the counterpart path. '}`
          + 'The saved source is copied exactly, without translating or rewriting anything. This page is never modified. Wait for DA to save your edits before analysing. '
          + `${TRANSLATION_WARNING}`
          + `${loaded.error ? ` Language-switcher sheet unavailable: ${loaded.error} Using the known article folder pair.` : ''}`,
        async load({ api: currentApi }) {
          const page = await currentApi.getDocument(source);
          if (!page.ok) throw new Error(`Cannot read the current page (HTTP ${page.status}).`);
          if (!page.html.trim() || !parseDocument(page.html).querySelector('main')) {
            throw new Error('The saved source has no page content. Save the page in DA before analysing.');
          }
          return { html: page.html };
        },
        create({ shared }) {
          return {
            html: shared.html,
            summary: `Create an identical ${locale.toUpperCase()} copy of ${source.path}.`,
            warning: TRANSLATION_WARNING,
          };
        },
      };
    },
  };
}
