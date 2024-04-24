import { ILendingPool, LendingPoolSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'
import { ISparkLendingPoolId, SparkLendingPoolIdSchema } from './ISparkLendingPoolId'

/**
 * @interface ISparkLendingPool
 * @description Represents a lending pool in the Spark protocol
 *
 * Currently empty as there are no specifics for this protocol
 */
export interface ISparkLendingPool extends ILendingPool {
  poolId: ISparkLendingPoolId
}

/**
 * @description Zod schema for ISparkLendingPool
 */
export const SparkLendingPoolSchema = z.object({
  ...LendingPoolSchema.shape,
  poolId: SparkLendingPoolIdSchema,
})

/**
 * @description Type guard for ISparkLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an ISparkLendingPool
 */
export function isSparkLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is ISparkLendingPool {
  return SparkLendingPoolSchema.safeParse(maybeLendingPool).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ISparkLendingPool = {} as z.infer<typeof SparkLendingPoolSchema>
