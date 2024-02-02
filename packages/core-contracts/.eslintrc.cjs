/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@summerfi/eslint-config/library.cjs'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['artifacts'],
}
