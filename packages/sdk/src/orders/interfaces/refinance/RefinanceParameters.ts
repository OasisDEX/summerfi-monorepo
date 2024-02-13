import { Percentage, TokenAmount } from '~sdk/common'

/**
 * @interface RefinanceParameters
 * @description Parameters used to refinance a position
 */
export interface RefinanceParameters {
  /** Amount that the user is willing to deposit */
  depositAmount?: TokenAmount
  /** Amount that the user is willing to borrow */
  borrowAmount?: TokenAmount
  /** Maximum slippage allowed when opening a position */
  slippage: Percentage
}
