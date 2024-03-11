import { Address, TokenAmount } from '@summerfi/sdk-common/common'
import { HexData } from '@summerfi/sdk-common/common/aliases'
import type { SwapProviderType } from '../enums/SwapProviderType'

/**
 * @name SwapData
 * @description Represents the data needed to perform a swap between two tokens
 */
export type SwapData = {
  provider: SwapProviderType
  fromTokenAmount: TokenAmount
  toTokenAmount: TokenAmount
  calldata: HexData
  targetContract: Address
  value: string
  gasPrice: string
}
