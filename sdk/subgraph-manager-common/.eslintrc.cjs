/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ['jest.config.js', 'generated'],
  extends: ['@summerfi/eslint-config/library.cjs'],
}
