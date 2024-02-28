import type { ChainId } from '@summerfi/sdk-common/common/aliases'
import type {
  ChainInfo,
  TokenAmount,
  Token,
  Percentage,
} from '@summerfi/sdk-common/common/implementation'
import { Maybe } from '@summerfi/sdk-common/utils'
import type { Address } from 'viem'
import { ISwapProvider, ISwapManager, SwapData, SwapProviderType } from '~swap-service/interfaces'

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

  public async getSwapData(params: {
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

    return provider.getSwapData(params)
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
    fromAmount: TokenAmount
    toToken: Token
    recipient: Address
    slippage: Percentage
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
