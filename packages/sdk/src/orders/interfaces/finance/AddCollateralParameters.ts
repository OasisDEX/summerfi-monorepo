import { Percentage, RiskRatio, TokenAmount } from '~sdk/common'

/**
 * @interface AddCollateralParameters
 * @description Parameters used to open a Multiply position
 */
export interface AddCollateralParameters {
  /** Amount that the user is willing to deposit */
  depositAmount: TokenAmount
  /** Amount that the user is willing to borrow */
  borrowAmount: TokenAmount
  /** Maximum slippage allowed when opening a position */
  slippage: Percentage
}
