import { LendingPositionId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IMorphoLendingPositionId,
  IMorphoLendingPositionIdParameters,
} from '../interfaces/IMorphoLendingPositionId'

/**
 * @class MorphoLendingPositionId
 * @see IMorphoLendingPositionId
 */
export class MorphoLendingPositionId extends LendingPositionId implements IMorphoLendingPositionId {
  readonly _signature_2 = 'IMorphoLendingPositionId'

  /** Factory method */
  static createFrom(params: IMorphoLendingPositionIdParameters): MorphoLendingPositionId {
    return new MorphoLendingPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoLendingPositionIdParameters) {
    super(params)
  }
}

SerializationService.registerClass(MorphoLendingPositionId)
