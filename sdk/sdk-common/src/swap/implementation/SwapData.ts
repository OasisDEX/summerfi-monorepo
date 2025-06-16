import { ITokenAmount } from '../../common/interfaces/ITokenAmount'
import { HexData } from '../../common/types/HexData'
import type { SwapProviderType } from '../enums/SwapProviderType'
import { IAddress } from '../../common/interfaces/IAddress'

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
