import type { IAllowanceManager } from '@summerfi/allowance-manager-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { EarnProtocolManager } from './EarnProtocolManager'

/**
 * @name EarnProtocolManagerFactory
 * @description This class is responsible for creating instances of the OracleManager
 */
export class EarnProtocolManagerFactory {
  public static newEarnProtocolManager(params: {
    configProvider: IConfigurationProvider
    allowanceManager: IAllowanceManager
    contractsProvider: IContractsProvider
  }): EarnProtocolManager {
    return new EarnProtocolManager(params)
  }
}
