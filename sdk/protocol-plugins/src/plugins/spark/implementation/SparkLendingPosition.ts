import { LendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { ISparkLendingPositionId } from '../interfaces'
import { ISparkLendingPool } from '../interfaces/ISparkLendingPool'
import {
  ISparkLendingPosition,
  ISparkLendingPositionParameters,
} from '../interfaces/ISparkLendingPosition'

/**
 * @class SparkPosition
 * @see ISparkLendingPosition
 */
export class SparkLendingPosition extends LendingPosition implements ISparkLendingPosition {
  readonly _signature_2 = 'ISparkLendingPosition'

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
