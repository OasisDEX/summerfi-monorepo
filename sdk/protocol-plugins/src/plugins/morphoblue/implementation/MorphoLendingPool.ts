import { IAddress, IRiskRatio, LendingPool, SerializationService } from '@summerfi/sdk-common'
import {
  IMorphoLendingPool,
  IMorphoLendingPoolData,
  __signature__,
} from '../interfaces/IMorphoLendingPool'
import { IMorphoLendingPoolId } from '../interfaces/IMorphoLendingPoolId'

/**
 * Type for the parameters of the IMorphoLendingPool interface
 */
export type MorphoLendingPoolParameters = Omit<IMorphoLendingPoolData, 'type'>

/**
 * @class MorphoLendingPool
 * @see IMorphoLendingPool
 */
export class MorphoLendingPool extends LendingPool implements IMorphoLendingPool {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly id: IMorphoLendingPoolId
  readonly oracle: IAddress
  readonly irm: IAddress
  readonly lltv: IRiskRatio

  /** FACTORY */
  public static createFrom(params: MorphoLendingPoolParameters): MorphoLendingPool {
    return new MorphoLendingPool(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: MorphoLendingPoolParameters) {
    super(params)

    this.id = params.id
    this.oracle = params.oracle
    this.irm = params.irm
    this.lltv = params.lltv
  }
}

SerializationService.registerClass(MorphoLendingPool, { identifier: 'MorphoLendingPool' })
