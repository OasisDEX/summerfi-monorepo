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
    const ONE_INCH_API_URL = configProvider.getConfigurationItem({ name: 'ONE_INCH_API_URL' })
    const ONE_INCH_API_KEY = configProvider.getConfigurationItem({ name: 'ONE_INCH_API_KEY' })
    const ONE_INCH_API_VERSION = configProvider.getConfigurationItem({
      name: 'ONE_INCH_API_VERSION',
    })
    const ONE_INCH_ALLOWED_SWAP_PROTOCOLS = configProvider.getConfigurationItem({
      name: 'ONE_INCH_ALLOWED_SWAP_PROTOCOLS',
    })
    const ONE_INCH_SWAP_CHAIN_IDS = configProvider.getConfigurationItem({
      name: 'ONE_INCH_SWAP_CHAIN_IDS',
    })

    if (
      !ONE_INCH_API_URL ||
      !ONE_INCH_API_KEY ||
      !ONE_INCH_API_VERSION ||
      !ONE_INCH_ALLOWED_SWAP_PROTOCOLS ||
      !ONE_INCH_SWAP_CHAIN_IDS
    ) {
      throw new Error(
        'OneInch configuration is missing: ' +
          JSON.stringify(
            Object.entries({
              ONE_INCH_API_URL,
              ONE_INCH_API_KEY,
              ONE_INCH_API_VERSION,
              ONE_INCH_ALLOWED_SWAP_PROTOCOLS,
              ONE_INCH_SWAP_CHAIN_IDS,
            }),
            null,
            2,
          ),
      )
    }

    return {
      config: {
        apiUrl: ONE_INCH_API_URL,
        apiKey: ONE_INCH_API_KEY,
        version: ONE_INCH_API_VERSION,
        allowedSwapProtocols: ONE_INCH_ALLOWED_SWAP_PROTOCOLS.split(','),
      },
      chainIds: ONE_INCH_SWAP_CHAIN_IDS.split(',').map((id: string) => parseInt(id)),
    }
  }
}
