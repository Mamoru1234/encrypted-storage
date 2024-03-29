module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'quotes': ['error', 'single']
  },
  root: true,
  env: {
    node: true,
  },
};
