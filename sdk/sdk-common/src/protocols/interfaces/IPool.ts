import { IPoolId, IPoolIdData, PoolIdSchema } from './IPoolId'
import { PoolType } from '../types/PoolType'
import { z } from 'zod'

/**
 * @interface IPoolData
 * @description Represents a generic protocol pool. Contains information about the pool's ID,
 *              which is specific to each protocol, and the pool's type
 *
 *              It is meant to be specialized for each type of pool
 */
export interface IPoolData {
  /** Type of the pool */
  type: PoolType
  /** Unique identifier for the pool, to be specialized for each protocol */
  id: IPoolIdData
}

/**
 * @name IPool
 * @description Interface for the implementors of the pool
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IPool extends IPoolData {
  type: PoolType
  id: IPoolId
}

/**
 * @description Zod schema for IPool
 */
export const PoolSchema = z.object({
  type: z.nativeEnum(PoolType),
  id: PoolIdSchema,
})

/**
 * @description Type guard for IPool
 * @param maybePool
 * @returns true if the object is an IPool
 */
export function isPool(maybePool: unknown): maybePool is IPoolData {
  return PoolSchema.safeParse(maybePool).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPoolData = {} as z.infer<typeof PoolSchema>
