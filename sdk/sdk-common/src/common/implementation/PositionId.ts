import { SerializationService } from '../../services/SerializationService'
import { IPositionId, IPositionIdParameters } from '../interfaces/IPositionId'
import { PositionType } from '../types/PositionType'

/**
 * @class PositionId
 * @see IPositionIdData
 */
export abstract class PositionId implements IPositionId {
  readonly _signature_0 = 'IPositionId'

  readonly id: string
  readonly type: PositionType

  protected constructor(params: IPositionIdParameters) {
    this.id = params.id
    this.type = params.type
  }

  toString(): string {
    return `Position ID: ${this.id} with type: ${this.type}`
  }
}

SerializationService.registerClass(PositionId)
