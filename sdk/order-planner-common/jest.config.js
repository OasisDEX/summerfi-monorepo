const { compilerOptions } = require('./tsconfig.test')
const sharedConfig = require('@summerfi/jest-config/jest.base')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig(compilerOptions),
  collectCoverageFrom: [
    '<rootDir>/**/*.{ts,tsx}',
    '!src/**/index.ts',
    '!src/interfaces/*.{ts,tsx}',
    '!src/types/*.{ts,tsx}',
  ],
  coveragePathIgnorePatterns: ['/tests/utils/'],
}
