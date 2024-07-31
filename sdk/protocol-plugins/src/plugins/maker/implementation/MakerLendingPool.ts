import { LendingPool } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IMakerLendingPool,
  IMakerLendingPoolParameters,
  __signature__,
} from '../interfaces/IMakerLendingPool'
import { MakerLendingPoolId } from './MakerLendingPoolId'

/**
 * @class MakerLendingPool
 * @see IMakerLendingPoolData
 */
export class MakerLendingPool extends LendingPool implements IMakerLendingPool {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: MakerLendingPoolId

  /** FACTORY */
  static createFrom(params: IMakerLendingPoolParameters): MakerLendingPool {
    return new MakerLendingPool(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: IMakerLendingPoolParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(MakerLendingPool)
