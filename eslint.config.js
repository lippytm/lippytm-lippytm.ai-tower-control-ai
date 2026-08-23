'use strict';

const js = require('@eslint/js');
const globals = require('globals');

/** Shared rule set used across all file groups. */
const sharedRules = {
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
};

module.exports = [
  // Apply recommended rules to all JS files
  js.configs.recommended,

  // Source files
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      globals: { ...globals.node },
    },
    rules: sharedRules,
  },

  // Jest test files (*.test.js) — expose jest globals
  {
    files: ['tests/**/*.test.js'],
    languageOptions: {
      ecmaVersion: 2021,
      globals: { ...globals.node, ...globals.jest },
    },
    rules: sharedRules,
  },

  // Fleet/Node assertion-style test scripts (test_*.js)
  {
    files: ['tests/**/*.js'],
    ignores: ['tests/**/*.test.js'],
    languageOptions: {
      ecmaVersion: 2021,
      globals: { ...globals.node },
    },
    rules: sharedRules,
  },
];
