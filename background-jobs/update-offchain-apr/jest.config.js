/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // serverless-shared ships ESM-only; map runtime value imports to a stub so
    // the CJS ts-jest transform can load fetchers that use it (e.g. Benji).
    '^@summerfi/serverless-shared$': '<rootDir>/tests/mocks/serverless-shared.ts',
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {},
      },
    ],
  },
}
