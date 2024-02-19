const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('@summerfi/typescript-config/tsconfig.test')

const configRootDir = __dirname

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = (pkgCompilerOptions = {}) => {
  const sharedMappings = pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  })
  const pkgMappings = pathsToModuleNameMapper(pkgCompilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  })

  const mappings = { ...sharedMappings, ...pkgMappings }
  console.log(mappings)
  return {
    roots: ['<rootDir>/src', '<rootDir>/tests', '<rootDir>/node_modules'],
    preset: 'ts-jest',
    extensionsToTreatAsEsm: ['.ts'],
    silent: true,
    maxWorkers: 1,
    testTimeout: 10000,
    testEnvironment: 'node',
    moduleNameMapper: mappings,
    transform: {
      '^.+\\.(ts|tsx)$': [
        'ts-jest',
        {
          useESM: true,
          tsconfig: '<rootDir>/tsconfig.test.json',
        },
      ],
    },
  }
}
