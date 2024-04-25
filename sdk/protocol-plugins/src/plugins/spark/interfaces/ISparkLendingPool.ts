import { ILendingPoolData, LendingPoolSchema } from '@summerfi/sdk-common/protocols'
import {
  ISparkLendingPoolId,
  ISparkLendingPoolIdData,
  SparkLendingPoolIdSchema,
} from './ISparkLendingPoolId'
import { z } from 'zod'

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
 */
export interface ISparkLendingPool extends ISparkLendingPoolData {
  /** The id of the lending pool */
  readonly id: ISparkLendingPoolId
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
const __schemaChecker: ISparkLendingPool = {} as z.infer<typeof SparkLendingPoolSchema>
