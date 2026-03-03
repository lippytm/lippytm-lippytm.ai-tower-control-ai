'use strict';

module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    // Catch unused vars; allow underscore-prefixed names used as placeholders
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', argsIgnorePattern: '^_' }],
    // Require semicolons
    semi: ['error', 'always'],
    // Enforce single quotes
    quotes: ['error', 'single', { avoidEscape: true }],
    // Prevent accidental use of == instead of ===
    eqeqeq: ['error', 'always'],
    // Disallow eval
    'no-eval': 'error',
    // Warn on console – acceptable in a server logger context so keep as warn
    'no-console': 'warn',
  },
};
