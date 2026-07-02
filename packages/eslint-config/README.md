# `@summerfi/eslint-config`

Shared ESLint configurations for the summerfi monorepo. Private package — not published to npm.

## Configs

| File           | Intended for                                                                              |
| -------------- | ----------------------------------------------------------------------------------------- |
| `library.cjs`  | Node/Jest packages (TypeScript, import-cycle detection, unused-imports)                   |
| `function.cjs` | Minimal TypeScript libraries (lighter rule set, no React)                                 |
| `next.cjs`     | Next.js apps (React, react-hooks, simple-import-sort, no-relative-import-paths, Prettier) |

## Usage

```js
// .eslintrc.cjs
module.exports = { extends: [require.resolve('@summerfi/eslint-config/next')] }
```

## Gotcha

`next.cjs` and `function.cjs` both resolve `tsconfig.json` relative to `process.cwd()` at load time
— run ESLint from the package root, not the repo root, or the TypeScript resolver will silently fall
back to defaults.
