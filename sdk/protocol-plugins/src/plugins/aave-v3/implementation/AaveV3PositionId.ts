import { PositionId } from '@summerfi/sdk-common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IAaveV3PositionId, IAaveV3PositionIdData } from '../interfaces/IAaveV3PositionId'

/**
 * @class AaveV3PositionId
 * @see IAaveV3PositionIdData
 */
export class AaveV3PositionId extends PositionId implements IAaveV3PositionId {
  /** Factory method */
  static createFrom(params: IAaveV3PositionIdData): AaveV3PositionId {
    return new AaveV3PositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: IAaveV3PositionIdData) {
    super(params)
  }
}

SerializationService.registerClass(AaveV3PositionId)
