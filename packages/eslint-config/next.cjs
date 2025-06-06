const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
module.exports = {
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    '*.cjs', // .eslint.cjs
    '*.config.ts', // vite config
    '*.module.css.d.ts', // generated css module types
    'tsconfig.tsbuildinfo', // tsconfig.tsbuildinfo
    'node_modules/',
    'out/',
    'types/generated/*',
    'scripts/get-config-types.js',
    'scripts/get-rays-config-types.js',
  ],
  overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }],
  plugins: [
    '@typescript-eslint',
    'no-relative-import-paths',
    'prettier',
    'react-hooks',
    'react',
    'simple-import-sort',
    'unused-imports',
    'import',
  ],
  extends: [
    'eslint:recommended',
    'eslint-config-turbo',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:@next/next/recommended',
  ],
  rules: {
    //* eslint base */
    //* eslint base - possible problems */

    'array-callback-return': 'error',
    'constructor-super': 'error',
    'no-constructor-return': 'error',
    'no-duplicate-imports': 'error',
    'no-promise-executor-return': 'warn',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'error',
    'no-this-before-super': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unreachable-loop': 'error',
    'no-use-before-define': 'error',
    'require-atomic-updates': 'error',

    //* eslint base - suggestions */

    'accessor-pairs': 'error',
    'block-scoped-var': 'error',
    camelcase: 'error',
    'consistent-return': 'warn',
    'default-case-last': 'error',
    'dot-notation': 'error',
    eqeqeq: [
      'error',
      'always',
      {
        null: 'ignore',
      },
    ],
    'new-cap': 'error',
    'no-alert': 'error',
    'no-array-constructor': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-console': 'error',
    'no-continue': 'error',
    'no-delete-var': 'error',
    'no-div-regex': 'error',
    'no-eq-null': 'off',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': ['error', { boolean: false }],
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-magic-numbers': 'warn',
    'no-mixed-operators': 'error',
    'no-multi-assign': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-proto': 'error',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-sequences': 'error',
    'no-shadow': 'off',
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-unneeded-ternary': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'object-shorthand': ['error', 'always'],
    'one-var': ['error', 'never'],
    'one-var-declaration-per-line': ['error', 'always'],
    'operator-assignment': ['error', 'always'],
    'prefer-arrow-callback': 'error',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'prefer-destructuring': 'error',
    'prefer-exponentiation-operator': 'error',
    'prefer-object-spread': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-regex-literals': 'error',
    'prefer-template': 'error',
    radix: 'error',
    'require-await': 'warn',
    'require-unicode-regexp': 'error',
    'spaced-comment': [
      'error',
      'always',
      {
        markers: ['/'],
      },
    ],
    'symbol-description': 'error',
    'vars-on-top': 'error',
    yoda: [
      'error',
      'never',
      {
        onlyEquality: true,
      },
    ],

    //* eslint base - layout & formatting */

    'linebreak-style': ['error', 'unix'],
    'padding-line-between-statements': [
      2,
      {
        blankLine: 'always',
        prev: ['import', 'const', 'let'],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['break', 'return', 'export', 'throw'],
      },
      {
        blankLine: 'any',
        prev: 'import',
        next: 'import',
      },
      {
        blankLine: 'any',
        prev: 'export',
        next: 'export',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let'],
        next: ['const', 'let'],
      },
    ],
    'unicode-bom': ['error', 'never'],

    // @typescript-eslint/eslint-plugin */

    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-indexed-object-style': ['error', 'index-signature'],
    'no-magic-numbers': 'off',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports-ts': [
      'error',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    'unused-imports/no-unused-vars': [
      'error',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-shadow': [
      'warn',
      { allow: ['Image', 'Text', 'Request'], builtinGlobals: true, hoist: 'all' },
    ],
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-useless-empty-export': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',

    //* eslint-plugin-react */

    'react/destructuring-assignment': ['error', 'always'],
    'react/display-name': 'off',
    'react/hook-use-state': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-this-in-sfc': 'error',
    'react/no-unstable-nested-components': 'error',
    'react/prefer-stateless-function': 'error',
    'react/self-closing-comp': [
      'error',
      {
        html: false,
      },
    ],
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/jsx-fragments': ['error', 'syntax'],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/jsx-pascal-case': 'error',
    'react/prop-types': 'off',

    //* eslint-plugin-react-hooks */

    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'warn',

    //* eslint-plugin-no-relative-import-paths */

    'no-relative-import-paths/no-relative-import-paths': ['error', { allowSameFolder: true }],

    //* plugin:simple-import-sort */
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // react and react celated packages
          ['^react', '^@?\\w'],
          // side effect
          ['^\\u0000'],
          // regular packages - imports starting with a letter (or digit or underscore), or `@` followed by a letter
          ['^@?\\w'],
          // absolute imports and anything not matched in another group.
          ['^'],
          // relative imports
          ['^\\.'],
          // style imports
          ['^.+\\.s?css$'],
          // images
          ['^.+\\.s?png$'],
        ],
      },
    ],

    //* eslint-plugin-prettier */

    'prettier/prettier': 'error',
  },
}
