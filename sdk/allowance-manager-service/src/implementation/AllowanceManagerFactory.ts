import { IConfigurationProvider } from '@summerfi/configuration-provider'

import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { AllowanceManager } from './AllowanceManager'

/**
 * @name AllowanceManagerFactory
 * @description This class is responsible for creating instances of the AllowanceManager
 */
export class AllowanceManagerFactory {
  public static newAllowanceManager(params: {
    configProvider: IConfigurationProvider
    contractsProvider: IContractsProvider
  }): AllowanceManager {
    return new AllowanceManager(params)
  }
}
