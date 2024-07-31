import { LendingPositionId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IAaveV3LendingPositionId,
  IAaveV3LendingPositionIdParameters,
  __iaavev3lendingpositionid__,
} from '../interfaces/IAaveV3LendingPositionId'

/**
 * @class AaveV3PositionId
 * @see IAaveV3LendingPositionIdData
 */
export class AaveV3LendingPositionId extends LendingPositionId implements IAaveV3LendingPositionId {
  /** SIGNATURE */
  readonly [__iaavev3lendingpositionid__] = 'IAaveV3LendingPositionId'

  /** FACTORY */
  static createFrom(params: IAaveV3LendingPositionIdParameters): AaveV3LendingPositionId {
    return new AaveV3LendingPositionId(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IAaveV3LendingPositionIdParameters) {
    super(params)
  }
}

SerializationService.registerClass(AaveV3LendingPositionId)
