import { z } from 'zod'
import { PoolType } from '../types/PoolType'
import { IPoolId, PoolIdDataSchema } from './IPoolId'

/**
 * @name IPool
 * @description Represents the extended information of a pool. It should contain extra info that is common for any type of pool
 *
 * It is meant to be specialized for each type of pool, like a lending pool, a staking pool, etc...
 */
export interface IPoolInfo extends IPoolInfoData {
  /** Signature to differentiate from similar interfaces */
  readonly _signature_0: 'IPoolInfo'
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
 * Type for the parameters of the IPoolInfo interface
 */
export type IPoolInfoParameters = Omit<IPoolInfoData, ''>

/**
 * @description Type guard for IPoolInfo
 * @param maybePoolInfo
 * @returns true if the object is an IPoolInfo
 */
export function isPoolInfo(maybePoolInfo: unknown): maybePoolInfo is IPoolInfo {
  return PoolInfoDataSchema.safeParse(maybePoolInfo).success
}
