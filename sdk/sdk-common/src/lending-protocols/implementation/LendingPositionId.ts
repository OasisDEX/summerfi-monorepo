import { PositionId } from '../../common/implementation/PositionId'
import { PositionType } from '../../common/types/PositionType'
import { SerializationService } from '../../services/SerializationService'
import {
  ILendingPositionIdData,
  ILendingPositionIdParameters,
} from '../interfaces/ILendingPositionId'

/**
 * @class LendingPositionId
 * @see ILendingPositionIdData
 */
export abstract class LendingPositionId extends PositionId implements ILendingPositionIdData {
  readonly _signature_1 = 'ILendingPositionId'

  protected constructor(params: ILendingPositionIdParameters) {
    super({
      ...params,
      type: PositionType.Lending,
    })
  }

  toString(): string {
    return `Lending Position ID: ${this.id} with type: ${this.type}`
  }
}

SerializationService.registerClass(LendingPositionId)
