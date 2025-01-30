import { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ContractsProvider } from './ContractsProvider'
import type { ITokensManager } from '@summerfi/tokens-common'

/**
 * @name ContractsProviderFactory
 * @description This class is responsible for creating instances of the ContractsProvider
 */
export class ContractsProviderFactory {
  public static newContractsProvider(params: {
    configProvider: IConfigurationProvider
    blockchainClientProvider: IBlockchainClientProvider
    tokensManager: ITokensManager
  }): ContractsProvider {
    return new ContractsProvider(params)
  }
}
