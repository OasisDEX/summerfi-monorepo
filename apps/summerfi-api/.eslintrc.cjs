/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ['lib/**', 'dist/**', 'artifacts/**', 'node_modules/**', '.sst/**'],
  extends: ['@summerfi/eslint-config/function.cjs'],
  parser: '@typescript-eslint/parser',

}
