import { LendingPool } from '@summerfi/sdk-common/protocols'
import {
  IMorphoBlueLendingPool,
  IMorphoBlueLendingPoolData,
} from '../interfaces/IMorphoBlueLendingPool'
import { SerializationService } from '@summerfi/sdk-common/services'
import { MorphoBlueLendingPoolId } from './MorphoBlueLendingPoolId'
import { Address } from '@summerfi/sdk-common/common'
import { RiskRatio } from '@summerfi/sdk-common'

/**
 * @class MorphoBlueLendingPool
 * @see IMorphoBlueLendingPool
 */
export class MorphoBlueLendingPool extends LendingPool implements IMorphoBlueLendingPool {
  readonly id: MorphoBlueLendingPoolId
  readonly oracle: Address
  readonly irm: Address
  readonly lltv: RiskRatio

  private constructor(params: IMorphoBlueLendingPoolData) {
    super(params)

    this.id = MorphoBlueLendingPoolId.createFrom(params.id)
    this.oracle = Address.createFrom(params.oracle)
    this.irm = Address.createFrom(params.irm)
    this.lltv = RiskRatio.createFrom(params.lltv)
  }

  public static createFrom(params: IMorphoBlueLendingPoolData): MorphoBlueLendingPool {
    return new MorphoBlueLendingPool(params)
  }
}

SerializationService.registerClass(MorphoBlueLendingPool)
