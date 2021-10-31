module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-console': 'off',
    'react/forbid-prop-types': 'off',
    'arrow-body-style': 'off',
    'react/require-default-props': 'off',
  },
  ignorePatterns: [
    'bundle.js',
    '.bundle.js',
    'siteBundle.js',
  ],
};
