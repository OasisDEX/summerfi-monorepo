import { PoolType } from '../types/PoolType'
import { Pool } from './Pool'
import { SerializationService } from '../../services'
import { ILendingPoolData } from '../interfaces/ILendingPool'
import { LendingPoolId } from './LendingPoolId'

/**
 * LendingPool
 * @see ILendingPoolData
 *
 * The class is abstract to force each protocol to implement it's own version of the LendingPool by
 * customizing the PoolId
 */
export abstract class LendingPool extends Pool implements ILendingPoolData {
  readonly type = PoolType.Lending
  abstract readonly id: LendingPoolId

  protected constructor(params: ILendingPoolData) {
    super(params)
  }
}

SerializationService.registerClass(LendingPool)
