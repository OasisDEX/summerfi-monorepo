import { PoolInfo } from '../../common/implementation/PoolInfo'
import { IPrintable } from '../../common/interfaces/IPrintable'
import { PoolType } from '../../common/types/PoolType'
import { SerializationService } from '../../services'
import { ILendingPoolInfo, ILendingPoolInfoData } from '../interfaces/ILendingPoolInfo'
import { CollateralInfo } from './CollateralInfo'
import { DebtInfo } from './DebtInfo'
import { LendingPoolId } from './LendingPoolId'

/**
 * LendingPoolInfo
 * @see ILendingPoolInfo
 *
 * The class is abstract to force each protocol to implement it's own version of the LendingPoolInfo by
 * customizing the PoolId
 */
export abstract class LendingPoolInfo extends PoolInfo implements ILendingPoolInfo, IPrintable {
  readonly type = PoolType.Lending
  abstract readonly id: LendingPoolId
  readonly collateral: CollateralInfo
  readonly debt: DebtInfo

  protected constructor(params: ILendingPoolInfoData) {
    super(params)

    this.collateral = CollateralInfo.createFrom(params.collateral)
    this.debt = DebtInfo.createFrom(params.debt)
  }

  toString(): string {
    return `Lending Pool: ${this.id.toString()}`
  }
}

SerializationService.registerClass(LendingPoolInfo)
