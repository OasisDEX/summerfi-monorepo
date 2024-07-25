import { LendingPool } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerLendingPool, IMakerLendingPoolData } from '../interfaces/IMakerLendingPool'
import { MakerLendingPoolId } from './MakerLendingPoolId'

/**
 * @class MakerLendingPool
 * @see IMakerLendingPoolData
 */
export class MakerLendingPool extends LendingPool implements IMakerLendingPool {
  readonly id: MakerLendingPoolId

  /** Factory method */
  static createFrom(params: IMakerLendingPoolData): MakerLendingPool {
    return new MakerLendingPool(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerLendingPoolData) {
    super(params)

    this.id = MakerLendingPoolId.createFrom(params.id)
  }
}

SerializationService.registerClass(MakerLendingPool)
