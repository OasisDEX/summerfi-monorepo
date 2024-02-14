import { Address, Percentage, TokenAmount } from '@summerfi/sdk/common'
import { ChainInfo } from '@summerfi/sdk/chains'
import { Hex } from 'viem'

/**
 * @name SwapProvider
 * @description Represents the different swap providers
 */
export enum SwapProvider {
  OneInch = 'OneInch',
}

/**
 * @name SwapData
 * @description Represents the data needed to perform a swap between two tokens
 */
export type SwapData = {
  provider: SwapProvider
  fromTokenAmount: TokenAmount
  toTokenAmount: TokenAmount
  calldata: Hex
  targetContract: Address
  value: string
  gasPrice: string
}

/**
 * @name SwapManager
 * @description Provides information about how to swap between two tokens
 */
export interface SwapManager {
  getSwapData(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toMinimumAmount: TokenAmount
    recipient: Address
    slippage: Percentage
  }): Promise<SwapData>
}
