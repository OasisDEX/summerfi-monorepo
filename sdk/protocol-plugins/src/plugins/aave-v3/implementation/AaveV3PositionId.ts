import { PositionId } from '@summerfi/sdk-common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IAaveV3PositionId } from '../interfaces/IAaveV3PositionId'

export class AaveV3PositionId extends PositionId implements IAaveV3PositionId {
  private constructor(params: IAaveV3PositionId) {
    super(params)
  }

  static createFrom(params: IAaveV3PositionId): AaveV3PositionId {
    return new AaveV3PositionId(params)
  }
}

SerializationService.registerClass(AaveV3PositionId)
