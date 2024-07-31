import { PoolInfo } from '../../common/implementation/PoolInfo'
import { IPrintable } from '../../common/interfaces/IPrintable'
import { PoolType } from '../../common/types/PoolType'
import { SerializationService } from '../../services'
import { ICollateralInfo } from '../interfaces/ICollateralInfo'
import { IDebtInfo } from '../interfaces/IDebtInfo'
import { ILendingPoolId } from '../interfaces/ILendingPoolId'
import {
  ILendingPoolInfo,
  ILendingPoolInfoParameters,
  __signature__,
} from '../interfaces/ILendingPoolInfo'

/**
 * LendingPoolInfo
 * @see ILendingPoolInfo
 *
 * The class is abstract to force each protocol to implement it's own version of the LendingPoolInfo by
 * customizing the PoolId
 */
export abstract class LendingPoolInfo extends PoolInfo implements ILendingPoolInfo, IPrintable {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  abstract readonly id: ILendingPoolId
  readonly collateral: ICollateralInfo
  readonly debt: IDebtInfo

  /** SEALED CONSTRUCTOR */
  protected constructor(params: ILendingPoolInfoParameters) {
    super({
      ...params,
      type: PoolType.Lending,
    })

    this.collateral = params.collateral
    this.debt = params.debt
  }

  /** METHODS */

  /** @see IPrintable.toString */
  toString(): string {
    return `Lending Pool: ${this.id.toString()}`
  }
}

SerializationService.registerClass(LendingPoolInfo)
