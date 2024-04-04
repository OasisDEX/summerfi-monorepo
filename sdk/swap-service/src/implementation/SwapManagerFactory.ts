import type { ChainId } from '@summerfi/sdk-common/common/aliases'
import { type IConfigurationProvider } from '@summerfi/configuration-provider'
import { OneInchSwapProvider } from './oneinch/OneInchSwapProvider'
import { OneInchSwapProviderConfig } from './oneinch/types'
import { SwapManager } from './SwapManager'

export class SwapManagerFactory {
  public static newSwapManager(params: { configProvider: IConfigurationProvider }): SwapManager {
    const { config: oneInchConfig, chainIds: oneInchChainIds } = this._getOneInchConfig(
      params.configProvider,
    )

    const oneInchSwapProvider = new OneInchSwapProvider(oneInchConfig)

    return new SwapManager([
      {
        provider: oneInchSwapProvider,
        chainIds: oneInchChainIds,
      },
    ])
  }

  private static _getOneInchConfig(configProvider: IConfigurationProvider): {
    config: OneInchSwapProviderConfig
    chainIds: ChainId[]
  } {
    const apiUrl = configProvider.getConfigurationItem({ name: 'ONE_INCH_API_URL' })
    const apiKey = configProvider.getConfigurationItem({ name: 'ONE_INCH_API_KEY' })
    const version = configProvider.getConfigurationItem({ name: 'ONE_INCH_API_VERSION' })
    const allowedSwapProtocols = configProvider.getConfigurationItem({
      name: 'ONE_INCH_ALLOWED_SWAP_PROTOCOLS',
    })
    const chainIds = configProvider.getConfigurationItem({ name: 'ONE_INCH_SWAP_CHAIN_IDS' })

    const apiV6Url = configProvider.getConfigurationItem({ name: 'ONE_INCH_API_V6_URL' })
    const apiV6Key = configProvider.getConfigurationItem({ name: 'ONE_INCH_API_V6_KEY' })

    if (
      !apiV6Url ||
      !apiV6Key ||
      !apiUrl ||
      !apiKey ||
      !version ||
      !allowedSwapProtocols ||
      !chainIds
    ) {
      throw new Error('OneInch configuration is missing')
    }

    return {
      config: {
        apiUrlV4: apiUrl,
        apiKeyV4: apiKey,
        apiUrlV6: apiV6Url,
        apiKeyV6: apiV6Key,
        allowedSwapProtocols: allowedSwapProtocols.split(','),
      },
      chainIds: chainIds.split(',').map((id: string) => parseInt(id)),
    }
  }
}
