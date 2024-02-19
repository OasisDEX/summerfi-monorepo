import { Percentage, TokenAmount } from '~sdk-common/common'

/**
 * @name ClosePositionType
 * @description Type of position closing
 */
export enum ClosePositionType {
  CloseToCollateral = 'CloseToCollateral',
  CloseToDebt = 'CloseToDebt',
}

/**
 * @interface ClosePositionParameters
 * @description Parameters used to open a Multiply position
 */
export interface ClosePositionParameters {
  /** Amount that the user is willing to repay to close the position */
  repayAmount: TokenAmount
  /** Type of position closing */
  closePositionType: ClosePositionType
  /** Maximum slippage allowed when opening a position */
  slippage: Percentage
}
