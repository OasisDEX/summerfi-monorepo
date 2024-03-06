import { IPool } from '../interfaces/IPool'
import { IPoolId } from '../interfaces/IPoolId'
import { PoolType } from '../interfaces/PoolType'
import { ProtocolName } from '../interfaces/ProtocolName'

/**
 * @see IPool
 */
export abstract class Pool implements IPool {
  public readonly type: PoolType
  public readonly poolId: IPoolId
  public readonly protocol: ProtocolName

  constructor(params: IPool) {
    this.type = params.type
    this.poolId = params.poolId
    this.protocol = params.protocol
  }
}
