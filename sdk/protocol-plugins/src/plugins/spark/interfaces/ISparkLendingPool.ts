import { ILendingPoolData, LendingPoolSchema } from '@summerfi/sdk-common/protocols'
import {
  ISparkLendingPoolId,
  ISparkLendingPoolIdData,
  SparkLendingPoolIdSchema,
} from './ISparkLendingPoolId'
import { z } from 'zod'
import { ILendingPool, PoolType } from '@summerfi/sdk-common'

/**
 * @interface ISparkLendingPoolData
 * @description Represents a lending pool in the Spark protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface ISparkLendingPoolData extends ILendingPoolData {
  /** The id of the lending pool */
  readonly id: ISparkLendingPoolIdData
}

/**
 * @interface ISparkLendingPool
 * @description Interface for the implementors of the lending pool
 *
 * This interface is used to add all the methods that the interface supports
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkLendingPool extends ISparkLendingPoolData, ILendingPool {
  readonly id: ISparkLendingPoolId

  // Re-declaring the properties with the correct types
  readonly type: PoolType.Lending
}

/**
 * @description Zod schema for ISparkLendingPool
 */
export const SparkLendingPoolSchema = z.object({
  ...LendingPoolSchema.shape,
  id: SparkLendingPoolIdSchema,
})

/**
 * @description Type guard for ISparkLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an ISparkLendingPool
 */
export function isSparkLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is ISparkLendingPoolData {
  return SparkLendingPoolSchema.safeParse(maybeLendingPool).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ISparkLendingPoolData = {} as z.infer<typeof SparkLendingPoolSchema>
