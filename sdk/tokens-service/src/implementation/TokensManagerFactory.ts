import { type IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { ITokensManager, ITokensProvider } from '@summerfi/tokens-common'
import { TokensManager } from './TokensManager'
import { StaticTokensProvider } from './static/StaticTokensProvider'

/**
 * @name TokensManagerFactory
 * @description Factory class for the TokensManager. Takes care of generating the manager config and creates an instance
 */
export class TokensManagerFactory {
  /**
   * @name providersConfig
   * @description Configuration for the TokensManager. It includes the list of available providers
   */
  static providers: ITokensProvider[] = []

  /**
   * @method newTokensManager
   * @param configProvider The configuration provider used to get environment variables
   * @param blockchainClientProvider The blockchain client provider for blockchain interactions
   * @returns A new instance of the TokensManager
   */
  public static newTokensManager(params: {
    configProvider: IConfigurationProvider
    blockchainClientProvider: IBlockchainClientProvider
  }): ITokensManager {
    this.initialize(params)

    return new TokensManager({ providers: this.providers })
  }

  /** PRIVATE */

  /**
   * @method initialize
   * @description Initializes the different providers
   * @param configProvider The configuration provider used to get environment variables
   * @param blockchainClientProvider The blockchain client provider for blockchain interactions
   */
  private static initialize(params: {
    configProvider: IConfigurationProvider
    blockchainClientProvider: IBlockchainClientProvider
  }): void {
    if (this.providers.length != 0) {
      return
    }

    const { configProvider, blockchainClientProvider } = params

    // Static provider
    const staticProvider = new StaticTokensProvider({
      configProvider: configProvider,
      blockchainClientProvider: blockchainClientProvider,
    })

    this.providers = [staticProvider]
  }
}
