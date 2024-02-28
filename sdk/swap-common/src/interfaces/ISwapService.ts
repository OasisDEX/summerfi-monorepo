import type {
  TokenAmount,
  ChainInfo,
  Percentage,
  Token,
  Address,
} from '@summerfi/sdk-common/common/implementation'
import { SwapData } from '~swap-common/types'

export interface ISwapService {
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
