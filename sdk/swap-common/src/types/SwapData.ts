import { Address, TokenAmount } from '@summerfi/sdk-common/common/implementation'
import { HexData } from '@summerfi/sdk-common/common/aliases'
import { SwapProviderType } from '~swap-common/enums'

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
