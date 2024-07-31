import { z } from 'zod'
import { PoolType } from '../types/PoolType'
import { IPoolId, isPoolId } from './IPoolId'
import { IPrintable } from './IPrintable'

/**
 * @name IPool
 * @description Represents a generic protocol pool. Contains information about the pool's ID,
 *              which is specific to each protocol, and the pool's type
 *
 * It is meant to be specialized for each type of pool
 */
export interface IPool extends IPrintable, IPoolData {
  /** Signature to differentiate from similar interfaces */
  readonly _signature_0: 'IPool'
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
 * Type for the parameters of the IPool interface
 */
export type IPoolParameters = Omit<IPoolData, ''>

/**
 * @description Type guard for IPool
 * @param maybePool
 * @returns true if the object is an IPool
 */
export function isPool(maybePool: unknown): maybePool is IPool {
  return PoolDataSchema.safeParse(maybePool).success
}
