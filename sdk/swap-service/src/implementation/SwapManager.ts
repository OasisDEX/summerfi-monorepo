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
import { ManagerWithProvidersBase } from '@summerfi/sdk-server-common'

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
export class SwapManager
  extends ManagerWithProvidersBase<SwapProviderType, ISwapProvider>
  implements ISwapManager
{
  /** CONSTRUCTOR */
  constructor(params: { providers: ISwapProvider[] }) {
    super(params)
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
}
