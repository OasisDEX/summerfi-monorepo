import { RiskRatio } from '@summerfi/sdk-common'
import { Address } from '@summerfi/sdk-common/common'
import { LendingPool } from '@summerfi/sdk-common/lending-protocols'
import { SerializationService } from '@summerfi/sdk-common/services'
import { IMorphoLendingPool, IMorphoLendingPoolData } from '../interfaces/IMorphoLendingPool'
import { MorphoLendingPoolId } from './MorphoLendingPoolId'

/**
 * @class MorphoLendingPool
 * @see IMorphoLendingPool
 */
export class MorphoLendingPool extends LendingPool implements IMorphoLendingPool {
  readonly id: MorphoLendingPoolId
  readonly oracle: Address
  readonly irm: Address
  readonly lltv: RiskRatio

  private constructor(params: IMorphoLendingPoolData) {
    super(params)

    this.id = MorphoLendingPoolId.createFrom(params.id)
    this.oracle = Address.createFrom(params.oracle)
    this.irm = Address.createFrom(params.irm)
    this.lltv = RiskRatio.createFrom(params.lltv)
  }

  public static createFrom(params: IMorphoLendingPoolData): MorphoLendingPool {
    return new MorphoLendingPool(params)
  }
}

SerializationService.registerClass(MorphoLendingPool)
