import { LendingPool } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IAaveV3LendingPool,
  IAaveV3LendingPoolParameters,
  __iaavev3lendingpool__,
} from '../interfaces/IAaveV3LendingPool'
import { AaveV3LendingPoolId } from './AaveV3LendingPoolId'

/**
 * @class AaveV3LendingPool
 * @see IAaveV3LendingPoolData
 */
export class AaveV3LendingPool extends LendingPool implements IAaveV3LendingPool {
  /** SIGNATURE */
  readonly [__iaavev3lendingpool__] = 'IAaveV3LendingPool'

  /** ATTRIBUTES */
  readonly id: AaveV3LendingPoolId

  /** FACTORY */
  public static createFrom(params: IAaveV3LendingPoolParameters): AaveV3LendingPool {
    return new AaveV3LendingPool(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IAaveV3LendingPoolParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(AaveV3LendingPool)
