import { Percentage, RiskRatio, TokenAmount } from '~sdk-common/common/implementation'

/**
 * @interface CreatePositionParameters
 * @description Parameters used to open a position (Multiply, Borrow and Earn)
 */
export interface CreatePositionParameters {
  /** Amount that the user is willing to deposit */
  depositAmount: TokenAmount
  /** Amount that the user is willing to borrow */
  borrowAmount: TokenAmount
  /** Risk ratio for the position (equivalent to the multiplier) */
  riskRatio: RiskRatio
  /** Maximum slippage allowed when opening a position */
  slippage: Percentage
}
