import { ILendingPool, IToken, PoolType } from '@summerfi/sdk-common'
import { LendingPoolDataSchema } from '@summerfi/sdk-common/lending-protocols'
import { z } from 'zod'
import { ISparkLendingPoolId, SparkLendingPoolIdDataSchema } from './ISparkLendingPoolId'

/**
 * @interface ISparkLendingPool
 * @description Represents a lending pool in the Spark protocol
 *
 * Currently empty as there are no specifics for this protocol
 *
 * Typescript forces the interface to re-declare any properties that have different BUT compatible types.
 * This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936
 */
export interface ISparkLendingPool extends ISparkLendingPoolData, ILendingPool {
  /** The id of the lending pool */
  readonly id: ISparkLendingPoolId

  // Re-declaring the properties with the correct types
  readonly type: PoolType.Lending
  readonly collateralToken: IToken
  readonly debtToken: IToken
}

/**
 * @description Zod schema for ISparkLendingPool
 */
export const SparkLendingPoolDataSchema = z.object({
  ...LendingPoolDataSchema.shape,
  id: SparkLendingPoolIdDataSchema,
})

/**
 * Type for the data part of ISparkLendingPool
 */
export type ISparkLendingPoolData = Readonly<z.infer<typeof SparkLendingPoolDataSchema>>

/**
 * @description Type guard for ISparkLendingPool
 * @param maybeLendingPool
 * @returns true if the object is an ISparkLendingPool
 */
export function isSparkLendingPool(
  maybeLendingPool: unknown,
): maybeLendingPool is ISparkLendingPool {
  return SparkLendingPoolDataSchema.safeParse(maybeLendingPool).success
}
