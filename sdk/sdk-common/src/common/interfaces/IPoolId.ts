import { z } from 'zod'
import { PoolType } from '../types'
import { IProtocol, isProtocol } from './IProtocol'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __ipoolid__: unique symbol = Symbol()

/**
 * @name IPoolId
 * @description Represents a pool's ID. This will be specialized for each protocol
 *
 * It is a way to retrieve a pool from the protocol and it should include all the necessary information
 * to uniquely identify a pool
 */
export interface IPoolId extends IPoolIdData {
  /** Signature to differentiate from similar interfaces */
  readonly [__ipoolid__]: 'IPoolId'
  /** Pool type */
  readonly type: PoolType
  /** Protocol where the pool is */
  readonly protocol: IProtocol
}

/**
 * @description Zod schema for IPoolId
 */
export const PoolIdDataSchema = z.object({
  type: z.nativeEnum(PoolType),
  protocol: z.custom<IProtocol>((val) => isProtocol(val)),
})

/**
 * Type for the data part of the IPoolId interface
 */
export type IPoolIdData = Readonly<z.infer<typeof PoolIdDataSchema>>

/**
 * Type for the parameters of the IPoolId interface
 */
export type IPoolIdParameters = Omit<IPoolIdData, ''>

/**
 * @description Type guard for IPoolId
 * @param maybePoolId
 * @returns true if the object is an IPoolId
 */
export function isPoolId(maybePoolId: unknown): maybePoolId is IPoolId {
  return PoolIdDataSchema.safeParse(maybePoolId).success
}
