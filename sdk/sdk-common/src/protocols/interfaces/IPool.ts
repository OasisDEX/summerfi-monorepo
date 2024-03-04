import { Address } from '~sdk-common/common/implementation/Address'
import { IPoolId } from './IPoolId'
import { ProtocolName } from './ProtocolName'
import { PoolType } from './PoolType'

/**
 * @interface IPool
 * @description Represents a protocol pool, including the pool ID and protocol.
 *              Also contains information about the type of pool (supply or lending)
 *              and the underlying assets
 */
export interface IPool {
  type: PoolType
  poolId: IPoolId
  protocol: ProtocolName
  address?: Address
  TVL?: number
}
