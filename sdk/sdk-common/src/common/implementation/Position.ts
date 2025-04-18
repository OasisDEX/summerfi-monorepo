import { SerializationService } from '../../services/SerializationService'
import { IPool } from '../interfaces/IPool'
import { IPosition, IPositionData, __signature__ } from '../interfaces/IPosition'
import { IPositionId } from '../interfaces/IPositionId'
import { PositionType } from '../enums/PositionType'

/**
 * Type for the parameters of Position
 */
export type PositionParameters = Omit<IPositionData, 'type' | 'id'>

/**
 * @name Position
 * @see IPosition
 */
export abstract class Position implements IPosition {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  abstract readonly type: PositionType
  abstract readonly id: IPositionId
  abstract readonly pool: IPool

  /** SEALED CONSTRUCTOR */
  protected constructor(_: PositionParameters) {
    // Empty on purpose
  }
}

SerializationService.registerClass(Position, { identifier: 'Position' })
