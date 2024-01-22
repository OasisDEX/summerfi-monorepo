import { TokenAmount, RiskRatio } from '~sdk/common'
import { Pool } from '~sdk/protocols'
import { Position, PositionId } from '~sdk/user'

export class PositionBaseImpl implements Position {
  public readonly positionId: PositionId
  public readonly debtAmount: TokenAmount
  public readonly collateralAmount: TokenAmount
  public readonly riskRatio: RiskRatio
  public readonly pool: Pool

  constructor(params: {
    positionId: PositionId
    debtAmount: TokenAmount
    collateralAmount: TokenAmount
    riskRatio: RiskRatio
    pool: Pool
  }) {
    this.positionId = params.positionId
    this.debtAmount = params.debtAmount
    this.collateralAmount = params.collateralAmount
    this.riskRatio = params.riskRatio
    this.pool = params.pool
  }
}
