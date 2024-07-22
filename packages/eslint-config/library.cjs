const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['unused-imports', 'no-relative-import-paths'],
  extends: [
    'eslint:recommended',
    'prettier',
    'eslint-config-turbo',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    // Ignore dotfiles
    'jest.config.js',
    'tsconfig.tsbuildinfo', // tsconfig.tsbuildinfo
    '.*.js',
    'node_modules/',
    'dist/',
    'types/generated/*',
  ],
  overrides: [
    {
      files: ['*.(m)js?(x)', '*.(m)ts?(x)'],
    },
  ],
  rules: {
    'import/no-cycle': 'error',
    'import/no-absolute-path': 'error',
    'import/no-unresolved': 'off',
    'no-unused-vars': 'off',
    // plugin:unused-imports */
    'unused-imports/no-unused-vars': [
      'off',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],

    // plugin:@typescript-eslint */
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',

    //* plugin:no-relative-import-paths */
    'no-relative-import-paths/no-relative-import-paths': [
      'error',
      { allowSameFolder: true, allowedDepth: 5 },
    ],

    //* plugin:import */
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
        },
        warnOnUnassignedImports: true,
      },
    ],
  },
}
