import type { ChainId } from '@summerfi/sdk-common/common/aliases'
import { Address, ChainInfo, Percentage, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { SwapManager } from '~swap-service/implementation/SwapManager'
import { ISwapService } from '@summerfi/swap-common/interfaces'
import { SwapData, QuoteData } from '@summerfi/swap-common/types'
import { OneInchSwapProvider } from './oneinch/OneInchSwapProvider'
import { OneInchSwapProviderConfig } from './oneinch/types'

// TODO: we should remove this and use just a funcition to instantiate the swap manager probably using a configuration provider to get 1inch config
export class SwapService implements ISwapService {
  private readonly swapManager: SwapManager

  constructor() {
    const { config: oneInchConfig, chainIds: oneInchChainIds } = this._getOneInchConfig()

    const oneInchSwapProvider = new OneInchSwapProvider(oneInchConfig)

    this.swapManager = new SwapManager([
      {
        provider: oneInchSwapProvider,
        chainIds: oneInchChainIds,
      },
    ])
  }

  // TODO: clean it up
  getSwapDataExactInput(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
    recipient: Address
    slippage: Percentage
  }): Promise<SwapData> {
    return this.swapManager.getSwapDataExactInput(params)
  }

  // TODO: clean it up
  getSwapQuoteExactInput(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
  }): Promise<QuoteData> {
    return this.swapManager.getSwapQuoteExactInput(params)
  }

  private _getOneInchConfig(): {
    config: OneInchSwapProviderConfig
    chainIds: ChainId[]
  } {
    if (!process.env.ONE_INCH_API_KEY) {
      throw new Error('ONE_INCH_API_KEY env variable is required')
    }
    if (!process.env.ONE_INCH_API_VERSION) {
      throw new Error('ONE_INCH_API_VERSION env variable is required')
    }
    if (!process.env.ONE_INCH_API_URL) {
      throw new Error('ONE_INCH_API_URL env variable is required')
    }
    if (!process.env.ONE_INCH_ALLOWED_SWAP_PROTOCOLS) {
      throw new Error('ONE_INCH_ALLOWED_SWAP_PROTOCOLS env variable is required')
    }
    if (!process.env.ONE_INCH_SWAP_CHAIN_IDS) {
      throw new Error('ONE_INCH_SWAP_CHAIN_IDS env variable is required')
    }

    return {
      config: {
        apiUrl: process.env.ONE_INCH_API_URL,
        version: process.env.ONE_INCH_API_VERSION,
        allowedSwapProtocols: process.env.ONE_INCH_ALLOWED_SWAP_PROTOCOLS.split(','),
        apiKey: process.env.ONE_INCH_API_KEY,
      },
      chainIds: process.env.ONE_INCH_SWAP_CHAIN_IDS.split(',').map((id) => parseInt(id)),
    }
  }
}
