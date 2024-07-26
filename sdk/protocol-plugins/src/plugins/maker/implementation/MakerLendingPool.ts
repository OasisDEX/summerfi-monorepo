import { LendingPool } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMakerLendingPool, IMakerLendingPoolParameters } from '../interfaces/IMakerLendingPool'
import { MakerLendingPoolId } from './MakerLendingPoolId'

/**
 * @class MakerLendingPool
 * @see IMakerLendingPoolData
 */
export class MakerLendingPool extends LendingPool implements IMakerLendingPool {
  readonly _signature_2 = 'IMakerLendingPool'

  readonly id: MakerLendingPoolId

  /** Factory method */
  static createFrom(params: IMakerLendingPoolParameters): MakerLendingPool {
    return new MakerLendingPool(params)
  }

  /** Sealed constructor */
  private constructor(params: IMakerLendingPoolParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(MakerLendingPool)
