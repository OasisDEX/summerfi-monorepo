import { LendingPositionId, SerializationService } from '@summerfi/sdk-common'
import {
  IMorphoLendingPositionId,
  IMorphoLendingPositionIdData,
  __signature__,
} from '../interfaces/IMorphoLendingPositionId'

/**
 * Type for the parameters of MorphoLendingPositionId
 */
export type MorphoLendingPositionIdParameters = Omit<IMorphoLendingPositionIdData, 'type'>

/**
 * @class MorphoLendingPositionId
 * @see IMorphoLendingPositionId
 */
export class MorphoLendingPositionId extends LendingPositionId implements IMorphoLendingPositionId {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** FACTORY */
  static createFrom(params: MorphoLendingPositionIdParameters): MorphoLendingPositionId {
    return new MorphoLendingPositionId(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: MorphoLendingPositionIdParameters) {
    super(params)
  }
}

SerializationService.registerClass(MorphoLendingPositionId, {
  identifier: 'MorphoLendingPositionId',
})
