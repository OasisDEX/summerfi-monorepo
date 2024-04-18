/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ['src/generated/**'],
  extends: ['@summerfi/eslint-config/library.cjs'],
  parser: '@typescript-eslint/parser',
}
