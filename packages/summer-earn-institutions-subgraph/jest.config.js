const { compilerOptions } = require('./tsconfig.test')
const sharedConfig = require('@summerfi/jest-config/jest.base')
require('dotenv').config({ path: '../../.env' })

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig(compilerOptions),
  moduleNameMapper: {
    '^@summerfi/serverless-shared$': '<rootDir>/../../packages/serverless-shared/src/index.ts',
    '^@summerfi/(.*)$': '<rootDir>/../../packages/$1/src/index.ts',
  },
  transformIgnorePatterns: ['node_modules/(?!(@summerfi)/)'],
}
