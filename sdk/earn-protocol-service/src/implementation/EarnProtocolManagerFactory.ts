import { IConfigurationProvider } from '@summerfi/configuration-provider'
import { EarnProtocolManager } from './EarnProtocolManager'
import type { IAllowanceManager } from '@summerfi/allowance-common'

/**
 * @name EarnProtocolManagerFactory
 * @description This class is responsible for creating instances of the OracleManager
 */
export class EarnProtocolManagerFactory {
  public static newEarnProtocolManager(params: {
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
  }): EarnProtocolManager {
    return new EarnProtocolManager(params)
  }
}
