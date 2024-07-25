import { LendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  ISparkLendingPosition,
  ISparkLendingPositionData,
} from '../interfaces/ISparkLendingPosition'
import { SparkLendingPool } from './SparkLendingPool'

/**
 * @class SparkPosition
 * @see ISparkLendingPosition
 */
export class SparkLendingPosition extends LendingPosition implements ISparkLendingPosition {
  readonly pool: SparkLendingPool

  /** Factory method */
  static createFrom(params: ISparkLendingPositionData): SparkLendingPosition {
    return new SparkLendingPosition(params)
  }

  /** Sealed constructor */
  private constructor(params: ISparkLendingPositionData) {
    super(params)

    this.pool = SparkLendingPool.createFrom(params.pool)
  }
}

SerializationService.registerClass(SparkLendingPosition)
