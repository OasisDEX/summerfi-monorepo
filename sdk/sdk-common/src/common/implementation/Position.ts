import { SerializationService } from '../../services/SerializationService'
import { IPosition, IPositionParameters, __iposition__ } from '../interfaces/IPosition'
import { IPositionId } from '../interfaces/IPositionId'
import { PositionType } from '../types/PositionType'

/**
 * @name Position
 * @see IPosition
 */
export abstract class Position implements IPosition {
  /** SIGNATURE */
  readonly [__iposition__] = 'IPosition'

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
