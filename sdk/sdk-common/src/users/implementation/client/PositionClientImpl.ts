import { RiskRatio, TokenAmount } from '~sdk-common/common'
import type { Pool } from '~sdk-common/protocols'
import { Position, PositionId, type PositionSerialized } from '~sdk-common/users'

export class PositionClientImpl implements Position {
  public readonly positionId: PositionId
  public readonly debtAmount: TokenAmount
  public readonly collateralAmount: TokenAmount
  public readonly riskRatio: RiskRatio
  public readonly pool: Pool

  private constructor(params: Position) {
    this.positionId = params.positionId
    this.debtAmount = params.debtAmount
    this.collateralAmount = params.collateralAmount
    this.riskRatio = params.riskRatio
    this.pool = params.pool
  }

  public static createFrom(params: Position): PositionClientImpl {
    return new PositionClientImpl({
      positionId: params.positionId,
      debtAmount: TokenAmount.createFrom(params.debtAmount),
      collateralAmount: TokenAmount.createFrom(params.collateralAmount),
      riskRatio: RiskRatio.createFrom(params.riskRatio),
      pool: params.pool,
    })
  }

  public static deserialize(params: PositionSerialized): PositionClientImpl {
    return new PositionClientImpl({
      positionId: params.positionId,
      debtAmount: TokenAmount.deserialize(params.debtAmount),
      collateralAmount: TokenAmount.deserialize(params.collateralAmount),
      riskRatio: RiskRatio.deserialize(params.riskRatio),
      pool: params.pool,
    })
  }
}
