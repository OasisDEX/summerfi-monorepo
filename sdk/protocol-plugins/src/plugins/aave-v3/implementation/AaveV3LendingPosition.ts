import { LendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IAaveV3LendingPosition,
  IAaveV3LendingPositionData,
} from '../interfaces/IAaveV3LendingPosition'
import { AaveV3LendingPool } from './AaveV3LendingPool'
import { AaveV3LendingPositionId } from './AaveV3LendingPositionId'

/**
 * @class AaveV3Position
 * @see IAaveV3LendingPosition
 */
export class AaveV3LendingPosition extends LendingPosition implements IAaveV3LendingPosition {
  readonly pool: AaveV3LendingPool
  readonly id: AaveV3LendingPositionId

  /** Factory method */
  static createFrom(params: IAaveV3LendingPositionData): AaveV3LendingPosition {
    return new AaveV3LendingPosition(params)
  }

  /** Sealed constructor */
  private constructor(params: IAaveV3LendingPositionData) {
    super(params)

    this.pool = AaveV3LendingPool.createFrom(params.pool)
    this.id = AaveV3LendingPositionId.createFrom(params.id)
  }
}

SerializationService.registerClass(AaveV3LendingPosition)
