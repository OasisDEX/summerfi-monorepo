/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ['jest.config.js', 'tests'],
  extends: ['@summerfi/eslint-config/function.cjs'],
  parser: '@typescript-eslint/parser',
}
