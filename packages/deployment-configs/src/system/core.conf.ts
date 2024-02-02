import { SystemCoreConfig } from '@summerfi/deployment-types'

export const CoreConfiguration: SystemCoreConfig = {
  ServiceRegistry: {
    name: 'ServiceRegistry',
    addToRegistry: true,
    constructorArgs: [0],
  },
  OperationExecutor: {
    name: 'OperationExecutor',
    addToRegistry: true,
    constructorArgs: ['address:ServiceRegistry'],
  },
  OperationStorage: {
    name: 'OperationStorage',
    addToRegistry: true,
    constructorArgs: ['address:ServiceRegistry', 'address:OperationExecutor'],
  },
  OperationsRegistry: {
    name: 'OperationsRegistry',
    addToRegistry: true,
    constructorArgs: [],
  },
  DSProxyFactory: {
    name: 'DSProxyFactory',
    addToRegistry: true,
    constructorArgs: [],
  },
  DSProxyRegistry: {
    name: 'DSProxyRegistry',
    addToRegistry: true,
    constructorArgs: ['address:DSProxyFactory'],
  },
  DSGuardFactory: {
    name: 'DSGuardFactory',
    addToRegistry: true,
    constructorArgs: [],
  },
  AccountGuard: {
    name: 'AccountGuard',
    addToRegistry: true,
    constructorArgs: [],
  },
  AccountFactory: {
    name: 'AccountFactory',
    addToRegistry: true,
    constructorArgs: ['address:AccountGuard'],
  },
  ChainLogView: {
    name: 'ChainLogView',
    addToRegistry: true,
    constructorArgs: ['0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F'],
  },
  Swap: {
    name: 'Swap',
    addToRegistry: true,
    constructorArgs: [],
  },
}
