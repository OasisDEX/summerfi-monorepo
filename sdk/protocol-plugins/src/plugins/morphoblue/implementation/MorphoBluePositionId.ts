import { PositionId } from '@summerfi/sdk-common'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IMorphoBluePositionId,
  IMorphoBluePositionIdData,
} from '../interfaces/IMorphoBluePositionId'

/**
 * @class MorphoBluePositionId
 * @see IMorphoBluePositionId
 */
export class MorphoBluePositionId extends PositionId implements IMorphoBluePositionId {
  /** Factory method */
  static createFrom(params: IMorphoBluePositionIdData): MorphoBluePositionId {
    return new MorphoBluePositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoBluePositionIdData) {
    super(params)
  }
}

SerializationService.registerClass(MorphoBluePositionId)
