import { SerializationService } from '../../services/SerializationService'
import { IPool } from '../interfaces/IPool'
import { IPoolId } from '../interfaces/IPoolId'
import { PoolType } from '../types/PoolType'

/**
 * @class Pool
 * @see IPool
 */
export abstract class Pool implements IPool {
  public readonly type: PoolType
  public readonly poolId: IPoolId

  protected constructor(params: IPool) {
    this.type = params.type
    this.poolId = params.poolId
  }
}

SerializationService.registerClass(Pool)
