import { MorphoBlueConfig } from '@summerfi/deployment-types'

export const MorphoBlueConfiguration: MorphoBlueConfig = {
  protocol: {
    MorphoBlue: {
      name: 'MorphoBlue',
      address: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
      addToRegistry: true,
    },
    AdaptiveCurveIrm: {
      name: 'AdaptiveCurveIrm',
      address: '0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC',
    },
  },
  actions: {
    MorphoBlueBorrow: {
      name: 'MorphoBlueBorrow',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    MorphoBlueWithdraw: {
      name: 'MorphoBlueWithdraw',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    MorphoBlueDeposit: {
      name: 'MorphoBlueDeposit',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
    MorphoBluePayback: {
      name: 'MorphoBluePayback',
      addToRegistry: true,
      constructorArgs: ['address:ServiceRegistry'],
    },
  },
}
