import { type IConfigurationProvider } from '@summerfi/configuration-provider'
import { OneInchOracleProvider } from './oneinch/OneInchOracleProvider'
import { OracleManager } from './OracleManager'
import { OneInchOracleProviderConfig } from './oneinch/Types'

/**
 * @name OracleManagerFactory
 * @description This class is responsible for creating instances of the OracleManager
 */
export class OracleManagerFactory {
  public static newOracleManager(params: {
    configProvider: IConfigurationProvider
  }): OracleManager {
    const { config: oneInchConfig } = this._getOneInchConfig(params.configProvider)

    const oneInchSwapProvider = new OneInchOracleProvider({
      providerConfig: oneInchConfig,
    })

    return new OracleManager({
      providersConfig: [
        {
          provider: oneInchSwapProvider,
        },
      ],
    })
  }

  private static _getOneInchConfig(configProvider: IConfigurationProvider): {
    config: OneInchOracleProviderConfig
  } {
    const ONE_INCH_API_SPOT_URL = configProvider.getConfigurationItem({
      name: 'ONE_INCH_API_SPOT_URL',
    })
    const ONE_INCH_API_SPOT_VERSION = configProvider.getConfigurationItem({
      name: 'ONE_INCH_API_SPOT_VERSION',
    })
    const ONE_INCH_API_SPOT_KEY = configProvider.getConfigurationItem({
      name: 'ONE_INCH_API_SPOT_KEY',
    })

    if (!ONE_INCH_API_SPOT_URL || !ONE_INCH_API_SPOT_KEY || !ONE_INCH_API_SPOT_VERSION) {
      throw new Error(
        'OneInch configuration is missing: ' +
          JSON.stringify(
            Object.entries({
              ONE_INCH_API_SPOT_URL,
              ONE_INCH_API_SPOT_KEY,
              ONE_INCH_API_SPOT_VERSION,
            }),
            null,
            2,
          ),
      )
    }

    return {
      config: {
        apiUrl: ONE_INCH_API_SPOT_URL,
        apiKey: ONE_INCH_API_SPOT_KEY,
        version: ONE_INCH_API_SPOT_VERSION,
      },
    }
  }
}
