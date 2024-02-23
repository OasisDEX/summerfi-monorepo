import { Address, Percentage, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { ChainInfo } from '@summerfi/sdk-common/chains'
import { Hex } from 'viem'

/**
 * @name SwapProviderType
 * @description Represents the different swap providers
 */
export enum SwapProviderType {
  OneInch = 'OneInch',
}

/**
 * @name SwapData
 * @description Represents the data needed to perform a swap between two tokens
 */
export type SwapData = {
  provider: SwapProviderType
  fromTokenAmount: TokenAmount
  toTokenAmount: TokenAmount
  calldata: Hex
  targetContract: Address
  value: string
  gasPrice: string
}

/**
 * @name ISwapProvider
 * @description Provides information about how to swap between two tokens
 */
export interface ISwapProvider {
  type: SwapProviderType

  /**
   * @name getSwapData
   * @description Returns the data needed to perform a swap between two tokens
   * @param chainInfo The chain information
   * @param fromAmount The amount of tokens to swap
   * @param recipient The address that will receive the tokens
   * @param slippage The maximum slippage allowed
   */
  getSwapData(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
    recipient: Address
    slippage: Percentage
  }): Promise<SwapData>
}

/**
 * @name ISwapManager
 * @description Provides information about how to swap between two tokens and has access
 *              to different swap providers
 */
export interface ISwapManager {
  /**
   * @name getSwapData
   * @description Returns the data needed to perform a swap between two tokens
   * @param chainInfo The chain information
   * @param fromAmount The amount of tokens to swap
   * @param recipient The address that will receive the tokens
   * @param slippage The maximum slippage allowed
   */
  getSwapData(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
    recipient: Address
    slippage: Percentage
  }): Promise<SwapData>
}
