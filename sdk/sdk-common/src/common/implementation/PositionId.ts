import { SerializationService } from '../../services/SerializationService'
import { IPositionId, IPositionIdData } from '../interfaces/IPositionId'

/**
 * @class PositionId
 * @see IPositionIdData
 */
export abstract class PositionId implements IPositionId {
  readonly id: string

  protected constructor(params: IPositionIdData) {
    this.id = params.id
  }

  toString(): string {
    return `Position ID: ${this.id}`
  }
}

SerializationService.registerClass(PositionId)
