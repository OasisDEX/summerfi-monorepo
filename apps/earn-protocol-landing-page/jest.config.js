const { pathsToModuleNameMapper } = require('ts-jest')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/components'],
  testMatch: ['**/__tests__/**/*.test.+(ts|tsx)'],
  maxWorkers: 1,
  testTimeout: 10000,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules', '.next'],
  moduleNameMapper: pathsToModuleNameMapper({ '@/*': ['./*'] }, { prefix: '<rootDir>/' }),
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
}
