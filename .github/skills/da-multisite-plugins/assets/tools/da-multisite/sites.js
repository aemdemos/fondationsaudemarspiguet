/**
 * Site and locale registry shared by multi-site DA tools.
 * Keep this list in code (reviewed and versioned): never read targets from
 * query parameters, author input or remote sheets.
 */

export const ORG = 'audemars-piguet';
export const REF = 'main';

export const LOCALES = Object.freeze(['fr', 'en']);

export const SITES = Object.freeze([
  Object.freeze({ id: 'fondations', repo: 'fondationsaudemarspiguet', label: 'Fondations' }),
  Object.freeze({ id: 'arbres', repo: 'arbres-fondationsaudemarspiguet', label: 'Arbres' }),
  Object.freeze({ id: 'biencommun', repo: 'biencommun-fondationsaudemarspiguet', label: 'Bien Commun' }),
]);
