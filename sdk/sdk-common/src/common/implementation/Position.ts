import { SerializationService } from '../../services/SerializationService'
import { IPosition, IPositionParameters, __signature__ } from '../interfaces/IPosition'
import { IPositionId } from '../interfaces/IPositionId'
import { PositionType } from '../types/PositionType'

/**
 * @name Position
 * @see IPosition
 */
export abstract class Position implements IPosition {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly type: PositionType
  readonly id: IPositionId

  /** SEALED CONSTRUCTOR */
  protected constructor(params: IPositionParameters) {
    this.type = params.type
    this.id = params.id
  }
}

SerializationService.registerClass(Position)
