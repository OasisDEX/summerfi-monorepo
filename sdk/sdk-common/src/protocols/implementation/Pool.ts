import { IPool } from '../interfaces/IPool'
import { IPoolId } from '../interfaces/IPoolId'
import { IProtocol } from '../interfaces/IProtocol'
import { PoolType } from '../interfaces/PoolType'

/**
 * @see IPool
 */
export abstract class Pool implements IPool {
  public readonly type: PoolType
  public readonly poolId: IPoolId
  public readonly protocol: IProtocol

  constructor(params: IPool) {
    this.type = params.type
    this.poolId = params.poolId
    this.protocol = params.protocol
  }
}
