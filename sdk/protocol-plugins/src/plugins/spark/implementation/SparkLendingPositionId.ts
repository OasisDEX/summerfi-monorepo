import { LendingPositionId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  ISparkLendingPositionId,
  ISparkLendingPositionIdParameters,
} from '../interfaces/ISparkLendingPositionId'

/**
 * @class SparkLendingPositionId
 * @see ISparkLendingPositionId
 */
export class SparkLendingPositionId extends LendingPositionId implements ISparkLendingPositionId {
  readonly _signature_2 = 'ISparkLendingPositionId'

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
