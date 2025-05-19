const { compilerOptions } = require('./tsconfig.test')
const sharedConfig = require('@summerfi/jest-config/jest.base')
require('dotenv').config({ path: '../.env' })

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig(compilerOptions),
  silent: false,
  coveragePathIgnorePatterns: ['/tests/utils/', '/tests/mocks/', 'src/plugins/[^/]+/interfaces'],
  testTimeout: 12000,
}
