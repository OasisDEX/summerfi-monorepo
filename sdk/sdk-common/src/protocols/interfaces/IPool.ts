import { IPoolId, PoolIdSchema, isPoolId } from './IPoolId'
import { PoolType, isPoolType } from '../types/PoolType'
import { z } from 'zod'

/**
 * @interface IPool
 * @description Represents a generic protocol pool. Contains information about the pool's ID,
 *              which is specific to each protocol, and the pool's type
 *
 *              It is meant to be specialized for each type of pool
 */
export interface IPool {
  type: PoolType
  poolId: IPoolId
}

/**
 * @description Type guard for IPool
 * @param maybePool
 * @returns true if the object is an IPool
 */
export function isPool(maybePool: unknown): maybePool is IPool {
  return (
    typeof maybePool === 'object' &&
    maybePool !== null &&
    'type' in maybePool &&
    isPoolType(maybePool.type) &&
    'poolId' in maybePool &&
    isPoolId(maybePool.poolId)
  )
}

/**
 * @description Zod schema for IPool
 */
export const PoolSchema = z.object({
  type: z.nativeEnum(PoolType),
  poolId: PoolIdSchema,
})

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPool = {} as z.infer<typeof PoolSchema>
