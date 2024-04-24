import { SerializationService } from '../../services/SerializationService'
import { IPositionId } from '../interfaces/IPositionId'

/**
 * @class PositionId
 * @see IPositionId
 */
export abstract class PositionId implements IPositionId {
  readonly id: string

  protected constructor(params: IPositionId) {
    this.id = params.id
  }

  toString(): string {
    return `Position ID: ${this.id}`
  }
}

SerializationService.registerClass(PositionId)
