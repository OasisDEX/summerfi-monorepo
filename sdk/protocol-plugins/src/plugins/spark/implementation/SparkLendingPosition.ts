import { LendingPosition } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { ISparkLendingPositionId } from '../interfaces'
import { ISparkLendingPool } from '../interfaces/ISparkLendingPool'
import {
  ISparkLendingPosition,
  ISparkLendingPositionData,
  __signature__,
} from '../interfaces/ISparkLendingPosition'

/**
 * Type for the parameters of SparkPosition
 */
export type SparkLendingPositionParameters = Omit<ISparkLendingPositionData, 'type'>

/**
 * @class SparkPosition
 * @see ISparkLendingPosition
 */
export class SparkLendingPosition extends LendingPosition implements ISparkLendingPosition {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: ISparkLendingPositionId
  readonly vault: ISparkLendingPool

  /** FACTORY */
  static createFrom(params: SparkLendingPositionParameters): SparkLendingPosition {
    return new SparkLendingPosition(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: SparkLendingPositionParameters) {
    super(params)

    this.id = params.id
    this.vault = params.pool
  }
}

SerializationService.registerClass(SparkLendingPosition, { identifier: 'SparkLendingPosition' })
