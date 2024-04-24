import { LendingPool } from '@summerfi/sdk-common/protocols'
import { IMakerLendingPool } from '../interfaces/IMakerLendingPool'
import { SerializationService } from '@summerfi/sdk-common/services'
import { MakerLendingPoolId } from './MakerLendingPoolId'

/**
 * @class MakerLendingPool
 * @see IMakerLendingPool
 */
export class MakerLendingPool extends LendingPool implements IMakerLendingPool {
  readonly poolId: MakerLendingPoolId

  private constructor(params: IMakerLendingPool) {
    super(params)

    this.poolId = MakerLendingPoolId.createFrom(params.poolId)
  }

  public static createFrom(params: IMakerLendingPool): MakerLendingPool {
    return new MakerLendingPool(params)
  }
}

SerializationService.registerClass(MakerLendingPool)
