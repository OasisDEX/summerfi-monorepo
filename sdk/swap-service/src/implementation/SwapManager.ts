import type {
  Maybe,
  IPercentage,
  IAddress,
  IToken,
  ITokenAmount,
  QuoteData,
  SwapData,
  SwapProviderType,
} from '@summerfi/sdk-common'
import { ChainId, Percentage } from '@summerfi/sdk-common'
import { ISwapProvider, ISwapManager } from '@summerfi/swap-common'
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
    fromAmount: ITokenAmount
    toToken: IToken
    recipient: IAddress
    slippage: IPercentage
    forceUseProvider?: SwapProviderType
  }): Promise<SwapData> {
    const provider: Maybe<ISwapProvider> = this._getBestProvider({
      chainInfo: params.fromAmount.token.chainInfo,
      forceUseProvider: params.forceUseProvider,
    })
    if (!provider) {
      throw new Error('No swap provider available')
    }

    return provider.getSwapDataExactInput(params)
  }

  /** @see ISwapManager.getSwapQuoteExactInput */
  async getSwapQuoteExactInput(params: {
    fromAmount: ITokenAmount
    toToken: IToken
    forceUseProvider?: SwapProviderType
  }): Promise<QuoteData> {
    const provider: Maybe<ISwapProvider> = this._getBestProvider({
      chainInfo: params.fromAmount.token.chainInfo,
      forceUseProvider: params.forceUseProvider,
    })
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
