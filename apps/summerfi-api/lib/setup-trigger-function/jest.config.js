const { pathsToModuleNameMapper } = require('ts-jest')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  silent: true,
  maxWorkers: 1,
  testTimeout: 10000,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist', 'node_modules'],
  modulePaths: ['src'],
  moduleNameMapper: pathsToModuleNameMapper({
    '@summerfi/serverless-shared': [
      '<rootDir>/../../../../packages/serverless-shared/src/index.ts',
    ],
    '@summerfi/serverless-shared/*': ['<rootDir>/../../../../packages/serverless-shared/src/*'],
    '~types': ['<rootDir>/src/types/index.ts'],
    '~abi': ['<rootDir>/src/abi/index.ts'],
  }),
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
}
