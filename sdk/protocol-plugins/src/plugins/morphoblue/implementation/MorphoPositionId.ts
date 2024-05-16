import { PositionId } from '@summerfi/sdk-common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMorphoPositionId, IMorphoPositionIdData } from '../interfaces/IMorphoPositionId'

/**
 * @class MorphoPositionId
 * @see IMorphoPositionId
 */
export class MorphoPositionId extends PositionId implements IMorphoPositionId {
  /** Factory method */
  static createFrom(params: IMorphoPositionIdData): MorphoPositionId {
    return new MorphoPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoPositionIdData) {
    super(params)
  }
}

SerializationService.registerClass(MorphoPositionId)
