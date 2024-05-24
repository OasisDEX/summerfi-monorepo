import { SerializationService } from '@summerfi/sdk-common/services'
import { IMorphoBluePosition, IMorphoBluePositionData } from '../interfaces/IMorphoBluePosition'
import { Position } from '@summerfi/sdk-common'
import { MorphoBlueLendingPool } from './MorphoBlueLendingPool'
import { MorphoBluePositionId } from './MorphoBluePositionId'

/**
 * @class MorphoBluePosition
 * @see IMorphoBluePosition
 */
export class MorphoBluePosition extends Position implements IMorphoBluePosition {
  readonly id: MorphoBluePositionId
  readonly pool: MorphoBlueLendingPool

  /** Factory method */
  static createFrom(params: IMorphoBluePositionData): MorphoBluePosition {
    return new MorphoBluePosition(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoBluePositionData) {
    super(params)

    this.id = MorphoBluePositionId.createFrom(params.id)
    this.pool = MorphoBlueLendingPool.createFrom(params.pool)
  }
}

SerializationService.registerClass(MorphoBluePosition)
