module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: ['./packages/common/tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'import/extensions': 'off',
  },
  extends: ['plugin:import/typescript'],
};
