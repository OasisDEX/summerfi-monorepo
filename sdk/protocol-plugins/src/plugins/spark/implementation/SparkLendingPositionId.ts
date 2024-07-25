import { LendingPositionId } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  ISparkLendingPositionId,
  ISparkLendingPositionIdData,
} from '../interfaces/ISparkLendingPositionId'

/**
 * @class SparkLendingPositionId
 * @see ISparkLendingPositionId
 */
export class SparkLendingPositionId extends LendingPositionId implements ISparkLendingPositionId {
  /** Factory method */
  static createFrom(params: ISparkLendingPositionIdData): SparkLendingPositionId {
    return new SparkLendingPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: ISparkLendingPositionIdData) {
    super(params)
  }
}

SerializationService.registerClass(SparkLendingPositionId)
