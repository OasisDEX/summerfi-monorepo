import { IPosition, IPositionData } from '../interfaces/IPosition'
import { SerializationService } from '../../services/SerializationService'
import { PositionId } from './PositionId'
import { TokenAmount } from './TokenAmount'
import { PositionType } from '../enums/PositionType'
import { Pool } from '../../protocols/implementation/Pool'

/**
 * @name Position
 * @see IPosition
 */
export abstract class Position implements IPosition {
  readonly type: PositionType
  readonly id: PositionId
  readonly debtAmount: TokenAmount
  readonly collateralAmount: TokenAmount
  abstract readonly pool: Pool

  protected constructor(params: IPositionData) {
    this.type = params.type
    this.id = params.id
    this.debtAmount = TokenAmount.createFrom(params.debtAmount)
    this.collateralAmount = TokenAmount.createFrom(params.collateralAmount)
  }
}

SerializationService.registerClass(Position)
