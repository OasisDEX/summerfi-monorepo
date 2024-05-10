import { type IConfigurationProvider } from '@summerfi/configuration-provider'
import { TokensManager, TokensManagerProviderConfig } from './TokensManager'
import { StaticTokensProvider } from './static/StaticTokensProvider'
import { ITokensManager } from '@summerfi/tokens-common'

/**
 * @name TokensManagerFactory
 * @description Factory class for the TokensManager. Takes care of generating the manager config and creates an instance
 */
export class TokensManagerFactory {
  /**
   * @name providersConfig
   * @description Configuration for the TokensManager. It includes the list of available providers
   */
  static providersConfig: TokensManagerProviderConfig[] = []

  /**
   * @method newTokensManager
   * @param configProvider The configuration provider used to get environment variables
   * @returns A new instance of the TokensManager
   */
  public static newTokensManager(params: {
    configProvider: IConfigurationProvider
  }): ITokensManager {
    this.initialize(params)

    return new TokensManager({ providersConfig: this.providersConfig })
  }

  /** PRIVATE */

  /**
   * @method initialize
   * @description Initializes the different providers
   * @param configProvider The configuration provider used to get environment variables
   */
  private static initialize(params: { configProvider: IConfigurationProvider }): void {
    if (this.providersConfig.length != 0) {
      return
    }

    const { configProvider } = params

    // Static provider
    const staticProvider = new StaticTokensProvider({ configProvider: configProvider })

    this.providersConfig = [
      {
        provider: staticProvider,
      },
    ]
  }
}
