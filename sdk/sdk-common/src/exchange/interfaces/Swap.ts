import { TokenAmount } from '~sdk-common/common'

export interface Swap {
  fromTokenAmount: TokenAmount
  toTokenAmount: TokenAmount
  slippage: number
  fee: number
}
