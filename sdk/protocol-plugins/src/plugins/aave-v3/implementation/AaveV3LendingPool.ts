import { LendingPool } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IAaveV3LendingPool, IAaveV3LendingPoolData } from '../interfaces/IAaveV3LendingPool'
import { AaveV3LendingPoolId } from './AaveV3LendingPoolId'

/**
 * @class AaveV3LendingPool
 * @see IAaveV3LendingPoolData
 */
export class AaveV3LendingPool extends LendingPool implements IAaveV3LendingPool {
  readonly id: AaveV3LendingPoolId

  /** Factory method */
  public static createFrom(params: IAaveV3LendingPoolData): AaveV3LendingPool {
    return new AaveV3LendingPool(params)
  }

  /** Sealed constructor */
  private constructor(params: IAaveV3LendingPoolData) {
    super(params)

    this.id = AaveV3LendingPoolId.createFrom(params.id)
  }
}

SerializationService.registerClass(AaveV3LendingPool)
