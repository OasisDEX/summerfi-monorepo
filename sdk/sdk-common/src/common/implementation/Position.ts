import { IPosition } from '../interfaces/IPosition'
import { IPool } from '../../protocols/interfaces/IPool'
import { SerializationService } from '../../services/SerializationService'
import { PositionId } from './PositionId'
import { RiskRatio } from './RiskRatio'
import { TokenAmount } from './TokenAmount'

// we should add assests prop instead of the amounts
export class Position implements IPosition {
  readonly positionId: PositionId
  readonly debtAmount: TokenAmount
  readonly collateralAmount: TokenAmount
  readonly pool: IPool

  private constructor(params: IPosition) {
    this.positionId = params.positionId
    this.debtAmount = TokenAmount.createFrom(params.debtAmount)
    this.collateralAmount = TokenAmount.createFrom(params.collateralAmount)
    this.pool = params.pool
  }

  static createFrom(params: IPosition): Position {
    return new Position(params)
  }

  get riskRatio(): RiskRatio {
    // TODO: Implement risk ratio calculation
    throw new Error('Not implemented')
  }
}

SerializationService.registerClass(Position)
