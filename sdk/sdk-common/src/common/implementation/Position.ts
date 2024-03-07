import { IPool } from '../../protocols/interfaces/IPool'
import { SerializationService } from '../../services/SerializationService'
import { PositionId } from './PositionId'
import { RiskRatio } from './RiskRatio'
import { TokenAmount } from './TokenAmount'

interface IPositionSerialized {
  readonly positionId: PositionId
  readonly debtAmount: TokenAmount
  readonly collateralAmount: TokenAmount
  readonly pool: IPool
}

export class Position implements IPositionSerialized {
  readonly positionId: PositionId
  readonly debtAmount: TokenAmount
  readonly collateralAmount: TokenAmount
  readonly pool: IPool

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
