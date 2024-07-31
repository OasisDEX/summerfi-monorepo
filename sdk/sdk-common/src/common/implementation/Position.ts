import { SerializationService } from '../../services/SerializationService'
import { IPosition, IPositionParameters } from '../interfaces/IPosition'
import { IPositionId } from '../interfaces/IPositionId'
import { PositionType } from '../types/PositionType'

/**
 * @name Position
 * @see IPosition
 */
export abstract class Position implements IPosition {
  readonly _signature_0 = 'IPosition'

  readonly type: PositionType
  readonly id: IPositionId

  protected constructor(params: IPositionParameters) {
    this.type = params.type
    this.id = params.id
  }
}

SerializationService.registerClass(Position)
