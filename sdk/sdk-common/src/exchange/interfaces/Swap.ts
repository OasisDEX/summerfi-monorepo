import { TokenAmount } from '~sdk-common/common/implementation'

export interface Swap {
  fromTokenAmount: TokenAmount
  toTokenAmount: TokenAmount
  slippage: number
  fee: number
}
