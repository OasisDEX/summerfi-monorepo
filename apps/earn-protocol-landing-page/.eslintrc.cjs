/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@summerfi/eslint-config/next.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['next-env.d.ts', 'jest.config.js'],
  rules: {
    'no-magic-numbers': 'off',
  },
}
