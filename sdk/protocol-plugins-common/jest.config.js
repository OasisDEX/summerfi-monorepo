const { compilerOptions } = require('./tsconfig.test')
const sharedConfig = require('@summerfi/jest-config/jest.base')

require('@dotenvx/dotenvx').config({ path: ['../../.env', '../.env'], override: true })

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig(compilerOptions),
  silent: false,
  collectCoverageFrom: [
    '<rootDir>/**/*.{ts,tsx}',
    '!src/**/index.ts',
    '!src/actions/Types.ts',
    '!src/types/*.{ts,tsx}',
    '!src/interfaces/*.{ts,tsx}',
  ],
}
