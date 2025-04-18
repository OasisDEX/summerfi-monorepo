import { LendingPool, SerializationService } from '@summerfi/sdk-common'
import {
  IMakerLendingPool,
  IMakerLendingPoolData,
  __signature__,
} from '../interfaces/IMakerLendingPool'
import { MakerLendingPoolId } from './MakerLendingPoolId'

/**
 * Type for the parameters of MakerLendingPool
 */
export type MakerLendingPoolParameters = Omit<IMakerLendingPoolData, 'type'>

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
  static createFrom(params: MakerLendingPoolParameters): MakerLendingPool {
    return new MakerLendingPool(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: MakerLendingPoolParameters) {
    super(params)

    this.id = params.id
  }
}

SerializationService.registerClass(MakerLendingPool, { identifier: 'MakerLendingPool' })
