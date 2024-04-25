import { LendingPool } from '@summerfi/sdk-common/protocols'
import { ISparkLendingPool, ISparkLendingPoolData } from '../interfaces/ISparkLendingPool'
import { SerializationService } from '@summerfi/sdk-common/services'
import { SparkLendingPoolId } from './SparkLendingPoolId'

/**
 * @class SparkLendingPool
 * @see ISparkLendingPool
 */
export class SparkLendingPool extends LendingPool implements ISparkLendingPool {
  readonly id: SparkLendingPoolId

  private constructor(params: ISparkLendingPool) {
    super(params)

    this.id = SparkLendingPoolId.createFrom(params.id)
  }

  public static createFrom(params: ISparkLendingPoolData): SparkLendingPool {
    return new SparkLendingPool(params)
  }
}

SerializationService.registerClass(SparkLendingPool)
