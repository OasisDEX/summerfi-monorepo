import { PositionId } from '@summerfi/sdk-common'
import { SerializationService } from '@summerfi/sdk-common/services'
import { ISparkPositionId } from '../interfaces/ISparkPositionId'

/**
 * @class SparkPositionId
 * @see ISparkPositionId
 */
export class SparkPositionId extends PositionId implements ISparkPositionId {
  private constructor(params: ISparkPositionId) {
    super(params)
  }

  static createFrom(params: ISparkPositionId): SparkPositionId {
    return new SparkPositionId(params)
  }
}

SerializationService.registerClass(SparkPositionId)
