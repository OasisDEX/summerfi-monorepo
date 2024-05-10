import { SerializationService } from '@summerfi/sdk-common/services'
import { ISparkPosition, ISparkPositionData } from '../interfaces/ISparkPosition'
import { Position } from '@summerfi/sdk-common'
import { SparkLendingPool } from './SparkLendingPool'

/**
 * @class SparkPosition
 * @see ISparkPosition
 */
export class SparkPosition extends Position implements ISparkPosition {
  readonly pool: SparkLendingPool

  /** Factory method */
  static createFrom(params: ISparkPositionData): SparkPosition {
    return new SparkPosition(params)
  }

  /** Sealed constructor */
  private constructor(params: ISparkPositionData) {
    super(params)

    this.pool = SparkLendingPool.createFrom(params.pool)
  }
}

SerializationService.registerClass(SparkPosition)
