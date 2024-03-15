const { compilerOptions } = require('./tsconfig.test')
const sharedConfig = require('@summerfi/jest-config/jest.base')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig(compilerOptions),
  collectCoverageFrom: [
    '<rootDir>/**/*.{ts,tsx}',
    '!src/**/index.ts',
    '!src/config/config.ts',
    '!src/implementation/OrderPlannerService.ts',
    '!src/interfaces/IOrderPlannerService.ts',
  ],
  coveragePathIgnorePatterns: ['/tests/utils/', '/tests/mocks/'],
}
