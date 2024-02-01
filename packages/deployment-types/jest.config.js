// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pathsToModuleNameMapper } = require('ts-jest')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/tests/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  silent: true,
  maxWorkers: 1,
  testTimeout: 10000,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist', 'node_modules'],
  modulePaths: ['src'],
  moduleNameMapper: pathsToModuleNameMapper({
    '~sdk': ['<rootDir>/src/index.ts'],
    '~sdk/*': ['<rootDir>/src/*'],
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
