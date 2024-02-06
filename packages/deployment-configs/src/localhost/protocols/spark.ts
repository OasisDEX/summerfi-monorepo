import { SparkConfig } from '@summerfi/deployment-types'

export const SparkConfiguration: SparkConfig = {
  dependencies: {
    Oracle: {
      name: 'Oracle',
      address: '0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9',
    },
    SparkLendingPool: {
      name: 'SparkLendingPool',
      address: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
      addToRegistry: true,
    },
    PoolDataProvider: {
      name: 'PoolDataProvider',
      address: '0xFc21d6d146E6086B8359705C8b28512a983db0cb',
    },
  },
  actions: {
    SparkBorrow: {
      name: 'SparkBorrow',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    SparkWithdraw: {
      name: 'SparkWithdraw',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    SparkDeposit: {
      name: 'SparkDeposit',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    SparkPayback: {
      name: 'SparkPayback',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    SparkSetEMode: {
      name: 'SparkSetEMode',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
  },
}
