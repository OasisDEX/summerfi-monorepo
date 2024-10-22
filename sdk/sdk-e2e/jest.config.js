const { resolve } = require('path')
const { compilerOptions } = require('./tsconfig.test')
const sharedConfig = require('@summerfi/jest-config/jest.base')
require('dotenv').config({
  path: [resolve(__dirname, '../.env'), resolve(__dirname, '../../.env')],
  override: false,
})

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig(compilerOptions),
  roots: ['<rootDir>/src', '<rootDir>/tests', '<rootDir>/e2e'],
}
