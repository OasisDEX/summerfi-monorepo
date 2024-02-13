import { AaveV2Config } from '@summerfi/deployment-types'

export const AAVEV2Configuration: AaveV2Config = {
  dependencies: {
    Oracle: {
      name: 'Oracle',
      address: '0xa50ba011c48153de246e5192c8f9258a2ba79ca9',
    },
    AaveLendingPool: {
      name: 'AaveLendingPool',
      address: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
      addToRegistry: true,
    },
    PoolDataProvider: {
      name: 'PoolDataProvider',
      address: '0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d',
    },
    AaveWethGateway: {
      name: 'AaveWethGateway',
      address: '0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04',
      addToRegistry: true,
    },
  },
  actions: {
    AaveBorrow: {
      name: 'AaveBorrow',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    AaveWithdraw: {
      name: 'AaveWithdraw',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    AaveDeposit: {
      name: 'AaveDeposit',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    AavePayback: {
      name: 'AavePayback',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
  },
}
