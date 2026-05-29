import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IContractsProvider } from '@summerfi/contracts-provider-common'
import { AllowanceManager } from './AllowanceManager'

/**
 * @name AllowanceManagerFactory
 * @description This class is responsible for creating instances of the AllowanceManager
 */
export class AllowanceManagerFactory {
  public static newAllowanceManager(params: {
    configProvider: IConfigurationProvider
    contractsProvider: IContractsProvider
    blockchainClientProvider: IBlockchainClientProvider
  }): AllowanceManager {
    return new AllowanceManager(params)
  }
}
