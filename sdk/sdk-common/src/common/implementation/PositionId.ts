import { SerializationService } from '../../services/SerializationService'
import { IPositionId, IPositionIdData, __signature__ } from '../interfaces/IPositionId'
import { PositionType } from '../types/PositionType'

/**
 * Type for the parameters of Position
 */
export type PositionIdParameters = Omit<IPositionIdData, 'type'>

/**
 * @class PositionId
 * @see IPositionIdData
 */
export abstract class PositionId implements IPositionId {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: string
  abstract readonly type: PositionType

  /** SEALED CONSTRUCTOR */
  protected constructor(params: PositionIdParameters) {
    this.id = params.id
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Position ID: ${this.id} with type: ${this.type}`
  }
}

SerializationService.registerClass(PositionId)
