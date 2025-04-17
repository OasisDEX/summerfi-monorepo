import { LendingPool, SerializationService } from '@summerfi/sdk-common'
import {
  IAaveV3LendingPool,
  IAaveV3LendingPoolData,
  __signature__,
} from '../interfaces/IAaveV3LendingPool'
import { AaveV3LendingPoolId } from './AaveV3LendingPoolId'

/**
 * Type for the parameters of AaveV3LendingPool
 */
export type AaveV3LendingPoolParameters = Omit<IAaveV3LendingPoolData, 'type'>

/**
 * @class AaveV3LendingPool
 * @see IAaveV3LendingPoolData
 */
export class AaveV3LendingPool extends LendingPool implements IAaveV3LendingPool {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: AaveV3LendingPoolId

  /** FACTORY */
  public static createFrom(params: AaveV3LendingPoolParameters): AaveV3LendingPool {
    return new AaveV3LendingPool(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: AaveV3LendingPoolParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(AaveV3LendingPool, { identifier: 'AaveV3LendingPool' })
