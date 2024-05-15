import { LendingPool } from '@summerfi/sdk-common/protocols'
import { IMorphoLendingPool, IMorphoLendingPoolData } from '../interfaces/IMorphoLendingPool'
import { SerializationService } from '@summerfi/sdk-common/services'
import { MorphoLendingPoolId } from './MorphoLendingPoolId'
import { Address } from '@summerfi/sdk-common/common'
import { RiskRatio } from '@summerfi/sdk-common'

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
