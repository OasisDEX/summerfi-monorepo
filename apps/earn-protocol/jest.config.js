const { compilerOptions } = require('./tsconfig.test')
const sharedConfig = require('@summerfi/jest-config/jest.base')(compilerOptions)

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig,
  moduleNameMapper: {
    ...sharedConfig.moduleNameMapper,
    // `@summerfi/sdk-common`'s package.json `exports` only declares `import`/`types`
    // conditions (pointing at raw `src/*.ts`) with no `require`/`default`, so Jest's CJS
    // resolver can't load it. Redirect to its TS source and let ts-jest transpile it
    // (the path is outside `node_modules`, so it isn't skipped by transformIgnorePatterns).
    '^@summerfi/sdk-common$': '<rootDir>/../../sdk/sdk-common/src/index.ts',
    '^@summerfi/sdk-common/(.*)$': '<rootDir>/../../sdk/sdk-common/src/$1/index.ts',
  },
  // This app has no `src/` — tests are colocated with the code they cover
  // (e.g. `helpers/*.test.ts`). List the actual source directories (instead of `<rootDir>`)
  // so Jest's file crawler doesn't walk this app's (large) `node_modules`/`.next`.
  roots: [
    '<rootDir>/app',
    '<rootDir>/components',
    '<rootDir>/constants',
    '<rootDir>/contexts',
    '<rootDir>/features',
    '<rootDir>/graphql',
    '<rootDir>/helpers',
    '<rootDir>/hooks',
    '<rootDir>/misc',
    '<rootDir>/providers',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/dist/', '/out/'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
        // Per-file transpile, no cross-file type-checking: `tsc --noEmit` (already part of
        // the `lint` script) is the real type gate for this app. Full ts-jest type-checking
        // would also need to resolve `@summerfi/app-types`' build-time-generated,
        // gitignored config types (see packages/app-types/CLAUDE.md), which aren't
        // guaranteed to exist outside a machine that already ran `pnpm dev`/`get-config-types`.
        isolatedModules: true,
      },
    ],
  },
}
