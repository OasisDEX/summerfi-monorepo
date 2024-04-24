import { IPosition } from '../interfaces/IPosition'
import { IPool } from '../../protocols/interfaces/IPool'
import { SerializationService } from '../../services/SerializationService'
import { PositionId } from './PositionId'
import { TokenAmount } from './TokenAmount'
import { PositionType } from '../enums/PositionType'

/**
 * @name Position
 * @see IPosition
 */
export class Position implements IPosition {
  readonly type: PositionType
  readonly positionId: PositionId
  readonly debtAmount: TokenAmount
  readonly collateralAmount: TokenAmount
  readonly pool: IPool

  private constructor(params: IPosition) {
    this.type = params.type
    this.positionId = params.positionId
    this.debtAmount = TokenAmount.createFrom(params.debtAmount)
    this.collateralAmount = TokenAmount.createFrom(params.collateralAmount)
    this.pool = params.pool
  }

  static createFrom(params: IPosition): Position {
    return new Position(params)
  }
}

SerializationService.registerClass(Position)
