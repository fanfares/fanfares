module.exports = {
  extends: ['next/core-web-vitals', 'prettier', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['no-only-tests'],
  parser: '@typescript-eslint/parser',
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/']
    }
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'no-only-tests/no-only-tests': ['error', { fix: true }]
  }
};
