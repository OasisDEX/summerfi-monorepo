import { IPoolId } from './IPoolId'
import { PoolType } from '../types/PoolType'
import { IProtocol } from './IProtocol'

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
}

export function isPool(maybePool: unknown): maybePool is IPool {
  return (
    typeof maybePool === 'object' &&
    maybePool !== null &&
    'type' in maybePool &&
    'poolId' in maybePool &&
    'protocol' in maybePool
  )
}
