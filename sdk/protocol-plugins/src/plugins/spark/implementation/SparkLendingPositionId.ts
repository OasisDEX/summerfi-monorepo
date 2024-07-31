import { LendingPositionId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  ISparkLendingPositionId,
  ISparkLendingPositionIdParameters,
  __isparklendingpositionid__,
} from '../interfaces/ISparkLendingPositionId'

/**
 * @class SparkLendingPositionId
 * @see ISparkLendingPositionId
 */
export class SparkLendingPositionId extends LendingPositionId implements ISparkLendingPositionId {
  readonly [__isparklendingpositionid__] = 'ISparkLendingPositionId'

  /** Factory method */
  static createFrom(params: ISparkLendingPositionIdParameters): SparkLendingPositionId {
    return new SparkLendingPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: ISparkLendingPositionIdParameters) {
    super(params)
  }
}

SerializationService.registerClass(SparkLendingPositionId)
