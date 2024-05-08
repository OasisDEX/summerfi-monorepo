import { LendingPool } from '@summerfi/sdk-common/protocols'
import { IMorphoLendingPool, IMorphoLendingPoolData } from '../interfaces/IMorphoLendingPool'
import { SerializationService } from '@summerfi/sdk-common/services'
import { MorphoLendingPoolId } from './MorphoLendingPoolId'

/**
 * @class MorphoLendingPool
 * @see IMorphoLendingPool
 */
export class MorphoLendingPool extends LendingPool implements IMorphoLendingPool {
  readonly id: MorphoLendingPoolId

  private constructor(params: IMorphoLendingPoolData) {
    super(params)

    this.id = MorphoLendingPoolId.createFrom(params.id)
  }

  public static createFrom(params: IMorphoLendingPoolData): MorphoLendingPool {
    return new MorphoLendingPool(params)
  }
}

SerializationService.registerClass(MorphoLendingPool)
