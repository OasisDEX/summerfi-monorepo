import { IPoolId, IPoolIdData, PoolIdSchema } from './IPoolId'
import { PoolType } from '../types/PoolType'
import { z } from 'zod'

/**
 * @interface IPoolInfoData
 * @description Represents the extended information of a pool. It should contain extra info that is common for any type of pool
 *
 * It is meant to be specialized for each type of pool, like a lending pool, a staking pool, etc...
 */
export interface IPoolInfoData {
  /** Type of the pool */
  readonly type: PoolType
  /** Unique identifier for the pool, to be specialized for each protocol */
  readonly id: IPoolIdData
}

/**
 * @name IPool
 * @description Interface for the implementors of the pool
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IPoolInfo extends IPoolInfoData {
  readonly type: PoolType
  readonly id: IPoolId
}

/**
 * @description Zod schema for IPoolInfo
 */
export const PoolInfoSchema = z.object({
  type: z.nativeEnum(PoolType),
  id: PoolIdSchema,
})

/**
 * @description Type guard for IPoolInfo
 * @param maybePoolInfo
 * @returns true if the object is an IPoolInfo
 */
export function isPoolInfo(maybePoolInfo: unknown): maybePoolInfo is IPoolInfoData {
  return PoolInfoSchema.safeParse(maybePoolInfo).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPoolInfoData = {} as z.infer<typeof PoolInfoSchema>
