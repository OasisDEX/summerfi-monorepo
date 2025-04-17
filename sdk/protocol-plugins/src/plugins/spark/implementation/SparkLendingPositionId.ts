import { LendingPositionId, SerializationService } from '@summerfi/sdk-common'
import {
  ISparkLendingPositionId,
  ISparkLendingPositionIdData,
  __signature__,
} from '../interfaces/ISparkLendingPositionId'

/**
 * Type for the parameters SparkLendingPositionId
 */
export type SparkLendingPositionIdParameters = Omit<ISparkLendingPositionIdData, 'type'>

/**
 * @class SparkLendingPositionId
 * @see ISparkLendingPositionId
 */
export class SparkLendingPositionId extends LendingPositionId implements ISparkLendingPositionId {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** FACTORY */
  static createFrom(params: SparkLendingPositionIdParameters): SparkLendingPositionId {
    return new SparkLendingPositionId(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: SparkLendingPositionIdParameters) {
    super(params)
  }
}

SerializationService.registerClass(SparkLendingPositionId, { identifier: 'SparkLendingPositionId' })
