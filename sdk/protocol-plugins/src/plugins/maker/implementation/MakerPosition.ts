import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerPosition, IMakerPositionData } from '../interfaces/IMakerPosition'
import { Position } from '@summerfi/sdk-common'
import { MakerLendingPool } from './MakerLendingPool'
import { MakerPositionId } from './MakerPositionId'

/**
 * @class MakerPosition
 * @see IMakerPosition
 */
export class MakerPosition extends Position implements IMakerPosition {
  readonly id: MakerPositionId
  readonly pool: MakerLendingPool

  /** Factory method */
  static createFrom(params: IMakerPositionData): MakerPosition {
    return new MakerPosition(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerPositionData) {
    super(params)

    this.id = MakerPositionId.createFrom(params.id)
    this.pool = MakerLendingPool.createFrom(params.pool)
  }
}

SerializationService.registerClass(MakerPosition)
