import { Address } from '~sdk-common/common'
import { PoolId } from './IDs'
import { ProtocolName } from './ProtocolName'

/**
 * @enum PoolType
 * @description Indicates the type of pool (staking or lending)
 */
export enum PoolType {
  Staking = 'Staking',
  Lending = 'Lending',
}

/**
 * @interface Pool
 * @description Represents a protocol pool, including the pool ID and protocol.
 *              Also contains information about the type of pool (staking or lending)
 *              and the underlying assets
 */
export interface Pool {
  poolId: PoolId
  protocol: ProtocolName
  type: PoolType
  address?: Address
  TVL?: number
}
