import { SerializationService } from '../../services/SerializationService'
import { IPool } from '../interfaces/IPool'
import { IPosition, IPositionParameters } from '../interfaces/IPosition'
import { IPositionId } from '../interfaces/IPositionId'
import { ITokenAmount } from '../interfaces/ITokenAmount'
import { PositionType } from '../types/PositionType'
import { TokenAmount } from './TokenAmount'

/**
 * @name Position
 * @see IPosition
 */
export abstract class Position implements IPosition {
  readonly _signature_0 = 'IPosition'

  readonly type: PositionType
  readonly id: IPositionId
  readonly debtAmount: ITokenAmount
  readonly collateralAmount: ITokenAmount
  abstract readonly pool: IPool

  protected constructor(params: IPositionParameters) {
    this.type = params.type
    this.id = params.id
    this.debtAmount = TokenAmount.createFrom(params.debtAmount)
    this.collateralAmount = TokenAmount.createFrom(params.collateralAmount)
  }
}

SerializationService.registerClass(Position)
