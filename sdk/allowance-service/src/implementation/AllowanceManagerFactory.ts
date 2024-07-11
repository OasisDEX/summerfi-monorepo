import { IConfigurationProvider } from '@summerfi/configuration-provider'

import { AllowanceManager } from './AllowanceManager'

/**
 * @name AllowanceManagerFactory
 * @description This class is responsible for creating instances of the OracleManager
 */
export class AllowanceManagerFactory {
  public static newAllowanceManager(params: {
    configProvider: IConfigurationProvider
  }): AllowanceManager {
    return new AllowanceManager(params)
  }
}
