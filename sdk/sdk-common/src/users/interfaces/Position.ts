import { RiskRatio, TokenAmount } from '~sdk-common/common'
import { Pool } from '~sdk-common/protocols'

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
  riskRatio: RiskRatio
  pool: Pool
}
