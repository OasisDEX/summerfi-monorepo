import { z } from 'zod'
import { PoolType } from '../enums/PoolType'
import { IPoolId, isPoolId } from './IPoolId'
import { IPrintable } from './IPrintable'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * Represents a generic protocol pool. Contains information about the pool's ID,
 * which is specific to each protocol, and the pool's type
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
 * Zod schema for IPool
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
 * Type guard for IPool
 *
 * @param maybePool
 * @returns true if the object is an IPool
 */
export function isPool(maybePool: unknown): maybePool is IPool {
  return PoolDataSchema.safeParse(maybePool).success
}
