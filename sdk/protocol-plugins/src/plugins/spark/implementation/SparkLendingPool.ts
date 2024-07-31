import { LendingPool } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  ISparkLendingPool,
  ISparkLendingPoolParameters,
  __isparklendingpool__,
} from '../interfaces/ISparkLendingPool'
import { SparkLendingPoolId } from './SparkLendingPoolId'

/**
 * @class SparkLendingPool
 * @see ISparkLendingPool
 */
export class SparkLendingPool extends LendingPool implements ISparkLendingPool {
  readonly [__isparklendingpool__] = 'ISparkLendingPool'

  readonly id: SparkLendingPoolId

  private constructor(params: ISparkLendingPoolParameters) {
    super(params)

    this.id = SparkLendingPoolId.createFrom(params.id)
  }

  public static createFrom(params: ISparkLendingPoolParameters): SparkLendingPool {
    return new SparkLendingPool(params)
  }
}

SerializationService.registerClass(SparkLendingPool)
