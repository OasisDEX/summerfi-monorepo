import type { ChainId } from '@summerfi/sdk-common/common/aliases'
import { type IConfigurationProvider } from '@summerfi/configuration-provider'
import { SwapManager } from '~swap-service/implementation/SwapManager'
import { OneInchSwapProvider } from './oneinch/OneInchSwapProvider'
import { OneInchSwapProviderConfig } from './oneinch/types'

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

    if (!apiUrl || !apiKey || !version || !allowedSwapProtocols || !chainIds) {
      throw new Error('OneInch configuration is missing')
    }

    return {
      config: {
        apiUrl,
        apiKey,
        version,
        allowedSwapProtocols: allowedSwapProtocols.split(','),
      },
      chainIds: chainIds.split(',').map((id: string) => parseInt(id)),
    }
  }
}
