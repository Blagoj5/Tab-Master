module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
  ],
  rules: {},
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
    currentPage: true,
  },
};
