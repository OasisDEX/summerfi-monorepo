import { PositionId } from '../../common/implementation/PositionId'
import { PositionType } from '../../common/enums/PositionType'
import { SerializationService } from '../../services/SerializationService'
import { ILendingPositionIdData, __signature__ } from '../interfaces/ILendingPositionId'

/**
 * Type for the parameters of LendingPositionId
 */
export type LendingPositionIdParameters = Omit<ILendingPositionIdData, 'type'>

/**
 * @class LendingPositionId
 * @see ILendingPositionId
 */
export abstract class LendingPositionId extends PositionId implements ILendingPositionIdData {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly type = PositionType.Lending

  /** SEALED CONSTRUCTOR */
  protected constructor(params: LendingPositionIdParameters) {
    super(params)
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Lending Position ID: ${this.id} with type: ${this.type}`
  }
}

SerializationService.registerClass(LendingPositionId, { identifier: 'LendingPositionId' })
