const { compilerOptions } = require('./tsconfig')
const sharedConfig = require('@summerfi/jest-config/jest.base')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig(compilerOptions),
  setupFiles: ['<rootDir>/jest.setup.ts'],
}
