/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ['jest.config.js'],
  extends: ['@summerfi/eslint-config/function.cjs'],
}
