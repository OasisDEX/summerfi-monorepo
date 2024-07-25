import { LendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IMorphoLendingPosition,
  IMorphoLendingPositionData,
} from '../interfaces/IMorphoLendingPosition'
import { MorphoLendingPool } from './MorphoLendingPool'
import { MorphoLendingPositionId } from './MorphoLendingPositionId'

/**
 * @class MorphoLendingPosition
 * @see IMorphoLendingPosition
 */
export class MorphoLendingPosition extends LendingPosition implements IMorphoLendingPosition {
  readonly id: MorphoLendingPositionId
  readonly pool: MorphoLendingPool

  /** Factory method */
  static createFrom(params: IMorphoLendingPositionData): MorphoLendingPosition {
    return new MorphoLendingPosition(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoLendingPositionData) {
    super(params)

    this.id = MorphoLendingPositionId.createFrom(params.id)
    this.pool = MorphoLendingPool.createFrom(params.pool)
  }
}

SerializationService.registerClass(MorphoLendingPosition)
