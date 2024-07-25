import { LendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IMakerLendingPosition,
  IMakerLendingPositionData,
} from '../interfaces/IMakerLendingPosition'
import { MakerLendingPool } from './MakerLendingPool'
import { MakerLendingPositionId } from './MakerLendingPositionId'

/**
 * @class MakerPosition
 * @see IMakerLendingPosition
 */
export class MakerLendingPosition extends LendingPosition implements IMakerLendingPosition {
  readonly id: MakerLendingPositionId
  readonly pool: MakerLendingPool

  /** Factory method */
  static createFrom(params: IMakerLendingPositionData): MakerLendingPosition {
    return new MakerLendingPosition(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerLendingPositionData) {
    super(params)

    this.id = MakerLendingPositionId.createFrom(params.id)
    this.pool = MakerLendingPool.createFrom(params.pool)
  }
}

SerializationService.registerClass(MakerLendingPosition)
