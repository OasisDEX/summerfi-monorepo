const { compilerOptions } = require('./tsconfig.test')
const sharedConfig = require('@summerfi/jest-config/jest.base')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig(compilerOptions),
  collectCoverageFrom: [
    '<rootDir>/**/*.{ts,tsx}',
    '!src/actions/Types.ts',
    '!src/builders/Types.ts',
    '!src/**/index.ts',
    /* OrderPlanner is tested through order-planner-service */
    '!src/implementation/OrderPlanner.ts',
  ],
  coveragePathIgnorePatterns: ['/tests/utils/'],
}
