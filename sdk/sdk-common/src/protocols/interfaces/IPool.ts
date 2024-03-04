import { Address } from '~sdk-common/common/implementation'
import { PoolId, IProtocolId } from './IDs'

/**
 * @enum PoolType
 * @description Indicates the type of pool (Supply or lending)
 */
export enum PoolType {
  Supply = 'Supply',
  Lending = 'Lending',
}

/**
 * @interface IPool
 * @description Represents a protocol pool, including the pool ID and protocol.
 *              Also contains information about the type of pool (supply or lending)
 *              and the underlying assets
 */
export interface IPool {
  type: PoolType
  poolId: PoolId
  protocolId: IProtocolId
  address?: Address
  TVL?: number
}
