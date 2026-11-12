module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
  },
  ignorePatterns: ['tools/importer/**/*'],
  overrides: [
    {
      // Node CLI scripts for bulk DA content changes
      files: ['tools/da-bulk/**/*.mjs'],
      env: { node: true, browser: false, es2020: true },
      rules: {
        'no-console': 'off',
        'import/extensions': ['error', { js: 'always', mjs: 'always' }],
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },
  ],
};
