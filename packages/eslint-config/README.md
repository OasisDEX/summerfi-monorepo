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

## Cross-package connections

**Consumes:** nothing from the monorepo — all deps are upstream ESLint plugins/presets
(`@typescript-eslint/*`, `@vercel/style-guide`, `eslint-config-next`, `eslint-config-turbo`,
`eslint-plugin-import`, `eslint-plugin-react(-hooks)`, `simple-import-sort`, `unused-imports`,
`no-relative-import-paths`, `prettier`).

**Consumed by:** ~100 workspace packages/apps that list `@summerfi/eslint-config` as a devDependency
and `extends: [require.resolve('@summerfi/eslint-config/<preset>')]` in their `.eslintrc.cjs` —
`library` (~66 consumers: `sdk/*`, `packages/*`), `function` (~23: lambdas under `summerfi-api/*`,
`external-api/*`, `background-jobs/*`), and `next` (~10: `apps/earn-protocol*` plus React UI
packages).

**Gotchas:**

- No barrel export — presets are referenced by subpath (`.../library`, `.../function`, `.../next`)
  which map to `library.cjs` / `function.cjs` / `next.cjs`; renaming a `.cjs` file breaks every
  consumer's `require.resolve`.
- Rule-severity changes here fan out to all consumers on the next `turbo lint`. `turbo.json`'s `lint`
  task runs `dependsOn: ["prebuild", "build", "^lint"]`, so a stricter rule (e.g. flipping
  `@typescript-eslint/no-explicit-any` to `error`) can fail CI in packages that never changed.
- `library.cjs` sets `import/no-cycle: error` — this, not a separate tool, is what enforces the
  `-common` vs `-service` layering across the SDK; consumers relying on cycle detection must extend
  `library`, not `function` (which omits `eslint-plugin-import`).
