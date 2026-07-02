# @summerfi/jest-config

Shared Jest configuration for TypeScript packages in the monorepo.

## What it provides

- `jest.base.js` — a factory function that accepts a package's `compilerOptions` (from
  `tsconfig.test.json`) and returns a `ts-jest` config with path alias resolution, ESM `.ts`
  extension support, `node` test environment, 10 s timeout, and `json-summary`/`text`/`lcov`
  coverage reporters.
- A thin `bin/jest.cjs` wrapper that forwards to the real `jest` binary, allowing packages to run
  `jest` without a local `jest` dependency.

## Usage

In a consuming package's `jest.config.js`:

```js
const { compilerOptions } = require('./tsconfig.test.json')
module.exports = require('@summerfi/jest-config/jest.base')(compilerOptions)
```

## Gotcha

`maxWorkers` is hard-coded to `1`. Tests across the monorepo run serially within each package;
override in the consuming config if parallel workers are needed.

## Cross-package connections

**Consumes:** `@summerfi/typescript-config` (peer dependency only — not imported in source; the
factory reads each consumer's `<rootDir>/tsconfig.test.json`, which in turn `extends`
`@summerfi/typescript-config`). Runtime deps are third-party build tooling (`jest`, `ts-jest`,
`@types/jest`).

**Consumed by:** ~48 packages via `jest.config.js` — nearly all of `sdk/*` (sdk-common, sdk-server,
sdk-client, protocol-plugins, tokens-service, and the rest), plus `packages/*` (the
`summer-earn-*-subgraph` clients, core-contracts), `summerfi-api/spark-rewards-claim`,
`summerfi-api/portfolio-overview-function`, and `__template-package__` (so new packages inherit it).

**Gotchas:**

- **Coupled by convention, not import.** Consumers do
  `require('@summerfi/jest-config/jest.base')(require('./tsconfig.test.json').compilerOptions)`.
  The factory feeds `compilerOptions.paths` into `pathsToModuleNameMapper`, so a package's path
  aliases only resolve in tests if they live in `tsconfig.test.json`, not just `tsconfig.json`.
- **`tsconfig.test.json` is mandatory in every consumer.** The `ts-jest` transform hard-codes
  `tsconfig: '<rootDir>/tsconfig.test.json'`; a package missing that file fails to transpile tests.
- **`bin/jest.cjs`** is exposed as the package's `jest` bin and just re-requires `jest/bin/jest`, so
  consumers can run `jest` without their own `jest` dependency — the version is pinned here
  (`jest@^29`), so a Jest major bump must happen in this package.
- **Only `src/` and `tests/` are collected** (`roots`); tests placed elsewhere are silently ignored.
