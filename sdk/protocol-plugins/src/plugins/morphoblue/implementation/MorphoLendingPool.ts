import { IAddress, IRiskRatio } from '@summerfi/sdk-common/common'
import { LendingPool } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import {
  IMorphoLendingPool,
  IMorphoLendingPoolParameters,
  __imorpholendingpool__,
} from '../interfaces/IMorphoLendingPool'
import { IMorphoLendingPoolId } from '../interfaces/IMorphoLendingPoolId'

/**
 * @class MorphoLendingPool
 * @see IMorphoLendingPool
 */
export class MorphoLendingPool extends LendingPool implements IMorphoLendingPool {
  readonly [__imorpholendingpool__] = 'IMorphoLendingPool'

  readonly id: IMorphoLendingPoolId
  readonly oracle: IAddress
  readonly irm: IAddress
  readonly lltv: IRiskRatio

  private constructor(params: IMorphoLendingPoolParameters) {
    super(params)

    this.id = params.id
    this.oracle = params.oracle
    this.irm = params.irm
    this.lltv = params.lltv
  }

  public static createFrom(params: IMorphoLendingPoolParameters): MorphoLendingPool {
    return new MorphoLendingPool(params)
  }
}

SerializationService.registerClass(MorphoLendingPool)
