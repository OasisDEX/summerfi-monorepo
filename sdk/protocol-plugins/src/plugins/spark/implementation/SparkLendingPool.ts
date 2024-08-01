import { LendingPool } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  ISparkLendingPool,
  ISparkLendingPoolData,
  __signature__,
} from '../interfaces/ISparkLendingPool'
import { SparkLendingPoolId } from './SparkLendingPoolId'

/**
 * Type for the parameters of SparkLendingPool
 */
export type SparkLendingPoolParameters = Omit<ISparkLendingPoolData, 'type'>

/**
 * @class SparkLendingPool
 * @see ISparkLendingPool
 */
export class SparkLendingPool extends LendingPool implements ISparkLendingPool {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: SparkLendingPoolId

  /** FACTORY */
  public static createFrom(params: SparkLendingPoolParameters): SparkLendingPool {
    return new SparkLendingPool(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: SparkLendingPoolParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(SparkLendingPool)
