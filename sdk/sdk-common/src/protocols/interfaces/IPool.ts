import { IPoolId } from './IPoolId'
import { PoolType } from './PoolType'
import { IProtocol } from './IProtocol'
import { Address } from '../../common/implementation/Address'

/**
 * @interface IPool
 * @description Represents a protocol pool, including the pool ID and protocol.
 *              Also contains information about the type of pool (supply or lending)
 *              and the underlying assets
 */
export interface IPool {
  type: PoolType
  poolId: IPoolId
  protocol: IProtocol
  address?: Address
  TVL?: number
}
