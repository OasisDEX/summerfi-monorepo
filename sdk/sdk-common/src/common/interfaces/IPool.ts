import { z } from 'zod'
import { PoolType } from '../types/PoolType'
import { IPoolId, isPoolId } from './IPoolId'
import { IPrintable } from './IPrintable'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __signature__: unique symbol = Symbol()

/**
 * @name IPool
 * @description Represents a generic protocol pool. Contains information about the pool's ID,
 *              which is specific to each protocol, and the pool's type
 *
 * It is meant to be specialized for each type of pool
 */
export interface IPool extends IPrintable, IPoolData {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
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
  id: z.custom<IPoolId>((val) => isPoolId(val)),
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
export function isPool(maybePool: unknown): maybePool is IPool {
  return PoolDataSchema.safeParse(maybePool).success
}
