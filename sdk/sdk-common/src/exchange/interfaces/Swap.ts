import { TokenAmount } from '~sdk-common/common/implementation/TokenAmount'

export interface Swap {
  fromTokenAmount: TokenAmount
  toTokenAmount: TokenAmount
  slippage: number
  fee: number
}
