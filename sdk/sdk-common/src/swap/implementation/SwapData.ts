import { IAddress, ITokenAmount } from '@summerfi/sdk-common/common'
import { HexData } from '@summerfi/sdk-common/common/aliases'
import type { SwapProviderType } from '../enums/SwapProviderType'

/**
 * @name SwapData
 * @description Represents the data needed to perform a swap between two tokens
 */
export type SwapData = {
  provider: SwapProviderType
  fromTokenAmount: ITokenAmount
  toTokenAmount: ITokenAmount
  calldata: HexData
  targetContract: IAddress
  value: string
  /* The gas price for the swap portion of the t/x only */
  gasPrice: string
}
