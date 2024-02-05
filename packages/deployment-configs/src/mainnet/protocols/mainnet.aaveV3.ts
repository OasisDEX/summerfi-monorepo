import { AaveV3Config } from '@summerfi/deployment-types'

export const AAVEV3Configuration: AaveV3Config = {
  dependencies: {
    Oracle: {
      name: 'Oracle',
      address: '0x54586bE62E3c3580375aE3723C145253060Ca0C2',
    },
    LendingPool: {
      name: 'LendingPool',
      address: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
      addToRegistry: true,
    },
    PoolDataProvider: {
      name: 'PoolDataProvider',
      address: '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3',
    },
    L2Encoder: {
      name: 'L2Encoder',
      address: '0x0000000000000000000000000000000000000000',
    },
  },
  actions: {
    AaveV3Borrow: {
      name: 'AaveV3Borrow',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    AaveV3Withdraw: {
      name: 'AaveV3Withdraw',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    AaveV3Deposit: {
      name: 'AaveV3Deposit',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    AaveV3Payback: {
      name: 'AaveV3Payback',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    AaveV3SetEMode: {
      name: 'AaveV3SetEMode',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
  },
}
