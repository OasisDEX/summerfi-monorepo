/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ['src/types/graphql/**', 'src/client.ts'],
  extends: ['@summerfi/eslint-config/library.cjs'],
}
