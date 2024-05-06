import type { Maybe } from '@summerfi/sdk-common/common/aliases'
import type {
  IChainInfo,
  IPercentage,
  IAddress,
  IToken,
  ITokenAmount,
} from '@summerfi/sdk-common/common'
import { ChainId, Percentage } from '@summerfi/sdk-common/common'
import { ISwapProvider, ISwapManager } from '@summerfi/swap-common/interfaces'
import type { QuoteData, SwapData, SwapProviderType } from '@summerfi/sdk-common/swap'

/**
 * @typedef SwapManagerProviderConfig
 * @property {ISwapProvider} Provider instance
 * @property {ChainId[]} Chain IDs supported by the provider
 */
export type SwapManagerProviderConfig = {
  provider: ISwapProvider
  chainIds: ChainId[]
}

/**
 * @class SwapManager
 * @see ISwapManager
 */
export class SwapManager implements ISwapManager {
  private _providersByChainId: Map<ChainId, ISwapProvider[]>
  private _providersByType: Map<SwapProviderType, ISwapProvider>

  /** CONSTRUCTOR */
  constructor(providersConfig: SwapManagerProviderConfig[]) {
    this._providersByChainId = new Map()
    this._providersByType = new Map()

    for (const config of providersConfig) {
      this._registerProvider(config.provider, config.chainIds)
    }
  }

  /** METHODS */

  /** @see ISwapManager.getSwapDataExactInput */
  async getSwapDataExactInput(params: {
    chainInfo: IChainInfo
    fromAmount: ITokenAmount
    toToken: IToken
    recipient: IAddress
    slippage: IPercentage
    forceUseProvider?: SwapProviderType
  }): Promise<SwapData> {
    const provider: Maybe<ISwapProvider> = this._getBestProvider(params)
    if (!provider) {
      throw new Error('No swap provider available')
    }

    return provider.getSwapDataExactInput(params)
  }

  /** @see ISwapManager.getSwapQuoteExactInput */
  async getSwapQuoteExactInput(params: {
    chainInfo: IChainInfo
    fromAmount: ITokenAmount
    toToken: IToken
    forceUseProvider?: SwapProviderType
  }): Promise<QuoteData> {
    const provider: Maybe<ISwapProvider> = this._getBestProvider(params)
    if (!provider) {
      throw new Error('No swap provider available')
    }

    return provider.getSwapQuoteExactInput(params)
  }

  /** @see ISwapManager.getSummerFee */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getSummerFee(params: {
    from: { token: IToken }
    to: { token: IToken }
  }): Promise<IPercentage> {
    // TODO: Implement with appropriate logic
    return Percentage.createFrom({
      value: 0.2,
    })
  }

  /** PRIVATE */

  /**
   * Register a swap provider for the given chain IDs.
   * @param provider Swap provider instance
   * @param forChainIds Chain IDs supported by the provider
   */
  private _registerProvider(provider: ISwapProvider, forChainIds: number[]): void {
    for (const chainId of forChainIds) {
      const providers = this._providersByChainId.get(chainId) || []
      providers.push(provider)
      this._providersByChainId.set(chainId, providers)
    }

    this._providersByType.set(provider.type, provider)
  }

  /**
   * Get the best provider for the given parameters.
   * @param params Parameters to determine the best provider
   * @returns Best provider instance or undefined if no provider is available
   */
  private _getBestProvider(params: {
    chainInfo: IChainInfo
    forceUseProvider?: SwapProviderType
  }): Maybe<ISwapProvider> {
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
