import { LendingPositionId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IAaveV3LendingPositionId,
  IAaveV3LendingPositionIdParameters,
} from '../interfaces/IAaveV3LendingPositionId'

/**
 * @class AaveV3PositionId
 * @see IAaveV3LendingPositionIdData
 */
export class AaveV3LendingPositionId extends LendingPositionId implements IAaveV3LendingPositionId {
  readonly _signature_2 = 'IAaveV3LendingPositionId'

  /** Factory method */
  static createFrom(params: IAaveV3LendingPositionIdParameters): AaveV3LendingPositionId {
    return new AaveV3LendingPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: IAaveV3LendingPositionIdParameters) {
    super(params)
  }
}

SerializationService.registerClass(AaveV3LendingPositionId)
