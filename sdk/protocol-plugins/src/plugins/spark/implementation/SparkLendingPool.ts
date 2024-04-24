import { LendingPool } from '@summerfi/sdk-common/protocols'
import { ISparkLendingPool } from '../interfaces/ISparkLendingPool'
import { SerializationService } from '@summerfi/sdk-common/services'
import { SparkLendingPoolId } from './SparkLendingPoolId'

/**
 * @class SparkLendingPool
 * @see ISparkLendingPool
 */
export class SparkLendingPool extends LendingPool implements ISparkLendingPool {
  readonly poolId: SparkLendingPoolId

  private constructor(params: ISparkLendingPool) {
    super(params)

    this.poolId = SparkLendingPoolId.createFrom(params.poolId)
  }

  public static createFrom(params: ISparkLendingPool): SparkLendingPool {
    return new SparkLendingPool(params)
  }
}

SerializationService.registerClass(SparkLendingPool)
