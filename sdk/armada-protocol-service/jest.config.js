const { compilerOptions } = require('./tsconfig.test')
const sharedConfig = require('@summerfi/jest-config/jest.base')
require('dotenv').config({ path: '../.env' })
require('dotenv').config({ path: '../../.env' })

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig(compilerOptions),
  roots: ['<rootDir>/src', '<rootDir>/e2e', '<rootDir>/tests'],
}
