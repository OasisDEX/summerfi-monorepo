import { SerializationService } from '../../services/SerializationService'
import { IPositionId, IPositionIdParameters, __signature__ } from '../interfaces/IPositionId'
import { PositionType } from '../types/PositionType'

/**
 * @class PositionId
 * @see IPositionIdData
 */
export abstract class PositionId implements IPositionId {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: string
  readonly type: PositionType

  /** SEALED CONSTRUCTOR */
  protected constructor(params: IPositionIdParameters) {
    this.id = params.id
    this.type = params.type
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Position ID: ${this.id} with type: ${this.type}`
  }
}

SerializationService.registerClass(PositionId)
