import type { Maybe } from '@summerfi/sdk-common/common/aliases'
import type { ChainInfo, TokenAmount, Token, Address } from '@summerfi/sdk-common/common'
import { ChainId, CurrencySymbol, Percentage } from '@summerfi/sdk-common/common'
import { ISwapProvider, ISwapManager } from '@summerfi/swap-common/interfaces'
import type { QuoteData, SwapData, SwapProviderType, SpotData } from '@summerfi/sdk-common/swap'

export type SwapManagerProviderConfig = {
  provider: ISwapProvider
  chainIds: ChainId[]
}

export class SwapManager implements ISwapManager {
  private _providersByChainId: Map<ChainId, ISwapProvider[]>
  private _providersByType: Map<SwapProviderType, ISwapProvider>

  constructor(providersConfig: SwapManagerProviderConfig[]) {
    this._providersByChainId = new Map()
    this._providersByType = new Map()

    for (const config of providersConfig) {
      this._registerProvider(config.provider, config.chainIds)
    }
  }

  async getSwapDataExactInput(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
    recipient: Address
    slippage: Percentage
    forceUseProvider?: SwapProviderType
  }): Promise<SwapData> {
    const provider: Maybe<ISwapProvider> = this._getBestProvider(params)
    if (!provider) {
      throw new Error('No swap provider available')
    }

    return provider.getSwapDataExactInput(params)
  }

  async getSwapQuoteExactInput(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
    forceUseProvider?: SwapProviderType
  }): Promise<QuoteData> {
    const provider: Maybe<ISwapProvider> = this._getBestProvider(params)
    if (!provider) {
      throw new Error('No swap provider available')
    }

    return provider.getSwapQuoteExactInput(params)
  }

  async getSpotPrice(params: {
    chainInfo: ChainInfo
    baseToken: Token
    quoteToken?: CurrencySymbol | Token
    forceUseProvider?: SwapProviderType
  }): Promise<SpotData> {
    const provider: Maybe<ISwapProvider> = this._getBestProvider(params)
    if (!provider) {
      throw new Error('No swap provider available')
    }

    return provider.getSpotPrice(params)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getSummerFee(params: {
    from: { token: Token }
    to: { token: Token }
  }): Promise<Percentage> {
    // TODO: Implement with appropriate logic
    return Percentage.createFrom({
      value: 0.2,
    })
  }

  private _registerProvider(provider: ISwapProvider, forChainIds: number[]): void {
    for (const chainId of forChainIds) {
      const providers = this._providersByChainId.get(chainId) || []
      providers.push(provider)
      this._providersByChainId.set(chainId, providers)
    }

    this._providersByType.set(provider.type, provider)
  }

  private _getBestProvider(params: {
    chainInfo: ChainInfo
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
