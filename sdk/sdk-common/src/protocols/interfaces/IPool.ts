import { IPoolId, PoolIdDataSchema } from './IPoolId'
import { PoolType } from '../types/PoolType'
import { z } from 'zod'

/**
 * @name IPool
 * @description Represents a generic protocol pool. Contains information about the pool's ID,
 *              which is specific to each protocol, and the pool's type
 *
 * It is meant to be specialized for each type of pool
 */
export interface IPool extends IPoolData {
  /** Type of the pool */
  readonly type: PoolType
  /** Unique identifier for the pool, to be specialized for each protocol */
  readonly id: IPoolId
}

/**
 * @description Zod schema for IPool
 */
export const PoolDataSchema = z.object({
  type: z.nativeEnum(PoolType),
  id: PoolIdDataSchema,
})

/**
 * Type for the data part of the IPool interface
 */
export type IPoolData = Readonly<z.infer<typeof PoolDataSchema>>

/**
 * @description Type guard for IPool
 * @param maybePool
 * @returns true if the object is an IPool
 */
export function isPool(maybePool: unknown): maybePool is IPoolData {
  return PoolDataSchema.safeParse(maybePool).success
}
