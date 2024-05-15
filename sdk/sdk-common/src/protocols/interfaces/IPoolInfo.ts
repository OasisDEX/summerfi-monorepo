import { IPoolId, PoolIdDataSchema } from './IPoolId'
import { PoolType } from '../types/PoolType'
import { z } from 'zod'

/**
 * @name IPool
 * @description Represents the extended information of a pool. It should contain extra info that is common for any type of pool
 *
 * It is meant to be specialized for each type of pool, like a lending pool, a staking pool, etc...
 */
export interface IPoolInfo extends IPoolInfoData {
  /** Type of the pool */
  readonly type: PoolType
  /** Unique identifier for the pool, to be specialized for each protocol */
  readonly id: IPoolId
}

/**
 * @description Zod schema for IPoolInfo
 */
export const PoolInfoDataSchema = z.object({
  type: z.nativeEnum(PoolType),
  id: PoolIdDataSchema,
})

/**
 * Type for the data part of the IPoolInfo interface
 */
export type IPoolInfoData = Readonly<z.infer<typeof PoolInfoDataSchema>>

/**
 * @description Type guard for IPoolInfo
 * @param maybePoolInfo
 * @returns true if the object is an IPoolInfo
 */
export function isPoolInfo(maybePoolInfo: unknown): maybePoolInfo is IPoolInfoData {
  return PoolInfoDataSchema.safeParse(maybePoolInfo).success
}
