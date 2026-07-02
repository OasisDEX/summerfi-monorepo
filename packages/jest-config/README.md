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
