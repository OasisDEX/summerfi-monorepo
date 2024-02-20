import { RiskRatio, TokenAmount } from '~sdk-common/common'
import type { RiskRatioSerialized } from '~sdk-common/common/implementation/RiskRatio'
import type { TokenAmountSerialized } from '~sdk-common/common/implementation/TokenAmount'
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
 * borrowed debts, etc..
 */
export interface Position {
  positionId: PositionId
  debtAmount: TokenAmount
  collateralAmount: TokenAmount
  riskRatio: RiskRatio
  pool: Pool
}

/**
 * @interface PositionSerialized
 * @description Represents a serialized user's position
 */
export interface PositionSerialized {
  positionId: PositionId
  debtAmount: TokenAmountSerialized
  collateralAmount: TokenAmountSerialized
  riskRatio: RiskRatioSerialized
  pool: Pool
}
