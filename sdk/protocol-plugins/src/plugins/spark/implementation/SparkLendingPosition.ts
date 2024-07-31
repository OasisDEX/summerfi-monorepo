import { LendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { ISparkLendingPositionId } from '../interfaces'
import { ISparkLendingPool } from '../interfaces/ISparkLendingPool'
import {
  ISparkLendingPosition,
  ISparkLendingPositionParameters,
  __signature__,
} from '../interfaces/ISparkLendingPosition'

/**
 * @class SparkPosition
 * @see ISparkLendingPosition
 */
export class SparkLendingPosition extends LendingPosition implements ISparkLendingPosition {
  readonly [__signature__] = __signature__

  readonly id: ISparkLendingPositionId
  readonly pool: ISparkLendingPool

  /** Factory method */
  static createFrom(params: ISparkLendingPositionParameters): SparkLendingPosition {
    return new SparkLendingPosition(params)
  }

  /** Sealed constructor */
  private constructor(params: ISparkLendingPositionParameters) {
    super(params)

    this.id = params.id
    this.pool = params.pool
  }
}

SerializationService.registerClass(SparkLendingPosition)
