import { TokenAmount, RiskRatio, PositionId } from '~sdk-common/common/implementation'
import { Pool } from '~sdk-common/protocols'
import { SerializationService } from '~sdk-common/common/services'

interface IPositionSerialized {
  readonly positionId: PositionId
  readonly debtAmount: TokenAmount
  readonly collateralAmount: TokenAmount
  readonly pool: Pool
}

export class Position implements IPositionSerialized {
  readonly positionId: PositionId
  readonly debtAmount: TokenAmount
  readonly collateralAmount: TokenAmount
  readonly pool: Pool

  constructor(params: IPositionSerialized) {
    this.positionId = params.positionId
    this.debtAmount = params.debtAmount
    this.collateralAmount = params.collateralAmount
    this.pool = params.pool
  }

  static createFrom(params: IPositionSerialized): Position {
    return new Position(params)
  }

  get riskRatio(): RiskRatio {
    // TODO: Implement risk ratio calculation
    throw new Error('Not implemented')
  }
}

SerializationService.registerClass(Position)
