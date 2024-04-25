import { PositionId } from '@summerfi/sdk-common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { ISparkPositionId, ISparkPositionIdData } from '../interfaces/ISparkPositionId'

/**
 * @class SparkPositionId
 * @see ISparkPositionIdData
 */
export class SparkPositionId extends PositionId implements ISparkPositionId {
  /** Factory method */
  static createFrom(params: ISparkPositionIdData): SparkPositionId {
    return new SparkPositionId(params)
  }

  /** Sealed constructor */
  private constructor(params: ISparkPositionIdData) {
    super(params)
  }
}

SerializationService.registerClass(SparkPositionId)
