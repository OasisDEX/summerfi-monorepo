const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('@summerfi/typescript-config/tsconfig.test')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = (pkgCompilerOptions = {}) => {
  const mappings = pathsToModuleNameMapper({ ...pkgCompilerOptions.paths } || {}, {
    prefix: '<rootDir>/',
  })
  return {
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    preset: 'ts-jest',
    extensionsToTreatAsEsm: ['.ts'],
    silent: true,
    maxWorkers: 1,
    testTimeout: 10000,
    testEnvironment: 'node',
    moduleNameMapper: mappings,
    transformIgnorePatterns: ['<rootDir>/node_modules', 'node_modules'],
    transform: {
      '^.+\\.(ts|tsx)$': [
        'ts-jest',
        {
          tsconfig: '<rootDir>/tsconfig.test.json',
          compilerOptions: {},
        },
      ],
    },
  }
}
