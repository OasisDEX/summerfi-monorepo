import { PositionId } from '../../common/implementation/PositionId'
import { PositionType } from '../../common/types/PositionType'
import { SerializationService } from '../../services/SerializationService'
import {
  ILendingPositionIdData,
  ILendingPositionIdParameters,
  __ilendingpositionid__,
} from '../interfaces/ILendingPositionId'

/**
 * @class LendingPositionId
 * @see ILendingPositionId
 */
export abstract class LendingPositionId extends PositionId implements ILendingPositionIdData {
  /** SIGNATURE */
  readonly [__ilendingpositionid__] = 'ILendingPositionId'

  /** SEALED CONSTRUCTOR */
  protected constructor(params: ILendingPositionIdParameters) {
    super({
      ...params,
      type: PositionType.Lending,
    })
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Lending Position ID: ${this.id} with type: ${this.type}`
  }
}

SerializationService.registerClass(LendingPositionId)
