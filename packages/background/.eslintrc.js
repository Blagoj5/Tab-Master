module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:import/typescript', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './packages/background/tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'import/extensions': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
  globals: {
    chrome: true,
    browser: true,
  },
};
