import { LendingPool } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IAaveV3LendingPool, IAaveV3LendingPoolParameters } from '../interfaces/IAaveV3LendingPool'
import { AaveV3LendingPoolId } from './AaveV3LendingPoolId'

/**
 * @class AaveV3LendingPool
 * @see IAaveV3LendingPoolData
 */
export class AaveV3LendingPool extends LendingPool implements IAaveV3LendingPool {
  readonly _signature_2 = 'IAaveV3LendingPool'

  readonly id: AaveV3LendingPoolId

  /** Factory method */
  public static createFrom(params: IAaveV3LendingPoolParameters): AaveV3LendingPool {
    return new AaveV3LendingPool(params)
  }

  /** Sealed constructor */
  private constructor(params: IAaveV3LendingPoolParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(AaveV3LendingPool)
