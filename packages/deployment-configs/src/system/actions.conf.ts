import { SystemActionConfigType } from '@summerfi/deployment-types'

export const ActionsConfig: SystemActionConfigType = {
  PositionCreated: {
    name: 'PositionCreated',
    addToRegistry: true,
    constructorArgs: [],
  },
  SwapAction: {
    name: 'SwapAction',
    addToRegistry: true,
    constructorArgs: ['address:ServiceRegistry'],
  },
  TakeFlashloan: {
    name: 'TakeFlashloan',
    addToRegistry: true,
    constructorArgs: [
      'address:ServiceRegistry',
      '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      '0x5a15566417e6C1c9546523066500bDDBc53F88C7',
    ],
  },
  SetApproval: {
    name: 'SetApproval',
    addToRegistry: true,
    constructorArgs: ['address:ServiceRegistry'],
  },
  PullToken: {
    name: 'PullToken',
    addToRegistry: true,
    constructorArgs: [],
  },
  SendToken: {
    name: 'SendToken',
    addToRegistry: true,
    constructorArgs: ['address:ServiceRegistry'],
  },
  WrapEth: {
    name: 'WrapEth',
    addToRegistry: true,
    constructorArgs: ['address:ServiceRegistry'],
  },
  UnwrapEth: {
    name: 'UnwrapEth',
    addToRegistry: true,
    constructorArgs: ['address:ServiceRegistry'],
  },
  ReturnFunds: {
    name: 'ReturnFunds',
    addToRegistry: true,
    constructorArgs: [],
  },
}
