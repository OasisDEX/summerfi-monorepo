import type { Maybe } from '@summerfi/sdk-common/common/aliases'
import type { ChainInfo, IChainInfo, IToken } from '@summerfi/sdk-common/common'
import { ChainId, CurrencySymbol } from '@summerfi/sdk-common/common'
import { IOracleManager, IOracleProvider } from '@summerfi/oracle-common'
import { OracleProviderType, SpotPriceInfo } from '@summerfi/sdk-common/oracle'

export type OracleManagerProviderConfig = {
  provider: IOracleProvider
}

/**
 * @name OracleManager
 * @description This class is the implementation of the IOracleManager interface. Takes care of choosing the best provider for a price consultation
 */
export class OracleManager implements IOracleManager {
  private _providersByChainId: Map<ChainId, IOracleProvider[]>
  private _providersByType: Map<OracleProviderType, IOracleProvider>

  /** CONSTRUCTOR */

  /**
   * @param providersConfig The list of providers to be registered
   */
  constructor(params: { providersConfig: OracleManagerProviderConfig[] }) {
    const { providersConfig } = params

    this._providersByChainId = new Map()
    this._providersByType = new Map()

    for (const config of providersConfig) {
      this._registerProvider(config.provider)
    }
  }

  /** @see IOracleManager.getSpotPrice */
  async getSpotPrice(params: {
    chainInfo: IChainInfo
    baseToken: IToken
    quoteToken?: CurrencySymbol | IToken
    forceUseProvider?: OracleProviderType
  }): Promise<SpotPriceInfo> {
    const provider: Maybe<IOracleProvider> = this._getBestProvider(params)
    if (!provider) {
      throw new Error('No swap provider available')
    }

    return provider.getSpotPrice(params)
  }

  /** PRIVATE */

  /**
   * @method _registerProvider
   * @description Registers a provider in the manager
   * @param provider The provider to be registered
   */
  private _registerProvider(provider: IOracleProvider): void {
    const forChainIds = provider.getSupportedChainIds()

    for (const chainId of forChainIds) {
      const providers = this._providersByChainId.get(chainId) || []
      providers.push(provider)
      this._providersByChainId.set(chainId, providers)
    }

    this._providersByType.set(provider.type, provider)
  }

  /**
   * @method _getBestProvider
   * @description Returns the best provider for a given price consultation
   * @param params The parameters for the price consultation
   * @returns The best provider for the given price consultation
   */
  private _getBestProvider(params: {
    chainInfo: ChainInfo
    forceUseProvider?: OracleProviderType
  }): Maybe<IOracleProvider> {
    if (params.forceUseProvider) {
      const provider = this._providersByType.get(params.forceUseProvider)
      if (provider) {
        return provider
      }
    }

    const providers = this._providersByChainId.get(params.chainInfo.chainId) || []
    if (providers.length === 0) {
      return undefined
    }

    // For now, we just return the first provider. In the future, we can implement a logic to
    // choose the best provider based on the input parameters or on the swap provider's capabilities.
    return providers[0]
  }
}
