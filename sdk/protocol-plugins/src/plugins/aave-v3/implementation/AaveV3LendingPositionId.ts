import { LendingPositionId, SerializationService } from '@summerfi/sdk-common'
import {
  IAaveV3LendingPositionId,
  IAaveV3LendingPositionIdData,
  __signature__,
} from '../interfaces/IAaveV3LendingPositionId'

/**
 * Type for the parameters of AaveV3PositionId
 */
export type AaveV3LendingPositionIdParameters = Omit<IAaveV3LendingPositionIdData, 'type'>

/**
 * @class AaveV3PositionId
 * @see IAaveV3LendingPositionIdData
 */
export class AaveV3LendingPositionId extends LendingPositionId implements IAaveV3LendingPositionId {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** FACTORY */
  static createFrom(params: AaveV3LendingPositionIdParameters): AaveV3LendingPositionId {
    return new AaveV3LendingPositionId(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: AaveV3LendingPositionIdParameters) {
    super(params)
  }
}

SerializationService.registerClass(AaveV3LendingPositionId, {
  identifier: 'AaveV3LendingPositionId',
})
