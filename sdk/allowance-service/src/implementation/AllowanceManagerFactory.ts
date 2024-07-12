import { IConfigurationProvider } from '@summerfi/configuration-provider'

import { AllowanceManager } from './AllowanceManager'

/**
 * @name AllowanceManagerFactory
 * @description This class is responsible for creating instances of the AllowanceManager
 */
export class AllowanceManagerFactory {
  public static newAllowanceManager(params: {
    configProvider: IConfigurationProvider
  }): AllowanceManager {
    return new AllowanceManager(params)
  }
}
