import { PoolType } from '../types/PoolType'
import { Pool } from './Pool'
import { SerializationService } from '../../services'
import { ILendingPool } from '../interfaces/ILendingPool'
import { LendingPoolId } from './LendingPoolId'

/**
 * LendingPool
 * @see ILendingPool
 *
 * The class is abstract to force each protocol to implement it's own version of the LendingPool by
 * customizing the PoolId
 */
export abstract class LendingPool extends Pool implements ILendingPool {
  public readonly type = PoolType.Lending
  public abstract readonly poolId: LendingPoolId

  protected constructor(params: ILendingPool) {
    super(params)
  }
}

SerializationService.registerClass(LendingPool)
