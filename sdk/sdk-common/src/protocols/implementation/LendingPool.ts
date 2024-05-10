import { PoolType } from '../types/PoolType'
import { Pool } from './Pool'
import { SerializationService } from '../../services'
import { ILendingPool, ILendingPoolData } from '../interfaces/ILendingPool'
import { LendingPoolId } from './LendingPoolId'
import { IPrintable } from '../../common/interfaces/IPrintable'

/**
 * LendingPool
 * @see ILendingPool
 *
 * The class is abstract to force each protocol to implement it's own version of the LendingPool by
 * customizing the PoolId
 */
export abstract class LendingPool extends Pool implements ILendingPool, IPrintable {
  readonly type = PoolType.Lending
  abstract readonly id: LendingPoolId

  protected constructor(params: ILendingPoolData) {
    super(params)
  }

  toString(): string {
    return `Lending Pool: ${this.id.toString()}`
  }
}

SerializationService.registerClass(LendingPool)
