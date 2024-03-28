/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ['jest.config.js', 'tests'],
  extends: ['@summerfi/eslint-config/library.cjs'],
  parser: '@typescript-eslint/parser',
}
