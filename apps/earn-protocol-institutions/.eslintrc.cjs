/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@summerfi/eslint-config/next.cjs'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['next-env.d.ts'],
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
}
