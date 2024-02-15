import { RiskRatio, TokenAmount } from '~sdk/common'
import { Pool } from '~sdk/protocols'

/**
 * @name PositionId
 * @description Represents a position ID
 */
export type PositionId = {
  id: string
}

/**
 * @interface Position
 * @description Represents a user's position, including risk ratio, current collateral,
 *              borrowed debts, etc..
 */
export interface Position {
  positionId: PositionId
  debtAmount: TokenAmount
  collateralAmount: TokenAmount
  pool: Pool
}
