import { SerializationService } from '../../services/SerializationService'
import { IPositionId, IPositionIdData } from '../interfaces/IPositionId'
import { PositionType } from '../types/PositionType'

/**
 * @class PositionId
 * @see IPositionIdData
 */
export abstract class PositionId implements IPositionId {
  readonly id: string
  readonly type: PositionType

  protected constructor(params: IPositionIdData) {
    this.id = params.id
    this.type = params.type
  }

  toString(): string {
    return `Position ID: ${this.id} with type: ${this.type}`
  }
}

SerializationService.registerClass(PositionId)
