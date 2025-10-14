module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error'
  },
  globals: {
    console: 'readonly',
    window: 'readonly',
    document: 'readonly',
    tetrisGame: 'readonly',
    settingsManager: 'readonly'
  }
};