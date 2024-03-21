const { compilerOptions } = require('./tsconfig.test')
const sharedConfig = require('@summerfi/jest-config/jest.base')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig(compilerOptions),
  collectCoverageFrom: [
    '<rootDir>/**/*.{ts,tsx}',
    '!src/**/index.ts',
    '!src/config/Config.ts',
    '!src/interfaces/IOrderPlannerService.ts',
    '!src/utils/**/*.{ts,tsx}',
  ],
  coveragePathIgnorePatterns: ['/tests/utils/', '/tests/mocks/'],
}
