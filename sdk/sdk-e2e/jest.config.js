const { resolve } = require('path')
const { compilerOptions } = require('./tsconfig.test')
const sharedConfig = require('@summerfi/jest-config/jest.base')
require('dotenv').config({ path: resolve(__dirname, '../.env') })

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests', '<rootDir>/e2e'],
  ...sharedConfig(compilerOptions),
}
