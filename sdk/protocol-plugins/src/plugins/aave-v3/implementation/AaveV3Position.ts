import { SerializationService } from '@summerfi/sdk-common/services'
import { IAaveV3Position, IAaveV3PositionData } from '../interfaces/IAaveV3Position'
import { Position } from '@summerfi/sdk-common'
import { AaveV3LendingPool } from './AaveV3LendingPool'

/**
 * @class AaveV3Position
 * @see IAaveV3Position
 */
export class AaveV3Position extends Position implements IAaveV3Position {
  readonly pool: AaveV3LendingPool

  /** Factory method */
  static createFrom(params: IAaveV3PositionData): AaveV3Position {
    return new AaveV3Position(params)
  }

  /** Sealed constructor */
  private constructor(params: IAaveV3PositionData) {
    super(params)

    this.pool = AaveV3LendingPool.createFrom(params.pool)
  }
}

SerializationService.registerClass(AaveV3Position)
