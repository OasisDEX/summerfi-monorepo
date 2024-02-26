import { Address } from '~sdk-common/common/implementation'
import { PoolId, IProtocolId } from './IDs'

/**
 * @enum PoolType
 * @description Indicates the type of pool (staking or lending)
 */
export enum PoolType {
  Staking = 'Staking',
  Lending = 'Lending',
}

/**
 * @interface IPool
 * @description Represents a protocol pool, including the pool ID and protocol.
 *              Also contains information about the type of pool (staking or lending)
 *              and the underlying assets
 */
export interface IPool {
  poolId: PoolId
  protocolId: IProtocolId
  type: PoolType
  address?: Address
  TVL?: number
}
