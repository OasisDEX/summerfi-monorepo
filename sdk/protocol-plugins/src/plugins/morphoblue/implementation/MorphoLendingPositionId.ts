import { LendingPositionId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IMorphoLendingPositionId,
  IMorphoLendingPositionIdData,
} from '../interfaces/IMorphoLendingPositionId'

/**
 * @class MorphoLendingPositionId
 * @see IMorphoLendingPositionId
 */
export class MorphoLendingPositionId extends LendingPositionId implements IMorphoLendingPositionId {
  /** Factory method */
  static createFrom(params: IMorphoLendingPositionIdData): MorphoLendingPositionId {
    return new MorphoLendingPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoLendingPositionIdData) {
    super(params)
  }
}

SerializationService.registerClass(MorphoLendingPositionId)
