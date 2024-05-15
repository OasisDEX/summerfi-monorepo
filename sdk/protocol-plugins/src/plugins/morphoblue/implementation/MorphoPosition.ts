import { SerializationService } from '@summerfi/sdk-common/services'
import { IMorphoPosition, IMorphoPositionData } from '../interfaces/IMorphoPosition'
import { Position } from '@summerfi/sdk-common'
import { MorphoLendingPool } from './MorphoLendingPool'

/**
 * @class MorphoPosition
 * @see IMorphoPosition
 */
export class MorphoPosition extends Position implements IMorphoPosition {
  readonly pool: MorphoLendingPool

  /** Factory method */
  static createFrom(params: IMorphoPositionData): MorphoPosition {
    return new MorphoPosition(params)
  }

  /** Sealed constructor */
  private constructor(params: IMorphoPositionData) {
    super(params)

    this.pool = MorphoLendingPool.createFrom(params.pool)
  }
}

SerializationService.registerClass(MorphoPosition)
