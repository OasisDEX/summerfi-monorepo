const { compilerOptions } = require('./tsconfig.test.json')
const sharedConfig = require('@summerfi/jest-config/jest.base')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig(compilerOptions),
}
