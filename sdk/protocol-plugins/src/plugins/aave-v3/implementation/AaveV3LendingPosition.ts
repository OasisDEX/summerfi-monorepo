import { LendingPosition, SerializationService } from '@summerfi/sdk-common'
import { IAaveV3LendingPool } from '../interfaces/IAaveV3LendingPool'
import {
  IAaveV3LendingPosition,
  IAaveV3LendingPositionData,
  __signature__,
} from '../interfaces/IAaveV3LendingPosition'
import { IAaveV3LendingPositionId } from '../interfaces/IAaveV3LendingPositionId'

/**
 * Type for the parameters of AaveV3Position
 */
export type AaveV3LendingPositionParameters = Omit<IAaveV3LendingPositionData, 'type'>

/**
 * @class AaveV3Position
 * @see IAaveV3LendingPosition
 */
export class AaveV3LendingPosition extends LendingPosition implements IAaveV3LendingPosition {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly pool: IAaveV3LendingPool
  readonly id: IAaveV3LendingPositionId

  /** FACTORY */
  static createFrom(params: AaveV3LendingPositionParameters): AaveV3LendingPosition {
    return new AaveV3LendingPosition(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: AaveV3LendingPositionParameters) {
    super(params)

    this.pool = params.pool
    this.id = params.id
  }
}

SerializationService.registerClass(AaveV3LendingPosition, { identifier: 'AaveV3LendingPosition' })
